function startHacking() {
	hijackWebSocket();
	hijackRedux();
	showParticipantsList();
	createCss();
	renderModal();
	createCustomOptions();
	toggleModal();
}
function hijackWebSocket() {
	WebSocket.prototype.send = function (...args) {
		if (zoomWebSocket !== this) {
			zoomWebSocket = this;
		}

		// DELETE
		if (JSON.parse(args[0]).evt !== 4167) { console.log(...args); }
		// DELETE

		return webSocketSend.call(this, ...args);
	};
}
function hijackRedux() {
	const store = getReduxStore();
	reduxState = Object.freeze(store.getState());

	if (reduxUnsubscribe) {
		reduxUnsubscribe();
	}

	reduxUnsubscribe = store.subscribe(() => {
		const newState = Object.freeze(store.getState());
		if (reduxState !== newState) {
			onAppStateChange(reduxState, newState);
			reduxState = newState;
		}
	});
}
function sendToWebSocket(evt, body) {
	zoomWebSocket.send(JSON.stringify({ evt, body }));
}
function sendToRedux(type, payload) {
	getReduxStore().dispatch({ type, ...payload });
}
function getReduxStore() {
	return document.querySelector('#root')._reactRootContainer._internalRoot.current.memoizedState.element.props.store;
}
// STORE SELECTORS
function selectUsers() {
	return reduxState?.attendeesList?.attendeesList || [];
}
function selectCurrentUser() {
	return reduxState.meeting.currentUser;
}
function selectMeetingInfo() {
	return reduxState?.meetingUI || {};
}
// ZOOM ACTIONS
function startUserAudio(id) {
	sendToWebSocket(zoomActions.AUDIO, { id, bMute: false });
}
function stopUserAudio(id) {
	sendToWebSocket(zoomActions.AUDIO, { id, bMute: true });
}
function startEveryUserAudio() {
	sendToWebSocket(zoomActions.MUTE_ALL, { bMute: false });
	startUserAudio(selectCurrentUser().userId);
}
function stopEveryUserAudio() {
	sendToWebSocket(zoomActions.MUTE_ALL, { bMute: true });
	stopUserAudio(selectCurrentUser().userId);
}
function startUserVideo(id) {
	sendToWebSocket(zoomActions.VIDEO, { id, bOn: false });
}
function stopUserVideo(id) {
	// disabled
	// sendToWebSocket(zoomActions.VIDEO, { id, bOn: true });
}
function acceptEveryUserInWaitingRoom() {
	sendToWebSocket(zoomActions.WAITING_ROOM);
}
function acceptUserInWaitingRoom(id) {
	sendToWebSocket(zoomActions.WAITING, { id, bHold: false });
}
function moveUserToWaitingRoom(id) {
	sendToWebSocket(zoomActions.WAITING, { id, bHold: true });
}
function lowerUserHand(id) {
	sendToWebSocket(zoomActions.HAND, { id, bOn: false });
}
function lowerEveryUserHand() {
	sendToWebSocket(zoomActions.LOWER_ALL);
}
function startUserSpotlight(id) {
	sendToWebSocket(zoomActions.SPOTLIGHT, { id, bReplace: true, bSpotlight: true, bUnSpotlightAll: true });
	// stopEveryUserSpotlight();
}
function stopUserSpotlight(id) {
	sendToWebSocket(zoomActions.SPOTLIGHT, { id, bReplace: false, bSpotlight: false, bUnSpotlightAll: false });
}
function addUserSpotlight(id) {
	sendToWebSocket(zoomActions.SPOTLIGHT, { id, bReplace: false, bSpotlight: true, bUnSpotlightAll: false });
}
function stopEveryUserSpotlight() {
	// sendToWebSocket(zoomActions.SPOTLIGHT, { id, bReplace: false, bSpotlight: true, bUnSpotlightAll: false });
}
function renameUser({ id, name }) {
	sendToWebSocket(zoomActions.RENAME, {
		id,
		dn2: btoa(name),
		olddn2: btoa(getUserById(id).displayName)
	});
}
// USERS UTILS
function getUserByText(search, absolute = false) {
	return selectUsers().find(user => absolute
		? user.displayName === search
		: getCleanText(user.displayName).includes(getCleanText(search))
	);
}
function getUserById(id) {
	return selectUsers().find(user => user.userId === id);
}
function getUsersInWaitingRoom() {
	return selectUsers().filter(user => user.bHold);
}
// UI UTILS
function createElement(text, events) {
	const dom = new DOMParser().parseFromString(text.replace(/\s+/g, ' '), 'text/html');
	const element = dom.body.children[0] || dom.head.children[0];
	events && Object.keys(events).forEach(k => element[k] = events[k]);
	return element;
}
function removeChildren(element) {
	element?.querySelectorAll?.('*').forEach(child => child.remove());
}
function dispatchMouseOver(element) {
	const bogusEvent = new MouseEvent('mouseover', { bubbles: true });
	bogusEvent.simulated = true;
	element.dispatchEvent(bogusEvent);
}
function hydrate(html, bindings) {
	const markup = html.replace(/\b(undefined|null|false)\b/gi, '').replace(/\s+/g, ' ');
	const { head, body } = new DOMParser().parseFromString(markup, 'text/html');
	const element = body.children[0] || head.children[0];
	if (bindings) {
		element.querySelectorAll('[hydrate]').forEach(dry => {
			const events = bindings[dry.getAttribute('hydrate')];
			Object.keys(events).forEach(e => dry[e] = events[e]);
		});
	}
	return element;
}
function query(selector) {
	return document.querySelector(selector);
}
function queryAll(selector) {
	return document.querySelectorAll(selector);
}
function byId(selector) {
	return document.getElementById(selector);
}
// UI HANDLERS
function createCss() {
	const membersPaneWidth = parseInt(query('#wc-container-right').style.width);
	const footerButtonsHeight = query('#wc-footer').clientHeight;
	const higherIndex = Math.max.apply(null, Array.from(queryAll('body *')).map(({ style = {} }) => style.zIndex || 0));
	const style = byId('custom-style') || createElement('<style id="custom-style"></style>');
	style.id = 'custom-style';
	style.innerHTML = `
		.main-modal {
				display: grid;
				grid-template-rows: 1fr 1fr;
				overflow-y: hidden;
				position: fixed;
				right: ${membersPaneWidth + 5}px;
				left: 5px;
				top: 20px;
				bottom: ${footerButtonsHeight + 10}px;
				background-color: #edf2f7e6;
				font-size: 12px;
				z-index: ${higherIndex + 2};
		}
		.transparent-modal { background-color: #ffffff11; }
		.transparent-modal .buttons-frame *, .transparent-modal .routines-frame * { color: #ffffffbb; }
		.transparent-modal .btn-warning .material-icons-outlined { color: #111111bb; }
		.transparent-modal .configuration, .transparent-modal .config-item { background-color: #24282ccf; }
		.transparent-modal .routines-frame { background-color: #21212147; }
		.transparent-modal #custom-modal .input-group-addon, .transparent-modal #custom-modal input { color: #555555;}
		.transparent-modal #custom-modal .btn-primary, .transparent-modal #custom-modal .btn-success { color: #ffffff;}
		.transparent-modal #custom-modal .alert-danger * { color: #a94442; }
		#custom-modal {
				position: absolute;
				left: 0%;
				top: 0%;
				background-color: #0000008a;
				width: 100%;
				height: 100%;
		}
		.routines-frame {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr 1fr;
				gap: 5px;
				margin: 0px 5px;
				padding-bottom: 10px;
		}
		.buttons-frame {
				display: grid;
				grid-template-columns: 2fr 3fr 3fr;
				grid-template-rows: 20px auto;
				gap: 5px;
				padding: 0;
				margin: 5px;
		}
		.close-feature-frame {
				display: grid;
				grid-template-columns: 1fr 3fr 1fr;
				align-items: center;
				text-align: center;
		}
		.call-member-frame,
		.focus-on-frame,
		.feature-frame {
				display: grid;
				gap: 5px;
		}
		.feature-frame {
			grid-template-columns: 1fr 1fr;
		}
		.exit-frame {
				display: grid;
				grid-template-columns: 2fr 3fr 3fr;
				grid-column: span 3;
				gap: 5px;
		}
		.hidden { display: none; }
		.btn-close {
				opacity: 0.7;
				cursor: pointer;
				color: #ffffff;
				font-size: 22px !important;
		}
		.btn-feature {
				display: flex;
				flex-direction: row-reverse;
				justify-content: space-evenly;
				align-items: center;
				font-size: 14px;
				opacity: 0.8;
				min-height: 40px;
				font-weight: 500;
		}
		.custom-focus-name {
				grid-row: span 2;
				grid-column: span 2;
				width: calc(100% - 5px);
				margin: auto 0 auto 5px;
		}
		.btn-custom-focus {
				display: flex;
				max-height: 55px;
				align-items: center;
				width: fit-content;
		}
		.btn-custom-focus button {
				background-color: #d32f2f;
				color: #fff;
				font-weight: 600;
		}
		.btn-custom-focus button:hover {
				background-color: #9a1010;
				color: #fff;
		}
		.btn-custom-focus button[disabled] {
				cursor: no-drop;
				background-color: #616161;
		}
		.btn-commenters {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				min-width: 100%;
				background-color: #1565c0;
				color: #fff;
				font-size: 12px;
				font-weight: 600;
		}
		.btn-commenters:hover {
				background-color: #0c468a;
				color: #fff;
		}
		.btn-commenters i { font-size: 16px; }
		.btn-commenters span { margin-left: 10px; }
		.btn-primary { background-color: #1565c0; }
		.btn-warning { background-color: #ff8f00; color: #111111; }
		.btn-danger:hover, .btn-danger:focus, .btn-danger:active, .btn-danger:visited { font-weight: 500; }
		.btn-warning:hover, .btn-warning:focus, .btn-warning:active, .btn-warning:visited {
				background-color: #ffb300;
				color: #111111;
		}
		.btn-primary-outline {
				background-color: transparent !important;
				color: #1665c0 !important;
				border-color: #1665c0 !important;
		}
		.alert-danger {
				background-color: #f3958e9c;
				color: #a94442;
		}
		.invalid-focus {
				pointer-events: none;
				font-weight: bolder;
				border-color: transparent;
				color: #525253;
				background-color: #000000;
				text-decoration: line-through;
				font-style: italic;
				text-decoration-style: double;
		}
		.alert-danger::-webkit-input-placeholder, .alert-danger::placeholder { color: #a94442; }
		.configuration {
				display: flex;
				justify-content: center;
				align-items: center;
				user-select: none;
				border-radius: 4px;
				border: 1px solid #afb4b7;
				box-shadow: 3px 7px 5px 0px #00000026;
				padding: 6px 12px;
				font-size: 14px;
				text-align: center;
				white-space: nowrap;
		}
		.buttons-title {
				text-align: center;
				font-size: 16px;
				color: #ffffff;
				background-color: #23272b;
		}
		.config-item {
				grid-column: span 2;
				font-size: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 5px 0px;
		}
		.config-item * {
				margin: 0;
				padding: 0;
				user-select: none;
				cursor: pointer;
		}
		.config-item input {
				margin: 0;
				margin-right: 10px;
		}
		.routine-div p {
				margin: 0px;
				background-color: #23272b;
				text-align: center;
				color: white;
		}
		.routine-div ul {
				list-style-type: none;
				overflow-y: scroll;
				height: 140px;
				margin: 0px;
				padding: 0px;
		}
		.routine-div ul li { padding-top: 10px; }
		.routine-div ul li.checkbox {
				display: flex;
				flex-direction: row-reverse;
				align-items: center;
				justify-content: flex-end;
				margin: 0px;
				padding: 0px;
		}
		.routine-div ul li input[type=checkbox] { margin: 5px; }
		.routine-div ul li.striped input { margin-right: 10px; }
		.routine-div ul .striped:nth-child(2n) { font-weight: bold; }
		.routine-div ul::-webkit-scrollbar-thumb {
				background-color: #23272b2e;
				border-radius: 10px;
		}
		.comments-grid {
				grid-row: 1 / span 2;
				grid-column: 4;
		}
		.custom-grid {
				grid-row: 1 / span 2;
				grid-column: 3;
		}
		.custom-grid ul { height: 310px; }
		.comments-grid ul { height: 280px; }
		.i-sm { font-size: 20px; }
		#quick-actions {
				display: grid;
				grid-template-columns: 1fr 1fr;
				min-height: 25px;
		}
		#quick-actions button { border-radius: 0px; }
		#quick-actions span {
				font-size: 10px;
				overflow: hidden;
				text-overflow: ellipsis;
		}
		.quick-note {
				display: flex;
				align-items: center;
				font-size: 11px;
				font-weight: bold;
				color: #427dc6;
		}
		.custom-modal-body {
				display: grid;
				grid-template-rows: repeat(7, 60px);
				grid-gap: 10px;
				overflow-y: scroll;
				margin: auto;
				margin-top: 5%;
				padding: 30px;
				height: 80%;
				width: 75%;
				border-radius: 10px;
				background-color: #ffffffc7;
		}
		.custom-modal-options {
				display: grid;
				grid-template-columns: repeat(5, 1fr);
				align-items: center;
				justify-content: center;
		}
		.custom-modal-options * { margin: 0 5px; }
		.custom-modal-options .btn-close-modal { grid-column-start: 5; }
		.large-checkbox {
				display: flex;
				align-items: center;
				user-select: none;
				margin: 10px;
		}
		.large-checkbox input {
				margin: 0;
				height: 20px;
				width: 30px;
		}
		.large-checkbox label {
				line-height: 20px;
				margin: 0;
		}
		.custom-modal-fields {
				display: grid;
				grid-template-columns: 3fr 2fr 2fr 2fr 2fr;
				grid-template-rows: 40px 20px;
				align-items: center;
				justify-items: center;
				height: 60px;
		}
		.custom-modal-fields input ~ i {
				color: #ff4242;
				font-size: 40px;
		}
		.custom-modal-fields input:checked ~ i {
				color: #5cb85c;
				font-size: 40px;
		}
		.custom-modal-fields label {
				user-select: none;
				cursor: pointer;
				margin-bottom: 0;
		}
		.context-menu {
				position: absolute;
				display: grid;
				row-gap: 5px;
				cursor: pointer;
				font-size: 12px;
				padding: 5px;
				margin: 0px;
				border-radius: 5px;
				border: 1px solid #427dc6;
				background-color: white;
				z-index: ${higherIndex + 3}
		}
		input[type=checkbox], label[for] { cursor: pointer; }
		.context-menu > span { padding: 5px }
		.context-menu > span:hover {
				background-color: #427dc6;
				color: white;
		}
	`;
	document.body.appendChild(style);
}
function createCustomOptions() {
	byId('open-meeting-options')?.remove();
	const btnOptions = createElement('<button id="open-meeting-options" style="margin-right: 20px">JW.ORG</button>', { onclick: toggleModal });
	query('#wc-footer .footer__inner').appendChild(btnOptions);
}
function createCustomModal() {
	const modalBackdrop = byId(generalIDs.customModal) || createElement(`<div id="${generalIDs.customModal}"></div>`);
	modalBackdrop.style.display = 'none';
	modalBackdrop.onclick = ({ target }) => {
		if (target === modalBackdrop) {
			closeCustomModal();
		}
	};
	removeChildren(modalBackdrop);
	return modalBackdrop;
}
function createCustomMenu(element, options) {
	if (!element || !Array.isArray(options)) {
		return;
	}
	let menu = byId(generalIDs.customMenu);
	if (!menu) {
		menu = createElement(`<div id="${generalIDs.customMenu}" class="context-menu"></div>`);
		document.body.appendChild(menu);
	}
	element.oncontextmenu = event => {
		event.preventDefault();
		menu.style.top = event.pageY;
		menu.style.left = event.pageX;
		menu.style.display = 'grid';
		removeChildren(menu);
		options.forEach(({ text, onclick }) => menu.appendChild(createElement(`<span>${text}</span>`, { onclick })));
	};
	document.body.onclick = ({ path }) => {
		if (menu && !path.find(e => e.id === 'wc-container-right')) {
			menu.style.display = 'none';
		}
	};
}
function createCustomFocus(details, name) {
	return {
		id: generateId(name),
		name,
		validate: () => details.every(p => getUserByText(p.role)),
		click: () => {
			const fields = details.map(({ role, useMike, useVideo, useSpotlight }) => {
				const list = [useMike && 'mic', useVideo && 'vídeo', useSpotlight && 'spot'].filter(Boolean);
				const userName = getUserByText(role)?.userName;
				return `${userName} - [${list}]\n`;
			}).join('');
			const action = prompt(`${name.toUpperCase()}\n${fields}\n"F" = focar\n"C" = chamar\n[Qualquer outra ação] = abortar`);
			if (!action) {
				return;
			}
			const isFocusing = String(action).toUpperCase() === 'F';
			if (isFocusing) {
				const exceptionList = details.reduce((list, { role, useMike }) => (
					useMike ? [...list, getUserByText(role)?.userId] : list
				), []);
				stopEveryUserAudio(exceptionList);
				stopEveryUserSpotlight();
				resetStage();
			}
			details.forEach(({ role, useVideo, useMike, useSpotlight }) => {
				const userId = getUserByText(role)?.userId;
				if (useMike) {
					startUserAudio(userId);
					subscribeStager(userId);
				}
				if (useVideo) {
					startUserVideo(userId);
					if (useSpotlight && isFocusing) {
						addUserSpotlight(userId);
						subscribeStager(userId);
					}
				}
			});
		}
	};
}
function createCustomFocusFields() {
	const suffix = Math.random().toString(36).substring(2);
	const onchange = ({ target }) => {
		const icon = target.nextElementSibling;
		const label = query(`label[for="${target.id}"]`);
		icon.innerText = target.checked ? icon.dataset.on : icon.dataset.off;
		label.innerText = target.checked ? label.dataset.on : label.dataset.off;
		label.style.color = target.checked ? '#5cb85c' : '#ff4242';
	};
	return hydrate(`
		<div class="custom-modal-fields">
			<div class="input-group custom-focus-name">
				<input type="text" class="form-control" name="role" placeholder="Participante ou Função" />
				<span class="input-group-btn">
					<button hydrate="btn1" name="check-text" class="btn btn-primary">Validar texto</button>
				</span>
			</div>
			<label>
				<input hydrate="check1" type="checkbox" style="display: none;" name="useVideo" id="useVideo-${suffix}">
				<i class="i-sm material-icons-outlined" data-on="videocam" data-off="videocam_off">videocam_off</i>
			</label>
			<label>
				<input hydrate="check2" type="checkbox" style="display: none;" name="useMike" id="useMike-${suffix}" checked>
				<i class="i-sm material-icons-outlined" data-on="mic_none" data-off="mic_off">mic_none</i>
			</label>
			<label>
				<input hydrate="check3" type="checkbox" style="display: none;" name="useSpotlight" id="useSpotlight-${suffix}">
				<i class="i-sm material-icons-outlined" data-on="gps_fixed" data-off="gps_not_fixed">gps_not_fixed</i>
			</label>
			<label data-on="Solicitar Vídeo" data-off="Sem Vídeo" for="useVideo-${suffix}" style="color: #ff4242" grid-column-start: 3;">Sem Vídeo</label>
			<label data-on="Solicitar Microfone" data-off="Sem Microfone" for="useMike-${suffix}" style="color: #5cb85c">Solicitar Microfone</label>
			<label data-on="Com Spotlight" data-off="Sem Spotlight" for="useSpotlight-${suffix}" style="color: #ff4242">Sem Spotlight</label>
		</div>`, {
		btn1: { onclick: validateCustomFocusTarget },
		check1: { onchange },
		check2: { onchange },
		check3: { onchange }
	});
}
function closeModal() {
	byId(generalIDs.modal).style.display = 'none';
}
function closeCustomModal() {
	const modal = byId(generalIDs.customModal);
	removeChildren(modal);
	modal.style.display = 'none';
}
function createRenameRoleField(role, label) {
	const name = getCleanText(role);
	return hydrate(`
		<div style="display: flex;">
			<div class="input-group" style="flex: 3; margin: 5px 0 0 0;">
				<span class="input-group-addon" style="min-width: 120px; font-weight: 600;">${label}:</span>
				<input hydrate="input1" id="rename-${roles[name]}" value="${roles[name]}" type="text" class="form-control">
				<span class="input-group-btn">
					<button hydrate="btn1" class="btn btn-primary">Salvar</button>
				</span>
			</div>
			<span style="flex: 2; align-self: center; margin-left: 10px;" class="text-primary">${getUserByText(roles[name])?.displayName}</span>
		</div>`, {
		input1: {
			onkeyup: ({ target, key, code }) => {
				clearTimeout(config.lastValidation);
				config.lastValidation = setTimeout(() => {
					if ([code, key].includes('Enter')) {
						target.parentElement.querySelector('button').click();
					} else {
						target.parentElement.nextElementSibling.innerText = getUserByText(target.value).displayName;
					}
				}, 400);
			}
		},
		btn1: {
			onclick: ({ target }) => {
				const newRole = getCleanText(target.parentElement.parentElement.querySelector('input').value);
				if (!newRole) {
					alert('É necessário informar um indentificador');
				} else if (newRole !== roles[name]) {
					roles[name] = newRole;
					alert(`${roles[name]} mudou para: ${newRole}`);
					refreshDefaultButtons();
				}
			}
		}
	});
}
function renderModal() {
	importIcons();
	const modal = byId(generalIDs.modal);
	modal?.remove();
	const optionsModal = createElement(`<div style="display: none" class="main-modal" id="${generalIDs.modal}"></div>`);
	optionsModal.appendChild(renderButtonsFrame());
	optionsModal.appendChild(renderServicesFrame());
	optionsModal.appendChild(renderCustomFocusModal());
	document.body.appendChild(optionsModal);
}
function renderCustomFocusModal() {
	const body = hydrate(`
		<div class="custom-modal-body">
			<div class="alert alert-danger" id="error-alert-modal" style="display: none; font-size: 18px; margin: auto 0;">
				<span class="glyphicon glyphicon-exclamation-sign"></span>
				<span name="error-placeholder"></span>
			</div>
			<div class="custom-modal-options">
				<button hydrate="add" class="btn btn-success">Novo participante</button>
				<button hydrate="save" class="btn btn-primary">Salvar</button>
				<button hydrate="cancel" class="btn btn-primary-outline btn-close-modal">Cancelar</button>
			</div>
			<div class="input-group" style="margin: auto 5px;">
				<span class="input-group-addon">Informe o nome do botão:</span>
				<input name="custom-focus-name" type="text" class="form-control" placeholder="Primeira Visita">
			</div>
		</div>`, {
		add: { onclick: () => query('.custom-modal-body').appendChild(createCustomFocusFields()) },
		cancel: { onclick: closeCustomModal },
		save: {
			onclick() {
				const validFields = validateCustomFocusFields();
				if (validFields) {
					const btn = createCustomFocus(validFields.members, getCleanText(validFields.buttonName));
					routineWarnings.customFocus = [...routineWarnings.customFocus.filter(({ id }) => id !== btn.id), btn];
					refreshCustomFocusButtons();
					closeCustomModal();
				}
			}
		}
	});
	body.appendChild(createCustomFocusFields());
	return createCustomModal().appendChild(body).parentElement;
}
function renderSeeMoreModal() {
	const modal = hydrate(`
		<div class="custom-modal-body" style="display: block">
			<div style="display: flex; justify-content: space-between; align-items: center">
				<div class="large-checkbox h5">
					<input hydrate="input1" id="open-waiting-room" type="checkbox" ${isPublicRoom() && 'checked'}/>
					<label for="open-waiting-room">Liberar sala de espera para todos</label>
				</div>
				<button hydrate="close" class="btn btn-primary-outline btn-close-modal">Fechar</button>
			</div>
			<div class="large-checkbox h5">
				<input hydrate="input2" id="auto-spotlight" type="checkbox" ${isAutoSpotlight() && 'checked'}/>
				<label for="auto-spotlight">Ativar foco automático (remove automaticamente o spotlight)</label>
			</div>
		</div>`, {
		close: { onclick: closeCustomModal },
		input1: { onchange() { toggleObserved(constants.PUBLIC_ROOM_KEY); refreshWaitingRoom(); } },
		input2: { onchange() { toggleObserved(constants.AUTO_SPOTLIGHT_KEY); refreshVideosOn(); } },
	});
	queryAll('.call-member-frame button:not(.hidden)').forEach(btn => modal.appendChild(createRenameRoleField(btn.dataset.role, btn.innerText)));
	return createCustomModal().appendChild(modal);
}
function renderButtonsFrame() {
	const { counted, notCounted } = countAttendance();
	const confirmAction = callback => ({ target }) => {
		const { dataset: { q, a } } = target.closest('button');
		const answer = prompt(q);
		if (typeof answer === 'string') {
			return getCleanText(answer) === getCleanText(a) ? callback() : alert('Texto incorreto! Ação não executada.');
		}
	};
	const buttonsFrame = hydrate(`
		<div class="buttons-frame">
			<div class="exit-frame">
				<span class="buttons-title">Chamar</span>
				<span class="buttons-title">Focar</span>
				<span class="buttons-title close-feature-frame">
					<span style="grid-column-start: 2">Ações</span>
					<i hydrate="icon1" id="btn-close-modal" class="i-sm material-icons-outlined btn-close">cancel</i>
				</span>
			</div>
			<div class="call-member-frame">
				<button hydrate="call4" data-role="speaker" class="btn btn-success btn-feature">
					PALCO
				</button>
			</div>
			<div class="focus-on-frame">
				<button hydrate="focus4" data-role="speaker" class="btn btn-primary btn-feature">
					PALCO
					<i class="i-sm material-icons-outlined">record_voice_over</i>
				</button>
			</div>
			<div class="feature-frame">
				<button hydrate="btn1" class="btn btn-danger btn-feature" data-q="Digite: 'TUDO' para confirmar" data-a="TUDO"> Ligar tudo <div> <i class="i-sm material-icons-outlined">videocam</i> <i class="i-sm material-icons-outlined">mic_off</i> </div> </button>
				<button hydrate="btn2" class="btn btn-danger btn-feature" data-q="Digite: 'FIM' para confirmar" data-a="FIM"> Finalizar discurso <i class="i-sm material-icons-outlined">voice_over_off</i> </button>
				<button hydrate="btn3" class="btn btn-success btn-feature"> Criar foco <i class="i-sm material-icons-outlined">person_add</i> </button>
				<button hydrate="btn4" class="btn btn-success btn-feature"> Mais opções <i class="i-sm material-icons-outlined">add_circle_outline</i> </button>
				<button hydrate="btn5" class="btn btn-danger btn-feature" data-q="Digite: 'NADA' para confirmar" data-a="NADA"> Desligar tudo <div> <i class="i-sm material-icons-outlined">videocam_off</i> <i class="i-sm material-icons-outlined">mic_off</i> </div> </button>
				<button hydrate="btn6" class="btn btn-danger btn-applause btn-feature" data-q="Digite: 'OVAR' para confirmar" data-a="OVAR"> Palmas (${config.applauseDuration / 1000}s) <i class="i-sm material-icons-outlined">dry</i> </button>
				<div hydrate="div1" class="configuration" style="cursor: pointer">
					<i style="color: #5cb85c" class="i-sm material-icons-outlined">airline_seat_recline_normal</i>
					<span id="${generalIDs.counted}">${counted} identificado(s)</span>
				</div>
				<div class="configuration">
					<i style="color: #ff4242" class="i-sm material-icons-outlined">airline_seat_recline_extra</i>
					<span id="${generalIDs.notCounted}">${notCounted} não identificado(s)</span>
				</div>
				<div class="config-item">
					<input hydrate="check1" id="transparent-mode" type="checkbox"/>
					<label for="transparent-mode">Modo transparente (exibe vídeo em destaque)</label>
				</div>
			</div>
		</div>`, {
		icon1: { onclick: closeModal },
		focus1: { onclick() { focusOn(roles.conductor) } },
		focus2: { onclick() { focusOn(roles.reader) } },
		focus3: { onclick() { focusOn(roles.president) } },
		focus4: { onclick() { focusOn(roles.speaker) } },
		focus5: { onclick() { focusOn(roles.treasures) } },
		focus6: { onclick() { focusOn(roles.gems) } },
		focus7: { onclick() { focusOn(roles.bible) } },
		focus8: { onclick() { focusOn(roles.living1) } },
		focus9: { onclick() { focusOn(roles.living2) } },
		call1: { onclick() { callMember(roles.conductor) } },
		call2: { onclick() { callMember(roles.reader) } },
		call3: { onclick() { callMember(roles.president) } },
		call4: { onclick() { callMember(roles.speaker) } },
		call5: { onclick() { callMember(roles.treasures) } },
		call6: { onclick() { callMember(roles.gems) } },
		call7: { onclick() { callMember(roles.bible) } },
		call8: { onclick() { callMember(roles.living1) } },
		call9: { onclick() { callMember(roles.living2) } },
		btn1: { onclick: confirmAction(texasMode) },
		btn2: { onclick: confirmAction(finishSpeech) },
		btn3: { onclick: openCustomFocusModal },
		btn4: { onclick: openSeeMoreModal },
		btn5: { onclick: confirmAction(northKoreaMode) },
		btn6: { onclick: confirmAction(requestApplause) },
		check1: { onchange: () => byId(generalIDs.modal).classList.toggle('transparent-modal') },
		div1: {
			onclick() {
				const { counted } = countAttendance();
				const answer = prompt(`Enviar email com assistência de ${counted}?\n(Digite "ENVIAR" para confirmar)`);
				if (typeof answer === 'string') {
					return answer.toLowerCase() === 'enviar' ? sendEmail() : alert('Texto incorreto. Email NÃO enviado!');
				}
			}
		}
	});
	return buttonsFrame;
}
function renderServicesFrame() {
	return hydrate(`
		<div class="routines-frame">
			<div class="routine-div">
				<p>Rodando (marque para abortar)</p>
				<ul id="${generateId('continuousAttempts')}"></ul>
			</div>
			<div class="routine-div">
				<p>Nomes inválidos</p>
				<ul id="${generateId('invalidNames')}"></ul>
			</div>
			<div class="routine-div">
				<p>Vídeos ligados</p>
				<ul id="${generateId('videosOn')}"></ul>
			</div>
			<div class="routine-div">
				<p>Microfones ligados</p>
				<ul id="${generateId('mikesOn')}"></ul>
			</div>
			<div class="routine-div custom-grid">
				<p>Foco customizado</p>
				<ul id="${generateId('customFocus')}"></ul>
			</div>
			<div class="routine-div comments-grid">
				<p>Comentários</p>
				<div id="quick-actions">
					<button hydrate="btn1" class="btn btn-xs btn-primary">Silenciar todos</button>
					<button hydrate="btn2" class="btn btn-xs btn-success">Abaixar mãos</button>
				</div>
				<ul id="raised-hands"></ul>
			</div>
		</div>`, {
		btn1: { onclick: muteCommenters },
		btn2: { onclick: lowerHands }
	});
}
function showParticipantsList() {
	sendToRedux('SHOW_PARTICIPANTS_LIST', { showParticipants: true });
	sendToRedux('SHOW_RIGHT_CONTAINER', { data: true });
}
function getMoreDropdownOptions(optionLabels) {
	const moreOptions = Array.from(queryAll('#wc-container-right .window-content-bottom ul li a'));
	return moreOptions.find(option => optionLabels.includes(option.innerText));
}
function openCustomFocusModal() {
	renderCustomFocusModal();
	openCustomModal();
}
function openSeeMoreModal() {
	renderSeeMoreModal();
	openCustomModal();
}
function openCustomModal() {
	byId(generalIDs.customModal).style.display = 'block';
}
// STRING UTILS
function generateId(text) {
	return btoa(encodeURI(text)).replace(/=/g, '');
}
function getCleanText(text) {
	return !text ? '' : text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, ' ');
}
function isNameValid(name = '') {
	/* ACCEPTED FORMAT: (number) members names */
	if (/^\s*[\(\[\{]\s*[0-9]/i.test(name)) {
		const brands = 'samsung_apple_motorola_nokia_lg_lenovo_huawei_xiaomi_galaxy_note_ipad_iphone_moto_oppo_vivo_tecno'.split('_');
		return name.toLowerCase().split(/\b/).every(x => !brands.includes(x));
	}
	return false;
}
// LIFECYCLE
function onAppStateChange(oldState, newState) {
	if (oldState.meeting !== newState.meeting || oldState.attendeesList !== newState.attendeesList) {
		refreshScreen();
	}
}
function subscribe({ queue, userId }) {
	if (!observed[queue]?.includes(userId)) {
		observed[queue] = [userId, ...observed[queue]];
	}
}
function unsubscribe({ queue, userId }) {
	observed[queue] = observed[queue].filter(id => id !== userId);
}
function subscribeCommenter(userId) {
	subscribe({ userId, queue: constants.COMMENTING_QUEUE });
}
function unsubscribeCommenter(userId) {
	unsubscribe({ userId, queue: constants.COMMENTING_QUEUE });
}
function subscribeStager(userId) {
	subscribe({ userId, queue: constants.ON_STAGE_QUEUE });
}
function unsubscribeStager(userId) {
	unsubscribe({ userId, queue: constants.ON_STAGE_QUEUE });
}
function resetStage() {
	clearQueue({ queue: constants.ON_STAGE_QUEUE });
}
function clearQueue({ queue }) {
	observed[queue] = [];
}
function setObserved(name, value) {
	observed[name] = Boolean(value);
}
function toggleObserved(name) {
	observed[name] = !observed[name];
}
function toggleModal() {
	const modal = byId(generalIDs.modal);
	if (modal.style.display === 'none') {
		modal.removeAttribute('style');
	} else {
		closeModal();
	}
}
function getCommenters() {
	return observed[constants.COMMENTING_QUEUE];
}
function isOnStage(id) {
	return observed.onStage.includes(id);
}
function isCommenting(id) {
	return observed.commenting.includes(id);
}
function isAutoSpotlight() {
	return Boolean(observed.autoSpotlight);
}
function isPublicRoom() {
	return Boolean(observed.publicRoom);
}
function refreshScreen() {
	clearTimeout(config.lastChange);
	config.lastChange = setTimeout(() => {
		refreshInvalidNames();
		refreshVideosOn();
		refreshMikesOn();
		refreshDefaultButtons();
		refreshRaisedHands();
		refreshAttendanceCount();
		refreshWaitingRoom();
		refreshWarnings();
		refreshRoutines();
	}, 200);
}
function refreshWarnings() {
	Object.keys(routineWarnings).forEach(routine => {
		if (routine !== 'continuousAttempts' && routineWarnings[routine].length > 10) {
			routineWarnings[routine] = [...new Set(routineWarnings[routine])].slice(-10);
		}
	});
}
function refreshInvalidNames() {
	routineWarnings.invalidNames = selectUsers().reduce((list, { displayName }) => (
		isNameValid(displayName) ? list : [...list, displayName]
	), []);
}
function refreshWaitingRoom() {
	const waitingRoom = getUsersInWaitingRoom();
	if (!waitingRoom.length) {
		return;
	}

	const [first] = waitingRoom;
	const audioLoaded = 1;
	if (isPublicRoom() && first?.audioConnectionStatus !== audioLoaded) {
		return acceptEveryUserInWaitingRoom();
	}

	getUsersInWaitingRoom().forEach(({ displayName, userId }) => {
		if (isNameValid(displayName)) {
			acceptUserInWaitingRoom(userId);
		}
	});
}
function refreshVideosOn() {
	routineWarnings.videosOn = selectUsers().reduce((list, user) => (
		user.bVideoOn ? [...list, user.displayName] : list
	), []);
}
function refreshMikesOn() {
	routineWarnings.mikesOn = selectUsers().reduce((list, user) => (
		user.muted ? list : [...list, user.displayName]
	), []);
}
function refreshRoutines() {
	Object.keys(routineWarnings).forEach(routine => {
		const ulRoutine = byId(generateId(routine));
		removeChildren(ulRoutine);
		const method = {
			continuousAttempts: () => refreshContinuousAttempts(),
			customFocus: () => refreshCustomFocusButtons(),
			invalidNames: () => updateInvalidNames(ulRoutine),
			mikesOn: () => updateMikesOn(ulRoutine),
			videosOn: () => updateVideosOn(ulRoutine)
		}[routine];
		if (method) {
			return method();
		}
		routineWarnings[routine].forEach(msg => {
			const li = createElement(`<li class="striped">${msg}</li>`);
			ulRoutine.appendChild(li);
		});
	});
}
function refreshDefaultButtons() {
	const toCall = queryAll('.call-member-frame > button') || [];
	const toFocus = queryAll('.focus-on-frame > button') || [];
	const statusClass = 'invalid-focus';
	toCall.forEach((btnCall, i) => {
		const btnFocus = toFocus[i];
		if (!getUserByText(roles[btnCall.dataset.role])) {
			btnCall.classList.add(statusClass);
			btnFocus.classList.add(statusClass);
		} else {
			btnCall.classList.remove(statusClass);
			btnFocus.classList.remove(statusClass);
		}
	});
}
function refreshRaisedHands() {
	const list = query('#raised-hands');
	removeChildren(list);

	const [commenterId] = getCommenters();
	const foundUser = getUserById(commenterId);
	if (!foundUser?.muted && foundUser?.bRaiseHand) {
		lowerUserHand(commenterId);
	}
	selectUsers().forEach(user => {
		if (!user.bRaiseHand) {
			return;
		}
		list.appendChild(hydrate(`
			<li>
				<button hydrate="btn1" data-member="${user.displayName}" class="btn-xs btn-commenters">
					<i data-member="${user.displayName}" class="material-icons-outlined">mic_none</i>
					<span data-member="${user.displayName}">${user.displayName}</span>
				</button>
			</li>`, {
			btn1: { onclick: () => callCommenter(user.userId) }
		}));
	});
}
function refreshAttendanceCount() {
	const { counted, notCounted } = countAttendance();
	byId(generalIDs.counted).innerText = `${counted} identificado(s)`;
	byId(generalIDs.notCounted).innerText = `${notCounted} não identificado(s)`;
}
function refreshContinuousAttempts() {
	const ul = byId(generateId('continuousAttempts'));
	ul.querySelectorAll('li').forEach(li => li.remove());
	routineWarnings.continuousAttempts.forEach(attempt => {
		ul.appendChild(hydrate(`
			<li class="checkbox">
				<label for="${getCleanText(attempt)}">${attempt}</label>
				<input hydrate="input1" id="${getCleanText(attempt)}" type="checkbox" value="${attempt}"/>
			</li>`, {
			input1: {
				onclick({ target }) {
					routineWarnings.continuousAttempts = routineWarnings.continuousAttempts.filter(id => id !== target.value);
					refreshContinuousAttempts();
				}
			}
		}));
	});
}
function refreshCustomFocusButtons() {
	const ul = byId(generateId('customFocus'));
	ul.querySelectorAll('li').forEach(li => li.remove());
	routineWarnings.customFocus.forEach(({ id, name, validate, click }) => {
		const isValid = validate();
		ul.appendChild(hydrate(`
			<li class="btn-custom-focus">
				<button hydrate="btn1" ${!isValid && 'disabled'} class="btn-sm">${isValid ? name : 'Não encontrado!'}</button>
				<i hydrate="icon1" class="i-sm material-icons-outlined" style="font-size: 22px; cursor: pointer">cancel</i>
			</li>`, {
			btn1: { onclick: e => !e.target.attributes.disabled && click() },
			icon1: {
				onclick: () => {
					if (id) {
						routineWarnings.customFocus = routineWarnings.customFocus.filter(cf => cf.id !== id);
						refreshCustomFocusButtons();
					}
				}
			}
		}));
	});
}
function updateContextMenu(ul, id, contextMenu) {
	routineWarnings[id].forEach(value => {
		const element = createElement(`<li class="striped">${value}</li>`);
		const menu = contextMenu.map(li => ({ ...li, onclick: () => li.onclick(value) }));
		createCustomMenu(element, menu);
		ul.appendChild(element);
	});
}
function updateInvalidNames(ul) {
	updateContextMenu(ul, 'invalidNames', [
		{ text: 'Renomear', onclick: name => openRenamePopup(getUserByText(name, true)) },
		{ text: 'Mover para sala de espera', onclick: name => moveUserToWaitingRoom(getUserByText(name, true).userId) }
	]);
}
function updateMikesOn(ul) {
	updateContextMenu(ul, 'mikesOn', [{
		text: 'Silenciar',
		onclick: name => stopUserAudio(getUserByText(name).userId)
	}]);
}
function updateVideosOn(ul) {
	updateContextMenu(ul, 'videosOn', [{
		text: 'Desligar vídeo (desativado)',
		onclick: name => stopUserVideo(getUserByText(name).userId)
	}]);
}
function validateCustomFocusTarget({ target }) {
	const { value, classList } = target.parentElement.previousElementSibling;
	const user = getUserByText(value);
	if (user) {
		classList.remove('alert-danger');
		alert(`Participante encontrado: ${user.displayName}`);
		return;
	}
	classList.add('alert-danger');
	alert(value ? `"${value.toUpperCase()}" não encontrado` : `Informe como encontrar o participante`);
}
function validateCustomFocusFields() {
	let hasError = false;
	const errorSpan = query('#error-alert-modal span[name="error-placeholder"]');
	const errorStyle = 'alert-danger';
	const focusNameInput = query(`#${generalIDs.customModal} input[name="custom-focus-name"]`);
	const members = [];
	if (!focusNameInput.value) {
		focusNameInput.classList.add(errorStyle);
		errorSpan.innerText = 'Informe nome para o novo botão. Preencha o(s) campo(s) em vermelho';
		errorSpan.parentElement.style.display = 'block';
		return;
	}
	queryAll(`#${generalIDs.customModal} .custom-modal-fields`).forEach(fields => {
		const customFocus = {};
		fields.querySelectorAll('input[type="checkbox"]').forEach(({ name, checked }) => customFocus[name] = checked);
		fields.querySelectorAll('input[type="text"]').forEach(({ value, classList }) => {
			if (getUserByText(value)) {
				customFocus.role = value;
			} else {
				classList.add(errorStyle);
				hasError = true;
			}
		});
		members.push(customFocus);
	});
	if (hasError) {
		errorSpan.innerText = 'Preencha o(s) campo(s) em vermelho e selecione "validar texto"';
		errorSpan.parentElement.style.display = 'block';
		return;
	}
	return {
		members,
		buttonName: focusNameInput.value
	};
}
function keepUserAudio(id) {
	selectUsers().forEach(({ userId, muted }) => {
		if (userId !== id && !muted) {
			stopUserAudio(userId);
		}
	});
}
function keepUserHandRaised(id) {
	selectUsers().forEach(({ userId, bRaiseHand }) => {
		if (userId !== id && bRaiseHand) {
			lowerUserHand(userId);
		}
	});
}
function texasMode() {
	selectUsers().forEach(({ userId }) => {
		startUserVideo(userId);
		startUserAudio(userId);
		stopUserSpotlight(userId);
	});
	enableAllowMikes(true);
	enableMuteOnEntry(false);
	setObserved(constants.PUBLIC_ROOM_KEY, true);
}
function northKoreaMode() {
	stopEveryUserAudio();
	enableAllowMikes(false);
	enableMuteOnEntry(true);
}
function focusOn(role) {
	const user = getUserByText(role);
	if (!user?.userId) {
		return alert(`Participante: "${role}" não encontrado`);
	}
	resetStage();
	setObserved(constants.AUTO_SPOTLIGHT_KEY, false)
	if (!user.bVideoOn) {
		startUserVideo(user.userId);
	}
	startUserAudio(user.userId);
	keepUserAudio(user.userId);
	startUserSpotlight(user.userId);
	subscribeStager(user.userId);
}
function callMember(role) {
	const id = getUserByText(role)?.userId;
	if (!id) {
		alert(`Participante: "${role}" não encontrado`);
		return;
	}
	startUserVideo(id);
	startUserAudio(id);
}
function callCommenter(userId) {
	if (!userId) {
		return;
	}
	startUserAudio(userId);
	keepUserHandRaised(userId);
	subscribeCommenter(userId);
	getCommenters().forEach(commenterId => {
		if (userId !== commenterId) {
			stopUserAudio(commenterId);
			unsubscribeCommenter(commenterId);
		}
	});
}
function muteCommenters() {
	getCommenters().forEach(commenterId => {
		unsubscribeCommenter(commenterId);
		stopUserAudio(commenterId);
	});
}
function lowerHands() {
	if (selectUsers().find(u => u.bRaiseHand)) {
		lowerEveryUserHand();
	}
}
function fetchRenamingList(id) {
	fetch(`https://zoom.vercel.app/api/rename-list?id=${id}`, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(async data => {
		const resp = await data.json();
		if (!resp.success) {
			return alert('<h4>Não foi possível obter nomes a renomear</h4>');
		}
		renameMembers(resp.list);
		alert('Os participantes detectados foram renomeados');
	}).catch(err => alert(err));
}
function sendEmail() {
	fetch('https://zoom.vercel.app/api/send-email', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			attendance: countAttendance().counted,
			id: 'Nordeste'
		})
	}).then(async data => {
		const resp = await data.json();
		alert(resp.success ? resp.message : 'Não foi possível enviar e-mail');
	}).catch(err => alert(err));
}
function importIcons() {
	if (!query('#icons')) {
		const link = createElement('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" id="icons"/>');
		document.head.appendChild(link);
	}
}
function openRenamePopup() {
	alert('NOT IMPLEMENTED');
}
function renameMembers(namesMapList) {
	alert('NOT IMPLEMENTED');
	// TODO: use socket
}
function autoRename() {
	const password = prompt('Informe a senha para obter a lista de renomeação');
	if (password) {
		fetchRenamingList(password);
	}
}
function countAttendance() {
	let counted = 0;
	let notCounted = 0;
	selectUsers().forEach(({ displayName }) => {
		if (!isNameValid(displayName)) {
			return notCounted++;
		}
		const attendance = parseInt(displayName.replace(/\(|\{|\[/, '').trim());
		if (attendance > 0) {
			counted += attendance;
		}
	});
	return { counted, notCounted };
}
function enableMuteOnEntry(enable) {
	const muteOnEntryOption = getMoreDropdownOptions(uiLabels.muteOnEntry);
	if (!muteOnEntryOption) {
		return;
	}
	const isActive = muteOnEntryOption.querySelector('.i-ok-margin');
	if ((enable && !isActive) || (!enable && isActive)) {
		muteOnEntryOption.click();
		setTimeout(() => {
			const allowMikesOption = query('.zm-modal-footer-default-checkbox');
			if (allowMikesOption) {
				if (allowMikesOption.querySelector('.zm-checkbox-checked')) {
					allowMikesOption.querySelector('.zm-checkbox-message').click();
				}
				query('.zm-modal-footer-default-actions .zm-btn__outline--blue').click();
			}
		}, 100);
	}
}
function enableAllowMikes(enable) {
	const allowMikesOption = getMoreDropdownOptions(uiLabels.allowMikes);
	if (!allowMikesOption) {
		return;
	}
	const isActive = allowMikesOption.querySelector('.i-ok-margin');
	if ((enable && !isActive) || (!enable && isActive)) {
		allowMikesOption.click();
	}
}
function requestApplause() {
	alert('NOT IMPLEMENTED');
}
function finishSpeech() {
	alert('NOT IMPLEMENTED');
}

/* LITERALS */
var generalIDs = {
	counted: 'counted-members',
	notCounted: 'not-counted-members',
	modal: 'meeting-options',
	customModal: 'custom-modal',
	customMenu: 'context-menu'
};
var roles = {
	conductor: 'dirigente',
	president: 'presidente',
	reader: 'leitor',
	speaker: 'palco',
	treasures: 'tesouros',
	gems: 'joias',
	bible: 'biblia',
	living1: 'vida-1',
	living2: 'vida-2'
};
var uiLabels = {
	allowMikes: [langResource['apac.wc_allow_unmute']],
	muteOnEntry: [langResource['apac.wc_mute_participants_on_entry']],
};
var constants = {
	ON_STAGE_QUEUE: 'onStage',
	COMMENTING_QUEUE: 'commenting',
	PUBLIC_ROOM_KEY: 'publicRoom',
	AUTO_SPOTLIGHT_KEY: 'autoSpotlight',
};
/* SETTINGS AND CONTROLS */
var runningIntervals = runningIntervals || {};
var observed = observed || {
	onStage: [],
	commenting: [],
	publicRoom: false,
	autoSpotlight: false
};
var routineWarnings = routineWarnings || {
	continuousAttempts: [],
	invalidNames: [],
	videosOn: [],
	mikesOn: [],
	customFocus: [],
};
var config = config || {
	// cache: {},
	applauseDuration: 8000,
	lastChange: null,
	lastValidation: null
};

/* HACK STUFF */
var reduxUnsubscribe = reduxUnsubscribe || null;
var reduxState = null;
var webSocketSend = webSocketSend || WebSocket.prototype.send;
var zoomWebSocket = zoomWebSocket || null;
var zoomActions = {
	AUDIO: 8193,
	HAND: 4131,
	LOWER_ALL: 4129,
	MUTE_ALL: 8201,
	RENAME: 4109,
	SPOTLIGHT: 4219,
	VIDEO: 12297,
	WAITING_ROOM: 4199,
	WAITING: 4113,
};

/* INIT */
try {
	startHacking();
	console.clear();
} catch (erro) {
	alert('Erro ao executar o script: ' + erro.message);
}

function createDomObserver() {
	if (observer) {
		observer.disconnect();
	}

	observer = new MutationObserver(refreshScreen);
	observer.observe(document.getElementById('wc-container-right'), {
		subtree: true,
		childList: true,
		characterData: true,
		attributes: true
	});
}

function createMouseOverEvent() {
	const bogusEvent = new MouseEvent('mouseover', { bubbles: true });
	bogusEvent.simulated = true;
	return bogusEvent;
}

function createElement(text, events) {
	const dom = new DOMParser().parseFromString(text.replace(/\s+/g, ' '), 'text/html');
	const element = dom.body.children[0] || dom.head.children[0];
	events && Object.keys(events).forEach(k => element[k] = events[k]);
	return element;
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

function createCss() {
	const membersPaneWidth = parseInt(document.querySelector('#wc-container-right').style.width);
	const footerButtonsHeight = document.querySelector('#wc-footer').clientHeight;
	const higherIndex = Math.max.apply(null, Array.from(document.querySelectorAll('body *')).map(({ style = {} }) => style.zIndex || 0));
	const style = document.getElementById('custom-style') || document.createElement('style');
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
            grid-template-columns: 1fr 1fr;
            gap: 5px;
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
	const currentButton = document.getElementById('open-meeting-options');

	if (currentButton) {
		currentButton.remove();
	}

	document.querySelector('#wc-footer .footer__inner').appendChild(
		createElement('<button id="open-meeting-options" style="margin-right: 20px">JW.ORG</button>', {
			onclick: toggleModal
		})
	);
}

function createCustomModal() {
	const modalBackdrop = document.getElementById(generalIDs.customModal) || createElement(`<div id="${generalIDs.customModal}"></div>`);
	modalBackdrop.style.display = 'none';
	modalBackdrop.onclick = ({ target }) => target !== modalBackdrop || closeCustomModal();

	removeChildren(modalBackdrop);
	return modalBackdrop;
}

function createCustomMenu(element, options) {
	if (!element || !Array.isArray(options)) {
		return;
	}

	let menu = document.getElementById(generalIDs.customMenu);

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
		validate: () => openMembersPanel() || details.every(p => getMember(p.role)),
		click: () => {
			const fields = details.map(({ role, useMike, useVideo, useSpotlight }) => {
				const list = [useMike && 'mic', useVideo && 'vídeo', useSpotlight && 'spot'].filter(Boolean);
				return `${getMemberName(getMember(role))} - [${list}]\n`;
			}).join('');
			const action = prompt(`${name.toUpperCase()}\n${fields}\n"F" = focar\n"C" = chamar\n[Qualquer outra ação] = abortar`);
			const fullAttention = String(action).toUpperCase() === 'F';

			if (!action) {
				return;
			}

			const videoExceptions = [];
			const mikeExceptions = [];

			details.forEach(({ role, useVideo, useMike, useSpotlight }) => {
				const member = getMember(role);
				useVideo && videoExceptions.push(member);
				useMike && mikeExceptions.push(member);

				if (useVideo) {
					startVideo(member, () => {
						useSpotlight && fullAttention && startSpotlight(member);
						useMike && startMike(member, true);
					});
				} else if (useMike) {
					startMike(member, true);
				}
			});

			if (fullAttention) {
				stopAllMikes(mikeExceptions);
				stopAllVideos(videoExceptions);
			}
		}
	};
}

function createCustomFocusFields() {
	const suffix = Math.random().toString(36).substring(2);
	const onchange = ({ target }) => {
		const icon = target.nextElementSibling;
		const label = document.querySelector(`label[for="${target.id}"]`);
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
            <span style="flex: 2; align-self: center; margin-left: 10px;" class="text-primary">${getMemberName(getMember(roles[name]))}</span>
        </div>`, {
		input1: {
			onkeyup: ({ target, key, code }) => {
				clearTimeout(config.lastValidation);
				config.lastValidation = setTimeout(() => {
					if ([code, key].includes('Enter')) {
						target.parentElement.querySelector('button').click();
					} else {
						target.parentElement.nextElementSibling.innerText = getMemberName(getMember(target.value));
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

function getCleanText(text) {
	return !text ? '' : text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, ' ');
}

function getMember(role, absolute) {
	if (!role) {
		return;
	}

	return getMembers().find(member => {
		const name = getCleanText(getMemberName(member));
		return name && absolute
			? getCleanText(name) === getCleanText(role)
			: name.includes(getCleanText(role));
	});
}

function getMembers() {
	return Array.from(document.querySelectorAll('.participants-ul .item-pos.participants-li'));
}

function getMemberName(member) {
	return !member ? '' : member.querySelector('.participants-item__display-name').innerText;
}

function getMemberButtons(member) {
	return !member ? [] : Array.from(member.querySelectorAll('.participants-item__buttons .button-margin-right'));
}

function getMemberDropdownButtons(member) {
	return !member ? [] : Array.from(member.querySelectorAll('.participants-item__buttons .dropdown-menu a'));
}

function getMoreDropdownOptions(optionLabels) {
	const options = document.querySelectorAll('#wc-container-right .window-content-bottom ul li a');
	return Array.from(options).find(a => optionLabels.includes(a.innerText));
}

/* ACCEPTED FORMAT: (number) members names */
function isNameValid(member) {
	const name = getMemberName(member);

	if (/^\s*[\(\[\{]\s*[0-9]/i.test(name)) {
		const brands = 'samsung_apple_motorola_nokia_lg_lenovo_huawei_xiaomi_galaxy_note_ipad_iphone_moto_oppo_vivo_tecno'.split('_');
		return name.toLowerCase().split(/\b/).every(x => brands.indexOf(x) === -1);
	} else {
		return false;
	}
}

function isMikeOn(member) {
	if (!member) {
		return false;
	}
	member.dispatchEvent(createMouseOverEvent());
	return getMemberButtons(member).some(btn => uiLabels.stopMike.includes(btn.innerText));
}

function isVideoOn(member) {
	if (!member) {
		return false;
	}
	member.dispatchEvent(createMouseOverEvent());
	return getMemberDropdownButtons(member).some(btn => uiLabels.stopVideo.includes(btn.innerText));
}

function isSpotlightOn(member) {
	if (!member) {
		return false;
	}
	member.dispatchEvent(createMouseOverEvent());
	return getMemberDropdownButtons(member).some(btn => uiLabels.stopSpotlight.includes(btn.innerText));
}

function isHandRaised(member) {
	return member && getMemberButtons(member).some(btn => uiLabels.lowerHands.includes(btn.innerText));
}

function clickButton(member, btnLabels) {
	if (!member) {
		return refreshScreen();
	}
	member.dispatchEvent(createMouseOverEvent());
	getMemberButtons(member).some(btn => {
		if (btn && btnLabels.includes(btn.innerText)) {
			btn.click();
			return true;
		}
	});
}

function clickDropdown(member, btnLabels) {
	if (!member) {
		refreshScreen();
		return;
	}
	member.dispatchEvent(createMouseOverEvent());
	return getMemberDropdownButtons(member).some(btn => {
		if (btn && btnLabels.includes(btn.innerText)) {
			btn.click();
			return true;
		}
	});
}

function cleanVideoScanner() {
	unschedule(observed.scanningVideo);
	delete observed.scanningVideo;
}

function refreshScreen() {
	clearTimeout(config.lastChange);
	config.lastChange = setTimeout(() => {
		openMembersPanel();

		refreshInvalidNames();
		refreshVideosOn();
		refreshMikesOn();
		refreshDefaultButtons();
		refreshRaisedHands();
		refreshAttendanceCount();
		refreshWaitingRoom();

		refreshWarnings();
		refreshRoutines();
	}, 100);
}

function refreshWarnings() {
	Object.keys(routineWarnings).forEach(routine => {
		if (routine !== 'continuousAttempts' && routineWarnings[routine].length > 10) {
			routineWarnings[routine] = [...new Set(routineWarnings[routine])].slice(-10);
		}
	});
}

function refreshInvalidNames() {
	routineWarnings.invalidNames = getMembers().reduce((list, member) => {
		if (!isNameValid(member)) {
			list.push(getMemberName(member));
		}
		return list;
	}, []);
}

function refreshWaitingRoom() {
	document.querySelectorAll('.waiting-room-list-conatiner__ul li').forEach(member => {
		if (isNameValid(member) || observed.publicRoom) {
			member.dispatchEvent(createMouseOverEvent());
			const btnAllow = member.querySelector('.btn-primary');
			if (btnAllow) {
				btnAllow.click();
			}
		}
	});
}

function refreshVideosOn() {
	routineWarnings.videosOn = getMembers().reduce((list, member) => {
		if (isVideoOn(member)) {
			list.push(getMemberName(member));
		}
		return list;
	}, []);

	if (observed.autoSpotlight) {
		stopAllSpotlights();
	}
}

function refreshMikesOn() {
	routineWarnings.mikesOn = getMembers().reduce((list, member) => {
		if (isMikeOn(member)) {
			list.push(getMemberName(member));
		}
		return list;
	}, []);
}

function refreshRoutines() {
	Object.keys(routineWarnings).forEach(routine => {
		const ulRoutine = document.getElementById(generateId(routine));
		const cache = generateId(routineWarnings[routine] + ulRoutine.children.length);

		if (config.cache[routine] !== cache || routine === 'customFocus') {
			config.cache[routine] = cache;
			removeChildren(ulRoutine);

			const method = {
				continuousAttempts: () => refreshContinuousAttempts(),
				customFocus: () => refreshCustomFocusButtons(),
				invalidNames: () => updateInvalidNames(ulRoutine),
				mikesOn: () => updateMikesOn(ulRoutine),
				videosOn: () => updateVideosOn(ulRoutine)
			}[routine];

			if (method) {
				method();
			} else {
				routineWarnings[routine].forEach(msg => ulRoutine.appendChild(createElement(`<li class="striped">${msg}</li>`)));
			}
		}
	});
}

function refreshDefaultButtons() {
	const toCall = document.querySelectorAll('.call-member-frame > button') || [];
	const toFocus = document.querySelectorAll('.focus-on-frame > button') || [];
	const statusClass = 'invalid-focus';

	toCall.forEach((bc, i, _, bf = toFocus[i]) => {
		if (!getMember(roles[bc.dataset.role])) {
			bc.classList.add(statusClass);
			bf.classList.add(statusClass);
		} else {
			bc.classList.remove(statusClass);
			bf.classList.remove(statusClass);
		}
	});
}

function refreshRaisedHands() {
	const list = document.querySelector('#raised-hands');
	removeChildren(list);

	const commenter = getMember(observed.commenting);

	if (isMikeOn(commenter)) {
		lowerHand(commenter);
		delete observed.commenting;
	}

	getMembers().forEach(member => {
		if (!isHandRaised(member)) {
			return;
		}

		const name = getMemberName(member);
		list.appendChild(hydrate(`
            <li>
                <button hydrate="btn1" data-member="${name}" class="btn-xs btn-commenters">
                    <i data-member="${name}" class="material-icons-outlined">mic_none</i>
                    ${shouldStartVideo(member) && `<i data-member="${name}" class="material-icons-outlined">duo</i>`}
                    <span data-member="${name}">${name}</span>
                </button>
            </li>`, {
			btn1: { onclick: () => callCommenter(name) }
		}));
	});
}

function refreshAttendanceCount() {
	const attendance = countAttendance();
	const newCache = generateId(JSON.stringify(attendance));

	if (config.cache.updateAttendance !== newCache) {
		config.cache.updateAttendance = newCache;
		document.getElementById(generalIDs.counted).innerText = `${attendance.counted} identificado(s)`;
		document.getElementById(generalIDs.notCounted).innerText = `${attendance.notCounted} não identificado(s)`;
	}
}

function refreshContinuousAttempts() {
	const ul = document.getElementById(generateId('continuousAttempts'));
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
					unschedule(target.value);
					refreshContinuousAttempts();
				}
			}
		}));
	});
}

function refreshCustomFocusButtons() {
	const ul = document.getElementById(generateId('customFocus'));
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
		{ text: 'Renomear', onclick: name => openRenamePopup(getMember(name, true)) },
		{ text: 'Mover para sala de espera', onclick: name => removeMember(getMember(name, true)) }
	]);
}

function updateMikesOn(ul) {
	updateContextMenu(ul, 'mikesOn', [{
		text: 'Silenciar',
		onclick: name => stopMike(getMember(name))
	}]);
}

function updateVideosOn(ul) {
	updateContextMenu(ul, 'videosOn', [{
		text: 'Desligar vídeo',
		onclick: name => stopVideo(getMember(name))
	}]);
}

function renderModal() {
	importIcons();
	const modal = document.getElementById(generalIDs.modal);

	if (modal) {
		modal.remove();
	}

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
		add: { onclick: () => document.querySelector('.custom-modal-body').appendChild(createCustomFocusFields()) },
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
                    <input hydrate="input1" id="open-waiting-room" type="checkbox" ${observed.publicRoom && 'checked'}/>
                    <label for="open-waiting-room">Liberar sala de espera para todos</label>
                </div>
                <button hydrate="close" class="btn btn-primary-outline btn-close-modal">Fechar</button>
            </div>
            <div class="large-checkbox h5">
                <input hydrate="input2" id="auto-spotlight" type="checkbox" ${observed.autoSpotlight && 'checked'}/>
                <label for="auto-spotlight">Ativar foco automático (remove automaticamente o spotlight)</label>
            </div>
        </div>`, {
		input1: { onchange() { observed.publicRoom = !observed.publicRoom; refreshWaitingRoom(); } },
		input2: { onchange() { observed.autoSpotlight = !observed.autoSpotlight; refreshVideosOn(); } },
		close: { onclick: closeCustomModal },
	});

	document.querySelectorAll('.call-member-frame button:not(.hidden)').forEach(btn => modal.appendChild(createRenameRoleField(btn.dataset.role, btn.innerText)));
	return createCustomModal().appendChild(modal);
}

function renderButtonsFrame() {
	const { counted, notCounted } = countAttendance();
	const confirmAction = callback => ({ target }) => {
		const { dataset: { q, a } } = target.closest('button');
		const answer = prompt(q);
		if (typeof answer === 'string') {
			return answer.toLowerCase() === a.toLowerCase() ? callback() : alert('Texto incorreto! Ação não executada.');
		}
	};

	/* WEEKENDS HAVE DIFFERENT UI LAYOUT */
	const isWeekend = [0, 6].includes(new Date().getDay());
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
                <button hydrate="call1" data-role="conductor" class="btn btn-success btn-feature">Dirigente</button>
                <button hydrate="call2" data-role="reader" class="btn btn-success btn-feature">Leitor</button>
                <button hydrate="call3" data-role="president" class="btn btn-warning btn-feature">Presidente</button>
                ${isWeekend ? `
                    <button hydrate="call4" data-role="speaker" class="btn btn-success btn-feature">Orador</button>
                ` : `
                    <button hydrate="call5" data-role="treasures" class="btn btn-success btn-feature">Tesouros</button>
                    <button hydrate="call6" data-role="gems" class="btn btn-success btn-feature">Jóias</button>
                    <button hydrate="call7" data-role="bible" class="btn btn-success btn-feature">Bíblia</button>
                    <button hydrate="call8" data-role="living1" class="btn btn-success btn-feature">Vida-1</button>
                    <button hydrate="call9" data-role="living2" class="btn btn-success btn-feature">Vida-2</button>
                `}
            </div>
            <div class="focus-on-frame">
                <button hydrate="focus1" data-role="conductor" class="btn btn-primary btn-feature"> Dirigente <i class="i-sm material-icons-outlined">group</i> </button>
                <button hydrate="focus2" data-role="reader" class="btn btn-primary btn-feature"> Leitor <i class="i-sm material-icons-outlined">supervisor_account</i> </button>
                <button hydrate="focus3" data-role="president" class="btn btn-warning btn-feature"> Presidente <i class="i-sm material-icons-outlined">person</i> </button>
                ${isWeekend ? `
                    <button hydrate="focus4" data-role="speaker" class="btn btn-primary btn-feature"> Orador <i class="i-sm material-icons-outlined">record_voice_over</i> </button>
                ` : `
                    <button hydrate="focus5" data-role="treasures" class="btn btn-primary btn-feature"> Tesouros <i class="i-sm material-icons-outlined">emoji_events</i> </button>
                    <button hydrate="focus6" data-role="gems" class="btn btn-primary btn-feature"> Jóias <i class="i-sm material-icons-outlined">wb_iridescent</i> </button>
                    <button hydrate="focus7" data-role="bible" class="btn btn-primary btn-feature"> Bíblia <i class="i-sm material-icons-outlined">menu_book</i> </button>
                    <button hydrate="focus8" data-role="living1" class="btn btn-primary btn-feature"> Vida-1 <i class="i-sm material-icons-outlined">looks_one</i> </button>
                    <button hydrate="focus9" data-role="living2" class="btn btn-primary btn-feature"> Vida-2 <i class="i-sm material-icons-outlined">looks_two</i> </button>
                `}
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
		focus1: { onclick: focusOnConductor },
		focus2: { onclick: focusOnReader },
		focus3: { onclick: focusOnPresident },
		focus4: { onclick: focusOnSpeaker },
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
		check1: { onchange: () => document.getElementById(generalIDs.modal).classList.toggle('transparent-modal') },
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
	refreshScreen();
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
                    <button hydrate="btn1" class="btn btn-xs btn-primary">Silenciar todos*</button>
                    <button hydrate="btn2" class="btn btn-xs btn-success">Abaixar mãos</button>
                </div>
                <div class="quick-note">*Exceto com vídeos ligados</div>
                <ul id="raised-hands"></ul>
            </div>
        </div>`, {
		btn1: { onclick: muteCommenters },
		btn2: { onclick: lowerAllHands }
	});
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
	document.getElementById(generalIDs.customModal).style.display = 'block';
}

function openMembersPanel() {
	if (!document.querySelector('.participants-header__title')) {
		document.querySelector('.footer-button__participants-icon').click();
		createDomObserver();
	}
}

function closeModal() {
	document.getElementById(generalIDs.modal).style.display = 'none';
}

function closeCustomModal() {
	const modal = document.getElementById(generalIDs.customModal);
	removeChildren(modal);
	modal.style.display = 'none';
}

function validateCustomFocusTarget({ target }) {
	const { value, classList } = target.parentElement.previousElementSibling;
	const foundMember = getMember(value);

	if (foundMember) {
		classList.remove('alert-danger');
		alert(`Participante encontrado: ${getMemberName(foundMember)}`);
	} else {
		classList.add('alert-danger');
		alert(value
			? `Nenhum participante encontrado pelo termo ${value.toUpperCase()}`
			: `Informe algum texto para encontrar o participante`
		);
	}
}

function validateCustomFocusFields() {
	let hasError = false;
	const errorSpan = document.querySelector('#error-alert-modal span[name="error-placeholder"]');
	const errorStyle = 'alert-danger';
	const focusNameInput = document.querySelector(`#${generalIDs.customModal} input[name="custom-focus-name"]`);
	const members = [];

	if (!focusNameInput.value) {
		focusNameInput.classList.add(errorStyle);
		errorSpan.innerText = 'Informe nome para o novo botão. Preencha o(s) campo(s) em vermelho';
		errorSpan.parentElement.style.display = 'block';
		return;
	}


	document.querySelectorAll(`#${generalIDs.customModal} .custom-modal-fields`).forEach(campos => {
		const customFocus = {};

		campos.querySelectorAll('input[type="checkbox"]').forEach(({ name, checked }) => customFocus[name] = checked);
		campos.querySelectorAll('input[type="text"]').forEach(({ value, classList }) => {
			if (getMember(value)) {
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

function shouldStartVideo(member) {
	return getMemberName(member).match(/\bok\b/gi);
}

function startMike(member, keepTrying) {
	if (!member) {
		return;
	}

	cleanVideoScanner();

	const routineName = `ligar_som_${getMemberName(member)}`;
	const routineDelay = 2000;

	if (isMikeOn(member)) {
		unschedule(routineName);
		refreshScreen();
		return;
	}

	clickButton(member, uiLabels.startMike);

	if (keepTrying) {
		schedule(routineName, routineDelay, () => {
			if (isMikeOn(member)) {
				unschedule(routineName);
				refreshScreen();
			} else {

				if (!routineWarnings.continuousAttempts.includes(routineName)) {
					routineWarnings.continuousAttempts.push(routineName);
					refreshScreen();
				}

				clickButton(member, uiLabels.startMike);
			}
		});
	}
}

function startVideo(member, callback, singleShot) {
	if (!member) {
		return;
	}

	cleanVideoScanner();

	if (isVideoOn(member)) {
		return callback && callback();
	}

	clickDropdown(member, uiLabels.startVideo);

	if (callback) {
		const scheduleId = `ligar_video_${getMemberName(member)}`;
		const refreshDelay = 500;
		const attemptDelay = 4000;
		let attempts = 0;

		schedule(scheduleId, refreshDelay, () => {
			attempts++;

			if (isVideoOn(member)) {
				unschedule(scheduleId);
				refreshScreen();
				callback();
			} else if (singleShot) {
				observed.scanningVideo = scheduleId;
				routineWarnings.continuousAttempts = routineWarnings.continuousAttempts.filter(attempt => attempt !== scheduleId);
				refreshScreen();
			} else {
				if (!routineWarnings.continuousAttempts.includes(scheduleId)) {
					routineWarnings.continuousAttempts.push(scheduleId);
					refreshScreen();
				}

				if (attempts >= (attemptDelay / refreshDelay)) {
					attempts = 0;
					clickDropdown(member, uiLabels.startVideo);
				}
			}
		});
	}
}

function startSpotlight(member) {
	cleanVideoScanner();
	stopAllSpotlights();
	clickDropdown(member, uiLabels.startSpotlight);
}

function addSpotlight(member) {
	cleanVideoScanner();
	clickDropdown(member, [
		...uiLabels.addSpotlight,
		...uiLabels.startSpotlight
	]);
}

function stopMike(member) {
	clickButton(member, uiLabels.stopMike);
}

function stopVideo(member) {
	// comentado devido a modificação da reunião implementada em 04/09/2021
	// clickDropdown(member, uiLabels.stopVideo);
}

function stopSpotlight(member) {
	clickDropdown(member, uiLabels.stopSpotlight);
}

function lowerHand(member) {

	if (!member) {
		return;
	}

	const btn = getMemberButtons(member).find(btn => uiLabels.lowerHands.includes(btn.innerText));

	if (btn) {
		btn.click();
	}
}

function startAllMikes() {
	getMembers().forEach(member => startMike(member));
}

function stopAllMikes(membersToKeep) {
	membersToKeep = Array.isArray(membersToKeep) ? membersToKeep.map(p => getMemberName(p)) : [];

	getMembers().forEach(member => {
		if (!membersToKeep.includes(getMemberName(member))) {
			stopMike(member);
		}
	});
}

function stopAllVideos(membersToKeep) {
	membersToKeep = Array.isArray(membersToKeep) ? membersToKeep.map(p => getMemberName(p)) : [];

	getMembers().forEach(member => {
		if (!membersToKeep.includes(getMemberName(member))) {
			stopVideo(member);
		}
	});
}

function stopAllSpotlights() {
	getMembers().forEach(member => stopSpotlight(member));
}

function lowerAllHands(membersToKeep) {
	membersToKeep = Array.isArray(membersToKeep) ? membersToKeep.map(p => getMemberName(p)) : [];

	getMembers().forEach(member => {
		if (!membersToKeep.includes(getMemberName(member))) {
			const btnLowerHand = getMemberButtons(member).find(btn => uiLabels.lowerHands.includes(btn.innerText));

			if (btnLowerHand) {
				btnLowerHand.click();
			}
		}
	});
}

function texasMode() {

	getMembers().forEach(member => {
		startVideo(member);
		startMike(member);
	});

	enableAllowMikes(true);
	enableMuteOnEntry(false);
	stopAllSpotlights();
	observed.publicRoom = true;
}

function northKoreaMode() {
	stopAllVideos();
	stopAllMikes();
	enableAllowMikes(false);
	enableMuteOnEntry(true);
}

function focusOn(role) {
	const target = getMember(role);

	if (!role || !target) {
		return alert(`Participante: "${role}" não encontrado`);
	}

	startVideo(target, () => {
		observed.autoSpotlight = false;
		const member = getMember(role);
		stopAllVideos([member]);
		stopAllMikes([member]);
		startSpotlight(member);
		startMike(member, true);
	});
}

function focusOnConductor() {
	const conductor = getMember(roles.conductor);
	const president = getMember(roles.president);
	const reader = getMember(roles.reader);

	if (!conductor) {
		return alert(`Dirigente não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: Anthony Morris - ${roles.conductor}`);
	}

	stopAllVideos([conductor, reader, president]);
	stopAllMikes([conductor, reader]);

	startVideo(conductor, () => {
		observed.autoSpotlight = false;
		const member = getMember(roles.conductor);
		startSpotlight(member);
		startMike(member, true);
		stopVideo(getMember(roles.president));
	});
}

function focusOnReader() {
	const reader = getMember(roles.reader);
	const conductor = getMember(roles.conductor);

	if (!reader) {
		return alert(`Leitor não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: David Splane - ${roles.reader}`);
	}

	stopAllVideos([conductor, reader]);
	stopAllMikes([conductor, reader]);

	startVideo(reader, () => {
		observed.autoSpotlight = false;
		const member = getMember(roles.reader);
		addSpotlight(member);
		startMike(member, true);
	});
}

function focusOnPresident() {
	const president = getMember(roles.president);

	if (!president) {
		return alert(`Presidente não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: Geoffrey Jackson - ${roles.president}`);
	}

	stopAllMikes([president]);

	startVideo(president, () => {
		observed.autoSpotlight = false;
		const member = getMember(roles.president);
		startMike(member, true);
		startSpotlight(member);
		stopAllVideos([member]);
	});
}

function focusOnSpeaker() {
	const speaker = getMember(roles.speaker);

	if (!speaker) {
		return alert(`Orador não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: Gerrit Losch - ${roles.speaker}`);
	}

	stopAllVideos([speaker]);
	stopAllMikes([speaker]);

	startVideo(speaker, () => {
		observed.autoSpotlight = false;
		const member = getMember(roles.speaker);
		startSpotlight(member);
		startMike(member, true);
	});
}

function callMember(role) {
	const target = getMember(role);

	if (!role || !target) {
		return alert(`Participante: "${role}" não encontrado`);
	}

	startVideo(target, () => startMike(getMember(role), true));
}

function callCommenter(name) {
	if (!name) {
		return;
	}

	observed.commenting = name;
	const member = getMember(name);

	lowerAllHands([member]);
	startMike(member);
	stopAllMikes([
		member,
		...getMembers().filter(m => isVideoOn(m) && !observed.commentersOnVideo.includes(getMemberName(m)))
	]);

	if (shouldStartVideo(member)) {
		startVideo(member, () => {
			observed.commentersOnVideo.push(name);
			const m = getMember(name);
			addSpotlight(m);
		}, true);
	}
}

function muteCommenters() {
	cleanVideoScanner();

	const keepSpotlight = [];

	getMembers().forEach(member => {
		if (!isVideoOn(member)) {
			return stopMike(member);
		}

		if (observed.commentersOnVideo.includes(getMemberName(member))) {
			stopSpotlight(member);
			stopVideo(member);
			stopMike(member);
		} else {
			keepSpotlight.push(member);
		}
	});

	startSpotlight(keepSpotlight.pop());
	keepSpotlight.forEach(m => addSpotlight(m));
	observed.commentersOnVideo = [];
}

function generateId(text) {
	return btoa(encodeURI(text)).replace(/=/g, '');
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
	if (!document.querySelector('#icons')) {
		const link = createElement('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" id="icons"/>');
		document.head.appendChild(link);
	}
}

function removeChildren(element) {
	if (element && element.querySelectorAll) {
		element.querySelectorAll('*').forEach(child => child.remove());
	}
}

function schedule(id, duration, callback) {
	unschedule(id);
	runningIntervals[id] = setInterval(() => callback(), duration);
	routineWarnings.continuousAttempts = [...new Set(routineWarnings.continuousAttempts.concat(id))];
	refreshScreen();
}

function unschedule(id) {
	runningIntervals[id] = clearInterval(runningIntervals[id]);
	routineWarnings.continuousAttempts = routineWarnings.continuousAttempts.filter(attempt => attempt !== id);
	refreshScreen();
}

function toggleModal() {
	const modal = document.getElementById(generalIDs.modal);
	if (modal.style.display === 'none') {
		modal.removeAttribute('style');
	} else {
		closeModal();
	}
}

function initMembersPanel() {
	const btnOpenPanel = document.querySelector('.footer-button__participants-icon');

	if (!document.getElementById('wc-container-right')) {
		btnOpenPanel.click();
	}

	createDomObserver();
	btnOpenPanel.click();
}

function openRenamePopup(member) {
	clickDropdown(member, uiLabels.rename);
	clickButton(member, uiLabels.rename);
}

function renameMembers(renaming = []) {
	if (renaming.length === 0) return;

	const [from, to] = renaming.shift();

	openRenamePopup(getMember(from, true));

	setTimeout(() => {
		const nameInput = document.querySelector('#newname');
		const btnSave = document.querySelector('.zm-modal-footer-default-actions .zm-btn.zm-btn-legacy.zm-btn--primary');

		if (nameInput && btnSave) {
			Object
				.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
				.set
				.call(nameInput, to);

			nameInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
			btnSave && btnSave.click();
		}

		renameMembers(renaming);
	}, 1000);
}

function autoRename() {
	const password = prompt('Informe a senha para obter a lista de renomeação');
	password && fetchRenamingList(password);
}

function removeMember(member) {
	clickDropdown(member, uiLabels.kickOut);
}

function countAttendance() {
	let counted = 0;
	let notCounted = 0;

	getMembers().forEach(member => {
		if (isNameValid(member)) {
			const attendance = parseInt(getMemberName(member).replace(/\(|\{|\[/, '').trim());
			if (attendance > 0) {
				counted += attendance;
			}
		} else {
			notCounted++;
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
			const allowMikesOption = document.querySelector('.zm-modal-footer-default-checkbox');

			if (allowMikesOption) {
				if (allowMikesOption.querySelector('.zm-checkbox-checked')) {
					allowMikesOption.querySelector('.zm-checkbox-message').click();
				}
				document.querySelector('.zm-modal-footer-default-actions .zm-btn__outline--blue').click();
			}
		}, 100);
	}
}

function enableAllowMikes(enable) {
	const allowMikesOption = getMoreDropdownOptions(uiLabels.allowMikes);

	if (!allowMikesOption) {
		return;
	}

	const isAtivo = allowMikesOption.querySelector('.i-ok-margin');

	if ((enable && !isAtivo) || (!enable && isAtivo)) {
		allowMikesOption.click();
	}
}

function requestApplause() {
	startAllMikes();

	document.querySelector('.btn-applause').classList.add('disabled');

	setTimeout(() => {
		stopAllMikes();
		document.querySelector('.btn-applause').classList.remove('disabled');
		refreshScreen();
	}, config.applauseDuration);
}

function finishSpeech() {
	const presidente = getMember(roles.president);

	stopAllVideos();
	startAllMikes();

	document.querySelectorAll('.btn-feature').forEach(btn => btn.classList.add('disabled'));

	setTimeout(() => {
		stopAllMikes([presidente]);
		document.querySelectorAll('.btn-feature').forEach(btn => btn.classList.remove('disabled'));
		refreshScreen();
	}, config.applauseDuration);

	setTimeout(() => startVideo(presidente, () => {
		startSpotlight(presidente);
		startMike(presidente, true);
	}), config.applauseDuration / 2);

	refreshScreen();
}

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
	speaker: 'orador',
	treasures: 'tesouros',
	gems: 'joias',
	bible: 'biblia',
	living1: 'vida-1',
	living2: 'vida-2'
};
var uiLabels = {
	startVideo: [langResource['apac.wc_video.ask_start_video'], langResource['apac.wc_video.start_video'], langResource['apac.wc_start_video']],
	stopVideo: [langResource['apac.wc_video.stop_video'], langResource['apac.wc_stop_video']],
	startMike: [langResource['apac.toolbar_ask_unmute'], langResource['apac.toolbar_unmute']],
	stopMike: [langResource['apac.toolbar_mute']],
	startSpotlight: [langResource['apac.wc_video.spotlight_for_everyone'], langResource['apac.wc_video.replace_spotlight']],
	addSpotlight: [langResource['apac.wc_video.add_spotlight']],
	stopSpotlight: [langResource['apac.wc_video.remove_spotlight']],
	lowerHands: [langResource['apac.wc_lower_hand'], langResource['apac.wc_nonverbal.lower_hand']],
	rename: [langResource['apac.dialog.rename']],
	kickOut: [langResource['apac.wc_put_in_waiting']],
	allowMikes: [langResource['apac.wc_allow_unmute']],
	muteOnEntry: [langResource['apac.wc_mute_participants_on_entry']],
};
/* SETTINGS AND CONTROLS */
var runningIntervals = runningIntervals || {};
var observer = observer || null;
var observed = observed || {
	commenting: null,
	scanningVideo: null,
	commentersOnVideo: [],
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
	cache: {},
	applauseDuration: 8000,
	lastChange: null,
	lastValidation: null
};

/* INIT */
try {
	openMembersPanel();
	createCss();
	renderModal();
	createCustomOptions();
	initMembersPanel();
	toggleModal();
	console.clear();
} catch (erro) {
	alert('Erro ao executar o script: ' + erro.message);
}

/*
TO DO: Porto Seguro - Piauí

PRAY:
    • Spotlight "audio e video"
    • Open prayer mic (request name/role typing)

AUTO RENAME:
    • fetch names list from backend by password (nome congregação)
    • apply autorename
    • ? option to stop auto rename ?
*/







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
        .transparent-modal { background-color: #ffffff11; }
        .transparent-modal .buttons-frame *, .transparent-modal .options-frame *, .transparent-modal .routines-frame * { color: #ffffffbb; }
        .transparent-modal .options-frame { background-color: #23272b; }
        .transparent-modal .btn-warning .material-icons-outlined { color: #111111bb; }
        .transparent-modal .config-item { background-color: #24282ccf; }
        .transparent-modal .routines-frame { background-color: #21212147; }
        .transparent-modal #custom-modal .input-group-addon, .transparent-modal #custom-modal input { color: #555555; }
        .transparent-modal #custom-modal .btn-primary, .transparent-modal #custom-modal .btn-success { color: #ffffff; }
        .transparent-modal #custom-modal .alert-danger * { color: #a94442; }

        #open-meeting-options { margin-right: 20px; }
        #meeting-options {
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
        #custom-modal,
        #custom-popup {
            position: absolute;
            left: 0%;
            top: 0%;
            background-color: #0000008a;
            width: 100%;
            height: 100%;
            z-index: ${higherIndex + 4};
        }
        .native-popup {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            left: 25%;
            top: 0;
            width: 50%;
            height: auto;
            min-height: 200px;
            padding: 20px;
            background-color: white;
            border-radius: 10px;
            z-index: ${higherIndex + 5};
        }
        .native-popup input { margin-top: 15px; }
        .native-popup .actions button { margin-left: 10px; }
        .native-popup .actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 15px;
        }
        .native-popup h1 {
            font-size: 16px;
            margin-top: 0;
            font-weight: 700;
            text-align: center;
            text-transform: uppercase;
        }
        .native-popup *:not(.actions) {
            display: flex;
            flex-direction: column;
        }
        .routines-frame {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 5px;
            margin: 0px 5px;
            padding-bottom: 10px;
        }
        .buttons-frame {
            display: grid;
            grid-template-columns: 4fr 4fr 5fr;
            gap: 5px;
            padding: 0;
            margin: 5px;
        }
        .options-frame {
            height: 20px;
            margin: 5px;
            display: flex;
            justify-content: space-evenly
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
        .feature-frame .btn-group { display: flex; }
        .feature-frame .btn-group > button { flex: 1; }
        .hidden { display: none; }
        .invisible { visibility: none; }
        .btn-close {
            opacity: 0.7;
            cursor: pointer;
            color: #ffffff;
            font-size: 22px !important;
        }
        .btn-feature {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            font-size: 14px;
            opacity: 0.8;
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
        }
        .alert-danger::-webkit-input-placeholder, .alert-danger::placeholder { color: #a94442; }
        .buttons-title {
            margin-bottom: 5px;
            text-align: center;
            font-size: 16px;
            color: #ffffff;
            background-color: #23272b;
        }
        .config-item {
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
        }
        .config-item *:not(span, i) { cursor: pointer; }
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
            grid-column: 2;
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
        .custom-modal-body > .btn-close-modal {
            position: absolute;
            right: 30px;
        }
        .rename-role { display: flex; }
        .rename-role .input-group {
            width: 450px;
            margin: 5px 0 0 0;
        }
        .rename-role .input-group-addon {
            min-width: 120px;
            font-weight: 600;
        }
        .rename-role .text-primary {
            align-self: center;
            margin-left: 10px;
        }
        .rename-role .saved i { margin: 0 10px; }
        .rename-role .saved {
            display: flex;
            align-items: center;
            font-weight: 700;
            font-size: 12px;
            color: #1665c0;
        }
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
        createElement('<button id="open-meeting-options">JW.ORG</button>', {
            onclick: toggleModal
        })
    );
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
        click: async () => {
            const fields = details.map(detail => {
                const memberName = getMemberName(getMember(detail.role));
                const actions = [
                    detail.useMike && 'mic',
                    detail.useVideo && 'vídeo',
                    detail.useSpotlight && 'spot'
                ];
                return `<span class="h4">${memberName} - [${actions.filter(Boolean)}]</span>`;
            }).join('\n');

            const body = `
                ${fields}
                <div style="font-weight: 700; margin-top: 10px">
                    <span style="color: #ff4242">digite "F" para FOCAR</span>
                    <span style="color: #5cb85c">digite "C" para CHAMAR</span>
                    <span>Use [outro texto] ou [Cancelar] ou [Confirmar] para cancelar esta ação</span>
                </div>
            `;
            const action = await _prompt(body, name);

            if (!action) {
                return;
            }

            const videoExceptions = [];
            const mikeExceptions = [];
            const fullAttention = String(action).toUpperCase() === 'F';

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
                <input hydrate="check1" type="checkbox" class="hidden" name="useVideo" id="useVideo-${suffix}">
                <i class="i-sm material-icons-outlined" data-on="videocam" data-off="videocam_off">videocam_off</i>
            </label>
            <label>
                <input hydrate="check2" type="checkbox" class="hidden" name="useMike" id="useMike-${suffix}" checked>
                <i class="i-sm material-icons-outlined" data-on="mic_none" data-off="mic_off">mic_none</i>
            </label>
            <label>
                <input hydrate="check3" type="checkbox" class="hidden" name="useSpotlight" id="useSpotlight-${suffix}">
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
        <div class="rename-role">
            <div class="input-group">
                <span class="input-group-addon">${label}:</span>
                <input hydrate="input1" value="${roles[name]}" type="text" class="form-control">
                <span class="input-group-btn">
                    <button hydrate="btn1" class="btn btn-primary">Salvar</button>
                </span>
            </div>
            <span class="text-primary">${getMemberName(getMember(roles[name]))}</span>
            <span class="saved invisible">
                <i class="i-sm material-icons-outlined">done_outline</i> Salvo!
            </span>
        </div>`, {
        input1: {
            onkeyup: ({ target, key, code }) => {
                clearTimeout(config.lastValidation);
                config.lastValidation = setTimeout(() => {
                    const row = target.closest('.rename-role');

                    if ([code, key].includes('Enter')) {
                        row.querySelector('button').click();
                    } else {
                        row.querySelector('.saved').classList.add('invisible');
                        row.querySelector('.text-primary').innerText = getMemberName(getMember(target.value));
                    }
                }, 400);
            }
        },
        btn1: {
            onclick: ({ target }) => {
                const row = target.closest('.rename-role');
                const newRole = getCleanText(row.querySelector('input').value);
                if (!newRole) {
                    _alert('É necessário informar um indentificador');
                } else if (newRole !== roles[name]) {
                    row.querySelector('.saved').classList.remove('invisible');
                    roles[name] = newRole;
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
    const options = document.querySelectorAll('#wc-container-right .participants-section-container__participants-footer ul li a');
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

function refreshScreen() {
    clearTimeout(config.lastChange);
    config.lastChange = setTimeout(() => {
        openMembersPanel();

        refreshInvalidNames();
        refreshVideosOn();
        refreshMikesOn();
        refreshDefaultButtons();
        refreshRaisedHands();
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

        if (config.cache[routine] !== cache) {
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
                    <span data-member="${name}">${name}</span>
                </button>
            </li>`, {
            btn1: { onclick: () => callCommenter(name) }
        }));
    });
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
        { text: 'Renomear', onclick: name => renameMember(getMember(name, true)) },
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

    const optionsModal = createElement(`<div class="hidden" id="${generalIDs.modal}" />`);

    optionsModal.appendChild(renderButtonsFrame());
    optionsModal.appendChild(renderOptionsFrame());
    optionsModal.appendChild(renderServicesFrame());

    const customModal = createElement(`<div id="${generalIDs.customModal}" class="hidden" />`);
    const customPopup = createElement(`<div id="${generalIDs.customPopup}" class="hidden" />`);

    customModal.onclick = ({ target }) => target !== customModal || closeCustomModal();

    optionsModal.appendChild(customModal);
    optionsModal.appendChild(customPopup);

    document.body.appendChild(optionsModal);
}

function renderCustomFocusModal() {
    const body = hydrate(`
        <div class="custom-modal-body">
            <div class="alert alert-danger" id="error-alert-modal" style="display: none; font-size: 14px; margin: auto 0;">
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
    return body;
}

function renderSeeMoreModal() {
    const modal = hydrate(`
        <div class="custom-modal-body" style="display: block; position: relative">
            <button hydrate="close" class="btn btn-primary-outline btn-close-modal">Fechar</button>
            <h4>Digite a nova palavra chave e pressione <strong>Salvar</strong></h4>
        </div>`, {
        close: { onclick: closeCustomModal },
    });

    modal.appendChild(createRenameRoleField('av', 'Áudio/Vídeo'));

    document.querySelectorAll('.call-member-frame button:not(.hidden)').forEach(btn => {
        modal.appendChild(createRenameRoleField(btn.dataset.role, btn.innerText));
    });

    return modal;
}

function renderButtonsFrame() {
    const confirmAction = callback => async ({ target }) => {
        const { dataset: { q, a } } = target.closest('button');
        const answer = await _prompt(`<span class="h4">${q}</span>`);
        if (typeof answer === 'string') {
            return answer.toLowerCase() === a.toLowerCase() ? callback() : _alert('Texto incorreto! Ação não executada.');
        }
    };

    /* WEEKENDS HAVE DIFFERENT UI LAYOUT */
    const isWeekend = [0, 6].includes(new Date().getDay());
    const buttonsFrame = hydrate(`
        <div class="buttons-frame">
            <div>
                <div class="buttons-title">Vídeo e Microfone</div>
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
            </div>
            <div>
                <div class="buttons-title">Spotlight, Vídeo e Microfone</div>
                <div class="focus-on-frame">
                    <button hydrate="focus1" data-role="conductor" class="btn btn-primary btn-feature">Dirigente</button>
                    <button hydrate="focus2" data-role="reader" class="btn btn-primary btn-feature">Leitor</button>
                    <button hydrate="focus3" data-role="president" class="btn btn-warning btn-feature">Presidente</button>
                    ${isWeekend ? `
                    <button hydrate="focus4" data-role="speaker" class="btn btn-primary btn-feature">Orador</button>
                    ` : `
                    <button hydrate="focus5" data-role="treasures" class="btn btn-primary btn-feature">Tesouros</button>
                    <button hydrate="focus6" data-role="gems" class="btn btn-primary btn-feature">Jóias</button>
                    <button hydrate="focus7" data-role="bible" class="btn btn-primary btn-feature">Bíblia</button>
                    <button hydrate="focus8" data-role="living1" class="btn btn-primary btn-feature">Vida-1</button>
                    <button hydrate="focus9" data-role="living2" class="btn btn-primary btn-feature">Vida-2</button>
                    `}
                </div>
            </div>
            <div>
                <span class="buttons-title close-feature-frame">
                    <span style="grid-column-start: 2">Ações</span>
                    <i hydrate="icon1" class="i-sm material-icons-outlined btn-close">cancel</i>
                </span>
                <div class="feature-frame">
                    <div class="btn-group">
                        <button hydrate="micOn" class="btn btn-danger btn-feature" data-q="Digite: 'TUDO' para LIGAR MICROFONES" data-a="TUDO">
                            <i class="i-sm material-icons-outlined">mic_none</i>
                        </button>
                        <button hydrate="micOff" class="btn btn-danger btn-feature" data-q="Digite: 'NADA' para DESLIGAR MICROFONES" data-a="NADA">
                            <i class="i-sm material-icons-outlined">mic_off</i>
                        </button>
                    </div>
                    <button hydrate="endSpeech" class="btn btn-danger btn-feature" data-q="Digite: 'FIM' para ENCERRAR DISCURSO" data-a="FIM">
                        Encerrar discurso <i class="i-sm material-icons-outlined">voice_over_off</i>
                    </button>
                    <button hydrate="newFocus" class="btn btn-success btn-feature">Criar foco</button>
                    <button hydrate="renameFocus" class="btn btn-success btn-feature">Renomear foco</button>
                    <button hydrate="renameAll" class="btn btn-feature invalid-focus">Corrigir nomes</button>
                    <button hydrate="mikePlusAv" class="btn btn-feature invalid-focus">Oração</button>
                    <button hydrate="spotlightAv" class="btn btn-primary btn-feature">Imagens</button>
                    <button hydrate="focusAv" class="btn btn-primary btn-feature">Cântico/Vídeos</button>
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
        micOn: { onclick: confirmAction(texasMode) },
        micOff: { onclick: confirmAction(northKoreaMode) },
        endSpeech: { onclick: confirmAction(finishSpeech) },
        newFocus: { onclick: openCustomFocusModal },
        renameFocus: { onclick: openSeeMoreModal },
        renameAll: { onclick: () => _alert('<p class="h4">Sorry, brother! Not implemented yet</p>') },
        mikePlusAv: { onclick: () => _alert('<p class="h4">Sorry, brother! Not implemented yet</p>') },
        spotlightAv: { onclick: spotlightAudioVideo },
        focusAv: { onclick: focusOnAudioVideo },
    });

    return buttonsFrame;
}

function renderOptionsFrame() {
    return hydrate(`
        <div class="options-frame">
            <div class="config-item">
                <input hydrate="check" id="open-waiting-room" type="checkbox" ${observed.publicRoom && 'checked'}/>
                <label for="open-waiting-room">Liberar sala de espera</label>
            </div>
        </div>`, {
        check: {
            onchange() {
                observed.publicRoom = !observed.publicRoom;
                refreshWaitingRoom();
            }
        }
    });
}

function renderServicesFrame() {
    refreshScreen();
    return hydrate(`
        <div class="routines-frame">
            <div class="routine-div hidden">
                <p>Nomes inválidos</p>
                <ul id="${generateId('invalidNames')}"></ul>
            </div>
            <div class="routine-div">
                <p>Microfones ligados</p>
                <ul id="${generateId('mikesOn')}"></ul>
            </div>
            <div class="routine-div hidden">
                <p>Rodando (marque para abortar)</p>
                <ul id="${generateId('continuousAttempts')}"></ul>
            </div>
            <div class="routine-div hidden">
                <p>Vídeos ligados</p>
                <ul id="${generateId('videosOn')}"></ul>
            </div>
            <div class="routine-div custom-grid">
                <p>Foco customizado</p>
                <ul id="${generateId('customFocus')}"></ul>
            </div>
            <div class="routine-div comments-grid">
                <p>Comentários</p>
                <div id="quick-actions">
                    <button hydrate="btn1" class="btn btn-xs btn-primary">Silenciar comentários</button>
                    <button hydrate="btn2" class="btn btn-xs btn-success">Abaixar mãos</button>
                </div>
                <ul id="raised-hands"></ul>
            </div>
        </div>`, {
        btn1: { onclick: muteCommenters },
        btn2: { onclick: lowerAllHands }
    });
}

function renderPopup({ type, title, text, onConfirm = Function, onHide = Function }) {
    refreshScreen();
    const hideIfAlert = type === 'alert' && 'hidden';
    return hydrate(`
        <div class="native-popup">
            <h1>${title || 'JW - ZOOM SCRIPT'}</h1>

            <div>${text}</div>
            <input hydrate="input" type="text" class="${hideIfAlert} form-control"/>

            <div class="actions">
                <button hydrate="cancel" type="text" class="${hideIfAlert} btn btn-primary-outline">Cancelar</button>
                <button hydrate="confirm" type="text" class="btn btn-primary">Confirmar</button>
            </div>
        </div>`, {
        input: {
            onkeyup: ({ target, key, code }) => {
                if ([code, key].includes('Enter')) {
                    target.closest('.native-popup').querySelector('.btn-primary').click();
                }
            }
        },
        cancel: { onclick() { closeCustomPopup(); onHide(); } },
        confirm: {
            onclick({ target }) {
                const input = target.closest('.native-popup').querySelector('input');
                closeCustomPopup();
                onConfirm(input && input.value);
            }
        }
    });
}

function _alert(text, title) {
    return new Promise(resolve => {
        const customPopup = document.getElementById(generalIDs.customPopup);
        removeChildren(customPopup);
        customPopup.appendChild(renderPopup({
            type: 'alert',
            title,
            text,
            onConfirm: resolve,
        }));
        openCustomPopup();
    });
}

function _prompt(text, title) {
    return new Promise(resolve => {
        const customPopup = document.getElementById(generalIDs.customPopup);
        removeChildren(customPopup);
        customPopup.appendChild(renderPopup({
            type: 'prompt',
            title,
            text,
            onConfirm: value => resolve(value),
            onHide: () => resolve(null)
        }));
        openCustomPopup();

        const input = document.querySelector('.native-popup input');
        if (input) {
            input.focus();
        }
    });
}

function openCustomFocusModal() {
    const customModal = document.getElementById(generalIDs.customModal);
    removeChildren(customModal);
    customModal.appendChild(renderCustomFocusModal());
    openCustomModal();
}

function openSeeMoreModal() {
    const customModal = document.getElementById(generalIDs.customModal);
    removeChildren(customModal);
    customModal.appendChild(renderSeeMoreModal());
    openCustomModal();
}

function openCustomModal() {
    document.getElementById(generalIDs.customModal).classList.remove('hidden');
}

function openCustomPopup() {
    document.getElementById(generalIDs.customPopup).classList.remove('hidden');
}

function openMembersPanel() {
    if (!document.querySelector('.participants-header__title')) {
        document.querySelector('.footer-button__participants-icon').click();
        createDomObserver();
    }
}

function closeModal() {
    document.getElementById(generalIDs.modal).classList.add('hidden');
}

function closeCustomModal() {
    const modal = document.getElementById(generalIDs.customModal);
    removeChildren(modal);
    modal.classList.add('hidden');
}

function closeCustomPopup() {
    const popup = document.getElementById(generalIDs.customPopup);
    removeChildren(popup);
    popup.classList.add('hidden');
}

function validateCustomFocusTarget({ target }) {
    const { value, classList } = target.parentElement.previousElementSibling;
    const foundMember = getMember(value);

    if (foundMember) {
        classList.remove('alert-danger');
        _alert(`<span class="h4">Participante encontrado: <strong>${getMemberName(foundMember)}</strong></span>`, 'Encontrado');
    } else {
        classList.add('alert-danger');
        const body = value
            ? `Termo procurado: <strong>${value.toUpperCase()}</strong>`
            : `Informe alguma parte do nome do participante`
        _alert(`<span class="h4">${body}</span>`, 'Nenhum participante encontrado');
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

function startMike(member, keepTrying) {
    if (!member) {
        return;
    }

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

function startVideo(member, callback) {
    if (!member) {
        return;
    }

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
    stopAllSpotlights([member]);
    clickDropdown(member, uiLabels.startSpotlight);
}

function stopMike(member) {
    clickButton(member, uiLabels.stopMike);
}

function stopVideo(member) {
    clickDropdown(member, uiLabels.stopVideo);
}

function stopSpotlight(member) {
    clickDropdown(member, uiLabels.stopSpotlight);
}

function stopAutoSpotlight() {
    observed.autoSpotlight = false;
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

    // for Porto Seguro it should keep Audio & Video always on
    const audioVideo = getMember(roles.av);
    membersToKeep.push(getMemberName(audioVideo));

    getMembers().forEach(member => {
        if (!membersToKeep.includes(getMemberName(member))) {
            stopMike(member);
        }
    });
}

function stopAllSpotlights(membersToKeep) {
    membersToKeep = Array.isArray(membersToKeep) ? membersToKeep.map(p => getMemberName(p)) : [];

    getMembers().forEach(member => {
        if (!membersToKeep.includes(getMemberName(member))) {
            stopSpotlight(member);
        }
    });
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
    stopAllMikes();
    enableAllowMikes(false);
    enableMuteOnEntry(true);
}

function focusOn(role) {
    const target = getMember(role);

    if (!role || !target) {
        return _alert(`Participante: "${role}" não encontrado`);
    }

    stopAutoSpotlight();
    startVideo(target, () => {
        const member = getMember(role);
        stopAllMikes([member]);
        startMike(member, true);
        startSpotlight(member);
    });
}

function focusOnConductor() {
    const conductor = getMember(roles.conductor);

    if (!conductor) {
        return _alert(`
            <h5>Com permissão de anfitrião (host) identifique-o renomeando.<br/><br/>Exemplo: <strong>Anthony Morris - ${roles.conductor}</strong></h5>`,
            'Dirigente não informado'
        );
    }

    stopAutoSpotlight();
    stopAllMikes([conductor]);
    startVideo(conductor, () => {
        const member = getMember(roles.conductor);
        startMike(member, true);
        startSpotlight(member);
    });
}

function focusOnReader() {
    const reader = getMember(roles.reader);

    if (!reader) {
        return _alert(
            `<h5>Com permissão de anfitrião (host) identifique-o renomeando.<br/><br/>Exemplo: <strong>David Splane - ${roles.reader}</strong></h5>`,
            'Leitor não informado'
        );
    }

    stopAutoSpotlight();
    stopAllMikes([reader]);
    startVideo(reader, () => {
        const member = getMember(roles.reader);
        startMike(member, true);
        startSpotlight(member);
    });
}

function focusOnPresident() {
    const president = getMember(roles.president);

    if (!president) {
        return _alert(
            `<h5>Com permissão de anfitrião (host) identifique-o renomeando.<br/><br/>Exemplo: <strong>Geoffrey Jackson - ${roles.president}</strong></h5>`,
            'Presidente não informado'
        );
    }

    stopAutoSpotlight();
    stopAllMikes([president]);
    startVideo(president, () => {
        const member = getMember(roles.president);
        startMike(member, true);
        startSpotlight(member);
    });
}

function focusOnSpeaker() {
    const speaker = getMember(roles.speaker);

    if (!speaker) {
        return _alert(
            `<h5>Com permissão de anfitrião (host) identifique-o renomeando.<br/><br/>Exemplo: <strong>Gerrit Losch - ${roles.speaker}</strong></h5>`,
            'Orador não informado'
        );
    }

    stopAutoSpotlight();
    stopAllMikes([speaker]);
    startVideo(speaker, () => {
        const member = getMember(roles.speaker);
        startMike(member, true);
        startSpotlight(member);
    });
}

function focusOnAudioVideo() {
    const av = getMember(roles.av);

    if (!av) {
        return _alert(
            `<h5>Com permissão de anfitrião (host) identifique-o renomeando.<br/><br/>Exemplo: <strong>Stephen Lett - ${roles.av}</strong></h5>`,
            '"Áudio e Vídeo" não informado'
        );
    }

    stopAutoSpotlight();
    stopAllMikes([av]);
    startVideo(av, () => {
        const member = getMember(roles.av);
        startMike(member, true);
        startSpotlight(member);
    });
}

function spotlightAudioVideo() {
    const member = getMember(roles.av);

    if (!member) {
        return _alert(
            `<h5>Com permissão de anfitrião (host) identifique-o renomeando.<br/><br/>Exemplo: <strong>Stephen Lett - ${roles.av}</strong></h5>`,
            '"Áudio e Vídeo" não informado'
        );
    }

    startVideo(member, () => startSpotlight(member));
}

function callMember(role) {
    const target = getMember(role);

    if (!role || !target) {
        return _alert(`Participante: "${role}" não encontrado`);
    }

    startVideo(target, () => startMike(getMember(role), true));
}

function callCommenter(name) {
    if (!name) {
        return;
    }

    muteCommenters();

    observed.autoSpotlight = true;
    observed.commenting = name;
    observed.commentersCalled = [...observed.commentersCalled, name];

    const member = getMember(name);
    lowerAllHands([member]);
    startMike(member);
}

function muteCommenters() {
    stopAutoSpotlight();
    observed.commentersCalled.forEach(name => stopMike(getMember(name)));
    observed.commentersCalled = [];
}

function generateId(text) {
    return btoa(encodeURI(text)).replace(/=/g, '');
}

// TODO - CALL / CREATE ENDPOINT
function fetchAutoRenameSettings(id) {
    fetch('https://zoom.vercel.app/api/renaming-options', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        params: {
            id
        }
    }).then(async data => {
        const resp = await data.json();
        _alert(resp.success ? resp.message : 'Não foi possível obter nomes a renomear');
    }).catch(err => _alert(err));
}

function importIcons() {
    if (!document.querySelector('#icons')) {
        const link = createElement('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" id="icons"/>');
        document.head.appendChild(link);
    }
}

function removeChildren(element) {
    if (element) {
        element.innerHTML = '';
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
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
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

function renameMember(member) {
    clickDropdown(member, uiLabels.rename);
    clickButton(member, uiLabels.rename);
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
    const setBtnApplauseDisabled = disable => document.querySelector('.btn-applause').classList[
        disable ? 'add' : 'remove'
    ]('disabled');

    const mikesAlreadyOn = getMembers().filter(m => isMikeOn(m));

    spotlightAudioVideo();
    startAllMikes();
    setBtnApplauseDisabled(true);

    setTimeout(() => {
        stopAllMikes(mikesAlreadyOn);
        setBtnApplauseDisabled(false);
        refreshScreen();
    }, config.applauseDuration);
}

function finishSpeech() {
    const presidente = getMember(roles.president);

    spotlightAudioVideo();
    startAllMikes();

    setTimeout(() => {
        stopAllMikes([presidente]);
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
    customPopup: 'custom-popup',
    customMenu: 'context-menu'
};
var roles = {
    av: 'audio e video',
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
    commentersCalled: [],
    transparentMode: false,
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
    applauseDuration: 4000,
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
    _alert(`
        Erro ao executar o script!
        Possível solução: diminuir o tamanho do painel de execução de script (console do navegador)
    `);
}
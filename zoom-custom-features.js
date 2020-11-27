function criarDomListener() {
    observador && observador.disconnect();
    observador = new MutationObserver(atualizarTela);
    observador.observe(document.getElementById('wc-container-right'), {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
    });
}

function criarEventoMouseOver() {
    const eventoFalsoDeMouseOver = new MouseEvent('mouseover', { bubbles: true });
    eventoFalsoDeMouseOver.simulated = true;
    return eventoFalsoDeMouseOver;
}

function criarElemento(text, eventos) {
    const dom = new DOMParser().parseFromString(text.replace(/\s+/g, ' '), 'text/html');
    const elemento = dom.body.children[0] || dom.head.children[0];
    eventos && Object.keys(eventos).forEach(k => elemento[k] = eventos[k]);
    return elemento;
}

function criarIcone(tipo, id) {
    if (!tipo) return;

    const tipos = {
        camera: 'videocam',
        cameraFechada: 'videocam_off',
        microfone: 'mic_none',
        microfoneFechado: 'mic_off',
        finalizarDiscurso: 'voice_over_off',
        orador: 'record_voice_over',
        presidente: 'person',
        dirigente: 'group',
        leitor: 'supervisor_account',
        tesouros: 'emoji_events',
        joias: 'wb_iridescent',
        biblia: 'menu_book',
        vida1: 'looks_one',
        vida2: 'looks_two',
        participante: 'person_add',
        assistencia: 'airline_seat_recline_normal',
        assistenciaNaoContada: 'airline_seat_recline_extra',
        mao: 'pan_tool',
        mais: 'add_circle_outline',
        fechar: 'cancel',
    };

    id = id ? `id="${id}"` : '';
    return criarElemento(`<i ${id} class="i-sm material-icons-outlined">${tipos[tipo]}</i>`);
}

function criarCss() {
    abrirPainelParticipantes();
    const larguraPainelParticipantes = parseInt(document.querySelector('#wc-container-right').style.width);
    const alturaBotoesRodape = document.querySelector('#wc-footer').clientHeight;
    const maiorZIndex = Math.max.apply(null, Array.from(document.querySelectorAll('body *')).map(({ style = {} }) => style.zIndex || 0));
    const css = document.getElementById('estilo-customizado') || document.createElement('style');
    css.id = 'estilo-customizado';
    css.innerHTML = `
        .modal-principal {
            display: grid;
            grid-template-rows: 1fr 1fr;
            overflow-y: hidden;
            position: fixed;
            right: ${larguraPainelParticipantes + 5}px;
            left: 5px;
            top: 20px;
            bottom: ${alturaBotoesRodape + 10}px;
            background-color: #edf2f7e6;
            font-size: 12px;
            z-index: ${maiorZIndex + 2};
        }
        .modal-transparente { background-color: #ffffff11; }
        .modal-transparente .frame-botoes *, .modal-transparente .frame-rotinas * { color: #ffffffbb; }
        .modal-transparente .btn-warning .material-icons-outlined { color: #111111bb; }
        .modal-transparente .configuracao, .modal-transparente .config-item { background-color: #24282ccf; }
        .modal-transparente .frame-rotinas { background-color: #21212147; }
        .modal-transparente #modal-customizado .input-group-addon, .modal-transparente #modal-customizado input { color: #555555; }
        .modal-transparente #modal-customizado .btn-primary, .modal-transparente #modal-customizado .btn-success { color: #ffffff; }
        .modal-transparente #modal-customizado .alert-danger * { color: #a94442; }
        #modal-customizado {
            position: absolute;
            left: 0%;
            top: 0%;
            background-color: #0000008a;
            width: 100%;
            height: 100%;
        }
        .frame-rotinas {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 5px;
            margin: 0px 5px;
            padding-bottom: 10px;
        }
        .frame-botoes {
            display: grid;
            grid-template-columns: 2fr 3fr 3fr;
            grid-template-rows: 20px auto;
            gap: 5px;
            padding: 0;
            margin: 5px;
        }
        .frame-funcionalidade-fechar {
            display: grid;
            grid-template-columns: 1fr 3fr 1fr;
            align-items: center;
            text-align: center;
        }
        .frame-chamar, .frame-focar, .frame-funcionalidade {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px;
        }
        .frame-fechar {
            display: grid;
            grid-template-columns: 2fr 3fr 3fr;
            grid-column: span 3;
            gap: 5px;
        }
        .btn-fechar {
            opacity: 0.7;
            cursor: pointer;
            color: #ffffff;
            font-size: 22px !important;
        }
        .btn-funcionalidade {
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-evenly;
            align-items: center;
            font-size: 14px;
            opacity: 0.8;
            min-height: 40px;
            font-weight: 500;
        }
        .btn-foco-customizado {
            display: flex;
            max-height: 55px;
            align-items: center;
            width: fit-content;
        }
        .btn-foco-customizado button {
            background-color: #d32f2f;
            color: #fff;
            font-weight: 600;
        }
        .btn-foco-customizado button:hover {
            background-color: #9a1010;
            color: #fff;
        }
        .btn-foco-customizado button[disabled] {
            cursor: no-drop;
            background-color: #616161;
        }
        .btn-comentaristas {
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
        .btn-comentaristas:hover {
            background-color: #0c468a;
            color: #fff;
        }
        .btn-comentaristas i {
            font-size: 16px;
            margin-right: 10px;
        }
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
        .foco-invalido {
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
        .configuracao {
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
        .titulo-botoes {
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
        .div-rotina p {
            margin: 0px;
            background-color: #23272b;
            text-align: center;
            color: white;
        }
        .div-rotina ul {
            list-style-type: none;
            overflow-y: scroll;
            height: 140px;
            margin: 0px;
            padding: 0px;
        }
        .div-rotina ul li { padding-top: 10px; }
        .div-rotina ul li.checkbox {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            justify-content: flex-end;
            margin: 0px;
            padding: 0px;
        }
        .div-rotina ul li input[type=checkbox] { margin: 5px; }
        .div-rotina ul li.zebrado input { margin-right: 10px; }
        .div-rotina ul li:nth-child(2n) { font-weight: bold; }
        .div-rotina ul::-webkit-scrollbar-thumb {
            background-color: #23272b2e;
            border-radius: 10px;
        }
        .grid-comentarios {
            grid-row: 1 / span 2;
            grid-column: 4;
        }
        .grid-customizados {
            grid-row: 1 / span 2;
            grid-column: 3;
        }
        .grid-customizados ul { height: 310px; }
        .grid-comentarios ul { height: 280px; }
        .i-sm { font-size: 20px; }
        #acoes-rapidas-comentarios {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 25px;
        }
        #acoes-rapidas-comentarios button { border-radius: 0px; }
        #acoes-rapidas-comentarios span {
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .legenda {
            display: flex;
            align-items: center;
            font-size: 11px;
            font-weight: bold;
            color: #427dc6;
        }
        .corpo-modal-customizado {
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
        .opcoes-modal-customizado {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            align-items: center;
            justify-content: center;
        }
        .opcoes-modal-customizado * { margin: 0 5px; }
        .opcoes-modal-customizado .fechar { grid-column-start: 5; }
        .opcao-grande {
            display: flex;
            align-items: center;
            user-select: none;
            margin: 10px;
        }
        .opcao-grande input {
            margin: 0;
            height: 20px;
            width: 30px;
        }
        .opcao-grande label {
            line-height: 20px;
            margin: 0;
        }
        .campos-modal-customizado {
            display: grid;
            grid-template-columns: 3fr 2fr 2fr 2fr 2fr;
            grid-template-rows: 40px 20px;
            align-items: center;
            justify-items: center;
            height: 60px;
        }
        .campos-modal-customizado input ~ i {
            color: #ff4242;
            font-size: 40px;
        }
        .campos-modal-customizado input:checked ~ i {
            color: #5cb85c;
            font-size: 40px;
        }
        .campos-modal-customizado label {
            user-select: none;
            cursor: pointer;
            margin-bottom: 0;
        }
        .menu-contexto {
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
            z-index: ${maiorZIndex + 3}
        }
        .menu-contexto > span { padding: 5px }
        .menu-contexto > span:hover {
            background-color: #427dc6;
            color: white;
        }
        input[type=checkbox], label[for] {
            cursor: pointer;
        }
    `;
    document.body.appendChild(css);
}

function criarBotaoOpcoesCustomizadas() {
    const idBotao = 'abrir-opcoes-reuniao';
    const btnAntigo = document.getElementById(idBotao);

    /* remover botao da barra de acoes do zoom ao reexecutar script */
    if (btnAntigo) btnAntigo.remove();

    /* recriar o botao ao executar script para manter atualizado */
    /* adicionar botao na barra de acoes do zoom */
    document.querySelector('#wc-footer .footer__inner').appendChild(criarElemento(
        `<button id="${idBotao}" style="margin-right: 20px">Opções customizadas</button>`, {
        onclick: alternarModal
    }));
}

function criarModalCustomizado() {
    const modalDrop = document.getElementById(idGerais.modalCustomizado) || criarElemento(`<div id="${idGerais.modalCustomizado}"></div>`);
    modalDrop.style.display = 'none';
    modalDrop.onclick = evento => evento.target !== modalDrop || fecharModalCustomizado();

    removerFilhos(modalDrop);
    return modalDrop;
}

function criarMenuCustomizado(elemento, options) {
    if (!elemento || !elemento.addEventListener || !Array.isArray(options)) return;

    if (!document.getElementById(idGerais.menuCustomizado)) {
        document.body.appendChild(criarElemento(`<div id="${idGerais.menuCustomizado}" class="menu-contexto"></div>`));
    }

    const menu = document.getElementById(idGerais.menuCustomizado);

    document.body.removeEventListener('click', config.eventoLimparMenu);

    config.eventoLimparMenu = e => {
        if (e.path.find(elemento => elemento.id == 'wc-container-right')) return;

        const ctxMenu = document.getElementById(idGerais.menuCustomizado);

        if (ctxMenu) {
            ctxMenu.style.display = 'none';
        }
    };

    document.body.addEventListener('click', config.eventoLimparMenu);
    elemento.addEventListener('contextmenu', e => {
        removerFilhos(menu);
        options.forEach(({ texto, click: onclick }) => menu.appendChild(criarElemento(`<span>${texto}</span>`, { onclick })));
        menu.style.top = e.pageY;
        menu.style.left = e.pageX;
        menu.style.display = 'grid';
        e.preventDefault();
    });
}

function criarBotaoFocoCustomizado(participantes, nome) {
    return {
        nome,
        id: btoa(nome),
        validar: () => {
            abrirPainelParticipantes();
            return participantes.every(p => selecionarParticipante(p.funcao));
        },
        click: () => {
            if (!confirm(`Deseja ativar o foco: ${nome.toUpperCase()}?`)) return;
            abrirPainelParticipantes();
            const alvosComVideo = [];
            const alvosComMicrofone = [];

            participantes.forEach(({ funcao, video, microfone, focar }) => {
                const p = selecionarParticipante(funcao);
                video && alvosComVideo.push(p);
                microfone && alvosComMicrofone.push(p);

                if (video) {
                    ligarVideoParticipante(p, () => {
                        focar && spotlightParticipante(p);
                        microfone && ligarMicrofoneParticipante(p, true);
                    });
                } else if (microfone) {
                    ligarMicrofoneParticipante(p, true);
                }
            });

            desligarMicrofones(alvosComMicrofone);
            desligarVideos(alvosComVideo);
        }
    };
}

function criarCamposModalFocoCustomizado() {
    const sufixo = Math.random().toString(36).substring(2);
    const cores = { on: 'color: #5cb85c;', off: 'color: #ff4242;' };
    const textos = {
        video: { on: 'Solicitar Vídeo', off: 'Sem Vídeo' },
        mic: { on: 'Solicitar Microfone', off: 'Sem Microfone' },
        spot: { on: 'Com Spotlight', off: 'Sem Spotlight' }
    };
    const icones = {
        video: { on: 'videocam', off: 'videocam_off' },
        mic: { on: 'mic_none', off: 'mic_off' },
        spot: { on: 'gps_fixed', off: 'gps_not_fixed' }
    };
    const campos = criarElemento(`
        <div class="campos-modal-customizado">
            <div class="input-group" style="grid-row: span 2; grid-column: span 2; margin: auto 0 auto 5px; width: calc(100% - 5px);">
                <input type="text" class="form-control" name="funcao" placeholder="Participante ou Função" />
                <span class="input-group-btn">
                    <button name="validar-texto" class="btn btn-primary">Validar texto</button>
                </span>
            </div>

            <label>
                <input type="checkbox" style="display: none;" name="video" id="${'video' + sufixo}">
                <i class="i-sm material-icons-outlined" data-on="${icones.video.on}" data-off="${icones.video.off}">${icones.video.off}</i>
            </label>

            <label>
                <input type="checkbox" style="display: none;" name="microfone" id="${'microfone' + sufixo}" checked>
                <i class="i-sm material-icons-outlined" data-on="${icones.mic.on}" data-off="${icones.mic.off}">${icones.mic.on}</i>
            </label>

            <label>
                <input type="checkbox" style="display: none;" name="focar" id="${'focar' + sufixo}">
                <i class="i-sm material-icons-outlined" data-on="${icones.spot.on}" data-off="${icones.spot.off}">${icones.spot.off}</i>
            </label>

            <label data-on="${textos.video.on}" data-off="${textos.video.off}" for="${'video' + sufixo}" style="${cores.off} grid-column-start: 3;">
                ${textos.video.off}
            </label>
            <label data-on="${textos.mic.on}" data-off="${textos.mic.off}" for="${'microfone' + sufixo}" style="${cores.on}">
                ${textos.mic.on}
            </label>
            <label data-on="${textos.spot.on}" data-off="${textos.spot.off}" for="${'focar' + sufixo}" style="${cores.off}">
                ${textos.spot.off}
            </label>
        </div>
    `);

    /* eventos */
    campos.querySelector('button[name="validar-texto"]').onclick = validarFuncaoAlvoFocoCustomizado;
    campos.querySelectorAll('input[type="checkbox"]').forEach(i => {
        i.onchange = ({ target }) => {
            const icon = target.nextElementSibling;
            const label = document.querySelector(`label[for="${target.id}"]`);
            icon.innerText = target.checked ? icon.dataset.on : icon.dataset.off;
            label.innerText = target.checked ? label.dataset.on : label.dataset.off;
            label.style.color = target.checked ? '#5cb85c' : '#ff4242';
        };
    });

    return campos;
}

function criarCamposOpcaoGrande({ id, texto, marcada, aoSelecionar }) {
    const opcao = criarElemento(`
        <div class="opcao-grande h5">
            <input id="${id}" type="checkbox" ${marcada ? 'checked' : ''}/>
            <label for="${id}">${texto}</label>
        </div>
    `);
    opcao.querySelector(`#${id}`).onchange = aoSelecionar;
    return opcao;
}

function criarCamposRenomearFuncoes(funcao) {
    funcao = getTextoPuro(funcao);
    const div = criarElemento(`
        <div style="display: flex;">
            <div class="input-group" style="flex: 3; margin: 5px 0 0 0;">
                <span class="input-group-addon" style="min-width: 120px; font-weight: 600;">${funcao}:</span>
                <input id="renomear-${funcao}" value="${idParticipantes[funcao]}" type="text" class="form-control">
                <span class="input-group-btn">
                    <button class="btn btn-primary">Salvar</button>
                </span>
            </div>
            <span style="flex: 2; align-self: center; margin-left: 10px;" class="text-primary">
                ${getNomeParticipante(selecionarParticipante(idParticipantes[funcao]))}
            </span>
        </div>
    `);
    div.querySelector('button').onclick = ({ target }) => {
        const novaFuncao = getTextoPuro(target.parentElement.parentElement.querySelector('input').value);
        if (!novaFuncao) {
            alert('É necessário informar um indentificador');
        } else if (novaFuncao != idParticipantes[funcao]) {
            idParticipantes[funcao] = novaFuncao;
            alert(`${funcao} mudou para: ${novaFuncao}`);
            atualizarBotoesFocoPadrao();
        }
    };
    div.querySelector('input').onkeyup = evento => {
        clearTimeout(config.ultimaValidacaoFuncao);
        config.ultimaValidacaoFuncao = setTimeout(() => {
            if (evento.code == "Enter" || evento.key == "Enter") {
                /* renomear com enter */
                evento.target.parentElement.querySelector('button').click();
            } else {
                const labelValidacao = evento.target.parentElement.nextElementSibling;
                labelValidacao.innerText = getNomeParticipante(selecionarParticipante(evento.target.value));
            }
        }, 400);
    };
    return div;
}

function getNomeRotina(id) {
    return {
        tentativasPersistentes: 'Rodando (marque para abortar)',
        validarVideosLigadosNaAssistencia: 'Vídeos ligados',
        validarMicrofonesLigadosNaAssistencia: 'Microfones ligados',
        validarNomesForaDoPadrao: 'Nomes inválidos',
        botoesFocoCustomizado: 'Foco customizado'
    }[id];
}

function getTextoPuro(texto) {
    return !texto ? '' : texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function getParticipantes() {
    return Array.from(document.querySelectorAll('.participants-ul .item-pos.participants-li'));
}

function getNomeParticipante(participante) {
    return !participante ? '' : participante.querySelector('.participants-item__display-name').innerText;
}

function getBotoesDropdown(participante) {
    return !participante ? [] : Array.from(participante.querySelectorAll('.participants-item__buttons .dropdown-menu a'));
}

function getOpcaoDropdownMais(textosOpcao) {
    const opcoes = document.querySelectorAll('#wc-container-right .participants-section-container__participants-footer ul li a');
    return Array.from(opcoes).find(a => textosOpcao.includes(a.innerText.toLowerCase()));
}

function getBotoesParticipantes() {
    const capital = str => str[0].toUpperCase() + str.substring(1, str.length);
    const isReuniaoSemana = new Date().toLocaleDateString('pt-br', { weekday: 'long' }).includes('feira');
    const botoesFocar = [
        { nome: capital(idParticipantes.dirigente), icone: 'dirigente', classe: 'btn-primary', click: focarDirigente },
        { nome: capital(idParticipantes.leitor), icone: 'leitor', classe: 'btn-primary', click: focarLeitor },
        { nome: capital(idParticipantes.presidente), icone: 'presidente', classe: 'btn-warning', click: focarPresidente },
        !isReuniaoSemana && { nome: capital(idParticipantes.orador), icone: 'orador', classe: 'btn-primary', click: focarOrador },
        isReuniaoSemana && { nome: capital(idParticipantes.tesouros), icone: 'tesouros', classe: 'btn-primary', click: () => focar(idParticipantes.tesouros) },
        isReuniaoSemana && { nome: capital(idParticipantes.joias), icone: 'joias', classe: 'btn-primary', click: () => focar(idParticipantes.joias) },
        isReuniaoSemana && { nome: capital(idParticipantes.biblia), icone: 'biblia', classe: 'btn-primary', click: () => focar(idParticipantes.biblia) },
        isReuniaoSemana && { nome: capital(idParticipantes['nossa-vida-1']), icone: 'vida1', classe: 'btn-primary', click: () => focar(idParticipantes['nossa-vida-1']) },
        isReuniaoSemana && { nome: capital(idParticipantes['nossa-vida-2']), icone: 'vida2', classe: 'btn-primary', click: () => focar(idParticipantes['nossa-vida-2']) },
    ];
    return {
        focar: botoesFocar.filter(Boolean),
        chamar: botoesFocar.reduce((lista, btn) => {
            if (btn) {
                const nome = getTextoPuro(btn.nome);
                lista.push({
                    nome: btn.nome,
                    classe: nome != idParticipantes.presidente ? 'btn-success' : 'btn-warning',
                    click: () => chamar(idParticipantes[nome])
                });
            }
            return lista;
        }, [])
    };
}

function isNomeValido(participante) {
    const nome = getNomeParticipante(participante);
    /* valida se nome comeca com (ou [ ou {, seguido de 0 a 9 */
    const regexPadrao = /^\s*[\(\[\{]\s*[0-9]/i;
    const dispositivos = [
        'galaxy',
        'note',
        'samsung',
        'apple',
        'huawei',
        'xiaomi',
        'oppo',
        'vivo',
        'lg',
        'lenovo',
        'motorola',
        'moto',
        'nokia',
        'tecno'
    ];
    /* texto deve conter nome [marca/dispositivo nao sao validos], quantidade [formato: "(x) nome pessoa"] */
    return nome
        && regexPadrao.test(nome)
        && nome.split(' ').filter(p => !dispositivos.includes(p.toLowerCase())).length == nome.split(' ').length;
}

function isMicrofoneLigado(participante) {
    if (!participante) return false;
    participante.dispatchEvent(criarEventoMouseOver());
    return Array
        .from(participante.querySelectorAll('.participants-item__buttons button'))
        .some(btn => textosOpcoes.desligarMicrofone.includes(btn.innerText.toLowerCase()));
}

function isVideoLigado(participante) {
    if (!participante) return false;
    participante.dispatchEvent(criarEventoMouseOver());
    return getBotoesDropdown(participante).some(btn => textosOpcoes.pararVideo.includes(btn.innerText.toLowerCase()));
}

function isSpotlightLigado(participante) {
    if (!participante) return false;
    participante.dispatchEvent(criarEventoMouseOver());
    return getBotoesDropdown(participante).some(btn => textosOpcoes.cancelarSpotlight.includes(btn.innerText.toLowerCase()));
}

function isMaoLevantada(participante) {
    return participante && Array
        .from(participante.querySelectorAll('.participants-item__buttons button.button-margin-right'))
        .some(btn => textosOpcoes.abaixarMaos.includes(btn.innerText.toLowerCase()));
}

function clickBotao(participante, textosBotao) {
    if (!participante) {
        atualizarTela();
        return;
    }
    participante.dispatchEvent(criarEventoMouseOver());
    Array.from(participante.querySelectorAll('.participants-item__buttons button')).some(btn => (
        btn && textosBotao.includes(btn.innerText.toLowerCase()) && !btn.click()
    ));
}

function clickDropdown(participante, textosBotao) {
    if (!participante) {
        atualizarTela();
        return;
    }
    participante.dispatchEvent(criarEventoMouseOver());
    getBotoesDropdown(participante).some(btn => {
        if (textosBotao.includes(btn.innerText.toLowerCase())) {
            btn.click();
            return true;
        }
    });
}

function atualizarTela() {
    clearTimeout(config.ultimaMudanca);
    config.ultimaMudanca = setTimeout(() => {
        atualizarAvisosAntigos();
        atualizarNomesForaDoPadrao();
        atualizarSalaDeEspera();
        atualizarVideosLigadosNaAssistencia();
        atualizarMicrofonesLigadosNaAssistencia();
        atualizarAvisosDeRotinas();
        atualizarBotoesFocoPadrao();
        atualizarMaosLevantadas();
        atualizarAssistencia();
    }, 100);
}

function atualizarAvisosAntigos() {
    Object.keys(avisosDeRotinas).forEach(rotina => {
        if (rotina != 'tentativasPersistentes' && avisosDeRotinas[rotina].length > 10) {
            const avisosUnicos = Array.from(new Set(avisosDeRotinas[rotina]));
            avisosDeRotinas[rotina] = avisosUnicos.slice(-10);
        }
    });
}

function atualizarNomesForaDoPadrao() {
    abrirPainelParticipantes();
    avisosDeRotinas.validarNomesForaDoPadrao = getParticipantes().reduce((lista, participante) => {
        if (!isNomeValido(participante)) {
            lista.push(getNomeParticipante(participante));
        }
        return lista;
    }, []);
}

function atualizarSalaDeEspera() {
    abrirPainelParticipantes();
    document.querySelectorAll('.waiting-room-list-conatiner__ul li').forEach(participante => {
        if (isNomeValido(participante) || observados.salaAberta) {
            participante.dispatchEvent(criarEventoMouseOver());
            const btnPermitir = participante.querySelector('.btn-primary');
            if (btnPermitir) {
                btnPermitir.click();
            }
        }
    });
}

function atualizarVideosLigadosNaAssistencia() {
    abrirPainelParticipantes();
    avisosDeRotinas.validarVideosLigadosNaAssistencia = getParticipantes().reduce((lista, participante) => {
        if (isVideoLigado(participante)) {
            lista.push(getNomeParticipante(participante));
            if (observados.focoAutomatico) {
                desligarSpotlight();
            }
        }
        return lista;
    }, []);
}

function atualizarMicrofonesLigadosNaAssistencia() {
    abrirPainelParticipantes();
    avisosDeRotinas.validarMicrofonesLigadosNaAssistencia = getParticipantes().reduce((lista, participante) => {
        if (isMicrofoneLigado(participante)) {
            lista.push(getNomeParticipante(participante));
        }
        return lista;
    }, []);
}

function atualizarAvisosDeRotinas() {
    Object.keys(avisosDeRotinas).forEach(rotina => {
        const novoCache = btoa(avisosDeRotinas[rotina].join(''));

        /* atualizar lista somente se tiver novos dados */
        if (config.cache[rotina] != novoCache) {
            const ulRotina = document.getElementById(btoa(rotina));
            removerFilhos(ulRotina);

            if (rotina == 'tentativasPersistentes') {
                return atualizarTentativasPersistentes();
            } else if (rotina == 'botoesFocoCustomizado') {
                return atualizarBotoesFocoCustomizado();
            } else if (rotina == 'validarNomesForaDoPadrao') {
                return atualizarNomesInvalidos(ulRotina);
            } else if (rotina == 'validarMicrofonesLigadosNaAssistencia') {
                return atualizarMicrofonesLigados(ulRotina);
            } else if (rotina == 'validarVideosLigadosNaAssistencia') {
                return atualizarVideosLigados(ulRotina);
            } else {
                avisosDeRotinas[rotina].forEach(aviso => ulRotina.appendChild(criarElemento(`<li class="zebrado">${aviso}</li>`)));
            }

            /* atualizar cache */
            config.cache[rotina] = novoCache;
        }
    });
}

function atualizarBotoesFocoPadrao() {
    const botoesFocar = document.querySelectorAll(".frame-focar > button") || [];
    const botoesChamar = document.querySelectorAll(".frame-chamar > button") || [];
    const classeIndicativa = 'foco-invalido';

    botoesChamar.forEach((btnChamar, idx) => {
        const btnFocar = botoesFocar[idx] || {};

        if (btnChamar.innerText && !selecionarParticipante(idParticipantes[btnChamar.innerText.toLowerCase()])) {
            btnFocar.classList.add(classeIndicativa);
            btnChamar.classList.add(classeIndicativa);
        } else if (btnChamar.classList.contains(classeIndicativa)) {
            btnChamar.classList.remove(classeIndicativa);
            btnFocar.classList.remove(classeIndicativa);
        }
    });
}

function atualizarMaosLevantadas() {
    const lista = document.querySelector('#maos-comentarios');
    removerFilhos(lista);

    const participante = selecionarParticipante(observados.comentarista);
    if (isMicrofoneLigado(participante)) {
        abaixarMaoParticipante(participante);
        delete observados.comentarista;
    }

    /* busca todas maos levantadas e adiciona na lista */
    getParticipantes().forEach(participante => {
        if (!isMaoLevantada(participante)) return;

        const nome = getNomeParticipante(participante);
        const li = criarElemento('<li></li>');
        const btn = criarElemento(`<button data-participante="${nome}" class="btn-xs btn-comentaristas"></button>`, {
            onclick: ({ target }) => {
                const nomeParticipante = target.dataset.participante;
                const participante = selecionarParticipante(nomeParticipante);
                observados.comentarista = nomeParticipante;

                abaixarMaos([participante]);
                ligarMicrofoneParticipante(participante);
                desligarMicrofones([
                    participante,
                    ...getParticipantes().filter(participante => isVideoLigado(participante))
                ]);
            }
        });

        btn.appendChild(criarElemento(`<i data-participante="${nome}" class="material-icons-outlined">mic_none</i>`));
        btn.appendChild(criarElemento(`<span data-participante="${nome}">${nome}</span>`));
        li.appendChild(btn);
        lista.appendChild(li);
    });
}

function atualizarAssistencia() {
    const dadosAssistencia = contarAssistencia();
    const novoCache = btoa(JSON.stringify(dadosAssistencia));
    /* atualizar lista somente se com novas informacoes */
    if (config.cache.atualizarAssistencia != novoCache) {
        document.getElementById(idGerais.textoContados).innerText = `${dadosAssistencia.contados} identificado(s)`;
        document.getElementById(idGerais.textoNaoContados).innerText = `${dadosAssistencia.naoContados} não identificado(s)`;
        /* atualizar cache */
        config.cache.atualizarAssistencia = novoCache;
    }
}

function atualizarTentativasPersistentes() {
    const ul = document.getElementById(btoa('tentativasPersistentes'));
    ul.querySelectorAll('li').forEach(li => li.remove());

    avisosDeRotinas.tentativasPersistentes.forEach(alvo => {
        const onclick = ({ target: { value: idTentativa } }) => {
            avisosDeRotinas.tentativasPersistentes = avisosDeRotinas.tentativasPersistentes.filter(id => id != idTentativa);
            encerrarRotina(idTentativa);
            atualizarTentativasPersistentes();
        };
        const input = criarElemento(`<input id="${getTextoPuro(alvo)}" type="checkbox" value="${alvo}"></input>`, { onclick });
        const li = criarElemento(`
            <li class="checkbox">
                <label for="${getTextoPuro(alvo)}">${alvo}</li>
            </li>
        `);
        li.appendChild(input);
        ul.appendChild(li);
    });
}

function atualizarBotoesFocoCustomizado() {
    const ul = document.getElementById(btoa('botoesFocoCustomizado'));
    ul.querySelectorAll('li').forEach(li => li.remove());

    avisosDeRotinas.botoesFocoCustomizado.forEach(({ nome, click, id, validar }) => {
        const isValido = validar();
        nome = isValido ? nome : 'Não encontrado!';
        const btn = criarElemento(`<button ${isValido || 'disabled'} class="btn-sm">${nome}</button>`, {
            onclick: e => !e.target.attributes.disabled && click()
        });

        const icon = criarIcone('fechar');
        icon.onclick = () => excluirBotaoFocoCustomizado(id);
        icon.style.cssText = `font-size: 22px; cursor: pointer;`;

        const li = criarElemento(`<li class="btn-foco-customizado"></li>`);

        li.appendChild(btn);
        li.appendChild(icon);
        ul.appendChild(li);
    });
}

function atualizarNomesInvalidos(ul) {
    avisosDeRotinas.validarNomesForaDoPadrao.forEach(nome => {
        const elemento = criarElemento(`<li class="zebrado">${nome}</li>`);
        criarMenuCustomizado(elemento, [{
            texto: 'Renomear',
            click: () => renomearParticipante(selecionarParticipante(nome))
        }, {
            texto: 'Mover para sala de espera',
            click: () => expulsarParticipante(selecionarParticipante(nome))
        }]);
        ul.appendChild(elemento);
    });
}

function atualizarMicrofonesLigados(ul) {
    avisosDeRotinas.validarMicrofonesLigadosNaAssistencia.forEach(nome => {
        const elemento = criarElemento(`<li class="zebrado">${nome}</li>`);
        criarMenuCustomizado(elemento, [{
            texto: 'Silenciar',
            click: () => desligarMicrofoneParticipante(selecionarParticipante(nome))
        }]);
        ul.appendChild(elemento);
    });
}

function atualizarVideosLigados(ul) {
    avisosDeRotinas.validarVideosLigadosNaAssistencia.forEach(nome => {
        const elemento = criarElemento(`<li class="zebrado">${nome}</li>`);
        criarMenuCustomizado(elemento, [{
            texto: 'Desligar vídeo',
            click: () => desligarVideoParticipante(selecionarParticipante(nome))
        }]);
        ul.appendChild(elemento);
    });
}

function desenharModal() {
    const modal = document.getElementById(idGerais.modal);
    /* limpar componentes anteriores */
    if (modal) modal.remove();

    /* importar icones */
    importarIconesFontAwesome();

    /* construir o quadro inteiro do painel */
    const painelOpcoes = criarElemento(`<div class="modal-principal" id="${idGerais.modal}"></div>`);
    /* adicionar os frames ao painel */
    painelOpcoes.appendChild(desenharFrameBotoes());
    painelOpcoes.appendChild(desenharFrameServicos());
    painelOpcoes.appendChild(desenharModalFocoCustomizado());

    /* esconder modal ao iniciar script */
    painelOpcoes.style.display = 'none';
    /* adicionar na tela */
    document.body.appendChild(painelOpcoes);
}

function desenharModalFocoCustomizado() {
    /* componentes modal */
    const btnAdicionarNovoFoco = criarElemento('<button class="btn btn-success">Novo participante</button>', {
        onclick: () => document.querySelector('.corpo-modal-customizado').appendChild(criarCamposModalFocoCustomizado())
    });

    const btnSalvar = criarElemento('<button class="btn btn-primary">Salvar</button>', {
        onclick: () => {
            const camposValidos = validarCamposModalFocoCustomizado();
            if (!camposValidos) return;

            const { participantes, inputNomeFoco } = camposValidos;
            const nomeBtnFoco = getTextoPuro(inputNomeFoco.value);
            const btn = criarBotaoFocoCustomizado(participantes, nomeBtnFoco);

            /* adicionar botao novo, sempre removendo as repeticoes */
            avisosDeRotinas.botoesFocoCustomizado = [btn, ...avisosDeRotinas.botoesFocoCustomizado.filter(b => b.id != btn.id)];
            atualizarTela();

            fecharModalCustomizado();
        }
    });

    const btnCancelar = criarElemento('<button class="btn btn-primary-outline fechar">Cancelar</button>', {
        onclick: fecharModalCustomizado
    });

    const inputNomeFocoCustomizado = criarElemento(`
        <div class="input-group" style="margin: auto 5px;">
            <span class="input-group-addon">Informe o nome do botão:</span>
            <input id="nome-foco-customizado" name="nome" type="text" class="form-control" placeholder="Primeira Visita">
        </div>
    `);

    /* desenhar modal */
    const cabecalhoModal = criarElemento('<div class="opcoes-modal-customizado"/>');
    cabecalhoModal.appendChild(btnAdicionarNovoFoco);
    cabecalhoModal.appendChild(btnSalvar);
    cabecalhoModal.appendChild(btnCancelar);

    const avisoErroModal = criarElemento(`
        <div class="alert alert-danger" id="aviso-erro-modal" style="display: none; font-size: 18px; margin: auto 0;">
            <span class="glyphicon glyphicon-exclamation-sign"></span>
            <span name="placeholder-erro"></span>
        </div>
    `);

    const modal = criarElemento('<div class="corpo-modal-customizado"></div>');
    modal.appendChild(avisoErroModal);
    modal.appendChild(cabecalhoModal);
    modal.appendChild(inputNomeFocoCustomizado);
    modal.appendChild(criarCamposModalFocoCustomizado());

    const modalDrop = criarModalCustomizado();
    modalDrop.appendChild(modal);
    return modalDrop;
}

function desenharModalVerMais() {
    /* componentes modal */
    const btnFechar = criarElemento('<button class="btn btn-primary-outline fechar">Fechar</button>', {
        onclick: fecharModalCustomizado
    });
    const opcaoSalaDeEspera = criarCamposOpcaoGrande({
        id: 'liberar-sala-espera',
        texto: 'Liberar sala de espera para todos',
        marcada: observados.salaAberta,
        aoSelecionar: () => {
            observados.salaAberta = !observados.salaAberta;
            atualizarSalaDeEspera();
        }
    });
    const opcaoSpotlight = criarCamposOpcaoGrande({
        id: 'foco-automatico',
        texto: 'Ativar foco automático (remove automaticamente o spotlight)',
        marcada: observados.focoAutomatico,
        aoSelecionar: () => {
            observados.focoAutomatico = !observados.focoAutomatico
            atualizarVideosLigadosNaAssistencia();
        }
    });

    /* desenhar modal */
    const opcoesTopo = criarElemento('<div style="display: flex; justify-content: space-between; align-items: center;"/>');
    opcoesTopo.appendChild(opcaoSalaDeEspera);
    opcoesTopo.appendChild(btnFechar);

    const modal = criarElemento('<div class="corpo-modal-customizado" style="display: block;"/>');
    modal.appendChild(opcoesTopo);
    modal.appendChild(opcaoSpotlight);

    document.querySelectorAll('.frame-chamar button').forEach(btn => {
        modal.appendChild(criarCamposRenomearFuncoes(btn.innerText));
    });

    const modalDrop = criarModalCustomizado();
    modalDrop.appendChild(modal);
    return modalDrop;
}

function desenharFrameBtnFechar() {
    /* botao fechar modal */
    const btnFechar = criarIcone('fechar', 'btn-fechar-modal');
    btnFechar.classList.add('btn-fechar');
    btnFechar.onclick = fecharModal;

    const rowFecharModal = criarElemento(`<div class="frame-fechar"></div>`);
    rowFecharModal.appendChild(criarElemento(`<span class="titulo-botoes">Chamar</span>`));
    rowFecharModal.appendChild(criarElemento(`<span class="titulo-botoes">Focar</span>`));
    rowFecharModal.appendChild(criarElemento(`
        <span class="titulo-botoes frame-funcionalidade-fechar">
            <span style="grid-column-start: 2;">Ações</span>
        </span>
    `).appendChild(btnFechar).parentElement);

    return rowFecharModal;
}

function desenharFrameBotoes() {
    const criarBotao = ({ nome, escrever, texto, click, classe, icone }) => {
        const btn = criarElemento(`<button class="btn ${classe} btn-funcionalidade">${nome}</button>`, {
            onclick: () => {
                if (escrever && texto) {
                    const respostaInformada = prompt(escrever);
                    const respostaCorreta = texto.toLowerCase();
                    if (typeof respostaInformada == 'string') {
                        return respostaInformada.toLowerCase() == respostaCorreta ? click() : alert('Texto incorreto! Ação não executada.');
                    }
                } else {
                    click();
                }
            }
        });

        if (icone) {
            const div = document.createElement('div');
            icone.split(',').forEach(i => div.appendChild(criarIcone(i)));
            btn.appendChild(div);
        }
        return btn;
    };
    const { chamar: botoesChamar, focar: botoesFocar } = getBotoesParticipantes();
    const palmasEmSegundos = config.palmasEmMilissegundos / 1000;
    const botoesFuncionalidades = [
        {
            nome: 'Ligar tudo',
            icone: 'camera,microfone',
            classe: 'btn-danger',
            click: ligarTudo,
            escrever: `Evite acidentes. Para confirmar, escreva: 'BARULHO'`,
            texto: 'BARULHO'
        },
        {
            nome: 'Finalizar discurso',
            icone: 'finalizarDiscurso',
            classe: 'btn-danger',
            click: finalizarDiscurso,
            escrever: `Microfones serão ligados por ${palmasEmSegundos} segundos e o presidente será acionado AUTOMATICAMENTE após as palmas.\n\nPara confirmar, escreva: 'FINALIZAR'.`,
            texto: 'FINALIZAR'
        },
        {
            nome: 'Criar foco',
            icone: 'participante',
            classe: 'btn-success',
            click: abrirModalFocoCustomizado
        },
        {
            nome: 'Mais opções',
            icone: 'mais',
            classe: 'btn-success',
            click: abrirModalVerMais
        },
        {
            nome: 'Desligar tudo',
            icone: 'cameraFechada,microfoneFechado',
            classe: 'btn-danger',
            click: desligarTudo,
            escrever: `Evite acidentes. Para confirmar, escreva: 'DESLIGAR'`,
            texto: 'DESLIGAR'
        },
        {
            nome: `Palmas (${palmasEmSegundos}s)`,
            icone: 'microfone',
            classe: 'btn-danger btn-palmas',
            click: liberarPalmas,
            escrever: `Microfones serão ligados por ${palmasEmSegundos} segundos.\n\nPara confirmar, escreva: 'PALMAS'.`,
            texto: 'PALMAS'
        }
    ];

    /* contagem da assistencia na ultima linha */
    const dadosAssistencia = contarAssistencia();
    const textoContados = criarElemento(`<span id="${idGerais.textoContados}">${dadosAssistencia.contados} identificado(s)</span>`);
    const textoNaoContados = criarElemento(`<span id="${idGerais.textoNaoContados}">${dadosAssistencia.naoContados} não identificado(s)</span>`);

    const iconContados = criarIcone('assistencia');
    iconContados.style.color = '#5cb85c';

    const iconNaoContados = criarIcone('assistenciaNaoContada');
    iconNaoContados.style.color = '#ff4242';

    const divContados = criarElemento(`<div class="configuracao" style="cursor: pointer"></div>`, {
        onclick: () => {
            const msg = `Evite acidentes.\nEscreva: "ENVIAR" para enviar email ao secretário informando assistência de ${contarAssistencia().contados}`;
            const resp = prompt(msg);
            if (typeof resp == 'string') {
                return resp.toLowerCase() == 'enviar' ? enviarEmailServerless() : alert('Texto incorreto. Email NÃO enviado!');
            }
        }
    });
    divContados.appendChild(iconContados);
    divContados.appendChild(textoContados);

    const divNaoContados = criarElemento(`<div class="configuracao"></div>`);
    divNaoContados.appendChild(iconNaoContados);
    divNaoContados.appendChild(textoNaoContados);

    const inputModoTransparente = criarElemento(`<input id="modo-transparente" type="checkbox"></input>`, {
        onchange: ({ target }) => {
            const modal = document.getElementById(idGerais.modal);
            if (target.checked) {
                modal.classList.add('modal-transparente');
            } else {
                modal.classList.remove('modal-transparente');
            }
        }
    });

    const textoModoTransparente = criarElemento(`<label for="modo-transparente">Modo transparente (exibe vídeo em destaque)</label>`);
    const divModoTransparente = criarElemento('<div class="config-item"></div>');
    divModoTransparente.appendChild(inputModoTransparente);
    divModoTransparente.appendChild(textoModoTransparente);

    /* construtir os frames de botoes */
    const frameBotoes = criarElemento(`<div class="frame-botoes"></div>`);
    const frameFechar = desenharFrameBtnFechar();
    const frameChamar = criarElemento(`<div class="frame-chamar"></div>`);
    const frameFocar = criarElemento(`<div class="frame-focar"></div>`);
    const frameFuncionalidades = criarElemento(`<div class="frame-funcionalidade"></div>`);

    /* adicionar os botoes nos frames */
    botoesChamar.forEach(c => frameChamar.appendChild(criarBotao(c)));
    botoesFocar.forEach(f => frameFocar.appendChild(criarBotao(f)));
    botoesFuncionalidades.forEach(f => frameFuncionalidades.appendChild(criarBotao(f)));
    frameFuncionalidades.appendChild(divContados);
    frameFuncionalidades.appendChild(divNaoContados);
    frameFuncionalidades.appendChild(divModoTransparente);

    /* popular os frames */
    frameBotoes.appendChild(frameFechar);
    frameBotoes.appendChild(frameChamar);
    frameBotoes.appendChild(frameFocar);
    frameBotoes.appendChild(frameFuncionalidades);
    return frameBotoes;
}

function desenharFrameServicos() {
    /* bloco dos servicos */
    const servicos = criarElemento('<div class="frame-rotinas" id="rotinas-background"></div>');

    /* criar listas de logs das rotinas */
    Object.keys(avisosDeRotinas).forEach(rotina => {
        /* criar rotina com titulo */
        const div = criarElemento(`<div class="div-rotina"><p>${getNomeRotina(rotina)}</p></div>`);
        const ul = document.createElement('ul');

        /* botoes de foco customizado */
        if (rotina == 'botoesFocoCustomizado') {
            div.classList.add('grid-customizados');
            avisosDeRotinas[rotina].forEach(btnCustomizado => {
                ul.appendChild(
                    document.createElement('li').appendChild(
                        criarElemento(`<button class="btn btn-danger btn-funcionalidade">${btnCustomizado.nome}</button>`, {
                            onclick: () => btnCustomizado.click()
                        })
                    ).parentElement
                );
            });
        }

        /* adicionar lista na sessao */
        ul.id = btoa(rotina);
        div.appendChild(ul);

        /* adiciona sessao na lista */
        servicos.appendChild(div);
    });

    /* lista de maos levantadas para comentar */
    servicos.appendChild(criarElemento(`
        <div class="div-rotina grid-comentarios">
            <p>Comentários</p>
            <div id="acoes-rapidas-comentarios">
                <button class="btn btn-xs btn-primary">Silenciar todos*</button>
                <button class="btn btn-xs btn-success">Abaixar mãos</button>
            </div>
            <div class="legenda">*Exceto com vídeos ligados</div>
            <ul id="maos-comentarios"></ul>
        </div>
    `));
    /* botoes de acao rapida */
    servicos.querySelector('.btn-primary').onclick = silenciarComentaristas;
    servicos.querySelector('.btn-success').onclick = abaixarMaos;

    return servicos;
}

function abrirModalFocoCustomizado() {
    desenharModalFocoCustomizado();
    abrirModalCustomizado();
}

function abrirModalVerMais() {
    desenharModalVerMais();
    abrirModalCustomizado();
}

function abrirModalCustomizado() {
    document.getElementById(idGerais.modalCustomizado).style.display = 'block';
}

function abrirPainelParticipantes() {
    if (!document.querySelector('.participants-header__title')) {
        document.querySelector('.footer-button__participants-icon').click();
        criarDomListener();
    }
}

function fecharModal() {
    document.getElementById(idGerais.modal).style.display = 'none';
}

function fecharModalCustomizado() {
    const modal = document.getElementById(idGerais.modalCustomizado);
    removerFilhos(modal);
    modal.style.display = 'none';
}

function validarFuncaoAlvoFocoCustomizado({ target }) {
    abrirPainelParticipantes();
    const campoTexto = target.parentElement.previousElementSibling;
    const encontrado = selecionarParticipante(campoTexto.value);
    if (encontrado) {
        campoTexto.classList.remove('alert-danger');
        alert(`Participante encontrado: ${getNomeParticipante(encontrado)}`);
    } else {
        campoTexto.classList.add('alert-danger');
        campoTexto.value
            ? alert(`Nenhum participante encontrado pelo termo ${campoTexto.value.toUpperCase()}`)
            : alert(`Informe algum texto para encontrar o participante`);
    }
}

function validarCamposModalFocoCustomizado() {
    let erros = false;
    const avisoErro = document.querySelector('#aviso-erro-modal span[name="placeholder-erro"]');
    const estiloErro = 'alert-danger';
    const inputNomeFoco = document.querySelector(`#${idGerais.modalCustomizado} input[name="nome"]`);
    const participantes = [];

    if (!inputNomeFoco.value) {
        inputNomeFoco.classList.add(estiloErro);
        avisoErro.innerText = 'Informe nome para o novo botão. Preencha o(s) campo(s) em vermelho';
        avisoErro.parentElement.style.display = 'block';
        return;
    }

    abrirPainelParticipantes();

    document.querySelectorAll(`#${idGerais.modalCustomizado} .campos-modal-customizado`).forEach(campos => {
        const foco = {};

        campos.querySelectorAll('input[type="checkbox"]').forEach(({ name, checked }) => foco[name] = checked);
        campos.querySelectorAll('input[type="text"]').forEach(({ value, classList }) => {
            if (selecionarParticipante(value)) {
                foco.funcao = value;
            } else {
                classList.add(estiloErro);
                erros = true;
            }
        });

        participantes.push(foco);
    });

    if (erros) {
        avisoErro.innerText = 'Preencha o(s) campo(s) em vermelho e selecione "validar texto"';
        avisoErro.parentElement.style.display = 'block';
        return;
    }

    return { participantes, inputNomeFoco };
}

function ligarMicrofoneParticipante(participante, tentativaPersistente) {
    const nomeRotina = `ligar_som_${getNomeParticipante(participante)}`;

    /* cancelar nova tentativa se participante ja ligou microfone */
    if (isMicrofoneLigado(participante)) {
        encerrarRotina(nomeRotina);
        atualizarTela();
        return;
    }

    clickBotao(participante, textosOpcoes.ligarMicrofone);

    if (participante && tentativaPersistente) {
        /* iniciar temporizador para aguardar participante liberar microfone */
        dispararRotina(nomeRotina, 2000, () => {
            if (isMicrofoneLigado(participante)) {
                encerrarRotina(nomeRotina);
                atualizarTela();
            } else {
                /* registrar log de tentativa em andamento */
                if (!avisosDeRotinas.tentativasPersistentes.includes(nomeRotina)) {
                    avisosDeRotinas.tentativasPersistentes.push(nomeRotina);
                    atualizarTela();
                }

                clickBotao(participante, textosOpcoes.ligarMicrofone);
            }
        });
    }
}

function ligarVideoParticipante(participante, callback) {
    /* se o video ja estiver ligado, seguir para proximas instrucoes */
    if (isVideoLigado(participante)) return callback && callback();

    const textosBotao = ['ask for start video', 'start video', 'pedir para iniciar vídeo', 'iniciar vídeo'];

    clickDropdown(participante, textosBotao);

    /* se houverem instrucoes para executar apos video ser ligado, ativa um temporizador */
    if (participante && callback) {
        const nomeRotina = `ligar_video_${getNomeParticipante(participante)}`;

        /* iniciar temporizador para aguardar participante liberar video */
        let repeticoes = 0;
        dispararRotina(nomeRotina, 500, () => {
            repeticoes++;
            if (isVideoLigado(participante)) {
                avisosDeRotinas.tentativasPersistentes = avisosDeRotinas.tentativasPersistentes.filter(aviso => aviso != nomeRotina);
                encerrarRotina(nomeRotina);
                atualizarTela();
                callback();
            } else {
                /* registrar log de tentativa em andamento */
                if (!avisosDeRotinas.tentativasPersistentes.includes(nomeRotina)) {
                    avisosDeRotinas.tentativasPersistentes.push(nomeRotina);
                    atualizarTela();
                }
                /* aguardar tempo suficiente para nova tentativa */
                if (repeticoes >= 8) {
                    repeticoes = 0;
                    clickDropdown(participante, textosBotao);
                }
            }
        });
    }
}

function ligarMicrofones() {
    abrirPainelParticipantes();
    getParticipantes().forEach(participante => ligarMicrofoneParticipante(participante));
}

function ligarTudo() {
    abrirPainelParticipantes();
    getParticipantes().forEach(participante => {
        ligarVideoParticipante(participante);
        ligarMicrofoneParticipante(participante);
    });
    /* deixar foco automático */
    desligarSpotlight();
    permitirParticipantesLigarMicrofones(true);
    silenciarParticipantesAoEntrar(false);
    observados.salaAberta = true;
}

function desligarMicrofoneParticipante(participante) {
    clickBotao(participante, textosOpcoes.desligarMicrofone);
}

function desligarVideoParticipante(participante) {
    clickDropdown(participante, textosOpcoes.pararVideo);
}

function desligarMicrofones(excecoes) {
    abrirPainelParticipantes();
    excecoes = Array.isArray(excecoes) ? excecoes.map(p => getNomeParticipante(p)) : [];

    getParticipantes().forEach(participante => {
        /* silenciar todos participantes que nao estejam na lista de excecoes */
        if (!excecoes.includes(getNomeParticipante(participante))) {
            desligarMicrofoneParticipante(participante);
        }
    });
}

function desligarVideos(excecoes) {
    abrirPainelParticipantes();
    excecoes = Array.isArray(excecoes) ? excecoes.map(p => getNomeParticipante(p)) : [];

    getParticipantes().forEach(participante => {
        /* desligar video de todos participantes que nao estejam na lista de excecoes */
        if (!excecoes.includes(getNomeParticipante(participante))) {
            desligarVideoParticipante(participante);
        }
    });
}

function desligarSpotlight() {
    abrirPainelParticipantes();
    getParticipantes().some(participante => {
        if (isSpotlightLigado(participante)) {
            clickDropdown(participante, textosOpcoes.cancelarSpotlight);
            return true;
        }
    });
}

function desligarTudo() {
    abrirPainelParticipantes();
    desligarVideos();
    desligarMicrofones();
    permitirParticipantesLigarMicrofones(false);
    silenciarParticipantesAoEntrar(true);
}

function focar(funcao) {
    abrirPainelParticipantes();
    const alvo = selecionarParticipante(funcao);

    if (!funcao || !alvo) return alert(`Participante: "${funcao}" não encontrado`);

    /* ligar video do participante informado */
    ligarVideoParticipante(alvo, () => {
        observados.focoAutomatico = false;
        const participante = selecionarParticipante(funcao);
        desligarVideos([participante]);
        desligarMicrofones([participante]);
        spotlightParticipante(participante);
        ligarMicrofoneParticipante(participante, true);
    });
}

function focarDirigente() {
    abrirPainelParticipantes();
    const dirigente = selecionarParticipante(idParticipantes.dirigente);
    const presidente = selecionarParticipante(idParticipantes.presidente);
    const leitor = selecionarParticipante(idParticipantes.leitor);

    if (!dirigente) {
        return alert(`Dirigente não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: Anthony Morris - ${idParticipantes.dirigente}`);
    }

    /* desligar video de todos participantes, exceto dirigente, leitor e presidente */
    desligarVideos([dirigente, leitor, presidente]);

    /* silenciar todos exceto dirigente e leitor */
    desligarMicrofones([dirigente, leitor]);

    /* ligar video do dirigente */
    ligarVideoParticipante(dirigente, () => {
        observados.focoAutomatico = false;
        const dirigente = selecionarParticipante(idParticipantes.dirigente);
        spotlightParticipante(dirigente);
        ligarMicrofoneParticipante(dirigente, true);
        desligarVideoParticipante(selecionarParticipante(idParticipantes.presidente));
    });
}

function focarLeitor() {
    abrirPainelParticipantes();
    const leitor = selecionarParticipante(idParticipantes.leitor);
    const dirigente = selecionarParticipante(idParticipantes.dirigente);

    if (!leitor) {
        return alert(`Leitor não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: David Splane - ${idParticipantes.leitor}`);
    }

    /* desligar video de todos participantes, exceto dirigente e leitor */
    desligarVideos([dirigente, leitor]);

    /* silenciar todos participantes, exceto leitor e dirigente */
    desligarMicrofones([leitor, dirigente]);

    /* ligar video do leitor */
    ligarVideoParticipante(leitor, () => {
        observados.focoAutomatico = false;
        spotlightParticipante(leitor);
        ligarMicrofoneParticipante(leitor, true);
    });
}

function focarPresidente() {
    abrirPainelParticipantes();
    const presidente = selecionarParticipante(idParticipantes.presidente);

    if (!presidente) {
        return alert(`Presidente não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: Geoffrey Jackson - ${idParticipantes.presidente}`);
    }

    /* silenciar todos participantes, exceto presidente */
    desligarMicrofones([presidente]);

    /* ligar video do presidente */
    ligarVideoParticipante(presidente, () => {
        observados.focoAutomatico = false;
        ligarMicrofoneParticipante(presidente, true);
        spotlightParticipante(presidente);
        desligarVideos([presidente]); /* exceto presidente */
    });
}

function focarOrador() {
    abrirPainelParticipantes();
    const orador = selecionarParticipante(idParticipantes.orador);

    if (!orador) {
        return alert(`Orador não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: Gerrit Losch - ${idParticipantes.orador}`);
    }

    /* desligar video de todos participantes, exceto orador */
    desligarVideos([orador]);

    /* silenciar todos participantes, exceto orador */
    desligarMicrofones([orador]);

    /* ligar video do orador */
    ligarVideoParticipante(orador, () => {
        observados.focoAutomatico = false;
        spotlightParticipante(orador);
        ligarMicrofoneParticipante(orador, true);
    });
}

function silenciarComentaristas() {
    abrirPainelParticipantes();
    getParticipantes().forEach(participante => {
        if (!isVideoLigado(participante)) {
            desligarMicrofoneParticipante(participante);
        }
    });
}

function silenciarParticipantesAoEntrar(silenciar) {
    const opcaoSilenciarAoEntrar = getOpcaoDropdownMais(textosOpcoes.silenciarAoEntrar);

    if (!opcaoSilenciarAoEntrar) {
        return;
    }

    const isAtivo = opcaoSilenciarAoEntrar.querySelector('.i-ok-margin');

    /* clicar na opcao somente se nao estiver como deveria */
    if ((silenciar && !isAtivo) || (!silenciar && isAtivo)) {
        opcaoSilenciarAoEntrar.click();

        /* desmarcar a opcao que permite os participantes ligarem o microfone */
        setTimeout(() => {
            const opcaoPermitirMicrofones = document.querySelector('.zm-modal-footer-default-checkbox');
            if (opcaoPermitirMicrofones) {

                if (opcaoPermitirMicrofones.querySelector('.zm-checkbox-checked')) {
                    opcaoPermitirMicrofones.querySelector('.zm-checkbox-message').click();
                }

                document.querySelector('.zm-modal-footer-default-actions .zm-btn__outline--blue').click();
            }
        }, 100);

    }
}

function abaixarMaoParticipante(participante) {
    if (!participante) return;
    abrirPainelParticipantes();
    const btn = Array.from(participante.querySelectorAll('.participants-item__buttons .button-margin-right')).find(btn => {
        return textosOpcoes.abaixarMaos.includes(btn.innerText.toLowerCase());
    });
    btn && btn.click();
}

function abaixarMaos(excecoes) {
    abrirPainelParticipantes();
    excecoes = Array.isArray(excecoes) ? excecoes.map(p => getNomeParticipante(p)) : [];
    getParticipantes().forEach(participante => {
        /* abaixar mao de todos participantes que nao estejam na lista de excecoes */
        if (!excecoes.includes(getNomeParticipante(participante))) {
            const btn = Array.from(participante.querySelectorAll('.participants-item__buttons .button-margin-right')).find(btn => {
                return textosOpcoes.abaixarMaos.includes(btn.innerText.toLowerCase());
            });

            btn && btn.click();
        }
    });
}

function enviarEmailServerless() {
    fetch('https://zoom.vercel.app/api/send-email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            assistencia: contarAssistencia().contados,
            congregacao: 'Nordeste'
        })
    }).then(async data => {
        const resp = await data.json();
        alert(resp.success ? resp.message : 'Não foi possível enviar e-mail');
    }).catch(err => alert(err));
}

function importarIconesFontAwesome() {
    const importIcones = document.querySelector('#icones');
    /* nao duplicar tag de import dos icones */
    if (!importIcones) {
        const url = 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined';
        document.head.appendChild(criarElemento(`<link rel="stylesheet" href="${url}" id="icones"> </link>`));
    }
}

function removerFilhos(elemento) {
    elemento && elemento.querySelectorAll && elemento.querySelectorAll('*').forEach(child => child.remove());
}

function dispararRotina(nomeRotina, tempoEmMilissengudos, callback) {
    encerrarRotina(nomeRotina);
    intervalosEmExecucao[nomeRotina] = setInterval(() => callback(), tempoEmMilissengudos);
    avisosDeRotinas.tentativasPersistentes = Array.from(new Set([...avisosDeRotinas.tentativasPersistentes, nomeRotina]));
    atualizarTela();
}

function encerrarRotina(nomeRotina) {
    intervalosEmExecucao[nomeRotina] = clearInterval(intervalosEmExecucao[nomeRotina]);
    avisosDeRotinas.tentativasPersistentes = avisosDeRotinas.tentativasPersistentes.filter(tentativa => tentativa != nomeRotina);
    atualizarTela();
}

function alternarModal() {
    const modal = document.getElementById(idGerais.modal);
    if (modal.style.display == 'none') {
        modal.removeAttribute('style');
    } else {
        fecharModal();
    }
}

function iniciarEventosPainelParticipantes() {
    const btnAbrirPainel = document.querySelector('.footer-button__participants-icon');

    if (!document.getElementById('wc-container-right')) {
        btnAbrirPainel.click();
    }

    criarDomListener();
    btnAbrirPainel.click();
}

function selecionarParticipante(funcao) {
    if (!funcao) return;
    return getParticipantes().find(participante => {
        const nome = getTextoPuro(getNomeParticipante(participante));
        return nome && nome.includes(getTextoPuro(funcao));
    });
}

function renomearParticipante(participante) {
    clickDropdown(participante, textosOpcoes.renomear);
    clickBotao(participante, textosOpcoes.renomear);
}

function expulsarParticipante(participante) {
    clickDropdown(participante, textosOpcoes.expulsar);
}

function spotlightParticipante(participante) {
    clickDropdown(participante, ['spotlight video', 'vídeo de destaque']);
}

function contarAssistencia() {
    abrirPainelParticipantes();
    let assistencia = 0;
    const nomesForaPadrao = [];

    getParticipantes().forEach(participante => {
        const nome = getNomeParticipante(participante);

        if (!isNomeValido(participante)) {
            nomesForaPadrao.push(nome);
            return;
        }

        const quantidade = parseInt(nome.replace(/\(|\{|\[/, '').trim());
        if (quantidade > 0) {
            assistencia += quantidade;
        }
    });

    return {
        contados: assistencia,
        naoContados: nomesForaPadrao.length,
        nomesInvalidos: nomesForaPadrao
    };
}

function permitirParticipantesLigarMicrofones(permitir) {
    const opcaoPermitirMicrofones = getOpcaoDropdownMais(textosOpcoes.permitirMicrofones);

    if (!opcaoPermitirMicrofones) {
        return;
    }

    const isAtivo = opcaoPermitirMicrofones.querySelector('.i-ok-margin');

    /* clicar na opcao somente se nao estiver como deveria */
    if ((permitir && !isAtivo) || (!permitir && isAtivo)) {
        opcaoPermitirMicrofones.click();
    }
}

function chamar(funcao) {
    abrirPainelParticipantes();
    const alvo = selecionarParticipante(funcao);

    if (!funcao || !alvo) return alert(`Participante: "${funcao}" não encontrado`);

    /* ligar video do participante informado */
    ligarVideoParticipante(alvo, () => {
        /* quando o participante informado iniciar seu video */
        ligarMicrofoneParticipante(selecionarParticipante(funcao), true);
    });
}

function excluirBotaoFocoCustomizado(id) {
    if (id) {
        avisosDeRotinas.botoesFocoCustomizado = avisosDeRotinas.botoesFocoCustomizado.filter(bfc => bfc.id != id);
        atualizarBotoesFocoCustomizado();
    }
}

function liberarPalmas() {
    abrirPainelParticipantes();
    /* ligar microfone de todos participantes para as palmas */
    ligarMicrofones();
    document.querySelector('.btn-palmas').classList.add('disabled');
    setTimeout(() => {
        desligarMicrofones();
        document.querySelector('.btn-palmas').classList.remove('disabled');
        atualizarTela();
    }, config.palmasEmMilissegundos);
}

function finalizarDiscurso() {
    abrirPainelParticipantes();
    const presidente = selecionarParticipante(idParticipantes.presidente);

    /* desligar video de todos participantes */
    desligarVideos();

    /* ligar microfone de todos participantes para as palmas */
    ligarMicrofones();

    /* desativar botoes durante as palmas para evitar interrupcoes acidentais */
    document.querySelectorAll('.btn-funcionalidade').forEach(btn => btn.classList.add('disabled'));

    /* Aguardar tempo suficiente de palmas */
    setTimeout(() => {
        desligarMicrofones([presidente]);
        document.querySelectorAll('.btn-funcionalidade').forEach(btn => btn.classList.remove('disabled'));
        atualizarTela();
    }, config.palmasEmMilissegundos);

    /* ligar video do presidente antes de acabar as palmas */
    setTimeout(() => ligarVideoParticipante(presidente, () => {
        /* quando o presidente iniciar seu video */
        spotlightParticipante(presidente);
        ligarMicrofoneParticipante(presidente, true);
    }), config.palmasEmMilissegundos / 2);

    atualizarTela();
}

/* IDENTIFICADORES GERAIS */
var idGerais = {
    textoContados: 'texto-contados',
    textoNaoContados: 'texto-nao-contados',
    modal: 'opcoes-reuniao',
    modalCustomizado: 'modal-customizado',
    menuCustomizado: 'menu-de-contexto'
};
/* IDENTIFICADORES DE PARTICIPANTES */
var idParticipantes = {
    dirigente: 'dirigente',
    presidente: 'presidente',
    leitor: 'leitor',
    orador: 'orador',
    tesouros: 'tesouros',
    joias: 'joias',
    biblia: 'biblia',
    'nossa-vida-1': 'nossa-vida-1',
    'nossa-vida-2': 'nossa-vida-2'
};
/* TEXTOS DAS OPCOES */
var textosOpcoes = {
    pararVideo: ['stop video', 'parar vídeo'],
    cancelarSpotlight: ['cancel the spotlight video', 'cancelar vídeo de destaque'],
    ligarMicrofone: ['ask to unmute', 'pedir para ativar som', 'unmute', 'ativar som'],
    desligarMicrofone: ['mute', 'desativar som'],
    abaixarMaos: ['lower hand', 'abaixar mão'],
    renomear: ['rename', 'renomear'],
    expulsar: ['put in waiting room', 'colocar na sala de espera'],
    permitirMicrofones: ['allow participants to unmute themselves', 'permitir que os próprios participantes desativem o mudo'],
    silenciarAoEntrar: ['mute participants on entry', 'desativar som dos participantes ao entrar']
};
/* CONTROLE E CONFIGURACOES */
var intervalosEmExecucao = intervalosEmExecucao || {};
var observador = observador || null;
var observados = observados || {
    comentarista: null,
    salaAberta: false,
    focoAutomatico: false
};
var avisosDeRotinas = avisosDeRotinas || {
    tentativasPersistentes: [],
    validarNomesForaDoPadrao: [],
    validarVideosLigadosNaAssistencia: [],
    validarMicrofonesLigadosNaAssistencia: [],
    botoesFocoCustomizado: [],
};
var config = config || {
    cache: {},
    palmasEmMilissegundos: 8000,
    ultimaMudanca: null,
    ultimaValidacaoFuncao: null,
    eventoLimparMenu: null,
};

/* INICIO DO SCRIPT */
try {
    criarCss();
    desenharModal();
    criarBotaoOpcoesCustomizadas();
    iniciarEventosPainelParticipantes();
} catch (erro) {
    alert('Erro ao executar o script: ' + erro.message);
}
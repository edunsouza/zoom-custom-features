function criarDomListener() {
    if (observer) {
        observer.disconnect();
    }

    observer = new MutationObserver(() => atualizarTela());

    observer.observe(
        document.getElementById('wc-container-right'),
        {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true
        }
    );
}

function criarElemento(text, eventos = {}) {
    const dom = new DOMParser().parseFromString(text.replace(/\s+/g, ' '), 'text/html');
    const elemento = dom.body.children[0] || dom.head.children[0];
    Object.keys(eventos).forEach(k => elemento[k] = eventos[k]);
    return elemento;
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
        .modal-transparente {
            background-color: #ffffff11;
        }
        .modal-transparente * {
            color: #ffffffbb;
        }
        .modal-transparente .btn-warning .material-icons-outlined {
            color: #111111bb;
        }
        .modal-transparente .configuracao, .modal-transparente .config-item {
            background-color: #24282ccf;
        }
        .modal-transparente .frame-rotinas {
            background-color: #21212147;
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
        }
        .div-rotina ul li input[type=checkbox] { margin-right: 5px }
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
        #acoes-rapidas-comentarios .btn-primary {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            line-height: 14px;
            padding: 0px;
        }
        #modal-foco-customizado {
            position: absolute;
            left: 0%;
            top: 0%;
            background-color: #0000008a;
            width: 100%;
            height: 100%;
        }
        .corpo-modal-foco-customizado {
            display: grid;
            grid-template-rows: repeat(7, 60px);
            grid-gap: 10px;
            overflow-y: scroll;
            margin: auto;
            margin-top: 5%;
            padding: 30px;
            height: 80%;
            width: 75%;
            background-color: #ffffffc7;
        }
        .opcoes-modal-foco-customizado {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            align-items: center;
            justify-content: center;
        }
        .opcoes-modal-foco-customizado * { margin: 0 5px; }
        .campos-modal-foco-customizado {
            display: grid;
            grid-template-columns: 3fr 2fr 2fr 2fr 2fr;
            grid-template-rows: 40px 20px;
            align-items: center;
            justify-items: center;
            height: 60px;
        }
        .campos-modal-foco-customizado input ~ i {
            color: #ff4242;
            font-size: 40px;
        }
        .campos-modal-foco-customizado input:checked ~ i {
            color: #5cb85c;
            font-size: 40px;
        }
        .campos-modal-foco-customizado label {
            user-select: none;
            cursor: pointer;
            margin-bottom: 0;
        }
        .campos-modal-foco-customizado input[type="checkbox"] {
            cursor: pointer;
        }
    `;
    document.body.appendChild(css);
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
        fechar: 'cancel',
    };

    id = id ? `id="${id}"` : '';
    return criarElemento(`<i ${id} class="i-sm material-icons-outlined">${tipos[tipo]}</i>`);
}

function criarEventoMouseOver() {
    const eventoFalsoDeMouseOver = new MouseEvent('mouseover', { bubbles: true });
    eventoFalsoDeMouseOver.simulated = true;
    return eventoFalsoDeMouseOver;
}

function getTextoPuro(texto) {
    return !texto ? '' : texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
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

function validarVideosLigadosNaAssistencia() {
    abrirPainelParticipantes();
    avisosDeRotinas['validarVideosLigadosNaAssistencia'] = getParticipantes().reduce((lista, participante) => {
        if (isVideoLigado(participante)) {
            lista.push(getNomeParticipante(participante));
        }
        return lista;
    }, []);
}

function validarMicrofonesLigadosNaAssistencia() {
    abrirPainelParticipantes();
    avisosDeRotinas['validarMicrofonesLigadosNaAssistencia'] = getParticipantes().reduce((lista, participante) => {
        if (isMicrofoneLigado(participante)) {
            lista.push(getNomeParticipante(participante));
        }
        return lista;
    }, []);
}

function atualizarMaosLevantadas() {
    /* lista de maos levantadas */
    const lista = document.querySelector('#maos-comentarios');
    lista.querySelectorAll('*').forEach(li => li.remove());

    const onclick = ({ target }) => {
        const comentarista = selecionarParticipante(target.parentElement.querySelector('span').innerText);
        const noPalco = getParticipantes().filter(p => isVideoLigado(p));
        ligarMicrofoneParticipante(comentarista);
        desligarMicrofones([comentarista, ...noPalco]);
        abaixarMaos([comentarista]);
    }

    /* busca todas maos levantadas e adiciona na lista */
    getParticipantes().forEach(participante => {
        if (isMaoLevantada(participante)) {
            const li = criarElemento(`
                <li>
                    <button class="btn-xs btn-comentaristas">
                        <i class="material-icons-outlined">pan_tool</i>
                        <i class="material-icons-outlined">mic_none</i>
                        <span>${getNomeParticipante(participante)}</span>
                    </button>
                </li>
            `);
            li.querySelector('.btn-comentaristas').onclick = onclick;
            lista.appendChild(li);
        }
    });
}

function admitirEntradaNaSalaComNomeValido() {
    abrirPainelParticipantes();
    Array.from(document.querySelectorAll('.waiting-room-list-conatiner__ul li')).forEach(participante => {
        const nome = getNomeParticipante(participante);
        /* verificar se participante tem nome valido */
        if (isNomeValido(participante)) {
            participante.dispatchEvent(criarEventoMouseOver());
            /* selecionar botao que permite entrada do participante */
            const btnPermitir = participante.querySelector('.btn-primary');
            if (btnPermitir) {
                btnPermitir.click();
            }
        }
    });
}

function validarNomesForaDoPadrao() {
    abrirPainelParticipantes();
    const nomesInvalidos = [];

    getParticipantes().forEach(participante => {
        const nome = getNomeParticipante(participante);
        /* busca por: parenteses, chaves ou colchetes (com ou sem espaco) seguido do numero de pessoas */
        if (!isNomeValido(participante)) {
            nomesInvalidos.push(nome);
        }
    });

    avisosDeRotinas['validarNomesForaDoPadrao'] = nomesInvalidos;
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

function atualizarTela() {
    limparAvisosAntigos();
    validarNomesForaDoPadrao();
    admitirEntradaNaSalaComNomeValido();
    validarVideosLigadosNaAssistencia();
    validarMicrofonesLigadosNaAssistencia();
    atualizarAssistencia();
    atualizarAvisosDeRotinas();
    atualizarMaosLevantadas();
}

function interromperTentativaPersistente(idTentativa) {
    avisosDeRotinas['tentativasPersistentes'] = avisosDeRotinas['tentativasPersistentes'].filter(id => id != idTentativa);
    encerrarRotina(idTentativa);
    atualizarTentativasPersistentes();
}

function atualizarTentativasPersistentes() {
    const ul = document.getElementById(btoa('tentativasPersistentes'));
    ul.querySelectorAll('li').forEach(li => li.remove());

    avisosDeRotinas['tentativasPersistentes'].forEach(alvo => {
        const input = criarElemento(`<input type="checkbox" value="${alvo}"></input>`, {
            onclick: (e) => interromperTentativaPersistente(e.target.value)
        });
        const li = criarElemento(`<li class="checkbox">${alvo}</li>`);
        li.appendChild(input);
        ul.appendChild(li);
    });
}

function atualizarBotoesFocoCustomizado() {
    const ul = document.getElementById(btoa('botoesFocoCustomizado'));
    ul.querySelectorAll('li').forEach(li => li.remove());

    avisosDeRotinas['botoesFocoCustomizado'].forEach(({ nome, click, id, validar }) => {
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

function atualizarAvisosDeRotinas() {
    Object.keys(avisosDeRotinas).forEach(rotina => {
        const novoCache = btoa(avisosDeRotinas[rotina].join(''));

        /* atualizar lista somente se tiver novos dados */
        if (cache[rotina] !== novoCache) {
            const ulRotina = document.getElementById(btoa(rotina));

            /* limpar feed de logs antigos */
            ulRotina.querySelectorAll('li').forEach(li => li.remove());

            if (rotina == 'tentativasPersistentes') {
                atualizarTentativasPersistentes();
                return;
            }

            if (rotina == 'botoesFocoCustomizado') {
                atualizarBotoesFocoCustomizado();
                return;
            }

            /* repopular lista */
            avisosDeRotinas[rotina].forEach(aviso => {
                ulRotina.appendChild(criarElemento(`<li class="zebrado">${aviso}</li>`));
            });

            /* atualizar cache */
            cache[rotina] = novoCache;
        }
    });
}

function atualizarAssistencia() {
    const dadosAssistencia = contarAssistencia();
    const novoCache = btoa(JSON.stringify(dadosAssistencia));
    /* atualizar lista somente se com novas informacoes */
    if (cache['atualizarAssistencia'] !== novoCache) {
        document.getElementById(idTextoContados).innerText = `${dadosAssistencia.contados} identificado(s)`;
        document.getElementById(idTextoNaoContados).innerText = `${dadosAssistencia.naoContados} não identificado(s)`;
        /* atualizar cache */
        cache['atualizarAssistencia'] = novoCache;
    }
}

function limparAvisosAntigos() {
    Object.keys(avisosDeRotinas).forEach(rotina => {
        if (rotina != 'tentativasPersistentes' && avisosDeRotinas[rotina].length > 10) {
            const avisosUnicos = Array.from(new Set(avisosDeRotinas[rotina]));
            avisosDeRotinas[rotina] = avisosUnicos.slice(-10);
        }
    });
}

function dispararRotina(nomeRotina, tempoEmMilissengudos, callback) {
    encerrarRotina(nomeRotina);
    intervalosEmExecucao[nomeRotina] = setInterval(() => callback(), tempoEmMilissengudos);
}

function encerrarRotina(nomeRotina) {
    intervalosEmExecucao[nomeRotina] = clearInterval(intervalosEmExecucao[nomeRotina]);
}

function desenharModal() {
    const modal = document.getElementById(idModal);
    /* limpar componentes anteriores */
    if (modal) modal.remove();

    /* importar icones */
    importarIconesFontAwesome();

    /* construir o quadro inteiro do painel */
    const painelOpcoes = criarElemento(`<div class="modal-principal" id="${idModal}"></div>`);
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
    const modalDrop = document.getElementById(idModalFocoCustomizado) || criarElemento(`<div id="${idModalFocoCustomizado}"></div>`);

    /* limpar modal anterior */
    modalDrop.style.display = 'none';
    modalDrop.querySelectorAll('*').forEach(ipt => ipt.remove());

    /* criar botoes principais */
    const btnAdicionarNovoFoco = criarElemento('<button class="btn btn-success" name="novo-participante">Novo participante</button>', {
        onclick: () => document.querySelector('.corpo-modal-foco-customizado').appendChild(criarCamposModalFocoCustomizado())
    });

    const btnSalvar = criarElemento('<button class="btn btn-primary" name="salvar">Salvar</button>', {
        onclick: () => {
            const camposValidos = validarCamposModalFocoCustomizado();
            if (!camposValidos) return;

            const { participantes, inputNomeFoco } = camposValidos;
            const nomeBtnFoco = getTextoPuro(inputNomeFoco.value);
            const btn = criarBotaoFocoCustomizado(participantes, nomeBtnFoco);

            /* adicionar botao novo, sempre removendo as repeticoes */
            avisosDeRotinas['botoesFocoCustomizado'] = [btn, ...avisosDeRotinas.botoesFocoCustomizado.filter(b => b.id != btn.id)];
            atualizarTela();

            fecharModalFocoCustomizado();
        }
    });

    const btnCancelar = criarElemento('<button class="btn btn-primary-outline" name="cancelar" style="grid-column-start: 5;">Cancelar</button>');

    const inputNomeFocoCustomizado = criarElemento(`
        <div class="input-group" style="margin: auto 5px;">
            <span class="input-group-addon">Informe o nome do botão:</span>
            <input id="nome-foco-customizado" name="nome" type="text" class="form-control" placeholder="Primeira Visita">
        </div>
    `);

    /* eventos fechar modal */
    btnCancelar.onclick = fecharModalFocoCustomizado;
    modalDrop.onclick = ({ target }) => (target != modalDrop) || fecharModalFocoCustomizado();

    /* desenhar modal */
    const cabecalhoModal = criarElemento('<div class="opcoes-modal-foco-customizado"/>');
    cabecalhoModal.appendChild(btnAdicionarNovoFoco);
    cabecalhoModal.appendChild(btnSalvar);
    cabecalhoModal.appendChild(btnCancelar);

    const avisoErroModal = criarElemento(`
        <div class="alert alert-danger" id="aviso-erro-modal" style="display: none; font-size: 18px; margin: auto 0;">
            <span class="glyphicon glyphicon-exclamation-sign"></span>
            <span name="placeholder-erro"></span>
        </div>
    `);

    const modal = criarElemento('<div class="corpo-modal-foco-customizado"/>');
    modal.appendChild(avisoErroModal);
    modal.appendChild(cabecalhoModal);
    modal.appendChild(inputNomeFocoCustomizado);
    modal.appendChild(criarCamposModalFocoCustomizado());

    modalDrop.appendChild(modal);
    return modalDrop;
}

function criarCamposModalFocoCustomizado() {
    const sufixo = btoa(Math.random()).replace(/[^0-9a-zA-Z]/, '');
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
        <div class="campos-modal-foco-customizado">
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
    const inputNomeFoco = document.querySelector(`#${idModalFocoCustomizado} input[name="nome"]`);
    const participantes = [];

    if (!inputNomeFoco.value) {
        inputNomeFoco.classList.add(estiloErro);
        avisoErro.innerText = 'Informe nome para o novo botão. Preencha o(s) campo(s) em vermelho';
        avisoErro.parentElement.style.display = 'block';
        return;
    }

    abrirPainelParticipantes();

    document.querySelectorAll(`#${idModalFocoCustomizado} .campos-modal-foco-customizado`).forEach(campos => {
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
    const palmasEmSegundos = tempoDePalmas / 1000;
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
            nome: 'Abaixar mãos',
            icone: 'mao',
            classe: 'btn-success',
            click: abaixarMaos
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
    const textoContados = criarElemento(`<span id="${idTextoContados}">${dadosAssistencia.contados} identificado(s)</span>`);
    const textoNaoContados = criarElemento(`<span id="${idTextoNaoContados}">${dadosAssistencia.naoContados} não identificado(s)</span>`);

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
        onchange: (evento) => alternarModoTransparente(evento)
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
                <button class="btn btn-xs btn-primary">
                    Silenciar
                    <span>(exceto videos ligados)</span>
                </button>
                <button class="btn btn-xs btn-success">Abaixar mãos</button>
            </div>
            <ul id="maos-comentarios"></ul>
        </div>
    `));
    /* botoes de acao rapida */
    servicos.querySelector('.btn-primary').onclick = silenciarComentaristas;
    servicos.querySelector('.btn-success').onclick = abaixarMaos;

    return servicos;
}

function getBotoesParticipantes() {
    const capital = str => str[0].toUpperCase() + str.substring(1, str.length);
    const isReuniaoSemana = new Date().toLocaleDateString('pt-br', { weekday: 'long' }).includes('feira');
    const botoesFocar = [
        { nome: capital(identificacaoDirigente), icone: 'dirigente', classe: 'btn-primary', click: focarDirigente },
        { nome: capital(identificacaoLeitor), icone: 'leitor', classe: 'btn-primary', click: focarLeitor },
        { nome: capital(identificacaoPresidente), icone: 'presidente', classe: 'btn-warning', click: focarPresidente },
        !isReuniaoSemana && { nome: capital(identificacaoOrador), icone: 'orador', classe: 'btn-primary', click: focarOrador },
        isReuniaoSemana && { nome: capital(identificacaoTesouros), icone: 'tesouros', classe: 'btn-primary', click: () => focar(identificacaoTesouros) },
        isReuniaoSemana && { nome: capital(identificacaoJoias), icone: 'joias', classe: 'btn-primary', click: () => focar(identificacaoJoias) },
        isReuniaoSemana && { nome: capital(identificacaoBiblia), icone: 'biblia', classe: 'btn-primary', click: () => focar(identificacaoBiblia) },
        isReuniaoSemana && { nome: capital(identificacaoVida1), icone: 'vida1', classe: 'btn-primary', click: () => focar(identificacaoVida1) },
        isReuniaoSemana && { nome: capital(identificacaoVida2), icone: 'vida2', classe: 'btn-primary', click: () => focar(identificacaoVida2) },
    ];
    return {
        focar: botoesFocar.filter(Boolean),
        chamar: botoesFocar.reduce((lista, btn) => {
            if (btn) lista.push({
                nome: btn.nome,
                classe: btn.nome.toLowerCase() != identificacaoPresidente ? 'btn-success' : 'btn-warning',
                click: () => chamar(btn.nome.toLowerCase())
            });
            return lista;
        }, [])
    };
}

function importarIconesFontAwesome() {
    const importIcones = document.querySelector('#icones');
    /* nao duplicar tag de import dos icones */
    if (!importIcones) {
        const url = 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined';
        document.head.appendChild(criarElemento(`<link rel="stylesheet" href="${url}" id="icones"> </link>`));
    }
}

function alternarModal() {
    const modal = document.getElementById(idModal);
    if (modal.style.display == 'none') {
        modal.removeAttribute('style');
    } else {
        fecharModal();
    }
}

function fecharModal() {
    document.getElementById(idModal).style.display = 'none';
}

function abrirModalFocoCustomizado() {
    desenharModalFocoCustomizado();
    document.getElementById(idModalFocoCustomizado).style.display = 'block';
}

function fecharModalFocoCustomizado() {
    const modal = document.getElementById(idModalFocoCustomizado);
    modal.querySelectorAll('*').forEach(i => i.remove());
    modal.style.display = 'none';
}

function alternarModoTransparente(evento) {
    const modal = document.getElementById(idModal);
    if (evento.target.checked) {
        modal.classList.add('modal-transparente');
    } else {
        modal.classList.remove('modal-transparente');
    }
}

function abrirPainelParticipantes() {
    if (!document.querySelector('.participants-header__title')) {
        document.querySelector('.footer-button__participants-icon').click();
        criarDomListener();
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

function selecionarParticipante(funcao) {
    if (!funcao) return;
    return getParticipantes().find(participante => {
        const nome = getTextoPuro(getNomeParticipante(participante));
        return nome && nome.includes(getTextoPuro(funcao));
    });
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
        .some(btn => textoDesligarMicrofone.includes(btn.innerText.toLowerCase()));
}

function isVideoLigado(participante) {
    if (!participante) return false;
    participante.dispatchEvent(criarEventoMouseOver());
    return getBotoesDropdown(participante).some(btn => textoPararVideo.includes(btn.innerText.toLowerCase()));
}

function isSpotlightLigado(participante) {
    if (!participante) return false;
    participante.dispatchEvent(criarEventoMouseOver());
    return getBotoesDropdown(participante).some(btn => textoCancelarSpotlight.includes(btn.innerText.toLowerCase()));
}

function isMaoLevantada(participante) {
    return participante && Array
        .from(participante.querySelectorAll('.participants-item__buttons button.button-margin-right'))
        .some(btn => textoAbaixarMaos.includes(btn.innerText.toLowerCase()));
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

function ligarMicrofoneParticipante(participante, tentativaPersistente) {
    const nomeRotina = `ligar_som_${getNomeParticipante(participante)}`;

    /* cancelar nova tentativa se participante ja ligou microfone */
    if (isMicrofoneLigado(participante)) {
        encerrarRotina(nomeRotina);
        atualizarTela();
        return;
    }

    clickBotao(participante, textoLigarMicrofone);

    if (participante && tentativaPersistente) {
        /* iniciar temporizador para aguardar participante liberar microfone */
        dispararRotina(nomeRotina, 2000, () => {
            if (isMicrofoneLigado(participante)) {
                avisosDeRotinas['tentativasPersistentes'] = avisosDeRotinas['tentativasPersistentes'].filter(tentativa => tentativa != nomeRotina);
                encerrarRotina(nomeRotina);
                atualizarTela();
            } else {
                /* registrar log de tentativa em andamento */
                if (!avisosDeRotinas['tentativasPersistentes'].includes(nomeRotina)) {
                    avisosDeRotinas['tentativasPersistentes'].push(nomeRotina);
                    atualizarTela();
                }

                clickBotao(participante, textoLigarMicrofone);
            }
        });
    }
}

function desligarMicrofoneParticipante(participante) {
    clickBotao(participante, textoDesligarMicrofone);
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
                avisosDeRotinas['tentativasPersistentes'] = avisosDeRotinas['tentativasPersistentes'].filter(aviso => aviso != nomeRotina);
                encerrarRotina(nomeRotina);
                atualizarTela();
                callback();
            } else {
                /* registrar log de tentativa em andamento */
                if (!avisosDeRotinas['tentativasPersistentes'].includes(nomeRotina)) {
                    avisosDeRotinas['tentativasPersistentes'].push(nomeRotina);
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

function desligarVideoParticipante(participante) {
    clickDropdown(participante, textoPararVideo);
}

function spotlightParticipante(participante) {
    clickDropdown(participante, ['spotlight video', 'vídeo de destaque']);
}

function desligarSpotlight() {
    abrirPainelParticipantes();
    getParticipantes().some(participante => {
        if (isSpotlightLigado(participante)) {
            clickDropdown(participante, textoCancelarSpotlight);
            return true;
        }
    });
}

function ligarMicrofones() {
    abrirPainelParticipantes();
    getParticipantes().forEach(participante => ligarMicrofoneParticipante(participante));
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

function abaixarMaos(excecoes) {
    abrirPainelParticipantes();
    excecoes = Array.isArray(excecoes) ? excecoes.map(p => getNomeParticipante(p)) : [];
    getParticipantes().forEach(participante => {
        /* abaixar mao de todos participantes que nao estejam na lista de excecoes */
        if (!excecoes.includes(getNomeParticipante(participante))) {
            const btn = Array.from(participante.querySelectorAll('.participants-item__buttons .button-margin-right')).find(btn => {
                return textoAbaixarMaos.includes(btn.innerText.toLowerCase());
            });

            btn && btn.click();
        }
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

function permitirParticipantesLigarMicrofones(permitir) {
    try {
        const opcaoPermitirMicrofones = getOpcaoDropdownMais([
            'allow participants to unmute themselves',
            'permitir que os próprios participantes desativem o mudo'
        ]);
        const isAtivo = opcaoPermitirMicrofones.querySelector('.i-ok-margin');

        /* clicar na opcao somente se nao estiver como deveria */
        if ((permitir && !isAtivo) || (!permitir && isAtivo)) {
            opcaoPermitirMicrofones.click();
        }
    } catch {
        alert('opção "permitir que os próprios participantes desativem o mudo" não encontrada');
    }
}

/* FUNCOES AVANCADAS */

function focarDirigente() {
    abrirPainelParticipantes();
    const dirigente = selecionarParticipante(identificacaoDirigente);
    const presidente = selecionarParticipante(identificacaoPresidente);
    const leitor = selecionarParticipante(identificacaoLeitor);

    if (!dirigente) {
        return alert(`Dirigente não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: Anthony Morris - ${identificacaoDirigente}`);
    }

    /* desligar video de todos participantes, exceto dirigente, leitor e presidente */
    desligarVideos([dirigente, leitor, presidente]);

    /* silenciar todos exceto dirigente e leitor */
    desligarMicrofones([dirigente, leitor]);

    /* ligar video do dirigente */
    ligarVideoParticipante(dirigente, () => {
        const dirigente = selecionarParticipante(identificacaoDirigente);
        /* quando o dirigente iniciar seu video */
        spotlightParticipante(dirigente);
        ligarMicrofoneParticipante(dirigente, true);
        /* para evitar distracoes com autofoco, manter o presidente em foco ate que dirigente inicie seu video */
        desligarVideoParticipante(selecionarParticipante(identificacaoPresidente));
    });
}

function focarLeitor() {
    abrirPainelParticipantes();
    const leitor = selecionarParticipante(identificacaoLeitor);
    const dirigente = selecionarParticipante(identificacaoDirigente);

    if (!leitor) {
        return alert(`Leitor não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: David Splane - ${identificacaoLeitor}`);
    }

    /* desligar video de todos participantes, exceto dirigente e leitor */
    desligarVideos([dirigente, leitor]);

    /* silenciar todos participantes, exceto leitor e dirigente */
    desligarMicrofones([leitor, dirigente]);

    /* ligar video do leitor */
    ligarVideoParticipante(leitor, () => {
        /* quando o leitor iniciar seu video */
        spotlightParticipante(leitor);
        ligarMicrofoneParticipante(leitor, true);
    });
}

function focarPresidente() {
    abrirPainelParticipantes();
    const presidente = selecionarParticipante(identificacaoPresidente);

    if (!presidente) {
        return alert(`Presidente não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: Geoffrey Jackson - ${identificacaoPresidente}`);
    }

    /* silenciar todos participantes, exceto presidente */
    desligarMicrofones([presidente]);

    /* ligar video do presidente */
    ligarVideoParticipante(presidente, () => {
        /* quando o presidente iniciar seu video */
        ligarMicrofoneParticipante(presidente, true);
        spotlightParticipante(presidente);
        desligarVideos([presidente]); /* exceto presidente */
    });
}

function focarOrador() {
    abrirPainelParticipantes();
    const orador = selecionarParticipante(identificacaoOrador);

    if (!orador) {
        return alert(`Orador não informado.\nCom permissão de anfitrião (host) identifique-o renomeando.\nExemplo: Gerrit Losch - ${identificacaoOrador}`);
    }

    /* desligar video de todos participantes, exceto orador */
    desligarVideos([orador]);

    /* silenciar todos participantes, exceto orador */
    desligarMicrofones([orador]);

    /* ligar video do orador */
    ligarVideoParticipante(orador, () => {
        /* quando o orador iniciar seu video */
        spotlightParticipante(orador);
        ligarMicrofoneParticipante(orador, true);
    });
}

function focar(funcao) {
    abrirPainelParticipantes();
    const alvo = selecionarParticipante(funcao);

    if (!funcao || !alvo) return alert(`Participante: "${funcao}" não encontrado`);

    /* ligar video do participante informado */
    ligarVideoParticipante(alvo, () => {
        const participante = selecionarParticipante(funcao);
        /* quando o participante informado iniciar seu video */
        desligarVideos([participante]);
        desligarMicrofones([participante]);
        spotlightParticipante(participante);
        ligarMicrofoneParticipante(participante, true);
    });
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
        avisosDeRotinas['botoesFocoCustomizado'] = avisosDeRotinas['botoesFocoCustomizado'].filter(bfc => bfc.id != id);
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
    }, tempoDePalmas);
}

function finalizarDiscurso() {
    abrirPainelParticipantes();
    const presidente = selecionarParticipante(identificacaoPresidente);

    /* desligar video de todos participantes */
    desligarVideos();

    /* ligar microfone de todos participantes para as palmas */
    ligarMicrofones();

    /* desativar botoes durante as palmas para evitar interrupcoes acidentais */
    document.querySelectorAll('.btn-funcionalidade').forEach(btn => btn.classList.add('disabled'));

    /* Aguardar tempo suficiente de palmas (8 segundos) */
    setTimeout(() => {
        desligarMicrofones([presidente]);
        document.querySelectorAll('.btn-funcionalidade').forEach(btn => btn.classList.remove('disabled'));
        atualizarTela();
    }, tempoDePalmas);

    /* ligar video do presidente antes de acabar as palmas */
    setTimeout(() => ligarVideoParticipante(presidente, () => {
        /* quando o presidente iniciar seu video */
        spotlightParticipante(presidente);
        ligarMicrofoneParticipante(presidente, true);
    }), tempoDePalmas / 2);

    atualizarTela();
}

function desligarTudo() {
    abrirPainelParticipantes();
    desligarVideos();
    desligarMicrofones();
    permitirParticipantesLigarMicrofones(false);
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

/* INICIO DO SCRIPT */
var idTextoContados = 'texto-contados';
var idTextoNaoContados = 'texto-nao-contados';
var idModal = 'opcoes-reuniao';
var idModalFocoCustomizado = 'modal-foco-customizado';
var tempoDePalmas = 8000;

/* PALAVRAS-CHAVE PARA ENCONTRAR PARTICIPANTES (NOMEAR PARTICIPANTE COM CHAVES ABAIXO) */
var identificacaoDirigente = 'dirigente';
var identificacaoPresidente = 'presidente';
var identificacaoLeitor = 'leitor';
var identificacaoOrador = 'orador';
var identificacaoTesouros = 'tesouros';
var identificacaoJoias = 'joias';
var identificacaoBiblia = 'biblia';
var identificacaoVida1 = 'nossa-vida-1';
var identificacaoVida2 = 'nossa-vida-2';

var textoPararVideo = ['stop video', 'parar vídeo'];
var textoCancelarSpotlight = ['cancel the spotlight video', 'cancelar vídeo de destaque'];
var textoLigarMicrofone = ['ask to unmute', 'pedir para ativar som', 'unmute', 'ativar som'];
var textoDesligarMicrofone = ['mute', 'desativar som'];
var textoAbaixarMaos = ['lower hand', 'abaixar mão'];

var intervalosEmExecucao = intervalosEmExecucao || {};
var cache = {};
var avisosDeRotinas = {
    tentativasPersistentes: [],
    validarNomesForaDoPadrao: [],
    validarVideosLigadosNaAssistencia: [],
    validarMicrofonesLigadosNaAssistencia: [],
    botoesFocoCustomizado: avisosDeRotinas ? avisosDeRotinas['botoesFocoCustomizado'] : [],
};

/* RESPONSAVEL POR OUVIR MUDANCAS NO PAINEL DOS PARTICIPANTES */
var observer = observer || null;

criarCss();
desenharModal();
criarBotaoOpcoesCustomizadas();
iniciarEventosPainelParticipantes();

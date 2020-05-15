function iniciarEventosDeRotina() {
    rotina_validarVideosLigadosNaAssistencia();
    rotina_admitirEntradaNaSalaComNomeValido();
    rotina_validarNomesForaDoPadrao();
    rotina_verificarOpcoesDaSala();

    dispararRotina('rotinasEmSegundoPlano', 5000, () => {
        try {
            /* limpar avisos antigos */
            Object.keys(avisosDeRotinas).forEach(rotina => avisosDeRotinas[rotina] = avisosDeRotinas[rotina].slice(-10));
            logarUltimasAtividades();
            console.log(avisosDeRotinas);

            /*
            var rotinas = document.querySelector('#rotinas-background');
            rotinas.innerHTML = '';
            getListasDeRotinas().forEach(ul => rotinas.appendChild(ul));
            */
        } catch (error) {
            console.log(error);
        }
    });
}

function logarUltimasAtividades() {
    var divRotinas = document.querySelector('#ultimos-logs');
    var logs = [];

    /* limpar feed de logs antigos */
    document.querySelectorAll('#ultimos-logs li').forEach(li => li.remove());

    Object.keys(avisosDeRotinas).forEach(avisosRotinaX => {
        logs = logs.concat(avisosDeRotinas[avisosRotinaX].slice(-5));
    });

    logs.forEach(log => {
        var li = document.createElement('li');
        li.innerText = log;
        divRotinas.appendChild(li);
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
    /* limpar componentes anteriores */
    if (document.querySelector('#modal-opcoes-reuniao')) document.querySelector('#modal-opcoes-reuniao').remove();
    if (document.querySelector('#opcoes-reuniao')) document.querySelector('#opcoes-reuniao').remove();

    var backdrop = desenharModalBackdrop();
    var painelOpcoes = desenharPainelPrincipal();

    /* posicionar acima de tudo e esconder modal ao iniciar script */
    painelOpcoes.style.zIndex = backdrop.style.zIndex + 1;
    painelOpcoes.style.display = 'none';
    backdrop.style.display = 'none';

    /* adicionar na tela */
    document.body.appendChild(backdrop);
    document.body.appendChild(painelOpcoes);
}

function desenharModalBackdrop() {
    var backdrop = document.createElement('div');
    backdrop.id = 'modal-opcoes-reuniao';
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0px';
    backdrop.style.left = '0px';
    backdrop.style.height = `${window.screen.height}px`;
    backdrop.style.width = `${window.screen.width}px`;
    backdrop.style.backgroundColor = 'black';
    backdrop.style.opacity = '0.7';

    /* posicionar backdrop acima de toda tela */
    var zIndexes = Array.from(document.querySelectorAll('body *')).filter(e => !!e.style.zIndex);
    backdrop.style.zIndex = 1 + Math.max.apply(null, zIndexes.map(e => parseInt(e.style.zIndex)));

    /* fechar modal clicando fora do conteudo */
    backdrop.onclick = (evento) => evento.srcElement.id == backdrop.id && fecharModal();

    return backdrop;
}

function desenharPainelPrincipal() {
    /* importar icones */
    importarIconesFontAwesome();

    /* construir o quadro inteiro do painel */
    var painelOpcoes = document.createElement('div');
    painelOpcoes.id = 'opcoes-reuniao';
    painelOpcoes.style.cssText = `
        display: grid;
        grid-template-columns: 2fr 1fr;
        position: fixed;
        top: 5%;
        left: 10%;
        width: 1190px;
        height: 550px;
        background-color: #edf2f7e6;
        border-radius: 10px;
    `;

    var frameBotoes = desenharFrameBotoes();
    var frameServicos = desenharFrameServicos();

    /* adicionar os frames ao painel */
    painelOpcoes.appendChild(frameBotoes);
    painelOpcoes.appendChild(frameServicos);
    return painelOpcoes;
}

function desenharFrameBotoes() {
    var funcionalidades = [
        { nome: 'Ligar vídeos e som', icone: 'camera,microfone', classe: 'btn-danger', click: ligarTudo, confirmar: 'Tem certeza que deseja LIGAR TODOS OS VÍDEOS E MICROFONES?' },
        { nome: 'Desligar vídeos e som', icone: 'cameraFechada,microfoneFechado', classe: 'btn-danger', click: desligarTudo, confirmar: 'Tem certeza que deseja DESLIGAR TODOS OS VÍDEOS E MICROFONES?' },
        { nome: 'Focar em qualquer um', icone: 'participante', classe: 'btn-danger', click: customizarFoco },
        { nome: 'Finalizar discurso', icone: 'finalizarDiscurso', classe: 'btn-danger', click: finalizarDiscurso, confirmar: 'Tem certeza que deseja FINALIZAR O DISCURSO?\nOs microfones serão ligados (por alguns segundos) para as palmas.' },
        { nome: 'Focar no presidente', icone: 'presidente', classe: 'btn-primary', click: focarNoPresidente },
        { nome: 'Focar no orador', icone: 'orador', classe: 'btn-primary', click: focarNoOrador },
        { nome: 'Focar no dirigente', icone: 'dirigente', classe: 'btn-primary', click: focarNoDirigente },
        { nome: 'Focar no leitor', icone: 'leitor', classe: 'btn-primary', click: focarNoLeitor },
        { nome: 'Contar assistência', icone: 'assistencia', classe: 'btn-success', click: contarAssitencia },
    ];

    /* construir botoes principais */
    var botoes = funcionalidades.map(func => {
        var btn = document.createElement('button');
        btn.innerText = func.nome;
        btn.onclick = () => !func.confirmar ? func.click() : confirm(`CUIDADO!\n\n${func.confirmar}\n\nClique em cancelar para desfazer`) && func.click();
        btn.setAttribute('class', `btn ${func.classe}`);
        btn.style.cssText = `
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            justify-content: space-evenly;
            width: 95%;
            height: 90%;
            margin: auto;
            font-size: 20px;
            font-weight: 600;
            opacity: 0.8;
        `;

        if (func.icone) {
            var div = document.createElement('div');
            func.icone.split(',').forEach(i => div.appendChild(criarIcone(i)));
            btn.appendChild(div);
        }

        return btn;
    });

    /* construtir o frame com botoes */
    var frameBotoes = document.createElement('div');
    frameBotoes.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(6, 1fr);
        grid-gap: 5px;
        padding: 10px;
    `;

    /* adicionar os botoes no frame */
    botoes.forEach(btn => frameBotoes.appendChild(btn));

    return frameBotoes;
}

function desenharFrameServicos() {
    var btnFechar = criarIcone('fechar', 'btn-fechar-modal');
    btnFechar.onclick = fecharModal;
    btnFechar.style.position = 'relative';
    btnFechar.style.left = '86%';
    btnFechar.style.top = '0%';
    btnFechar.style.opacity = '0.7';
    btnFechar.style.fontSize = '50px';

    var listaAvisos = document.createElement('ul');
    listaAvisos.id = 'ultimos-logs';

    /* bloco dos servicos */
    var servicos = document.createElement('div');
    servicos.id = 'rotinas-background';

    /* adicionar a lista de avisos */
    servicos.appendChild(listaAvisos);

    /* getListasDeRotinas().forEach(ul => servicos.appendChild(ul)); */

    /* construtir o frame com servicos */
    var frameServicos = document.createElement('div');
    frameServicos.appendChild(btnFechar);
    frameServicos.appendChild(servicos);

    return frameServicos;
}

function getListasDeRotinas() {
    var listaServicos = [];

    Object.keys(avisosDeRotinas).forEach(nome => {
        var rotinas = avisosDeRotinas[nome];
        var ul = document.createElement('ul');
        ul.style.listStyleType = 'none';

        rotinas.forEach(linha => {
            var li = document.createElement('li');
            li.innerText = linha;
            li.onClick = () => { console.log('click não implementado ainda') };

            ul.appendChild(li);
        });

        listaServicos.push(ul);
    });

    return listaServicos;
}

function importarIconesFontAwesome() {
    if (document.querySelector('#icones')) document.querySelector('#icones').remove();
    var link = document.createElement('link');
    link.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('id', 'icones');
    document.head.appendChild(link);
}

function criarIcone(tipo, id) {
    if (!tipo) return;

    var tipos = {
        camera: 'videocam',
        cameraFechada: 'videocam_off',
        microfone: 'mic_none',
        microfoneFechado: 'mic_off',
        orador: 'record_voice_over',
        finalizarDiscurso: 'voice_over_off',
        presidente: 'person',
        participante: 'face',
        dirigente: 'group',
        leitor: 'supervisor_account',
        assistencia: 'airline_seat_recline_normal',
        cadeado: 'lock',
        desativado: 'toggle_off',
        ativado: 'toggle_on',
        fechar: 'cancel',
    };
    var icone = document.createElement('i');
    if (id) icone.id = id;
    icone.setAttribute('class', 'material-icons-outlined');
    icone.style.fontSize = '60px';
    icone.style.cursor = 'pointer';
    icone.innerText = tipos[tipo];
    return icone;
}

function abrirModal() {
    document.querySelector('#opcoes-reuniao').style.display = 'grid';
    document.querySelector('#modal-opcoes-reuniao').style.display = 'block';
}

function fecharModal() {
    document.querySelector('#modal-opcoes-reuniao').style.display = 'none';
    document.querySelector('#opcoes-reuniao').style.display = 'none';
}

function abrirPainelParticipantes() {
    if (!document.querySelector('.participants-header__title')) {
        document.querySelector('.footer-button__participants-icon').click();
    }
}

function getParticipantes() {
    return Array.from(document.querySelectorAll('.item-pos.participants-li'));
}

function getNomeParticipante(participante) {
    return !participante ? '' : participante.querySelector('.participants-item__display-name').innerText;
}

function getBotoesDropdown(participante) {
    return !participante ? [] : Array.from(participante.querySelectorAll('.participants-item__buttons .dropdown-menu a'));
}

function criarEventoMouseOver() {
    var eventoFalsoDeMouseOver = new MouseEvent('mouseover', { bubbles: true });
    eventoFalsoDeMouseOver.simulated = true;
    return eventoFalsoDeMouseOver;
}

function selecionarParticipante(funcao) {
    return getParticipantes().find(participante => {
        var nome = getNomeParticipante(participante);
        return nome && nome.toLowerCase().includes(funcao);
    });
}

function isVideoLigado(participante) {
    if (!participante) return false;
    participante.dispatchEvent(criarEventoMouseOver());
    return getBotoesDropdown(participante)
        .some(btn => btn && ['stop video', 'parar vídeo'].includes(btn.innerText.toLowerCase()));
}

function clickBotao(participante, textosBotao, mensagemErro) {
    if (!participante) return console.log(mensagemErro || 'Um click em botão foi perdido');
    participante.dispatchEvent(criarEventoMouseOver());
    Array.from(participante.querySelectorAll('.participants-item__buttons button')).some(btn => (
        btn && textosBotao.includes(btn.innerText.toLowerCase()) && !btn.click()
    ));
}

function clickDropdown(participante, textosBotao, mensagemErro) {
    if (!participante) return console.log(mensagemErro || 'Um click em dropdown foi perdido');
    participante.dispatchEvent(criarEventoMouseOver());
    getBotoesDropdown(participante).some(btn => btn && textosBotao.includes(btn.innerText.toLowerCase()) && !btn.click());
}

function ligarMicrofoneParticipante(participante) {
    clickBotao(
        participante,
        ['unmute', 'ativar som'],
        'Não foi possível LIGAR o áudio! Verifique o nome do participante.'
    );
}

function desligarMicrofoneParticipante(participante) {
    clickBotao(
        participante,
        ['mute', 'desativar som'],
        'Não foi possível DESLIGAR o áudio! Verifique o nome do participante.'
    );
}

function ligarVideoParticipante(participante, callback) {
    /* se o video ja estiver ligado, seguir para proximas instrucoes */
    if (isVideoLigado(participante)) return callback && callback();

    var textosBotao = ['ask for start video', 'start video', 'pedir para iniciar vídeo', 'iniciar vídeo'];
    var mensagemErro = 'Não foi possível LIGAR o vídeo! Verifique o nome do participante.';

    clickDropdown(participante, textosBotao, mensagemErro);

    /* se houverem instrucoes para executar apos video ser ligado, ativa um temporizador */
    if (participante && callback) {
        var nome = getNomeParticipante(participante);

        /* iniciar temporizador para aguardar participante liberar video */
        var repeticoes = 0;
        dispararRotina(nome, 500, () => {
            repeticoes++;
            if (isVideoLigado(participante)) {
                encerrarRotina(nome);
                callback();
            } else if (repeticoes >= 10) { /* aguardar tempo suficiente para nova tentativa */
                repeticoes = 0;
                clickDropdown(participante, textosBotao, mensagemErro);
                /* registrar log de tentativa em andamento */
                var momento = new Date().toLocaleString('pt-br').split(' ')[1];
                avisosDeRotinas['tentativaAbrirVideo'].push(`Tentando ligar vídeo de: ${nome}. Horário da tentativa: ${momento}`);
            }
        });
    }
}

function desligarVideoParticipante(participante) {
    clickDropdown(
        participante,
        ['stop video', 'parar vídeo'],
        'Não foi possível DESLIGAR o vídeo! Verifique o nome do participante.'
    );
}

function spotlightParticipante(participante) {
    clickDropdown(participante,
        ['spotlight video', 'vídeo de destaque'],
        'Não foi possível ACIONAR SPOTLIGHT! Verifique o nome do participante.'
    );
}

function ligarMicrofones() {
    var textos = ['mute all', 'unmute all', 'desativar som de todos', 'ativar som de todos'];
    var textosMuteAll = ['mute all', 'desativar som de todos'];
    var btn = Array
        .from(document.querySelectorAll('.participants-section-container__participants-footer button'))
        .find(btn => textos.includes(btn.innerText.toLowerCase()));

    if (!btn) return;

    /* se botao estiver na opcao silenciar todos, entao sera preciso desligar para depois ligar microfones */
    if (textosMuteAll.includes(btn.innerText.toLowerCase())) {
        /* abrir modal para silenciar todos */
        btn.click();

        var btnConfirmarMute = document.querySelector('.zm-modal-footer-default-actions .zm-btn--primary');
        var checkboxPermitirUnmute = document.querySelector('.zm-modal-footer-default-checkbox .zm-checkbox');

        /* desmarcar a opcao 'participantes desativem o mudo' */
        if (checkboxPermitirUnmute) {
            checkboxPermitirUnmute.setAttribute('aria-checked', 'false');
            checkboxPermitirUnmute.removeAttribute('class');
            checkboxPermitirUnmute.setAttribute('class', 'zm-checkbox');
        }

        /* confirmar opcao silenciar todos para que surja a opcao para liberar microfones */
        btnConfirmarMute && btnConfirmarMute.click();
    }

    /* por fim, liberar todos os microfones */
    btn.click();
}

function desligarMicrofones(execoes) {
    abrirPainelParticipantes();
    execoes = Array.isArray(execoes) ? execoes.map(p => getNomeParticipante(p)) : [];

    getParticipantes().forEach(participante => {
        /* silenciar todos participantes que nao estejam na lista de excecoes */
        if (!execoes.includes(getNomeParticipante(participante))) {
            desligarMicrofoneParticipante(participante);
        }
    });
}

function desligarVideos(execoes) {
    abrirPainelParticipantes();
    execoes = Array.isArray(execoes) ? execoes.map(p => getNomeParticipante(p)) : [];

    getParticipantes().forEach(participante => {
        /* desligar video de todos participantes que nao estejam na lista de excecoes */
        if (!execoes.includes(getNomeParticipante(participante))) {
            desligarVideoParticipante(participante);
        }
    });
}

/* FUNCOES AVANCADAS */

function focarNoDirigente() {
    abrirPainelParticipantes();
    var dirigente = selecionarParticipante('dirigente');
    var presidente = selecionarParticipante('presidente');
    var leitor = selecionarParticipante('leitor');

    /* desligar video de todos participantes, exceto dirigente, leitor e presidente */
    desligarVideos([dirigente, leitor, presidente]);

    /* silenciar todos exceto dirigente */
    desligarMicrofones([dirigente]);

    /* ligar video do dirigente */
    ligarVideoParticipante(dirigente, () => {
        /* quando o dirigente iniciar seu video */
        spotlightParticipante(dirigente);
        ligarMicrofoneParticipante(dirigente);
        /* para evitar distracoes com autofoco, manter o presidente em foco ate que dirigente inicie seu video */
        desligarVideoParticipante(presidente);
    });
}

function focarNoLeitor() {
    abrirPainelParticipantes();
    var leitor = selecionarParticipante('leitor');
    var dirigente = selecionarParticipante('dirigente');

    /* desligar video de todos participantes, exceto dirigente e leitor */
    desligarVideos([dirigente, leitor]);

    /* silenciar todos participantes, exceto leitor */
    desligarMicrofones([leitor]);

    /* ligar video do leitor */
    ligarVideoParticipante(leitor, () => {
        /* quando o leitor iniciar seu video */
        spotlightParticipante(leitor);
        ligarMicrofoneParticipante(leitor);
    });
}

function focarNoPresidente() {
    abrirPainelParticipantes();
    var presidente = selecionarParticipante('presidente');

    /* silenciar todos participantes, exceto presidente */
    desligarMicrofones([presidente]);

    /* ligar video do presidente */
    ligarVideoParticipante(presidente, () => {
        /* quando o presidente iniciar seu video */
        ligarMicrofoneParticipante(presidente);
        spotlightParticipante(presidente);
        desligarVideos([presidente]); /* exceto presidente */
    });
}

function focarNoOrador() {
    abrirPainelParticipantes();
    var orador = selecionarParticipante('orador');

    /* desligar video de todos participantes, exceto orador */
    desligarVideos([orador]);

    /* silenciar todos participantes, exceto orador */
    desligarMicrofones([orador]);

    /* ligar video do orador */
    ligarVideoParticipante(orador, () => {
        /* quando o orador iniciar seu video */
        spotlightParticipante(orador);
        ligarMicrofoneParticipante(orador);
    });
}

function customizarFoco() {
    abrirPainelParticipantes();
    var nome = prompt('Informe como (nome ou palavra no nome) encontrar o participante.\n\n(Dica: use uma identificação única)\nBOA SORTE AO DIGITAR!');
    if (!nome) return;
    var alvo = selecionarParticipante(nome);

    /* desligar video de todos participantes, exceto participante informado */
    desligarVideos([alvo]);

    /* silenciar todos participantes, exceto participante informado */
    desligarMicrofones([alvo]);

    /* ligar video do participante informado */
    ligarVideoParticipante(alvo, () => {
        /* quando o participante informado iniciar seu video */
        spotlightParticipante(alvo);
        ligarMicrofoneParticipante(alvo);
    });
}

function finalizarDiscurso() {
    abrirPainelParticipantes();
    var presidente = selecionarParticipante('presidente');

    /* desligar video de todos participantes */
    desligarVideos();

    /* ligar microfone de todos participantes para as palmas */
    ligarMicrofones();

    /* Aguardar tempo suficiente de palmas (8 segundos) */
    setTimeout(() => desligarMicrofones(), 8000);

    /* ligar video do presidente antes de acabar as palmas */
    setTimeout(() => ligarVideoParticipante(presidente, () => {
        /* quando o presidente iniciar seu video */
        spotlightParticipante(presidente);
        ligarMicrofoneParticipante(presidente);
    }), 4000);

    alert('Aguarde!\nApós as palmas, o presidente será automaticamente acionado.\nAguarde até o presidente anunciar o dirgente.');
}

/* desligar videos e microfones */
function desligarTudo() {
    abrirPainelParticipantes();
    desligarVideos();
    desligarMicrofones();
}

function ligarTudo() {
    abrirPainelParticipantes();
    getParticipantes().forEach(participante => ligarVideoParticipante(participante));
    ligarMicrofones();
}

function contarAssitencia() {
    abrirPainelParticipantes();
    var assistencia = 0;
    var nomesForaPadrao = [];

    document.querySelectorAll('.participants-item__display-name').forEach(x => {
        var participantes = parseInt(x.innerText.replace(/\(|\{|\[/, '').trim());
        if (participantes > 0) {
            assistencia += participantes;
        } else {
            nomesForaPadrao.push(x.innerText);
        };
    });

    var erros = !nomesForaPadrao.length ? '' : `${nomesForaPadrao.length} nomes inválidos:\n${nomesForaPadrao.join('\n')}`;

    alert(`ASSISTÊNCIA IDENTIFICADA: === ${assistencia} ===\nContando apenas nomes no padrão: "(quantidade) Nome do participante"\n\n${erros}\n\nO indicador deve verificar os nomes dos participantes.`);
}

/* ROTINAS DE LOOP */

function rotina_validarVideosLigadosNaAssistencia() {
    dispararRotina('rotina_validarVideosLigadosNaAssistencia', 5000, () => {
        abrirPainelParticipantes();
        var videosLigados = [];
        getParticipantes()
            .filter(p => !!p.querySelector('.participants-icon__participant-video--started'))
            .forEach(p => videosLigados.push(`Participante com vídeo ligado: ${getNomeParticipante(p)}`));

        avisosDeRotinas['rotina_validarVideosLigadosNaAssistencia'] = videosLigados;
    });
}

function rotina_admitirEntradaNaSalaComNomeValido() {
    dispararRotina('rotina_admitirEntradaNaSalaComNomeValido', 5000, () => {
        abrirPainelParticipantes();
        Array.from(document.querySelectorAll('.waiting-room-list-conatiner__ul li')).forEach(participante => {
            var nome = getNomeParticipante(participante);
            var invalidos = [];

            /* verificar se participante tem nome valido */
            if (/\s*[\(\[\{]\s*[0-9]/ig.test(nome)) {
                participante.dispatchEvent(criarEventoMouseOver());
                participante.querySelector('.btn-primary').click();
                avisosDeRotinas['rotina_admitirEntradaNaSalaComNomeValido'].push(`liberada a entrada do participante: ${nome}`);
            } else {
                invalidos.push(`Participante em espera com nome fora do padrão: ${nome}`);
            }

            /* criar uma nova lista com todos participantes invalidos */
            avisosDeRotinas['rotina_registrarEntradaNaSalaComNomeInvalido'] = invalidos;
        });
    });
}

function rotina_validarNomesForaDoPadrao() {
    dispararRotina('rotina_validarNomesForaDoPadrao', 5000, () => {
        abrirPainelParticipantes();
        var nomesInvalidos = [];

        getParticipantes().forEach(participante => {
            var nome = getNomeParticipante(participante);
            /* verifica se nome esta fora do padrao */
            if (!/\s*[\(\[\{]\s*[0-9]/ig.test(nome)) {
                nomesInvalidos.push(`Participante na assistência com nome inválido: ${nome}`);
            }
        });

        avisosDeRotinas['rotina_validarNomesForaDoPadrao'] = nomesInvalidos;
    });
}

/* ================================================ TODO ================================================ */
function rotina_verificarOpcoesDaSala() {
    /*
    dispararRotina('rotina_verificarOpcoesDaSala', 5000, () => {
        abrirPainelParticipantes();
        avisosDeRotinas['rotina_verificarOpcoesDaSala'] = Array
            .from(document.querySelectorAll('ul[aria-labelledby="particioantHostDropdown"] li'))
            .filter(li => li.querySelector('.glyphicon-ok'))
            .map(opcao => opcao.innerText);
    });
    */
}

/* INICIO DO SCRIPT */
var intervalosEmExecucao = intervalosEmExecucao || {};
var avisosDeRotinas = {
    'rotina_validarVideosLigadosNaAssistencia': [],
    'rotina_admitirEntradaNaSalaComNomeValido': [],
    'rotina_registrarEntradaNaSalaComNomeInvalido': [],
    'rotina_validarNomesForaDoPadrao': [],
    'rotina_verificarOpcoesDaSala': [],
    'tentativaAbrirVideo': [],
};

if (!document.querySelector('#abrir-opcoes-reuniao')) {
    var btnAbrirModal = document.createElement('button');
    btnAbrirModal.id = 'abrir-opcoes-reuniao';
    btnAbrirModal.innerText = 'Opções customizadas';
    btnAbrirModal.style.marginRight = '20px';
    btnAbrirModal.onclick = abrirModal;
    /* adicionar botao no rodape */
    document.querySelector('#wc-footer').appendChild(btnAbrirModal);
}

desenharModal();
iniciarEventosDeRotina();

/* TODO: MELHORIAS */
/* desligar video do participante anterior somente quando o atual ligar a camera */
/* usar icones de cadeado, checkbox_on e checkbox_off nos servicos */
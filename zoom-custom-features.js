function iniciarEventosDeRotina() {
    console.log('iniciarEventosDeRotina() <- função sem conteúdo');
    /*
    rotina_validarNomes()
    rotina_desligarVideosAssistencia();
    rotina_verificarOpcoesDaSala();
    */
}

function dispararRotina(nomeRotina, tempoEmMilissengudos, callback) {
    encerrarRotina(nomeRotina);
    intervalosEmExecucao[nomeRotina] = setInterval(() => callback(), tempoEmMilissengudos);
}

function encerrarRotina(nomeRotina) {
    intervalosEmExecucao[nomeRotina] = clearInterval(intervalosEmExecucao[nomeRotina]);
}

function desenharModal() {
    // limpar componentes anteriores
    if (document.querySelector('#modal-opcoes-reuniao')) document.querySelector('#modal-opcoes-reuniao').remove();
    if (document.querySelector('#opcoes-reuniao')) document.querySelector('#opcoes-reuniao').remove();

    var modal = document.createElement('div');
    modal.id = 'modal-opcoes-reuniao';
    modal.style.position = 'fixed';
    modal.style.top = '0px';
    modal.style.left = '0px';
    modal.style.height = `${window.screen.height}px`;
    modal.style.width = `${window.screen.width}px`;
    modal.style.backgroundColor = 'black';
    modal.style.opacity = '0.7';
    // posicionar modal acima de toda tela
    modal.style.zIndex = 1 + Math.max.apply(null, Array
        .from(document.querySelectorAll('body *'))
        .filter(e => !!e.style.zIndex)
        .map(e => parseInt(e.style.zIndex))
    );
    // fechar modal clicando fora do conteudo
    modal.onclick = (evento) => evento.srcElement.id == modal.id && fecharModal();

    var painelOpcoes = desenharPainelOpcoes();
    painelOpcoes.style.zIndex = modal.style.zIndex + 1;

    // esconder modal ao iniciar script
    painelOpcoes.style.display = 'none';
    modal.style.display = 'none';

    // adicionar na tela
    document.body.appendChild(modal);
    document.body.appendChild(painelOpcoes);
}

function desenharPainelOpcoes() {
    var funcionalidades = [
        { nome: 'Ligar vídeos', icone: 'camera', classe: 'btn-danger', click: ligarVideos, confirmar: 'Tem certeza que deseja LIGAR TODOS OS VÍDEOS?' },
        { nome: 'Finalizar discurso', icone: 'palmas', classe: 'btn-danger', click: finalizarDiscurso, confirmar: 'Tem certeza que deseja FINALIZAR O DISCURSO? Ligará todos microfones para as palmas.' },
        { nome: 'Desligar vídeos', icone: 'cameraFechada', classe: 'btn-warning', click: desligarVideos, confirmar: 'Tem certeza que deseja DESLIGAR TODOS OS VIDEOS?' },
        { nome: 'Iniciar cântico', icone: 'microfoneFechado', classe: 'btn-warning', click: iniciarCantico, confirmar: 'Tem certeza que deseja INICIAR O CÂNTICO? Desligará todos vídeos e microfones.' },
        { nome: 'Focar no presidente', icone: 'participante', classe: 'btn-primary', click: focarNoPresidente },
        { nome: 'Focar no dirigente', icone: 'participante', classe: 'btn-primary', click: focarNoDirigente },
        { nome: 'Focar no leitor', icone: 'participante', classe: 'btn-primary', click: focarNoLeitor },
        { nome: 'Focar no orador', icone: 'participante', classe: 'btn-primary', click: focarNoOrador },
        { nome: 'Contar assistência', icone: 'assistencia', classe: 'btn-primary', click: contarAssitencia },
        // TODO: OPCIONAIS
        // { nome: 'Leitura Bíblia', icone: 'participante', classe: 'btn-primary', click: leituraBiblia },
        // { nome: 'Demonstracao 1', icone: 'assistencia', classe: 'btn-primary', click: demonstracao1 },
        // { nome: 'Demonstracao 2', icone: 'assistencia', classe: 'btn-primary', click: demonstracao2 },
    ];
    var rotinas = [
        { nome: 'Validar nomes inválidos', classe: 'btn-primary', click: rotina_validarNomes },
        { nome: 'Verificar opções sala', classe: 'btn-primary', click: rotina_verificarOpcoesDaSala },
        { nome: 'Desligar vídeos assistência', classe: 'btn-warning', click: rotina_desligarVideosAssistencia },
    ];
    // construir botoes principais
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
            opacity: 0.8;
        `;

        if (func.icone) {
            var icon = criarIcone(func.icone, btoa(func.nome));
            icon.style.filter = 'brightness(10)';
            btn.appendChild(icon);
        }
        return btn;
    });
    var btnFechar = criarIcone('fechar', 'btn-fechar-modal');
    btnFechar.style.left = '85%';
    btnFechar.style.top = '1%';
    btnFechar.style.opacity = '0.7';
    btnFechar.onclick = fecharModal;
    // construtir o frame com botoes
    var frameBotoes = document.createElement('div');
    frameBotoes.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(6, 1fr);
        grid-gap: 5px;
        padding: 10px;
    `;
    // adicionar os botoes no frame
    botoes.forEach(btn => frameBotoes.appendChild(btn));
    // construtir o frame com servicos
    var frameServicos = document.createElement('div');
    frameServicos.appendChild(btnFechar);
    // adicionar os servicos no frame
    // TODO: criar servicos
    // construir o quadro inteiro do painel
    var painelOpcoes = document.createElement('div');
    painelOpcoes.id = 'opcoes-reuniao';
    painelOpcoes.style.cssText = `
        display: grid;
        position: fixed;
        top: 5%;
        left: 10%;
        width: 1100px;
        height: 600px;
        grid-template-columns: 2fr 1fr;
        grid-gap: 30px;
        background-color: #edf2f7e6;
        border-radius: 10px;
    `;
    // adicionar os frames ao painel
    painelOpcoes.appendChild(frameBotoes);
    painelOpcoes.appendChild(frameServicos);
    return painelOpcoes;
}

function criarIcone(tipo, id) {
    if (!tipo || !id) return;
    var tipos = {
        camera: 'background-position: 264px 1128px;',
        cameraFechada: 'background-position: 215px 1127px;',
        microfone: 'background-position: -193px 553px;',
        microfoneFechado: 'background-position: -242px 554px;',
        palmas: 'background-position: 637px 875px;',
        participante: 'background-position: 400px 1080px; background-size: 574px 645px;',
        cadeado: 'background-position: 117px 1124px; background-size: 800px 670px;',
        assistencia: 'background-position: 400px 1080px; background-size: 650px 645px;',
        fechar: 'background-position: 323px 1200px; background-size: 1200px 959px;',
    };
    var icone = document.createElement('i');
    icone.id = id;
    icone.style.cssText = `
        cursor: pointer;
        position: relative;
        height: 45px;
        width: 50px;
        display: inline-block;
        background: url(https://us04st1.zoom.us/web_client/pwj3uo/image/wc_sprites.png);
        background-size: 840px 740px;
        ${tipos[tipo]}
    `;
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
    // se o video ja estiver ligado, seguir para proximas instrucoes
    if (isVideoLigado(participante)) return callback && callback();

    var textosBotao = ['ask for start video', 'start video', 'pedir para iniciar vídeo', 'iniciar vídeo'];
    var mensagemErro = 'Não foi possível LIGAR o vídeo! Verifique o nome do participante.';

    clickDropdown(participante, textosBotao, mensagemErro);

    // se houverem instrucoes para executar apos video ser ligado, ativa um temporizador
    if (participante && callback) {
        var nomeParticipante = getNomeParticipante(participante);

        // iniciar temporizador para aguardar participante liberar video
        var repeticoes = 0;
        dispararRotina(nomeParticipante, 500, () => {
            repeticoes++;
            if (isVideoLigado(participante)) {
                encerrarRotina(nomeParticipante);
                callback();
            } else if (repeticoes > 5) {
                // nao tentar ativar o video toda hora para evitar processamento desnecessario
                console.log(`Loop de rotina [ligar vídeo] --EM EXECUÇÃO-- para: ${nomeParticipante}.`);
                clickDropdown(participante, textosBotao, mensagemErro);
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

    // se botao estiver na opcao silenciar todos, entao sera preciso desligar para depois ligar microfones
    if (textosMuteAll.includes(btn.innerText.toLowerCase())) {
        // abrir modal para silenciar todos
        btn.click();

        var btnConfirmarMute = document.querySelector('.zm-modal-footer-default-actions .zm-btn--primary');
        var checkboxPermitirUnmute = document.querySelector('.zm-modal-footer-default-checkbox .zm-checkbox');

        // desmarcar a opcao 'participantes desativem o mudo'
        if (checkboxPermitirUnmute) {
            checkboxPermitirUnmute.setAttribute('aria-checked', 'false');
            checkboxPermitirUnmute.removeAttribute('class');
            checkboxPermitirUnmute.setAttribute('class', 'zm-checkbox');
        }

        // confirmar opcao silenciar todos para que surja a opcao para liberar microfones
        btnConfirmarMute && btnConfirmarMute.click();
    }

    // por fim, liberar todos os microfones
    btn.click();
}

function desligarMicrofones(execoes) {
    abrirPainelParticipantes();
    execoes = Array.isArray(execoes) ? execoes.map(p => getNomeParticipante(p)) : [];

    getParticipantes().forEach(participante => {
        // silenciar todos participantes que nao estejam na lista de excecoes
        if (!execoes.includes(getNomeParticipante(participante))) {
            desligarMicrofoneParticipante(participante);
        }
    });
}

function ligarVideos() {
    abrirPainelParticipantes();
    getParticipantes().forEach(participante => ligarVideoParticipante(participante));
}

function desligarVideos(execoes) {
    abrirPainelParticipantes();
    execoes = Array.isArray(execoes) ? execoes.map(p => getNomeParticipante(p)) : [];

    getParticipantes().forEach(participante => {
        // desligar video de todos participantes que nao estejam na lista de excecoes
        if (!execoes.includes(getNomeParticipante(participante))) {
            desligarVideoParticipante(participante);
        }
    });
}

// FUNCOES AVANCADAS

function focarNoDirigente() {
    abrirPainelParticipantes();
    var dirigente = selecionarParticipante('dirigente');
    var presidente = selecionarParticipante('presidente');
    var leitor = selecionarParticipante('leitor');

    // desligar video de todos participantes, exceto dirigente, leitor e presidente
    desligarVideos([dirigente, leitor, presidente]);

    // silenciar todos exceto dirigente
    desligarMicrofones([dirigente]);

    // ligar video do dirigente
    ligarVideoParticipante(dirigente, () => {
        // quando o dirigente iniciar seu video
        spotlightParticipante(dirigente);
        ligarMicrofoneParticipante(dirigente);
        // para evitar distracoes com autofoco, manter o presidente em foco ate que dirigente inicie seu video
        desligarVideoParticipante(presidente);
    });
}

function focarNoLeitor() {
    abrirPainelParticipantes();
    var leitor = selecionarParticipante('leitor');
    var dirigente = selecionarParticipante('dirigente');

    // desligar video de todos participantes, exceto dirigente e leitor
    desligarVideos([dirigente, leitor]);

    // silenciar todos participantes, exceto leitor
    desligarMicrofones([leitor]);

    // ligar video do leitor
    ligarVideoParticipante(leitor, () => {
        // quando o leitor iniciar seu video
        spotlightParticipante(leitor);
        ligarMicrofoneParticipante(leitor);
    });
}

function focarNoPresidente() {
    abrirPainelParticipantes();
    var presidente = selecionarParticipante('presidente');

    // silenciar todos participantes, exceto presidente
    desligarMicrofones([presidente]);

    // ligar video do presidente
    ligarVideoParticipante(presidente, () => {
        // quando o presidente iniciar seu video
        ligarMicrofoneParticipante(presidente);
        spotlightParticipante(presidente);
        desligarVideos([presidente]); // exceto presidente
    });
}

function focarNoOrador() {
    abrirPainelParticipantes();
    var orador = selecionarParticipante('orador');

    // desligar video de todos participantes, exceto orador
    desligarVideos([orador]);

    // silenciar todos participantes, exceto orador
    desligarMicrofones([orador]);

    // ligar video do orador
    ligarVideoParticipante(orador, () => {
        // quando o orador iniciar seu video
        spotlightParticipante(orador);
        ligarMicrofoneParticipante(orador);
    });
}

function finalizarDiscurso() {
    abrirPainelParticipantes();
    var presidente = selecionarParticipante('presidente');

    // desligar video de todos participantes
    desligarVideos();

    // ligar microfone de todos participantes para as palmas
    ligarMicrofones();

    // Aguardar tempo suficiente de palmas
    setTimeout(() => {
        // ligar video do presidente
        ligarVideoParticipante(presidente, () => {
            // quando o presidente iniciar seu video
            spotlightParticipante(presidente);
            ligarMicrofoneParticipante(presidente);
        });
    }, 8000);
}

// somente desliga videos e microfones
function iniciarCantico() {
    abrirPainelParticipantes();
    desligarVideos();
    desligarMicrofones();
}

function contarAssitencia() {
    abrirPainelParticipantes();
    var assistencia = 0;

    document.querySelectorAll('.participants-item__display-name').forEach(x => {
        var participantes = parseInt(x.innerText.replace(/\(|\{|\[/, '').trim());
        if (participantes > 0) {
            assistencia += participantes;
        };
    });

    alert(`Contagem automatizada da assistência: ${assistencia}\nContando apenas nomes no padrão: (1) Nome `);
}

// ROTINAS DE LOOP

function rotina_desligarVideosAssistencia() {
    var rotina = 'validarVideosLigadosNaAssistencia';
    // iniciar rotina de 10 segundos
    dispararRotina(rotina, 10000, () => {
        // Atualizar sempre que uma funcao nova for mapeada
        desligarVideos([
            // desligar todos videos, com excecao dos participantes abaixo
            selecionarParticipante('dirigente'),
            selecionarParticipante('leitor'),
            selecionarParticipante('presidente'),
            selecionarParticipante('orador'),
        ]);
    });
}

function rotina_validarNomes() {
    var rotina = 'validarNomesForaDoPadrao';
    // iniciar rotina de 15 segundos
    dispararRotina(rotina, 15000, () => {
        var invalidos = getParticipantes().filter(participante => !/\s*[\(\[\{]\s*[0-9]/ig.test(getNomeParticipante(participante)));

        if (invalidos) {
            alert(`participantes com nome inválido:\n${invalidos.join('\n')}`);
        }
    });
}

// verificar se participantes podem se desmutar, renomear, entram silenciados, se a sala está trancada...
function rotina_verificarOpcoesDaSala() { /* TODO */ }

// INICIO DO SCRIPT
desenharModal();
iniciarEventosDeRotina();

var intervalosEmExecucao = intervalosEmExecucao || {};

if (!document.querySelector('#abrir-opcoes-reuniao')) {
    var btnAbrirModal = document.createElement('button');
    btnAbrirModal.id = 'abrir-opcoes-reuniao';
    btnAbrirModal.innerText = 'Opções customizadas';
    btnAbrirModal.style.marginRight = '20px';
    btnAbrirModal.onclick = abrirModal;
    // adicionar botao no rodape
    document.querySelector('#wc-footer').appendChild(btnAbrirModal);
}

// TODO: MELHORIAS
// desligar video do participante anterior somente quando o atual ligar a camera
// antes de contar a assistencia, validar os nomes invalidos
function iniciarEventosDeRotina() {
    // TODO

    // ==== OPCOES AVANCADAS ====
    // - desligar todos microfones quando focar em alguém (exceto sentinela) (safe)
    // - desligar vídeo do participante anterior somente quando o atual ligar a câmera
    // - ligar microfone do participante somente quando ele ligar a câmera
    // - spotlight automático sempre que o vídeo de quem está em foco for ligado
    // - ao encerrar o discurso:
    //     desligar vídeo orador
    //     desligar microfone orador
    //     ligar todos microfones
    //     esperar alguns (talvez 5) segundos de palmas
    //     desligar todos microfones
    //     ligar microfone e vídeo do presidente

    // ==== ROTINAS ====
    // - desligar automaticamente todos vídeos que não sejam participantes (safe)
    // - verificar nomes fora do padrão e perguntar se quer renomear ou expulsar (safe)
}

function desenharModal() {
    // limpar componentes anteriores
    try {
        document.querySelector('#modal-opcoes-reuniao').remove();
        document.querySelector('#opcoes-reuniao').remove();
    } catch { }

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
        { nome: 'Contar assistência', click: contarAssitencia },
        { nome: 'Ligar videos', click: ligarVideos, confirmar: 'Tem certeza que deseja LIGAR TODOS OS VIDEOS?' },
        { nome: 'Desligar videos', click: desligarVideos, confirmar: 'Tem certeza que deseja DESLIGAR TODOS OS VIDEOS?' },
        { nome: 'Focar no dirigente', click: focarNoDirigente },
        { nome: 'Focar no leitor', click: focarNoLeitor },
        // { nome: 'Focar no presidente', click: focarNoPresidente },
        // { nome: 'Focar no orador', click: focarNoOrador },
        // { nome: 'Iniciar cântico', click: iniciarCantico, confirmar: 'Tem certeza que deseja INICIAR O CÂNTICO?' },
        // { nome: 'Finalizar discurso', click: finalizarDiscurso, confirmar: 'Tem certeza que deseja LIGAR TODOS OS VIDEOS?' },
        // TODO: OPCIONAIS
        // { nome: 'Leitura Bíblia', click: leituraBiblia },
        // { nome: 'Demonstracao 1', click: demonstracao1 },
        // { nome: 'Demonstracao 2', click: demonstracao2 },
    ];

    // construir botoes principais
    var botoes = funcionalidades.map(func => {
        var btn = document.createElement('button');
        btn.innerText = func.nome;
        btn.onclick = () => !func.confirmar ? func.click() : confirm(`CUIDADO!\n\n${func.confirmar}\n\nClique em cancelar para desfazer`) && func.click();
        btn.setAttribute('class', 'btn btn-primary');
        btn.style.cssText = `
            width: 80%;
            height: 90%;
            margin: auto;
        `;

        return btn;
    });

    // construtir o frame com botoes
    var frame = document.createElement('div');
    frame.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(6, 1fr);
        grid-gap: 10px;
        margin-top: 40px;
    `;

    // construir o quadro inteiro do painel
    var painelOpcoes = document.createElement('div');
    painelOpcoes.id = 'opcoes-reuniao';
    painelOpcoes.style.cssText = `
        display: grid;
        position: fixed;
        top: 5%;
        left: 10%;
        width: 1000px;
        height: 550px;
        grid-template-columns: 2fr 1fr;
        grid-gap: 30px;
        background-color: white;
    `;

    // adicionar os botoes no frame
    botoes.forEach(btn => frame.appendChild(btn));
    // adicionar o frame com botoes ao painel inteiro
    painelOpcoes.appendChild(frame);
    return painelOpcoes;
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

        intervalosEmExecucao[nomeParticipante] = setInterval(() => {
            if (isVideoLigado(participante)) {
                intervalosEmExecucao[nomeParticipante] = clearInterval(intervalosEmExecucao[nomeParticipante]);
                callback();
            } else {
                console.log(`Loop de rotina [ligar vídeo] --EM EXECUÇÃO-- para: ${nomeParticipante}.`);
                clickDropdown(participante, textosBotao, mensagemErro);
            }

        }, 500); // tempo em milissegundos
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

// funcoes avancadas
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

function focarNoPresidente() { /* TODO */ }

function focarNoOrador() { /* TODO */ }

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

    alert(`Contagem automatizada da assistência: ${assistencia}`);
}

// INICIO DO SCRIPT
desenharModal();
iniciarEventosDeRotina();

var intervalosEmExecucao = intervalosEmExecucao || {};

if (!document.querySelector('#abrir-opcoes-reuniao')) {
    var btnAbrirModal = document.createElement('button');
    btnAbrirModal.id = 'abrir-opcoes-reuniao';
    btnAbrirModal.innerText = 'Opções customizadas';
    btnAbrirModal.style.marginRight = '10px';
    btnAbrirModal.onclick = abrirModal;
    // adicionar botao no rodape
    document.querySelector('#wc-footer').appendChild(btnAbrirModal);
}
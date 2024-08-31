console.log('[DevBrx] ProjetoJogo');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const flecha= {
    spritesX: 279,
    spritesy: 120,
    largura: 33,
    altura: 116,
    x: 45,
    y: -116,
    estaNoChao: false,
    velocidade: 0,
    gravidade: 0.25,

    atualiza(){
        flecha.velocidade += flecha.gravidade;
        flecha.y += flecha.velocidade;

        if (fazColisao(flecha, chao)) {
            flecha.velocidade = 0;
            flecha.estaNoChao = true;  // Marca que está no chão
        } else {
            flecha.estaNoChao = false;  // Marca que está no ar
        }
    },

    desenha(){
        contexto.drawImage(
            sprites,
            flecha.spritesX, flecha.spritesy,
            flecha.largura , flecha.altura,
            flecha.x, flecha.y,
            flecha.largura, flecha.altura,
        );
    }
};



const chao = {
    spriteX: 3,
    spriteY: 571,
    largura: 896,
    altura: 78,
    x: 0,
    y: canvas.height - 78,
    desenha() {
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura,
        );
    }
};

function fazColisao(player, chao) {
    const playerY = player.y + player.altura;
    const chaoY = chao.y;

    if (playerY >= chaoY) {
        player.y = chao.y - player.altura;  // Corrige a posição do player
        return true;
    }
    return false;
}

const player = {
    spriteX: 44,
    spriteY: 518,
    largura: 42,
    altura: 43,
    x: 39,
    y: 500,
    pulo: 4.6,
    velocidade: 0,
    gravidade: 0.25,
    andar: 10,
    estaNoChao: false,

    pula() {
        if (player.estaNoChao) {  // Pular só se estiver no chão
            player.velocidade = -player.pulo;
            player.estaNoChao = false;  // Marca que não está mais no chão
        }
    },

    moveEsquerda() {  // Movimenta o player para a esquerda
        player.x -= player.andar;
    },

    moveDireita() {  // Movimenta o player para a direita
        player.x += player.andar;
    },

    atualiza() {
        player.velocidade += player.gravidade;
        player.y += player.velocidade;

        if (fazColisao(player, chao)) {
            player.velocidade = 0;
            player.estaNoChao = true;  // Marca que está no chão
        } else {
            player.estaNoChao = false;  // Marca que está no ar
        }
    },

    desenha() {
        contexto.drawImage(
            sprites,
            player.spriteX, player.spriteY,
            player.largura, player.altura,
            player.x, player.y,
            player.largura, player.altura,
        );
    }
};

//
// Telas
//

let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
}

const Telas = {
    INICIO: {
        desenha() {
            player.desenha();
             chao.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            // Código para atualizar na tela inicial
        }
    }
};

Telas.JOGO = {
    desenha() {
        chao.desenha();
        player.desenha();
        flecha.desenha();
    },
    onkeydown(e) {  // Controle de movimento com as teclas A e D
        if (e.code === "Space") {
            console.log("apertou space");
            player.pula();  // Pula quando a barra de espaço é pressionada
        } else if (e.key === "a" || e.key === "A") {
            player.moveEsquerda();  // Move para a esquerda quando a tecla "A" é pressionada
        } else if (e.key === "d" || e.key === "D") {
            player.moveDireita();  // Move para a direita quando a tecla "D" é pressionada
        }
    },
    
    atualiza() {
        player.atualiza();
        flecha.atualiza();
    }
};

//
// Telas
//

window.addEventListener('click', function() {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

window.addEventListener('keydown', (e) => {
    if (telaAtiva.onkeydown) {
        telaAtiva.onkeydown(e);  // Detecta pressionamentos de tecla e chama a função onkeydown da tela ativa
    }
});

function loop() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    telaAtiva.desenha();
    telaAtiva.atualiza();

    requestAnimationFrame(loop);
}

mudaParaTela(Telas.INICIO);
loop();

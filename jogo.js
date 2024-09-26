console.log('[DevBrx] ProjetoJogo');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

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
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }
};
function fazColisao(player, chao) {
    const playerY = player.y + player.altura;
    const chaoY = chao.y;

    if (playerY >= chaoY) {
        player.y = chao.y - player.altura;  
        return true;
    }
    return false;
}

class Flecha {
    constructor() {
        this.spritesX = 279;
        this.spritesY = 120;
        this.largura = 33;
        this.altura = 116;
        this.x = Math.random() * (canvas.width - this.largura); // Posição X aleatória
        this.y = -116; // Começa na parte superior
        this.velocidade = 0;
        this.gravidade = 0.10;
    }

    atualiza() {
        this.velocidade += this.gravidade;
        this.y += this.velocidade;

        if (fazColisaoFlechaChao(this, chao)) {
            this.velocidade = 0;
            this.y = chao.y - this.altura;  // Coloca a flecha no chão
            this.x = Math.random() * (canvas.width - this.largura); // Nova posição X aleatória
            this.y = -this.altura; // Reinicia a posição Y para cima
        }
    }

    desenha() {
        contexto.drawImage(
            sprites,
            this.spritesX, this.spritesY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }
}

const flechas = [];

function criarFlechas() {
    for (let i = 0; i < 10; i++) {
        flechas.push(new Flecha()); // Adiciona uma nova flecha ao array
    }
}

const star = {
    spritesX: 256,
    spritesY: 537,
    largura: 34,
    altura: 30,
    x: Math.random() * (canvas.width - 34), // Posição X aleatória inicial
    y: chao.y - 30,  // Coloca a estrela acima do chão
    visivel: true,  // Controle de visibilidade

    desenha() {
        if (this.visivel) {
            contexto.drawImage(
                sprites,
                this.spritesX, this.spritesY,
                this.largura, this.altura,
                this.x, this.y,
                this.largura, this.altura,
            );
        }
    },

    reaparecer() {
        this.x = Math.random() * (canvas.width - this.largura);  // Nova posição X aleatória
        this.y = chao.y - this.altura;  // Coloca a estrela acima do chão
        this.visivel = true;  // Torna a estrela visível novamente
    }
};

function fazColisaoPlayerStar(player, star) {
    const starAltura = star.y + star.altura;
    const starLargura = star.x + star.largura;
    const playerAltura = player.y + player.altura;
    const playerLargura = player.x + player.largura;

    if (starAltura >= player.y && star.y <= playerAltura && starLargura >= player.x && star.x <= playerLargura) {
        console.log("Houve colisão");
        player.estrelasColetadas ++;
        return true;
    }

    return false;
}

const life = {
    spritesX: 733,
    spritesY: 4,
    largura: 52,
    altura: 44,
    x: 843,
    y: 4,

    desenha() {
        for (let i = 0; i < player.vida; i++) {
            contexto.drawImage(
                sprites,
                this.spritesX, this.spritesY,
                this.largura, this.altura,
                this.x - (i * (this.largura + 10)), // Desenha os corações espaçados
                this.y,
                this.largura, this.altura
            );
        }
    }
};

function fazColisaoFlechaPlayer(player, flecha) {
    const flechaY = flecha.y + flecha.altura;
    const playerY = player.y;
    const flechaX = flecha.x;
    const flechaLargura = flecha.x + flecha.largura;
    const playerX = player.x;
    const playerLargura = player.x + player.largura;

    if (flechaY >= playerY && flechaX <= playerLargura && flechaLargura >= playerX) {
        flecha.y = -116; 
        flecha.velocidade = 0;  
        return true;
    }

    return false;
}

function fazColisaoFlechaChao(flecha, chao) {
    const flechaY = flecha.y + flecha.altura;
    const chaoY = chao.y;

    if (flechaY >= chaoY) {
        flecha.y = chao.y - flecha.altura;  
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
    y: 525,
    pulo: 4.6,
    velocidade: 0,
    gravidade: 0.25,
    andar: 10,
    estaNoChao: false,
    vida: 3,
    estrelasColetadas: 0,

    pula() {
        if (this.estaNoChao) {  
            this.velocidade = -this.pulo;
            this.estaNoChao = false;  
        }
    },

    moveEsquerda() {  
        this.x -= this.andar;
    },

    moveDireita() {  
        this.x += this.andar;
    },

    atualiza() {
        this.velocidade += this.gravidade;
        this.y += this.velocidade;

        if (fazColisao(player, chao)) {
            this.velocidade = 0;
            this.estaNoChao = true;  
        } else {
            this.estaNoChao = false;  
        }
    },

    desenha() {
        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }
};

function desenhaEstrelasColetadas() {
    // Desenha a estrela no canto superior esquerdo
    contexto.drawImage(
        sprites,
        star.spritesX, star.spritesY,  
        star.largura, star.altura,     
        10, 10,                        // Posição no canvas (canto superior esquerdo)
        star.largura, star.altura      
    );

    // Desenha o número de estrelas coletadas ao lado da estrela
    contexto.font = '20px Arial';
    contexto.fillStyle = 'black';
    contexto.fillText(`x ${player.estrelasColetadas}`, 50, 30); // Texto com o número de estrelas
}

// Telas do jogo
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
            
        }
    }
};

Telas.JOGO = {
    desenha() {
        chao.desenha();
        player.desenha();
        flechas.forEach(flecha => flecha.desenha()); // Desenha todas as flechas
        life.desenha();  // Desenha os corações de vida
        star.desenha();
        desenhaEstrelasColetadas();
    },
    
    onkeydown(e) {
        if (e.code === "Space") {
            player.pula();  
        } else if (e.key === "a" || e.key === "A") {
            player.moveEsquerda();  
        } else if (e.key === "d" || e.key === "D") {
            player.moveDireita();  
        }
    },

    atualiza() {
        player.atualiza();
        flechas.forEach(flecha => flecha.atualiza()); // Atualiza todas as flechas

        if (fazColisaoPlayerStar(player, star)) {
            // Ação em caso de colisão com a estrela
            star.reaparecer();
        }

        // Verifica a colisão entre o player e as flechas
        flechas.forEach(flecha => {
            if (fazColisaoFlechaPlayer(player, flecha)) {
                // Reduz a vida do player
                player.vida--;

                // Se a vida do player chegar a 0, muda para a tela de Game Over
                if (player.vida <= 0) {
                    mudaParaTela(Telas.GameOver);
                }
            }
        });
    }
};

Telas.GameOver = {
    desenha() {

        desenhaEstrelasColetadas();
        contexto.font = '30px Arial';
        contexto.fillStyle = 'red';
        contexto.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        
    },
    click() {
        // Reiniciar o jogo ao voltar para a tela de início
        player.x = 39; // reseta a posição do player
        player.vida = 3;  // Reseta a vida do player
        flechas.length = 0; // Limpa as flechas
        player.estrelasColetadas = 0; //RESETA AS ESTRELAS COLETADAS
        criarFlechas(); // Cria novas flechas
        mudaParaTela(Telas.INICIO); // Muda para a tela inicial
    },
    atualiza(){

    }
};

// Inicia o jogo
function inicia() {
    criarFlechas(); // Inicializa as flechas
    mudaParaTela(Telas.INICIO); // Muda para a tela inicial

    canvas.addEventListener('click', () => {
        telaAtiva.click();
    });

    window.addEventListener('keydown', (e) => {
        if (telaAtiva.onkeydown) {
            telaAtiva.onkeydown(e);
        }
    });

    loop(); // Inicia o loop do jogo
}

// Função de loop
function loop() {

    contexto.clearRect(0, 0, canvas.width, canvas.height);

    telaAtiva.atualiza();
    telaAtiva.desenha();
    requestAnimationFrame(loop);
}

inicia(); // Chama a função para iniciar o jogo

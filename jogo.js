console.log('[DevBrx] ProjetoJogo');

/** Variáveis Globais */

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
const sprites = new Image();
const flechas = [];
let buffer = {};
let telaAtiva = {};

sprites.src = './sprites.png';

const chao = {
    spriteX: 3,
    spriteY: 571,
    largura: canvas.width,
    altura: 78,
    x: 0,
    y: canvas.height - 78,
    desenha() {
        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura - 4, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }
};

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

const player = {
    spriteX: 44,
    spriteY: 518,
    largura: 42,
    altura: 43,
    x: 39,
    y: chao.y - 43,
    pulo: 4.6,
    velocidade: 0,
    gravidade: 0.25,
    andar: 10,
    estaNoChao: false,
    vida: 3,
    estrelasColetadas: 0,
    hspd: 0,
    ultimaDirecao: 'direita',
    invencibilidade: 60 * 2,

    pula() {
        if (this.estaNoChao) {  
            this.velocidade = -this.pulo;
            this.estaNoChao = false;  
        }
    },

    atualiza() {
        this.velocidade += this.gravidade;
        this.y += this.velocidade;
        this.invencibilidade = Math.min(60 * 2 + 1, this.invencibilidade + 1);

        this.x += this.hspd;
        if (!estaDentroDaTela(this)) this.x -= this.hspd;

        if (fazColisao(player, chao)) {
            this.velocidade = 0;
            this.estaNoChao = true;  
        } else {
            this.estaNoChao = false;  
        }
    },

    desenha() {
        if (this.invencibilidade < 60 * 2) {
            contexto.globalAlpha = this.invencibilidade % 25 > 12 ? 1 : 0;
        }

        let x = this.x;

        if (this.ultimaDirecao === 'esquerda') {
            contexto.scale(-1, 1);
            contexto.translate(-canvas.width, 0);
            x = canvas.width - this.largura - this.x;
        }

        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            x, this.y,
            this.largura, this.altura,
        );

        contexto.resetTransform();
        contexto.globalAlpha = 1;
    }
};

const star = {
    spritesX: 256,
    spritesY: 537,
    largura: 34,
    altura: 30,
    x: Math.random() * (canvas.width - 34), 
    y: chao.y - 30,  
    visivel: true, 
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
        this.x = Math.random() * (canvas.width - this.largura);  
        this.y = chao.y - this.altura;  
        this.visivel = true; 
    }
};

const shield = {
    spritesX: 294,
    spritesY: 520,
    largura: 41,
    altura: 40,
    x: Math.random() * (canvas.width - 41),
    y: chao.y -40,
    ativo: false,
    reaparecer: false,
    tempoDuracao: 5000, 
    tempoReaparecer: 15000, 


    desenha() {
        if (!this.ativo && !this.reaparecer) {
            contexto.drawImage(
                sprites,
                this.spritesX, this.spritesY,
                this.largura, this.altura,
                this.x, this.y,
                this.largura, this.altura
            );
        }
    },

    desenhaCirculoEmVoltaDoPlayer() {
        if (this.ativo) {
            contexto.beginPath();
            contexto.arc(player.x + player.largura / 2, player.y + player.altura / 2, 50, 0, 2 * Math.PI);
            contexto.strokeStyle = "rgba(0, 255, 0, 0.5)";  // Cor verde com transparência
            contexto.lineWidth = 5;
            contexto.stroke();
        }
    },


    pegar() {
        if (!this.ativo && !this.reaparecer) {
            this.ativo = true;
            this.iniciarContagemDuracao();
        }
    },

    
    iniciarContagemDuracao() {
        setTimeout(() => {
            this.ativo = false; 
            this.iniciarContagemReaparecimento();
            
        }, this.tempoDuracao);
    },
    reposicionar() {
        
        this.x = Math.random() * (canvas.width - this.largura);  // Reposiciona o shield aleatoriamente
        this.y = chao.y - 40; // Ajusta a posição Y do shield, se necessário
        console.log('Escudo reposicionado!');
        
    },

    
    iniciarContagemReaparecimento() {
        this.reaparecer =  true;
        setTimeout(() => {
        this.reposicionar();
        this.reaparecer = false;
            
        }, this.tempoReaparecer);
    }
};
    


const Telas = {
    INICIO: {
        
            desenha() {
                contexto.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela
        
                // Título do Jogo
                contexto.font = '40px Arial';
                contexto.fillStyle = 'black';
                contexto.fillText('Projeto Jogo - Versão 2.0', canvas.width / 2 - 180, 100);
        
                // Lista de Atualizações
                contexto.font = '20px Arial';
                contexto.fillStyle = 'black';
                const updates = [
                    'Melhora da movimentação deixando o jogo mais dinâmico e difícil.',
                    'Melhoria das flechas, agora caem em tempos diferentes.',
                    'Não é mais possível sair do mapa.',
                    'Adição de invencibilidade ao perder vida, por tempo limitado.',
                    'Novo item: Shield, protege por 5 segundos e reaparece a cada 15 segundos.'
                ];
        
                for (let i = 0; i < updates.length; i++) {
                    contexto.fillText(`• ${updates[i]}`, 100, 180 + (i * 30));
                }
        
                // Instruções para iniciar o jogo
                contexto.font = '25px Arial';
                contexto.fillText('Clique para começar o jogo!', canvas.width / 2 - 150, canvas.height - 100);
            },
        
            click() {
                mudaParaTela(Telas.JOGO);
            },
        
            atualiza() {}
        
        
    }
};

Telas.JOGO = {
    desenha() {
        chao.desenha();
        player.desenha();
        flechas.forEach(flecha => flecha.desenha()); 
        life.desenha();  
        star.desenha();
        shield.desenha();
        
        
        desenhaEstrelasColetadas();
    },
    
    onkeydown(e) {
        switch (e.key) {
            case ' ': case 'Space':
                player.pula();
                break;

            case 'a': case 'A':
                player.hspd = -10;
                player.ultimaDirecao = 'esquerda';
                break;

            case 'd': case 'D':
                player.hspd = 10;
                player.ultimaDirecao = 'direita';
                break;
        }
    },

    onkeyup(e) {
        switch (e.key) {
            case 'a': case 'A': case 'd': case 'D':
                player.hspd = 0;
                break;
        }
    },

    atualiza() {
        player.atualiza();
        flechas.forEach(flecha => flecha.atualiza());{
            
        }

        

        if (fazColisaoPlayerStar(player, star)) {
           
            star.reaparecer();
        }
           
        if(fazColisaoPlayerShield(player, shield)){
            shield.pegar();
             
        }

        shield.desenhaCirculoEmVoltaDoPlayer(player);

        if( fazColisaoFlechaPlayer(player, Flecha) ){
            if(shield.ativo){
                
                Flecha.reinicia();
            }else{
                 player.vida--;
            }

        }   



        


        // Verifica a colisão entre o player e as flechas
        flechas.forEach(flecha => {
            if (fazColisaoFlechaPlayer(player, flecha) && player.invencibilidade >= 60 * 2) {
                if(shield.ativo){
                    
                    flecha.reinicia();
                }else {
                flecha.reinicia();
                // Reduz a vida do player
                player.vida--;
                player.invencibilidade = 0;

                // Se a vida do player chegar a 0, muda para a tela de Game Over
                if (player.vida <= 0) {
                    mudaParaTela(Telas.GameOver);
                }
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
        
        player.x = 39; // reseta a posição do player
        player.vida = 3;  // Reseta a vida do player
        flechas.length = 0; // Limpa as flechas
        buffer.length = 0;
        player.estrelasColetadas = 0; //RESETA AS ESTRELAS COLETADAS
        criarFlechas(5); // Cria novas flechas
        mudaParaTela(Telas.INICIO); // Muda para a tela inicial
    },
    atualiza(){

    }
};

/** Classes */

class Flecha {
    constructor(nome) {
        this.nome = nome;
        this.spritesX = 279;
        this.spritesY = 120;
        this.largura = 33;
        this.altura = 116;
        this.x = 0;
        this.y = 0;
        this.velocidade = 0;
        this.gravidade = 0.10;
        this.reinicia();
    }

    atualiza() {
        this.velocidade += this.gravidade;
        this.y += this.velocidade;
        if (fazColisaoFlechaChao(this, chao)) this.reinicia();
    }

    reinicia() {
        removedobuffer(this.nome);
        this.y = 0 - this.altura;
        this.x = SotearX(this.largura);
        buffer[this.nome] = this.x;
        this.velocidade = 0;
        this.gravidade = Math.random() * 0.3 + 0.1;
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

/** Funções de Colisão */



function fazColisaoPlayerShield(player, shield){
    if (player.x <= shield.x && player.x + player.largura >= shield.x || player.x <= shield.x + shield.largura && player.x + player.largura >= shield.x + shield.largura) {
        
        return true;
    }

    return false;
}

function fazColisao(player, chao) {
    const playerY = player.y + player.altura;
    const chaoY = chao.y;

    if (playerY >= chaoY) {
        player.y = chao.y - player.altura;  
        return true;
    }
    return false;
}

function fazColisaoPlayerStar(player, star) {
    if (player.x <= star.x && player.x + player.largura >= star.x || player.x <= star.x + star.largura && player.x + player.largura >= star.x + star.largura) {
        player.estrelasColetadas++;
        return true;
    }

    return false;
}

function fazColisaoFlechaPlayer(player, flecha) {
    if (flecha.y + flecha.altura >= player.y &&
        ((player.x <= flecha.x + flecha.largura && player.x + player.largura >= flecha.x + flecha.largura) ||
        (player.x <= flecha.x && player.x + player.largura >= flecha.x))) {
        return true;
    }

    return false;
}

function fazColisaoFlechaChao(flecha, chao) {
    const flechaY = flecha.y + flecha.altura;
    const chaoY = chao.y;

    if (flechaY >= chaoY) {
        return true;
    }
    return false;
}

function estaDentroDaTela(obj) {
    if (obj.x <= 0 || obj.x + obj.largura >= canvas.width) return false;
    return true;
}

/** Funções Utilitárias */

function SotearX (largura){
    let contadorDeSeguranca = 50;
    let X;

    for( let i = 0; i < contadorDeSeguranca; i++) {
        X = Math.random() * canvas.width - largura;
        let valido = true;

        Object.keys(buffer).forEach(chave => {
            if(!valido) return;
            if((buffer[chave] >= X && buffer[chave] <= X + largura) || (buffer[chave] + largura >= X && buffer[chave] + largura <= X + largura)) valido = false;
        });

        if (valido) return X;
    }

    return canvas.width + 1;

}

function removedobuffer(nome){
    const aux = {};

    Object.keys(buffer).forEach(chave => {
        if(chave !== nome) aux[chave] = buffer[chave];
    });
    
    buffer = aux;
}

function criarFlechas(quantFlechas) {

    buffer.length = 0;

    for (let i = 0; i < quantFlechas; i++) {

        const f = new Flecha(`flecha-${i}`); 
        f.x = SotearX(f.largura); 
        flechas.push(f);
        
    }
    return flechas;
}

function desenhaEstrelasColetadas() {
    // Desenha a estrela no canto superior esquerdo
    contexto.drawImage(
        sprites,
        star.spritesX, star.spritesY,  
        star.largura, star.altura,     
        10, 10,                       
        star.largura, star.altura      
    );

    // Desenha o número de estrelas coletadas ao lado da estrela
    contexto.font = '20px Arial';
    contexto.fillStyle = 'black';
    contexto.fillText(`x ${player.estrelasColetadas}`, 50, 30); // Texto com o número de estrelas
}

/** Funções da Engine do Jogo */

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
}

function inicia() {
    criarFlechas(5); // Inicializa as flechas
    mudaParaTela(Telas.INICIO); // Muda para a tela inicial

    canvas.addEventListener('click', () => {
        telaAtiva.click();
    });

    window.addEventListener('keydown', (e) => {
        if (telaAtiva.onkeydown) {
            telaAtiva.onkeydown(e);
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (telaAtiva.onkeyup) {
            telaAtiva.onkeyup(e);
        }
    });

    loop(); // Inicia o loop do jogo
}

function loop() {

    contexto.clearRect(0, 0, canvas.width, canvas.height);

    telaAtiva.atualiza();
    telaAtiva.desenha();
    requestAnimationFrame(loop);
}

inicia(); // Chama a função para iniciar o jogo
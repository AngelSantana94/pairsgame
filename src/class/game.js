import { Board } from "./board";
import { Card } from "./card";
import { arrCardsRandom } from "../utils/helpers";

class Game{

    constructor(){
        this.score = 0;
        this.level = 1;
        this.cardsSelect = [];
        this.isStarted = false;
        this.board = new Board("#card-container")
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.result = 0;
        this.finalResult = 0;
        this.timeLeft = 0;
        this.timerInterval = null;
        this.audioJuego = new Audio('sound/musica-fondo.mp3');
        this.audioTecla = new Audio('sound/tecla.mp3');
        this.audioVoltear = new Audio('sound/voltear.mp3');

        // Configuración extra
        this.audioJuego.loop = true;
        this.audioJuego.volume = 0.1;
        this.audioTecla.volume = 0.7;
        this.audioVoltear.volume = 1.0;

        this.uiTime = document.querySelector("#time");
        this.uiResult = document.querySelector("#result");
        this.uiFinalResult = document.querySelector("#final-result");
        this.header = document.querySelector("#header")
        this.uilevel = document.querySelector("#current-level-display")
        this.uiboard = document.querySelector("#board")
        this.title = document.querySelector("#title")

        this.buttonRestart = document.querySelector("#restart")
        this.buttonRestart.addEventListener("click", ()=>{
            this.audioTecla.play();
            this.restartGame();
        })
        

        this.buttonStart = document.querySelector("#start");
        this.buttonStart.addEventListener("click", ()=>{
            this.audioTecla.play();
            this.startGame()
        })
        
        this.buttonExit = document.querySelector("#exit");
        this.buttonExit.addEventListener("click",()=>{
            this.audioTecla.play();
            this.audioJuego.pause(); 
            this.audioJuego.currentTime = 0;
            this.exit()
        })

        this.buttonContinue = document.querySelector("#continue")
        this.buttonContinue.addEventListener("click",()=>{
            this.audioTecla.play();
            this.startGame()
        })

        // Guardar juego
        const gameStatus = {
            level: this.level,
            lastDate: new Date().toLocaleDateString()
        };
        localStorage.setItem("game_data", JSON.stringify(gameStatus));
        
        // Para recuperarlo luego:
        const savedData = JSON.parse(localStorage.getItem("game_data"));
        this.level = savedData ? savedData.level : 1;
        

    }

    exit(){
        localStorage.setItem("savedLevel", this.level);
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.board.clear();
    
        this.level = 1;
        this.isStarted = false;
    
        this.header.style.display = "none";
        this.buttonStart.style.display = "block";
        this.title.style.display = "block"
        this.buttonRestart.style.display = "none"
        this.uiboard.style.display = "block";
        this.buttonExit.style.display = "none" 
        this.buttonContinue.style.display = "block"
        
        console.log("Juego reseteado y de vuelta al menú");
    }

    startGame(){
        this.audioJuego.play().catch(e => console.log("Esperando interacción"));
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null; 
        }
        this.level = parseInt(localStorage.getItem("savedLevel")) || 1;

        this.isStarted = true;
        this.buttonStart.style.display ="none";
        this.title.style.display = "none"
        this.header.style.display ="flex";
        this.buttonExit.style.display = "block"
        this.buttonRestart.style.display = "block"
        this.buttonContinue.style.display = "none"
        
        console.log("Comienza el juego")
        this.starLevel();
        
        
    }
    
    starLevel(){
        const CONFIG_LEVELS ={
            1:{rows:2, cols: 2},
            2:{rows:2, cols: 3},
            3:{rows:3, cols: 4},
        }
        const currentSetting = CONFIG_LEVELS[this.level];

        

        this.result = 0;
        this.finalResult = (currentSetting.cols * currentSetting.rows)/2;
        this.timeLeft = 59;
        this.updateUI();
        this.lockBoard= false;
        this.uilevel.textContent = this.level;

        
        console.log("Comienza el nivel 1");
        this.board.clear();
        this.board.setupGrid(currentSetting.rows,currentSetting.cols);
        let totalPares = (currentSetting.rows * currentSetting.cols)/2;
        let arr= [];
        for(let i= 1; i <= totalPares; i++){
            arr.push(i);
        }
        let arrRandom = arrCardsRandom(arr);
        let arrRandomConcat = [...arrRandom,...arrRandom];
        let arrRandomComplet = arrCardsRandom(arrRandomConcat)
        
        for(let id of arrRandomComplet){
            let imagePath =`./img0${id}.jpeg`;
            let card = new Card(id,imagePath, this);
            this.board.addCard(card.element);
        }
    }

    checkSelection(card){
        this.audioVoltear.currentTime = 0;
        this.audioVoltear.play();
        this.startTimer();
        
        if(this.firstCard === null){
            this.firstCard = card;
            return;
        }
        
        if(this.secondCard === null){
            this.secondCard = card;
        }

        if(this.firstCard.id === this.secondCard.id){
            this.result ++;
            
            console.log(`¡Pareja encontrada! 🎉`)
            this.updateUI();
            this.resetTurn();
            this.checkWin();
        }else {
            console.log(`No son iguales... 😢`)

            this.lockBoard = true; 
        
            setTimeout(() => {
            this.firstCard.hide();
            this.secondCard.hide();
            this.resetTurn();
            this.lockBoard = false;
        }, 700);
        }
    }

    resetTurn(){
        this.firstCard = null;
        this.secondCard = null;
    }

    updateUI(){
        if(this.uiResult) this.uiResult.textContent = `${this.result}`;
        if(this.uiFinalResult) this.uiFinalResult.textContent = `${this.finalResult}`

        if(this.uiTime){
            let mins = Math.floor(this.timeLeft/60);
            let secs = this.timeLeft % 60;
            
            let fromattedMins = mins.toString().padStart(2,"0");
            let formattedSecs = secs.toString().padStart(2,"0");

            this.uiTime.textContent = `${fromattedMins}:${formattedSecs}`;

            if (this.timeLeft <= 10) {
                this.uiTime.style.color = "red";
            } else {
                this.uiTime.style.color = "black";
            }


        }
    }
    
    startTimer(){
        if(this.timerInterval){
            clearInterval(this.timerInterval);
        }
        this.timerInterval = setInterval(()=>{
            this.timeLeft--;
            this.updateUI();

            if(this.timeLeft <= 0 ){
                this.gameOver();
            }
        },700)

    }
    
    checkWin(){
        if(this.result === this.finalResult){
            console.log("¡Nivel Completado!");
            clearInterval(this.timerInterval)
            setTimeout(() =>{
                this.level ++
                localStorage.setItem("savedLevel", this.level);
                console.log(this.level)
                this.starLevel()
                if(this.level === 3){
                    
                    console.log(`"HAS GANADO TODO EL JUEGO"`);
                }
            },500);
        }
    }

    gameOver(){
        clearInterval(this.timerInterval);
        this.lockBoard = true;
        alert("¡GAME OVER! Se ha acabado el tiempo. 🕒");
        this.starLevel()
    }

    restartGame() {
        console.log("Reiniciando juego desde cero...");
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.level = 1;
        
        localStorage.removeItem("game_data");
        localStorage.removeItem("savedLevel")
        
        this.board.clear();
        
        if(this.uilevel) this.uilevel.textContent = this.level;
    
        this.startGame();
    }
}

export{Game};
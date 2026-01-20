class Board{

    constructor(containerId){
        this.containerId = document.querySelector(containerId);
        this.rows = 0;
        this.cols = 0;

    }

    setupGrid(rows,cols){
        this.containerId.style.gridTemplateColumns =`repeat(${cols}, 1fr)`;
        this.containerId.style.gridTemplateRows =`repeat(${rows}, 1fr)`;
        

    }

    clear(){
        this.containerId.innerHTML = "";
    }

    addCard(cardElement){
        this.containerId.appendChild(cardElement)
        
    }
}

export{Board};
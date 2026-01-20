
class Card{

    constructor(id, imagePath,gameInstance){
        this.id = id;
        this.imagePath = imagePath;
        this.gameInstance= gameInstance;
        this.isFlipped = false;
        
        //Seleccionamos elementos
        this.element = document.createElement("div");
        this.element.classList.add("card");
        this.imgElement = document.createElement("img");
        this.imgElement.src = `./img-backside.jpeg`;
        this.imgElement.classList.add("card-img");

        this.element.appendChild(this.imgElement)

        this.element.addEventListener("click", ()=>{
            this.handleFlip()
        })

    }

    handleFlip(){
        if(this.isFlipped || this.gameInstance.lockBoard) return;

        this.isFlipped = true;
        this.imgElement.src = this.imagePath;

        this.gameInstance.checkSelection(this);
    }

    hide(){
        this.isFlipped = false;
        this.imgElement.src = `./img-backside.jpeg`;

    }


}

export{Card}
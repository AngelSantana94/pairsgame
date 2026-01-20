// Aplico el Algoritmo de Fisher-Yates.
function arrCardsRandom(arr){

    let arrayCompletoRandom = [];
            
    while (arr.length > 0) {
        let posicion = Math.floor(Math.random() * arr.length);
        let elemento = arr.splice(posicion, 1)[0];
        arrayCompletoRandom.unshift(elemento);
    }
    
    return arrayCompletoRandom;
}

export{arrCardsRandom}; 




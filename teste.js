// arquivo de teste para implementar a script do jest
// se o type for -> ar -> aritmética retornamos a1 + a2 / 2 
// se o type for -> pd -> ponderada -> a1 * weight + a2 * weight  (weight + weight) -> soma a1+a2 / soma dos pesos

function calcStudantAverage(type, a1, a2, weight1 = 1, weight2 = 1)  {
    if(type === "ar") {
        console.log(calcAR(a1, a2));
        return calcAR(a1, a2);
    }
    if(type === "pd") {
        console.log(calcPD(a1, a2, weight1, weight2));
        return calcPD(a1, a2, weight1, weight2);
    }
}

function calcAR(a1, a2) {
    let sum;
    let divisor;

    sum = a1 + a2;
    divisor = 2;

    return sum / divisor;   
}

function calcPD(a1, a2, weight1, weight2) {
    let sumWeights = weight1 + weight2;
    let sumProduct = (a1 * weight1) + (a2 * weight2);

    return sumProduct / sumWeights;
}

module.exports = { calcStudantAverage, calcAR, calcPD };

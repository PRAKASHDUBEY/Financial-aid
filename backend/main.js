const indicators = require('technicalindicators');
const Stocks = require('./Stocks.json');
const correlationCoefficient = require('./Correlation.js');
const netProfit = require('./profit.js');

class Pair {
    constructor(pair1, pair2, closingPrice1, closingPrice2, date, correlation, rsi1, rsi2, profit) {
        this.pair1 = pair1;
        this.pair2 = pair2;
        this.profit = profit;
        this.correlation = correlation;
        this.closingPrice1 = closingPrice1;
        this.closingPrice2 = closingPrice2;
        this.rsi1 = rsi1;
        this.rsi2 = rsi2;
        this.date = date;
    }

}
module.exports = function main(date) {
    let index = indexLimit(date);

    const FilterPair = [];

    let i = 0;
    while (i < 50) {
        let j = i + 1;
        while (j < 50) {
            let pair1 = Stocks[i];
            let pair2 = Stocks[j];

            let correlation = correlationCoefficient(pair1.CLOSE, pair2.CLOSE, pair1.CLOSE.length);
            correlation = parseFloat(correlation).toFixed(3);

            //Filter Pair
            if (correlation >= 0.7) {

                const inputRSI1 = {
                    values: pair1.CLOSE,
                    period: 14
                };
                const inputRSI2 = {
                    values: pair2.CLOSE,
                    period: 14
                };
                const rsi1 = indicators.RSI.calculate(inputRSI1);
                const rsi2 = indicators.RSI.calculate(inputRSI2);



                let profit = netProfit(rsi1, rsi2, pair1.CLOSE, pair2.CLOSE, index.si, index.ei);
                const pairdata = new Pair(pair1.Symbol, pair2.Symbol, pair1.CLOSE, pair2.CLOSE, pair1.DATE, correlation, rsi1, rsi2, profit);
                FilterPair.push(pairdata);
            }
            j++;
        }
        i++;
    }

    FilterPair.sort((a, b) => b.profit - a.profit)
    FilterPair.forEach((x, i) => x.rank = i + 1);
    return FilterPair;
}

function indexLimit(date){
    var dt = new Date(date.startDate);
    var dt2 = new Date(date.endDate);

    var datearr = Stocks[0].DATE;

    
    let indexe; let indexs;

    for (let i = 0; i < datearr.length; i++) {


        if (new Date(datearr[i]) <= dt2) {
            indexs = i; break;
        }
        

    }
    for (let i = 0; i < datearr.length; i++) {


        if (new Date(datearr[i]) <= dt) { indexe = i; break; }
        
    }
    return{
        si:indexs,
        ei:indexe
    }

}
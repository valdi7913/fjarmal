class Situation {
    constructor(currentSavings, currentIncome, currentCosts, yearlyROI, yearlyPromotion, loanRatio) {
        hello
        this.currentSavings = currentSavings;
        this.currentIncome = currentIncome;
        this.currentCosts = currentCosts;
        this.yearlyROI = yearlyROI;
        this.yearlyPromotion = yearlyPromotion;

        this.loanRatio = loanRatio;

        this.savingsHistory = [];
        this.incomeHistory = [];
        this.maxLoan = [];
        this.years = [];
    }

    calculate(years) {
        this.savingsHistory = [currentSavings];
        this.incomeHistory = [this.income]
        this.maxLoan = [];

        for(let i = 0; i < years * 12; i++) {
            let newSavingsBalance = this.savingsHistory[i];
            let interestIncome = this.savingsHistory[i] * this.yearlyROI / 12;
            newSavingsBalance += this.currentIncome + interestIncome - this.currentCosts;

            this.years.push(i/12);
            this.incomeHistory.push(interestIncome + this.currentIncome);
            this.savingsHistory.push(newSavingsBalance);
            this.maxLoan.push(newSavingsBalance + maxPrincipalLoan(this.loanRatio, 15, 0.1075,this.currentIncome));
        }

    }

    timeToTarget(target) {
        for(let index = 0; index < this.savingsHistory.length; index++) {
            if(this.savingsHistory[index] >= target) {
                return index;
            }
        }
    }

    timeToTargetWithLoan(target) {
        for(let index = 0; index < this.savingsHistory.length; index++) {
            if(this.maxLoan[index] >= target) {
                return index;
            }
        }
    }

    plotSavings() {
        let data = [];
        for(let i = 0; i < this.savingsHistory.length * 12; i++) {
            data.push({"x":i/12, "y": this.savingsHistory[i]});
        }
        return data;
    }
}

const ctx = document.getElementById('myChart');
const ratioLabel = document.getElementById('ratioLabel');
const ratioInput = document.getElementById('ratioInput');
ratioLabel.innerText = ratioInput.value + " %";

const currentSavingsLabel = document.getElementById('savingsLabel');
const currentSavingsInput = document.getElementById('savingsInput');
currentSavingsLabel.innerText = formatNumberWithSeparators(currentSavingsInput.value);

const currentIncomeLabel = document.getElementById('incomeLabel')
const currentIncomeInput = document.getElementById('incomeInput');
currentIncomeLabel.innerText = formatNumberWithSeparators(currentIncomeInput.value);

const yearLabel = document.getElementById('yearLabel')
const yearInput = document.getElementById('yearInput');
yearLabel.innerText = yearInput.value;

const targetLabel = document.getElementById('targetLabel')
const targetInput = document.getElementById('targetInput');
targetLabel.innerText = targetInput.value;

let chart = plot();

function currentSavingsChanged() {
    console.log("Current Savings Changed");
    currentSavingsLabel.innerHTML = formatNumberWithSeparators(currentSavingsInput.value);
    chart.destroy();
    chart = plot();
}

function loanRatioChanged() {
    console.log("Ratio Changed");
    ratioLabel.innerHTML = ratioInput.value + " %";
    chart.destroy();
    chart = plot();
}

function currentIncomeChanged() {
    console.log("Income Changed");
    currentIncomeLabel.innerHTML = formatNumberWithSeparators(currentIncomeInput.value);
    chart.destroy();
    chart = plot();
}

function yearChanged() {
    console.log("Year Changed");
    yearLabel.innerHTML = yearInput.value;
    chart.destroy();
    chart = plot();
}

function targetChanged() {
    console.log("Target Changed");
    targetLabel.innerHTML = formatNumberWithSeparators(targetInput.value);
    chart.destroy();
    chart = plot();
}

function maxPrincipalLoan(ratio, years, interestRate, income) {
    let oneOverNumberOfMonths = 1 / (years * 12);
    let monthlyInterestRate = interestRate / 12;
    return ratio * income / (oneOverNumberOfMonths + monthlyInterestRate);
}

function zip(x, y) {
    let data = [];

    if(x.length !== y.length) {
        throw new Error("Lists must be equal length but are of length x:" + x.length + " y:" + y.length);
    }

    for(let i = 0; i < x.length; i++) {
        data.push({"x":x[i], "y": y[i]});
    }
    return data;
}

function plot() {   

    let me = new Situation(
        currentSavings = parseInt(currentSavingsInput.value),
        currentIncome = parseInt(currentIncomeInput.value),
        currentCosts = 120000,
        yearlyROI = 0.0865,
        yearlyPromotion = 0.05,
        loanRatio = parseFloat(ratioInput.value)
    );

    let years = parseInt(yearInput.value);
    me.calculate(years);
    let savings = me.plotSavings();

    let target = parseInt(targetInput.value);

    return new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
            {
                label: 'Target',
                data: [{x: me.timeToTarget(target)/12, y: target}],
                    backgroundColor: "#002F6C"
            },
            {
                label: 'Target með láni',
                data: [{x: me.timeToTargetWithLoan(target)/12, y: target}],
                backgroundColor: "#007B82"
            },
            {
                label: 'Sparnaður',
                data: savings,
                pointRadius: 1,
                fill: {
                    target: "origin", 
                },
                backgroundColor: '#4CAF50'
            },
            {
                label: 'Sparnaður + lán',
                data: zip(me.years, me.maxLoan),
                pointRadius: 1,
                fill: {
                    target: "origin", 
                },
                backgroundColor: '#FFA500'
            }
        ]
    },
    options: {
        animation: false,
        scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Ár'
                    },
                    max: years
                },
                y: {
                    title: {
                        display: true,
                        text: 'Upphæð í kr.'
                    },
                    min: 0
                }
            }
        }
    });
}

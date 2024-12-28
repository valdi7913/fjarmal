class Situation {
  constructor(
    currentSavings,
    currentIncome,
    currentCosts,
    yearlyROI,
    yearlyPromotion,
    loanRatio,
  ) {
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
    this.incomeHistory = [this.income];
    this.maxLoan = [];

    for (let i = 0; i < years * 12; i++) {
      let newSavingsBalance = this.savingsHistory[i];
      let interestIncome = (this.savingsHistory[i] * this.yearlyROI) / 12;
      newSavingsBalance +=
        this.currentIncome + interestIncome - this.currentCosts;

      this.years.push(i / 12);
      this.incomeHistory.push(interestIncome + this.currentIncome);
      this.savingsHistory.push(newSavingsBalance);
      this.maxLoan.push(
        newSavingsBalance +
          maxPrincipalLoan(this.loanRatio, 15, 0.1075, this.currentIncome),
      );
    }
  }

  timeToTarget(target) {
    for (let index = 0; index < this.savingsHistory.length; index++) {
      if (this.savingsHistory[index] >= target) {
        return index;
      }
    }
  }

  timeToTargetWithLoan(target) {
    for (let index = 0; index < this.savingsHistory.length; index++) {
      if (this.maxLoan[index] >= target) {
        return index;
      }
    }
  }

  plotSavings() {
    let data = [];
    for (let i = 0; i < this.savingsHistory.length * 12; i++) {
      data.push({ x: i / 12, y: this.savingsHistory[i] });
    }
    return data;
  }

  plotMaxmimumLoan() {
    let data = [];
    for (let i = 0; i < this.maxLoan.length * 12; i++) {
      data.push({ x: i / 12, y: this.maxLoan[i] });
    }
    return data;
  }
}

const ctx = document.getElementById("my-chart");

const ratioInput = document.getElementById("ratioInput");
ratioInput.min = 0;
ratioInput.value = 0.5;
ratioInput.step = 0.01;
ratioInput.oninput = replot;

const currentSavingsInput = document.getElementById("savingsInput");
currentSavingsInput.min = 0;
currentSavingsInput.value = 1_000_000;
currentSavingsInput.step = 100_000;
currentSavingsInput.oninput = replot;

const currentIncomeInput = document.getElementById("incomeInput");
currentIncomeInput.min = 0;
currentIncomeInput.value = 500_000;
currentIncomeInput.step = 10_000;
currentIncomeInput.oninput = replot;

const yearInput = document.getElementById("yearInput");
yearInput.min = 1;
yearInput.max = 40;
yearInput.value = 25;
yearInput.step = 1;
yearInput.oninput = replot;

const targetInput = document.getElementById("targetInput");
targetInput.min = 0;
targetInput.value = 50_000_000;
targetInput.step = 100_000;
targetInput.oninput = replot;

let chart = plot();

function replot() {
  chart.destroy();
  chart = plot();
}

function maxPrincipalLoan(ratio, years, interestRate, income) {
  let oneOverNumberOfMonths = 1 / (years * 12);
  let monthlyInterestRate = interestRate / 12;
  return (ratio * income) / (oneOverNumberOfMonths + monthlyInterestRate);
}

function plot() {
  let me = new Situation(
    (currentSavings = parseInt(currentSavingsInput.value)),
    (currentIncome = parseInt(currentIncomeInput.value)),
    (currentCosts = 120000),
    (yearlyROI = 0.0865),
    (yearlyPromotion = 0.05),
    (loanRatio = parseFloat(ratioInput.value)),
  );

  const years = parseInt(yearInput.value);
  me.calculate(years);
  const savings = me.plotSavings();
  const maxLoans = me.plotSavings();

  let target = parseInt(targetInput.value);
  console.log("Savings ", savings);
  console.log("MaxLoans ", maxLoans);

  return new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Target",
          data: [{ x: me.timeToTarget(target) / 12, y: target }],
          backgroundColor: "#002F6C",
        },
        {
          label: "Target með láni",
          data: [{ x: me.timeToTargetWithLoan(target) / 12, y: target }],
          backgroundColor: "#007B82",
        },
        {
          label: "Sparnaður",
          data: savings,
          pointRadius: 1,
          fill: {
            target: "origin",
          },
          backgroundColor: "#4CAF50",
        },
        {
          label: "Sparnaður + lán",
          data: maxLoans,
          pointRadius: 1,
          fill: {
            target: "origin",
          },
          backgroundColor: "#FFA500",
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: "Ár",
          },
          max: years,
        },
        y: {
          title: {
            display: true,
            text: "Upphæð í kr.",
          },
          min: 0,
        },
      },
    },
  });
}

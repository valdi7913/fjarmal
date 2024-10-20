const { LineChart } = JSGrof;

class DeathBond {
  /**
   *	The constructor for the death bond
   * @param {float} principal
   * @param {float} interest_rate
   * @param {integer} length_in_years
   */
  constructor(principal, interest_rate, length_in_years) {
    this.principal = parseFloat(principal);
    this.interest_rate = parseFloat(interest_rate) / 100;
    this.length = parseInt(length_in_years);

    this.months = [];
    this.interest_history = [];
    this.installment_history = [];
    this.principal_history = [this.principal];
  }

  calculateLoan() {
    this.months = [];
    this.interest_history = [0];
    this.installment_history = [0];
    this.principal_history = [this.principal];

    for (let i = 0; i < this.length * 12; i++) {
      let interest = (this.interest_rate / 12) * this.principal_history[i];
      let installment = this.principal / (this.length * 12);

      this.months.push(i);
      this.principal_history.push(this.principal_history[i] - installment);
      this.installment_history.push(this.installment_history[i] + installment);
      this.interest_history.push(
        this.interest_history[i] + installment + interest
      );
    }
  }

  getPlotablePrincipal() {
    let data = [];
    for (let i = 0; i < this.length * 12; i++) {
      data.push([this.months[i] / 12, this.principal_history[i]]);
    }
    return data;
  }

  getPlotablePayment() {
    let data = [];
    for (let i = 0; i < this.length * 12; i++) {
      data.push([this.months[i] / 12, this.installment_history[i]]);
    }
    return data;
  }

  getPlotableInterest() {
    let data = [];
    for (let i = 0; i < this.length * 12; i++) {
      data.push([this.months[i] / 12, this.interest_history[i]]);
    }
    return data;
  }

  getTotalPaid() {
    let length = this.interest_history.length;
    return parseInt(this.principal);
  }

  getTotalInterestPaid() {
    let length = this.interest_history.length;
    return parseInt(this.interest_history[length - 1]);
  }
}

function zip(x, y) {
  let data = [];

  if (x.length !== y.length) {
    throw new Error(
      "Lists must be equal length but are of length x:" +
        x.length +
        " y:" +
        y.length
    );
  }

  for (let i = 0; i < x.length; i++) {
    data.push([x[i], y[i]]);
  }
  return data;
}

//Inputs
const principalInput = document.getElementById("principalInput");

const interestInput = document.getElementById("interestInput");

const lengthInput = document.getElementById("lengthInput");

//Stats
const totalPaidLabel = document.getElementById("les");
const interestPaid = document.getElementById("bis");

plot();

function plot() {
  let principal = principalInput.value;
  let interest = interestInput.value;
  let length = lengthInput.value;

  let mortgage = new DeathBond(principal, interest, length);
  mortgage.calculateLoan();
  let principals = mortgage.getPlotablePrincipal();
  let installments = mortgage.getPlotablePayment();
  let interests = mortgage.getPlotableInterest();

  totalPaidLabel.innerHTML = mortgage.getTotalPaid();
  interestPaid.innerHTML = mortgage.getTotalInterestPaid();
  console.log("");

  const data = {
    Höfuðstóll: principals,
    Vextir: interests,
    Mánaðargreiðslur: installments,
  };

  const options = {
    // title: "Þróun láns sem fall af tíma",
    bgColor: "#ffffff",
    dataColors: ["#e8871e", "#BC4B51", "#BAD4AA"],
    axisColor: "#000000",
    strokeColor: "#000000",
    lineWidth: 2,
    resizeListener: true,
    resolutionUpscale: 1,
    dynamicFontSize: false,
    legendType: "top",
    fontSize: 16,
    dataLabels: true,
    interactive: true,
    legend: true,
    areaUnder: true,
    points: false,
    interactivityPrecisionX: 2,
    interactivityPrecisionY: 4,

    chartPaddingLeft: 0.15,
    chartPaddingRight: 0,
    chartPaddingTop: 0.1,
    chartPaddingBottom: 0.1,

    // labelX: "ár",
    labelY: " kr.",

    tickSpacingY:
      Math.pow(10, Math.round(Math.log10(principalInput.value))) / 10,
    tickSpacingX: 5,
  };
  return new LineChart("myChart", data, options);
}

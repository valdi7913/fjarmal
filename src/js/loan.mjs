import Mortgage from "./mortgage.mjs";
import JsGrof from "./grof";

//Inputs
const principalInput = document.getElementById("principal-input");
const interestInput = document.getElementById("interest-input");
const lengthInput = document.getElementById("length-input");

//on input
principalInput.oninput = plot;
interestInput.oninput = plot;
lengthInput.oninput = plot;

//Stats
const totalPaidLabel = document.getElementById("total-paid");
const interestPaid = document.getElementById("interest-paid");

function plot() {
    console.log("plotting and schemeing");
    //   let principal = principalInput.value;
    //   let interest = interestInput.value;
    //   let length = lengthInput.value;

    let principal = 100000
    let interest = 4;
    let length = 10;


    let mortgage = new Mortgage(principal, interest, length, false, false);

      let principals = [[0,0], [1,1]];
      let installments = [[0,0], [1,1]];
      let interests = [[0,0], [1,1]];

    // let principals = mortgage.getPlotablePrincipal();
    // let installments = mortgage.getPlotablePayment();
    // let interests = mortgage.getPlotableInterest();
    let totalPaid = mortgage.getTotalPaid()
    let totalInterestPaid = mortgage.getTotalInterestPaid()

    totalPaidLabel.innerHTML = mortgage.getTotalPaid();
    interestPaid.innerHTML = mortgage.getTotalInterestPaid();

    console.log("constructing graph");
    const data = {
        Höfuðstóll: principals,
        Vextir: interests,
        Mánaðargreiðslur: installments,
    };

    const options = {
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

        tickSpacingY: 10,
        //   Math.pow(10, Math.round(Math.log10(principalInput.value))) / 10,
        tickSpacingX: 5,
    };
    return new JsGrof.LineChart("my-chart", data, options);
}
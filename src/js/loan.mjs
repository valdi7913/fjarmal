import Mortgage from "./mortgage.mjs";

//Inputs

const principalInput = document.getElementById("principal-input");
principalInput.min = 0;
principalInput.value = 20_000_000;
principalInput.step = 100_000;
principalInput.oninput = replot;

const interestInput = document.getElementById("interest-input");
interestInput.min = 0;
interestInput.value = 10;
interestInput.step = 0.1;
interestInput.max = 100;
interestInput.oninput = replot;

const lengthInput = document.getElementById("length-input");
lengthInput.min = 1;
lengthInput.max = 40;
lengthInput.value = 25;
lengthInput.step = 1;
lengthInput.oninput = replot;

const equalPaymentsInput = document.getElementById("equal-payments");
equalPaymentsInput.checked = true;
equalPaymentsInput.onclick = replot;

const equalInstallmentsInput = document.getElementById("equal-installments");
equalInstallmentsInput.checked = false;
equalInstallmentsInput.onclick = replot;

const indexedInput = document.getElementById("indexed-input");
indexedInput.checked = false;
indexedInput.onclick = replot;

const unindexedInput = document.getElementById("unindexed-input");
unindexedInput.checked = true;
unindexedInput.onclick = replot;

const inflationInput = document.getElementById("inflation-input");
inflationInput.oninput = replot;
inflationInput.min = 0;
inflationInput.value = 6;
inflationInput.step = 0.1;
inflationInput.max = 100;

//Labels
const totalPaidLabel = document.getElementById("total-paid");
const interestPaid = document.getElementById("interest-paid");

let chart = plot();

function replot() {
	chart.destroy();
	chart = plot();
}

function plot() {
	let principal = principalInput.value;
	let interest = interestInput.value;
	let length = lengthInput.value;
	let equalPayments = equalPaymentsInput.checked;
	let indexed = indexedInput.checked;
	let inflation = inflationInput.value;

	let mortgage = new Mortgage(
		principal,
		interest,
		length,
		indexed,
		equalPayments,
		inflation
	);

	let principals = mortgage.getPlotablePrincipal();
	let installments = mortgage.getPlotablePayment();
	let interests = mortgage.getPlotableInterest();
	const totalPaidString =
		mortgage.getTotalPaid().toLocaleString("is-IS") + " kr.";
	const totalInterestPaidString =
		mortgage.getTotalInterestPaid().toLocaleString("is-IS") + " kr.";

	totalPaidLabel.innerHTML = totalPaidString;
	interestPaid.innerHTML = totalInterestPaidString;

	const ctx = document.getElementById("my-chart").getContext("2d");

	const data = {
		labels: mortgage.months,
		title: "Greiðsluplan",
		datasets: [
			{
				label: "Höfuðstóll",
				data: principals,
				fill: true,
				borderColor: "#FF0000",
			},
			{
				label: "Vextir",
				data: interests,
				fill: true,
				borderColor: "#FF0000",
			},
			{
				label: "Afborgannir",
				data: installments,
				fill: true,
				borderColor: "#33ddFF",
			},
		],
	};

	const config = {
		type: "line",
		data: data,
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: "top",
				},
			},
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	};

	return new Chart(ctx, config);
}

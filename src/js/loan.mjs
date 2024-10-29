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
indexedInput.onclick = replotAndHide;

const unindexedInput = document.getElementById("unindexed-input");
unindexedInput.checked = true;
unindexedInput.onclick = replotAndHide;

const inflationInput = document.getElementById("inflation-input");
inflationInput.oninput = replot;
inflationInput.min = 0;
inflationInput.value = 6;
inflationInput.step = 0.1;
inflationInput.max = 100;

const inflationContainer = document.getElementById("inflation-container");
inflationContainer.hidden = !indexedInput.checked;

const rollingGraphInput = document.getElementById("rolling-graph-input");
rollingGraphInput.checked = true;
rollingGraphInput.onclick = replot;

const monthlyGraphInput = document.getElementById("monthly-graph-input");
monthlyGraphInput.checked = false;
monthlyGraphInput.onclick = replot;

//Labels
const totalPaidLabel = document.getElementById("total-paid");
const interestPaid = document.getElementById("interest-paid");

let chart = plot();

function replotAndHide() {
	inflationContainer.hidden = !indexedInput.checked;
	chart.destroy();
	chart = plot();
}

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

	const principals = mortgage.getPlotablePrincipal();
	const rollingInstallments = mortgage.getPlotableRollingInstallments();
	const rollingInterests = mortgage.getPlotableRollingInterest();

	const installments = mortgage.getPlotableInstallments();
	const interests = mortgage.getPlotableInterest();
	const payments = mortgage.getPlotablePayments();

	const totalPaidString =
		mortgage.getTotalPaid().toLocaleString("is-IS") + " kr.";
	const totalInterestPaidString =
		mortgage.getTotalInterestPaid().toLocaleString("is-IS") + " kr.";

	totalPaidLabel.innerHTML = totalPaidString;
	interestPaid.innerHTML = totalInterestPaidString;

	const ctx = document.getElementById("my-chart").getContext("2d");

	//Decide which datasets to show
	let datasets = [];
	if (rollingGraphInput.checked) {
		datasets = [
			{
				label: "Samtals Afborgannir",
				data: rollingInstallments,
				fill: false,
				borderColor: "#8FF7A7",
				backgroundColor: "#8FF7A755",
			},
			{
				label: "Samtals Vextir",
				data: rollingInterests,
				fill: true,
				borderColor: "#db5461",
				backgroundColor: "#db546155",
			},
			{
				label: "Höfuðstóll",
				data: principals,
				fill: true,
				borderColor: "#058ed9",
				backgroundColor: "#058ed955",
			},
		];
	} else {
		datasets = [
			{
				label: "Afborgannir",
				data: installments,
				fill: false,
				borderColor: "#8FF7A7",
				backgroundColor: "#8FF7A755",
			},
			{
				label: "Vextir",
				data: interests,
				fill: true,
				borderColor: "#db5461",
				backgroundColor: "#db546155",
			},
			{
				label: "Greiðslur",
				data: payments,
				fill: true,
				borderColor: "#058ed9",
				backgroundColor: "#058ed955",
			},
		];
	}

	const data = {
		labels: mortgage.months,
		title: "Greiðsluplan",
		datasets: datasets,
	};

	const config = {
		type: "line",
		data: data,
		options: {
			animation: false,
			responsive: true,
			plugins: {
				legend: {
					position: "top",
				},
			},
			scales: {
				x: {
					min: 1,
				},
				y: {
					min: 0,
				},
			},
		},
	};

	return new Chart(ctx, config);
}

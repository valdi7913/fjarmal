function calculateTax(amount, taxcard = 0, pensionRatio = 0) {
	const taxStep1 = 0.3148;
	const taxStep2 = 0.3798;
	const taxStep3 = 0.4628;

	const taxStep1UpperLimit = 446_136;
	const taxStep2UpperLimit = 1_252_501;

	let totalTax = 0;

	if (amount <= taxStep1UpperLimit) {
		totalTax = amount * taxStep1;
	} else if (amount <= taxStep2UpperLimit) {
		totalTax += taxStep1UpperLimit * taxStep1;
		totalTax += (amount - taxStep1UpperLimit) * taxStep2;
	} else {
		totalTax += taxStep1UpperLimit * taxStep1;
		totalTax += (taxStep2UpperLimit - taxStep1UpperLimit) * taxStep2;
		totalTax += (amount - taxStep2UpperLimit) * taxStep3;
	}

	return totalTax;
}

//Labels
const incomeAfterTaxLabel = document.getElementById("income-after-tax-label");
const paidTaxLabel = document.getElementById("paid-tax-label");

const canvas = document.getElementById("my-chart");
const ctx = canvas.getContext("2d");

//Inputs
const incomeInput = document.getElementById("income-input");
incomeInput.min = 0;
incomeInput.value = 800_000;
incomeInput.step = 10_000;
incomeInput.oninput = replot;

const taxcardInput = document.getElementById("taxcard-input");
taxcardInput.min = 0;
taxcardInput.value = 100;
taxcardInput.step = 1;
taxcardInput.max = 100;
taxcardInput.oninput = replot;

const pensionInput = document.getElementById("pension-input");
pensionInput.min = 0;
pensionInput.value = 0;
pensionInput.step = 1;
pensionInput.max = 8;
pensionInput.oninput = replot;

const suplementaryPensionInput = document.getElementById(
	"supplementary-pension-input"
);

suplementaryPensionInput.min = 0;
suplementaryPensionInput.max = 8;
suplementaryPensionInput.value = 0;
suplementaryPensionInput.step = 1;
suplementaryPensionInput.oninput = replot;

function replot() {
	chart.destroy();
	chart = plot();
}

function plot() {
	incomeBeforeTax = [];
	incomeTax = [];
	incomeAfterTax = [];
	const targetSalary = Math.round(incomeInput.value);
	const targetSalaryTax = Math.round(calculateTax(targetSalary));
	const targetSalaryAfterTax = Math.round(targetSalary - targetSalaryTax);

	for (
		let amount = 0;
		amount < Math.max(1_600_000, targetSalary * 1.2);
		amount += 10_000
	) {
		let tax = calculateTax(amount);

		incomeBeforeTax.push(amount);
		incomeTax.push(tax);
		incomeAfterTax.push(amount - tax);
	}

	//Assign labels
	incomeAfterTaxLabel.innerText =
		targetSalaryAfterTax.toLocaleString("is-Is") + " kr.";
	paidTaxLabel.innerText = targetSalaryTax.toLocaleString("is-Is") + " kr.";

	//Tax steps
	const firstTaxStep = 446_136;
	const firstTaxStepAfterTax = firstTaxStep - calculateTax(firstTaxStep);
	const secondTaxStep = 1_252_501;
	const secondTaxStepAfterTax = secondTaxStep - calculateTax(secondTaxStep);

	const data = {
		labels: incomeBeforeTax,
		title: "Laun fyrir og eftir skatt",
		datasets: [
			{
				label: "Fyrsta skattþrep",
				data: [{ x: firstTaxStep, y: firstTaxStepAfterTax }],
				pointRadius: 5,
			},
			{
				label: "Annað skattþrep",
				data: [{ x: secondTaxStep, y: secondTaxStepAfterTax }],
				pointRadius: 5,
			},
			{
				label: "Þín laun",
				data: [{ x: targetSalary, y: targetSalaryAfterTax }],
				color: "red",
				pointRadius: 10,
			},
			{
				label: "Laun eftir skatt",
				data: incomeAfterTax,
				color: "blue",
				pointRadius: 1,
				lineWidth: 10,
			},
		],
	};

	const config = {
		type: "line",
		data: data,

		options: {
			animation: false,
			responsive: true,
			scales: {
				x: {
					type: "linear",
					position: "bottom",
					title: {
						display: true,
						text: "Ár",
					},
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
	};

	return new Chart(ctx, config);
}

let chart = plot();

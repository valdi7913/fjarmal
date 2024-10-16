class DeathBond {
	constructor(principal, interest_rate, length_in_years) {
		this.principal = principal;
		this.interest_rate = interest_rate / 100;
		this.length = length_in_years;

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
			this.interest_history.push(this.interest_history[i] + installment + interest);
		}
	}

	getPlotablePrincipal() {
		let data = [];
		for (let i = 0; i < this.length * 12; i++) {
			data.push({ "x": this.months[i] / 12, "y": this.principal_history[i] });
		}
		return data;
	}

	getPlotablePayment() {
		let data = [];
		for (let i = 0; i < this.length * 12; i++) {
			data.push({ "x": this.months[i] / 12, "y": this.installment_history[i] });
		}
		return data;
	}

	getPlotableInterest() {
		let data = [];
		for (let i = 0; i < this.length * 12; i++) {
			data.push({ "x": this.months[i] / 12, "y": this.interest_history[i] });
		}
		return data;
	}

	getTotalPaid() {
		let length = this.interest_history.length
		return parseInt(this.principal);
	}

	getTotalInterestPaid() {
		let length = this.interest_history.length
		return parseInt(this.interest_history[length-1]);
	}
};

function zip(x, y) {
	let data = [];

	if (x.length !== y.length) {
		throw new Error("Lists must be equal length but are of length x:" + x.length + " y:" + y.length);
	}

	for (let i = 0; i < x.length; i++) {
		data.push({ "x": x[i], "y": y[i] });
	}
	return data;
}

const ctx = document.getElementById('myChart');

//Inputs
const principalInput = document.getElementById('principalInput');

const interestInput = document.getElementById('interestInput');

const lengthInput = document.getElementById('lengthInput');

//Stats
const totalPaidLabel = document.getElementById("les");
const interestPaid = document.getElementById("bis");

let chart = plot();

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
	console.log("")

	return new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [
				{
					label: 'Höfuðstóll',
					data: principals
				},
				{
					label: 'Afborgun',
					data: installments,
					fill: {
						target: "origin",
					}
				},
				{
					label: 'Vextir',
					data: interests,
					fill: {
						target: "origin",
					}
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
					}
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

function replot() {
	chart.destroy()
	chart = plot()
}

document.getElementById('principalInput').addEventListener('input', function(e) {
	let input = e.target.value;

	// Format the number with Icelandic separators
	const formattedInput = formatNumberWithSeparators(input);

	// Update the input value with the formatted number
	e.target.value = formattedInput;
});
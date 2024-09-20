class DeathBond {
    constructor(principal, interest_rate, length_in_years) {
        this.principal = principal;
        this.interest_rate = interest_rate;
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

        for(let i = 0; i < this.length * 12; i++) {
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
        for(let i = 0; i < this.length * 12; i++) {
            data.push({"x":this.months[i]/12, "y": this.principal_history[i]});
        }
        return data;
    }

    getPlotablePayment() {
        let data = [];
        for(let i = 0; i < this.length * 12; i++) {
            data.push({"x":this.months[i]/12, "y": this.installment_history[i]});
        }
        return data;
    }

    getPlotableInterest() {
        let data = [];
        for(let i = 0; i < this.length * 12; i++) {
            data.push({"x":this.months[i]/12, "y": this.interest_history[i]});
        }
        return data;
    }
};

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

const ctx = document.getElementById('myChart');

const principalLabel = document.getElementById('principalLabel');
const principalInput = document.getElementById('principalInput');
const principalSlider = document.getElementById('principalSlider');

const interestLabel = document.getElementById('interestLabel')
const interestInput = document.getElementById('interestInput');
const interestSlider = document.getElementById('interestSlider');
interestLabel.innerText = interestSlider.value+ " %";

const lengthLabel = document.getElementById('lengthLabel')
const lengthInput = document.getElementById('lengthInput');
const lengthSlider = document.getElementById('lengthSlider');
lengthLabel.innerText = lengthSlider.value + " years";

let chart = plot();

function plot() {
    let principal = principalSlider.value;
    let interest = interestSlider.value;
    let length = lengthSlider.value;

    let mortgage = new DeathBond(principal, interest, length);
    mortgage.calculateLoan()
    let principals = mortgage.getPlotablePrincipal()
    let installments = mortgage.getPlotablePayment()
    let interests = mortgage.getPlotableInterest()
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

function principalSliderChanged() {
    console.log("Principal Slider Changed")
    let newText = formatNumberWithSeparators(principalSlider.value);
    principalInput.value = newText;
    chart.destroy()
    chart = plot()
}

function principalInputChanged() {
    console.log("Principal Input Changed")
    console.log(principalInput.value.replaceAll("/./g l lu", ""));
    principalSlider.value = 9999999;
    chart.destroy()
    chart = plot()
}

function interestChanged() {
    console.log("interest Changed")
    interestLabel.innerHTML = interestSlider.value + " %";
    chart.destroy()
    chart = plot()
}

function lengthChanged() {
    console.log("Length Changed")
    lengthLabel.innerHTML = lengthSlider.value + " years";
    chart.destroy()
    chart = plot()
}

document.getElementById('principalInput').addEventListener('input', function(e) {
    let input = e.target.value;

    // Remove any non-numeric characters before reformatting
    input = input.replace(/[^0-9,]/g, '');

    // Format the number with Icelandic separators
    const formattedInput = formatNumberWithSeparators(input);

    // Update the input value with the formatted number
    e.target.value = formattedInput;
});
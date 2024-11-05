function calculateTax(amount) {
    let taxStep1 = 0.3148;
    let taxStep2 = 0.3798;
    let taxStep3 = 0.4628;

    let taxStep1UpperLimit =   446_136;
    let taxStep2UpperLimit = 1_252_501;

    let totalTax = 0;

    if(amount <= taxStep1UpperLimit) {
        totalTax = amount * taxStep1;
    } else if(amount <= taxStep2UpperLimit) {
        totalTax += (taxStep1UpperLimit) * taxStep1;
        totalTax += (amount - taxStep1UpperLimit) * taxStep2; 
    } else {
        totalTax += (taxStep1UpperLimit) * taxStep1;
        totalTax += (taxStep2UpperLimit - taxStep1UpperLimit) * taxStep2;
        totalTax += (amount - taxStep2UpperLimit) * taxStep3; 
    }

    return totalTax;
}

const ctx = document.getElementById('chart');

const incomeInput = document.getElementById('incomeInput');
const incomeLabel = document.getElementById('incomeLabel');

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

function incomeChanged() {
    incomeLabel.innerHTML = incomeInput.value;
    chart.destroy()
    chart = plot()
}

function plot() {
    incomeBeforeTax = [];
    incomeTax = [];
    incomeAfterTax = [];
    target = 1_000_000;
    for(let amount = 0; amount < 3_000_000; amount += 10_000) {
        let tax = calculateTax(amount);

        incomeBeforeTax.push(amount);
        incomeTax.push(tax);
        incomeAfterTax.push(amount - tax);
    }

    return new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                {
                    label: 'Þín laun',
                    data: [{"x": target, "y": target - calculateTax(target)}],
                    color: "red",
                    pointRadius: 5
                },
                {
                    label: 'Laun eftir skatt',
                    data: zip(incomeBeforeTax, incomeAfterTax),
                    color: "blue",
                    pointRadius: 1
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

let chart = plot()
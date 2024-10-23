export default class Mortgage {
    /**
     * @param {float} principal
     * @param {float} interest_rate
     * @param {integer} length_in_years
     * @param {boolean} [insured = false] insured
     * @param {boolean} [equal_payments = false] equal_payments
     */
    constructor(principal, interest_rate, length_in_years, insured = false, equal_payments = false) {
        this.principal = parseInt(principal);
        this.interest_rate = parseFloat(interest_rate) / 100;
        this.length = Math.ceil(parseFloat(length_in_years) * 12); // In months
        this.insured = insured;
        this.is_equal_payments = equal_payments;

        this.calculateLoan();
    }

    calculateLoan() {
        // Initialize loan variables 
        this.months = [];
        this.interest_history = [];
        this.installment_history = [];
        this.principal_history = [this.principal];

        // Call either equal payments or equal installments
        this.is_equal_payments ? this.equalPayments() : this.equalInstallments();
    }

    equalPayments() {
        console.log("equal payments", this.is_equal_payments);
        const r_m = this.interest_rate / 12;
        const n = this.length;

        // Calculate the monthly payment once
        const payment = this.principal * (r_m * (1 + r_m) ** n) / (((1 + r_m) ** n) - 1);

        for (let i = 0; i < n; i++) {
            const interest = r_m * this.principal_history[i];
            const installment = payment - interest;

            this.months.push(i + 1);  // Push month number starting from 1
            this.principal_history.push(Math.round(this.principal_history[i] - installment));
            this.installment_history.push(Math.round(installment));
            this.interest_history.push(Math.round(interest));
        }
    }

    equalInstallments() {
        console.log("equal installments", this.is_equal_payments);
        const r_m = this.interest_rate / 12;
        const n = this.length;

        for (let i = 0; i < n; i++) {
            const interest = r_m * this.principal_history[i];
            const installment = this.principal / n;

            this.months.push(i + 1);  // Push month number starting from 1
            this.principal_history.push(this.principal_history[i] - installment);
            this.installment_history.push(installment);
            this.interest_history.push(interest);
        }
    }

    // Getters
    getFirstPayment() {
        return this.installment_history[0] + this.interest_history[0];
    }

    getTotalInterestPaid() {
        const sum = this.interest_history.reduce((sum, interest) => sum + interest, 0);
        return Math.round(sum)
    }

    getTotalPaid() {
        const sum = this.installment_history.reduce((sum, installment) => sum + installment, 0) + this.getTotalInterestPaid();
        return Math.round(sum);
    }

    getPlotablePrincipal() {
        console.log("getting plottable principal")
        let data = [];
        console.log(this.months.length)
        for(let i = 0; i < this.length; i++) {
            data.push([this.months[i]/12, Math.round(this.principal_history[i])]);
        }
        return data;
    };
    
    getPlotablePayment() {
        let data = [];
        console.log(this.months.length)
        for(let i = 0; i < this.length; i++) {
            data.push([this.months[i]/12, Math.round(this.installment_history[i] + this.interest_history[i])]);
        }
        return data;
    }

    getPlotableInterest() {
        let data = [];
        console.log(this.months.length)
        for(let i = 0; i < this.length; i++) {
            data.push([this.months[i]/12, this.interest_history[i]]);
        }
        return data;
    }


}

export default class Mortgage {
	/**
	 * @param {float} principal
	 * @param {float} interest_rate expressed as a yearly percentage X%
	 * @param {integer} length_in_years expressed as a whole number of years
	 * @param {boolean} [insured = false] boolean flag dictates whether loan is CPI backed
	 * @param {boolean} [equal_payments = false] equal_payments
	 * @param {float} [inflation = 0] expressed as a yearly percentage X%
	 */
	constructor(
		principal,
		interest_rate,
		length_in_years,
		insured = false,
		equal_payments = false,
		inflation = 0
	) {
		this.principal = parseInt(principal);
		this.interest_rate = parseFloat(interest_rate) / 1200;      //converted to monthly interest as a decimal
		this.length = parseFloat(length_in_years) * 12;             //converted to number of payments 
		this.is_insured = insured;
		this.is_equal_payments = equal_payments;
		this.inflation = parseFloat(inflation) / 1200;              //converted to monthy inflation as a decimal

		this.calculateLoan();
	}

	calculateLoan() {
		// Initialize loan variables
		this.months = [];
		this.interest_history = [];
		this.installment_history = [];
		this.principal_history = [this.principal];

		// Calculate the corresponding loan type
        if      ( this.is_equal_payments &&  this.is_insured) this.equalPaymentCpi();
        else if ( this.is_equal_payments && !this.is_insured) this.equalPayments();        
        else if (!this.is_equal_payments &&  this.is_insured) this.equalInstallmentsCpi();
        else if (!this.is_equal_payments && !this.is_insured) this.equalInstallments();        
	}

	equalPayments() {
        console.log("equal payments");
        for(let month = 1; month < this.length; month++) {
            this.months[month] = month;
            this.principal_history[month] = 
                (this.principal) * 
                (Math.pow(1 + this.interest_rate,this.length - month) - 1) /
                (Math.pow(1 + this.interest_rate,this.length) - 1)

            this.interest_history[month] = this.interest_rate * this.principal_history[month-1];
            this.installment_history[month] = this.principal_history[month-1] - this.principal_history[month];

        }
	}

	equalInstallments() {
        console.log("equal installments");
        for(let month = 1; month <= this.length; month++) {
            this.months[month] = month;
            this.principal_history  [month] = this.principal * (1 - (month / this.length));
            this.installment_history[month] = this.principal / this.length;
            this.interest_history   [month] = this.principal_history[month-1] * this.interest_rate; 
        }
	}

    equalPaymentCpi() {
        console.log("equal payments cpi");
        for(let month = 1; month < this.length; month++) {
            this.months[month] = month;
            this.principal_history[month] = 
                this.principal * 
                Math.pow( 1 + this.inflation,month) *
                (Math.pow(1 + this.interest_rate,(this.length - month)) - 1) /
                (Math.pow(1 + this.interest_rate,(this.length)) - 1)

            this.interest_history[month] = this.interest_rate * this.principal_history[month-1];
            this.installment_history[month] = this.principal_history[month-1] - this.principal_history[month];
        } 
    }

    equalInstallmentsCpi() {
        console.log("equal installments cpi");
        for(let month = 1; month < this.length; month++) {
            this.months[month] = month;
            this.principal_history  [month] = this.principal * ((1+this.inflation) ** month) * (1 - (month / this.length));
            this.installment_history[month] = this.principal * ((1+this.inflation) ** month) / this.length;
            this.interest_history   [month] = this.principal_history[month-1] * this.interest_rate; 
        }
    }

	// Getters
	getFirstPayment() {
		return this.installment_history[0] + this.interest_history[0];
	}

	getTotalInterestPaid() {
		const sum = this.interest_history.reduce(
			(sum, interest) => sum + interest,
			0
		);
		return Math.round(sum);
	}

    getTotalPrincipalPayments() {
 		const sum = this.installment_history.reduce(
			(sum, interest) => sum + interest,
			0
		);       

        return Math.round(sum);
    }

	getTotalPaid() {
		return this.getTotalInterestPaid() + this.getTotalPrincipalPayments();
	}

	getPlotablePrincipal() {
		return this.principal_history;
	}

	getPlotablePayment() {
		return this.installment_history;
	}

	getPlotableInterest() {
		return this.interest_history;
	}
}

import Mortgage from "../src/js/mortgage.mjs";

import { test, suite } from "uvu";
import * as assert from "uvu/assert";

const equalPayments = suite("Equal Payments");
const equalInstallments = suite("Equal Installments");
const indexEqualPayments = suite("Index Equal Payments");
const indexEqualInstallments = suite("Index Equal Installments");

equalPayments("Óverðtryggt Jafnar Greiðslur Engir Vextir", () => {
	const principal = 70_000_000;
	const interest = 0;
	const length_in_years = 40;
	const insured = false;
	const equal_payments = true;

	const mortgage = new Mortgage(
		principal,
		interest,
		length_in_years,
		insured,
		equal_payments
	);

	assert.is(mortgage.getTotalPaid(), 70_000_000);
	assert.is(mortgage.getTotalInterestPaid(), 0);
	assert.is(mortgage.getFirstPayment(), 145_833);
});

equalPayments("Óverðtryggt Jafnar Greiðslur", () => {
	const principal = 70_000_000;
	const interest = 10.5;
	const length_in_years = 40;
	const insured = false;
	const equal_payments = true;

	const mortgage = new Mortgage(
		principal,
		interest,
		length_in_years,
		insured,
		equal_payments
	);

	assert.is(mortgage.getTotalPaid(), 187_186);
	assert.is(mortgage.getTotalInterestPaid(), 58_386);
	assert.is(mortgage.getFirstPayment(), 780);
});

equalInstallments("Óverðtryggt Jafnar Afborgannir", () => {
	const principal = 70_000_000;
	const interest = 10.5;
	const length_in_years = 40;
	const insured = false;
	const equal_payments = false;

	const mortgage = new Mortgage(
		principal,
		interest,
		length_in_years,
		insured,
		equal_payments
	);

	assert.is(mortgage.getTotalPaid(), 178_996);
	assert.is(mortgage.getTotalInterestPaid(), 50_196);
	assert.is(mortgage.getFirstPayment(), 954);
});

indexEqualPayments("Verðtryggt Jafnar Greiðslur", () => {
	const principal = 70_000_000;
	const interest = 10.5;
	const length_in_years = 40;
	const insured = true;
	const equal_payments = true;

	const mortgage = new Mortgage(
		principal,
		interest,
		length_in_years,
		insured,
		equal_payments
	);

	assert.is(mortgage.getTotalPaid(), 187_186);
	assert.is(mortgage.getTotalInterestPaid(), 58_386);
	assert.is(mortgage.getFirstPayment(), 780);
});

indexEqualInstallments("Verðtryggt Jafnar Afborgannir", () => {
	const principal = 70_000_000;
	const interest = 10.5;
	const length_in_years = 40;
	const insured = true;
	const equal_payments = false;

	const mortgage = new Mortgage(
		principal,
		interest,
		length_in_years,
		insured,
		equal_payments
	);

	assert.is(mortgage.getTotalPaid(), 178_996);
	assert.is(mortgage.getTotalInterestPaid(), 50_196);
	assert.is(mortgage.getFirstPayment(), 954);
});

equalPayments.run();
// equalInstallments.run();
// indexEqualPayments.run();
// indexEqualInstallments.run();

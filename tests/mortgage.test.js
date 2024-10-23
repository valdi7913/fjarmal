import Mortgage from "../src/js/mortgage.mjs";

import { test, suite } from 'uvu';
import * as assert from 'uvu/assert';

test('adding', () => {
    assert.is(1 + 1, 2);
})

function formatIcelandicNumber(number) {
    let outputString = "";
    let stringified = number.toString();
    for(let i = stringified.length -1; i > -1; i--) {
        console.log(stringified[i])
        outputString = stringified[i] + outputString;
        if(i % 3 === 0 && i > stringified.length) {
            outputString = '.' + outputString;
        }
    }
    return outputString;
}




const loan = suite('Lána Module')

loan('Óverðtryggt Jafnar Greiðslur', () => {
    const principal = 70_000_000;
    const interest = 10.5;
    const length_in_years = 40;
    const insured = false;
    const equal_payments = true

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

loan('Óverðtryggt Jafnar Afborgannir', () => {
    const principal = 70_000_000;
    const interest = 10.5;
    const length_in_years = 40;
    const insured = false;
    const equal_payments = false

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

loan('Verðtryggt Jafnar Greiðslur', () => {
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

loan('Verðtryggt Jafnar Afborgannir', () => {
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


const format = suite('Format');

format('hundraðstölur', () => {
    let number = 100_000_000

    assert.is(formatIcelandicNumber(number), "100.000.000")
})



// loan.run()
format.run()
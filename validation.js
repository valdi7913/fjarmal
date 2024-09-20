function validateInput(event, min, max) {
    // //Check if input is numeric
    let charCode = (event.which) ? event.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    //Check if input is in the correct range
    let value = parseInt(event.target.value);
    if( value <= min || max <= value) {
        console.log("You stupid bastard")    
        return false;
    }

    return true;
}

function formatNumberWithSeparators(num) {
    // Replace any existing commas (for the thousands separator)
    // or periods (for decimals) to avoid errors.
    num = num.replace(/\./g, '').replace(/,/g, '');

    // Convert the string to a number for correct formatting
    const parsedNum = parseFloat(num);
    console.log(parsedNum)
    if (isNaN(parsedNum)) return '';

    // Convert the number back to a string with Icelandic separators
    return parsedNum.toLocaleString('de-DE').replace(/\./g, ',').replace(/,/g, '.');
}
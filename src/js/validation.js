function validateInput(event, min, max) {
  // //Check if input is numeric
  let charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;

  //Check if input is in the correct range
  let value = parseInt(event.target.value);
  if (value <= min || max <= value) {
    return false;
  }

  return true;
}

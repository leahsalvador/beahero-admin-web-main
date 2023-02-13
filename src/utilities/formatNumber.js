export default function getCommaSeparatedTwoDecimalsNumber(number) {
  if (isNaN(number)) return;
  const fixedNumber = Number.parseFloat(number).toFixed(2);
  return String(fixedNumber).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

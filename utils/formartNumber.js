module.exports.formatNumber = (numberString) => {
  // Convert the numberString to an integer
  const number = parseInt(numberString, 10);

  // Format the number with decimal separators
  const formattedNumber = number.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Replace commas with dots (optional step)
  const result = formattedNumber.replace(/,/g, ".");

  // Return the formatted number
  return result;
};

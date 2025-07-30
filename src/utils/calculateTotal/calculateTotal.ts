export function calculateTotal(input: string): number {
  return input
    .split('\n')                       // split by newline
    .map(line => line.trim())         // remove leading/trailing spaces
    .filter(line => line !== '')      // filter out empty lines
    .map(line => parseFloat(line))    // convert to numbers
    .filter(n => !isNaN(n))           // filter out invalid numbers
    .reduce((acc, val) => acc + val, 0); // sum it up
}

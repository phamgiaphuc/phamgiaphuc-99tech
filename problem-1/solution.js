// Method 1: Using a loop to iterate from 1 to n and sum the numbers
var sum_to_n_a = function(n) {
  let result = 0;
  for (let i = 1; i <= n; i++) {
    result += i;
  }
  return result;
};

// Method 2: Using a formula to calculate the sum of numbers from 1 to n
var sum_to_n_b = function(n) {
  return n * (n + 1) / 2;
};


// Method 3: Using a recursion to sum the numbers from 1 to n
var sum_to_n_c = function(n) {
  if (n === 1) {
    return 1;
  }
  return n + sum_to_n_c(n - 1);
};


// Print out the results
console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));


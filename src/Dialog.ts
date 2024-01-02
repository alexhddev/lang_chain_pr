process.stdin.addListener('data', function(input) {
    let userInput = input.toString().trim();

    console.log('Your input: ' + userInput);
});
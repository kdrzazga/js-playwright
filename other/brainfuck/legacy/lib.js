function isStringANumber(str) {
    return !isNaN(Number(str)) && str.trim() !== "";
}

function truncToByte(number) {
    while (number > 255) {
        number = 256 - number;
    }

    while (number < 0) {
        number = 256 + number;
    }

    return number;
}

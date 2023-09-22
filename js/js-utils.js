
function strToStandardCase(string) {
    let str = "";
//data validation, makes user input standard Capital Case
    str = string.split(" ");
    str.forEach((word, index) => {
        let firstLetter = word.charAt(0).toUpperCase();
        let rest = word.slice(1).toLowerCase();
        str[index] = firstLetter + rest;
    });
    string = str.join(" ");
    return string
}

export {strToStandardCase}

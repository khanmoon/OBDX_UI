const XLSX = require('xlsx');
const fs = require('fs');

var inputWorkbook = XLSX.readFile('locale.xlsx');
var regexSheet = inputWorkbook.Sheets[inputWorkbook.SheetNames[0]];
var lengthOfSheet = Object.keys(regexSheet).filter(function(element, index, array) {
    return element.charAt(0) === 'A';
}).length;
var regexOut = '';
for (var i = 2; i <= lengthOfSheet; i++) {
    if (i[0] === '!') continue;
    regexOut += '\n' + regexSheet['A' + i].v + ":{\n\ttype:'" + regexSheet['B' + i].v + "',\n\toptions:{\n\t\tpattern:'" +
        regexSheet['C' + i].v + "',\n\t\tmessageDetail:'" + regexSheet['D' + i].v + "'\n\t}\n},";
}
console.log(regexOut);

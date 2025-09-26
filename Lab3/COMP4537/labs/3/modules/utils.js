const messages = require("../lang/en/en.js");
const filePath = "file.txt";

function getDate(name) {
  const currentDate = new Date().toLocaleString();
  const greeting = messages.greeting.replace("%1", name);
  return `<p style="color:blue">${greeting}${currentDate}</p>`;
}

function getErrorMessage(notfound, error, q={}) {
    let extra = "";
    if (error === "noName") {
        extra = messages.noName;
    }
    if (error === "cantWrite") {
        extra = messages.cantWrite;
    }
    if (error === "noText") {
        extra = messages.noText;
    }
    if (error === "noFile") {
        extra = messages.noFile.replace("%1", q.pathname.replace("/COMP4537/labs/3/readFile/", ""));
    }
    if (error === "cantRead") {
        extra = messages.cantRead.replace("%1", filePath);
    }
    notFoundMessage = notfound ? messages.notFound : "" + extra;
    return `<p style="color:red">${notFoundMessage}</p>`
}

function getSuccessMessage(text) {
    return `<p>Appended "${text}" to ${filePath}</p>`
}

exports.getDate = getDate;
exports.getErrorMessage = getErrorMessage;
exports.getSuccessMessage = getSuccessMessage;
exports.filePath = filePath
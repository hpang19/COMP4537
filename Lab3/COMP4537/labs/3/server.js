const http = require("http");
const url = require("url");
const fs = require("fs");
const { getDate, getErrorMessage, getSuccessMessage, filePath } = require("./modules/utils.js");


http.createServer((req, res) => {
    const q = url.parse(req.url, true);
    if (q.pathname === "/COMP4537/labs/3/getDate/") {
        const name = q.query.name;
        if (name) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(getDate(name));
            res.end();
        } else {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.write(getErrorMessage(false, "noName"));
            return res.end();
        }
    } else if (q.pathname === "/COMP4537/labs/3/writeFile/") {
        const text = q.query.text;
        if (text) {
            fs.appendFile(filePath, text + "\n", (err) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/html" });
                    res.write(getErrorMessage(false, "cantWrite"));
                    return res.end();
                }
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(getSuccessMessage(text));
                res.end();
            });
        } else {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.write(getErrorMessage(false, "noText"));
            return res.end();
        }
    } else if (q.pathname === "/COMP4537/labs/3/readFile/" + filePath) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.write(getErrorMessage(false, "cantRead"))
                return res.end();
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
        });
    } else {
        let error = [""];
        if (q.pathname.startsWith("/COMP4537/labs/3/readFile/")) {
            error = ["noFile", q];
        }
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write(getErrorMessage(true, ...error));
        res.end();
    }
}).listen(process.env.PORT || 8888);

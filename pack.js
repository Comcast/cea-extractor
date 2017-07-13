
var fs = require("fs");

var contents = fs.readFileSync("./dist/worker.js");

var out = "module.exports={file:" + JSON.stringify(contents.toString()) + "}";

fs.writeFileSync("./dist/worker.js", out);



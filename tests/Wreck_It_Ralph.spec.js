
var expect = require("chai").expect;
var CEA608Parser = require("../index").CEA608Parser;
var fs = require("fs");

function formatTime(time) {
    var hours = Math.floor(time / 3600);
    time = time - (3600 * hours);
    var minutes = Math.floor(time / 60);
    time = time - (60 * minutes);
    return ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2) + ":" + ("00" + time).slice(-2);
}

describe("Wreck_It_Ralph.mp4", function() {
    
    it("should generate appropriate text", function() {

        var parser = new CEA608Parser();
        var output = "";
        parser.displayScreen = function (d) {
            output += d.screen.map(function (screen) {
               return "[" + formatTime(d.start) + " -> " + formatTime(d.end) + "] " + screen.cols.map(function (col) {
                    return col.char;
                }).join("");
            }).join("\n") + "\n";
        };
        parser.add(fs.readFileSync("tests/Wreck_It_Ralph.mp4").buffer);
        let expected = fs.readFileSync("tests/Wreck_It_Ralph.out").toString();
        expect(output, "should match last output").to.equal(expected);
    });

});


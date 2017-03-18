/**
 * Copyright 2014 Comcast Cable Communications Management, LLC
 * 
 * Licensed under the BSD License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://opensource.org/licenses/BSD-3-Clause
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This is a command line utility useful for debugging and seeing the caption
 * data contained within an MP4 file. Needs a lot of TLC, currently takes an
 * input file as argument and provides the captions with timing data as output
 * written to stdout.
 */
import { readFileSync } from "fs";
import { CEA608Parser, IDataOutput, ISerializedRow, ISerializedStyledUnicodeChar } from "../index";

if (process.argv.length < 3) {
    console.error("Filename must be provided as argument");
    process.exit(1);
}

let parser = new CEA608Parser();

parser.displayScreen = (d: IDataOutput) => {
    process.stdout.write(d.screen.map((screen: ISerializedRow) => {
        return "[" + formatTime(d.start) + " -> " + formatTime(d.end) + "] " + screen.cols.map((col: ISerializedStyledUnicodeChar) => {
            return col.char;
        }).join("");
    }).join("\n") + "\n");
};

parser.add(readFileSync(process.argv[2]).buffer);

function formatTime(time: number) {
    let hours = Math.floor(time / 3600);
    time = time - (3600 * hours);
    let minutes = Math.floor(time / 60);
    time = time - (60 * minutes);
    return ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2) + ":" + ("00" + time).slice(-2);
}

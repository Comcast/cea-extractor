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

// tslint:disable:no-bitwise

import { CodemISO, parseBuffer, MOOFAtom, TRUNAtom, TFDTAtom } from "codem-isoboxer";

const COLOR_WHITE: string = "white";
const COLOR_GREEN: string = "green";
const COLOR_BLUE: string = "blue";
const COLOR_CYAN: string = "cyan";
const COLOR_RED: string = "red";
const COLOR_YELLOW: string = "yellow";
const COLOR_MAGENTA: string = "magenta";
const COLOR_BLACK: string = "black";
const COLOR_TRANSPARENT: string = "transparent";

const PAC_DATA_COLORS: string[] = [
    COLOR_WHITE,
    COLOR_GREEN,
    COLOR_BLUE,
    COLOR_CYAN,
    COLOR_RED,
    COLOR_YELLOW,
    COLOR_MAGENTA,
    COLOR_BLACK,
    COLOR_TRANSPARENT
];

const EXTENDED_CHAR_CODES: { [x: number]: number } = {
    0x2a : 0xe1, // lowercase a, acute accent
    0x5c : 0xe9, // lowercase e, acute accent
    0x5e : 0xed, // lowercase i, acute accent
    0x5f : 0xf3, // lowercase o, acute accent
    0x60 : 0xfa, // lowercase u, acute accent
    0x7b : 0xe7, // lowercase c with cedilla
    0x7c : 0xf7, // division symbol
    0x7d : 0xd1, // uppercase N tilde
    0x7e : 0xf1, // lowercase n tilde
    0x7f : 0x2588, // Full block
    // THIS BLOCK INCLUDES THE 16 EXTENDED (TWO-BYTE) LINE 21 CHARACTERS
    // THAT COME FROM HI BYTE=0x11 AND LOW BETWEEN 0x30 AND 0x3F
    // THIS MEANS THAT \x50 MUST BE ADDED TO THE VALUES
    0x80 : 0xae, // Registered symbol (R)
    0x81 : 0xb0, // degree sign
    0x82 : 0xbd, // 1/2 symbol
    0x83 : 0xbf, // Inverted (open) question mark
    0x84 : 0x2122, // Trademark symbol (TM)
    0x85 : 0xa2, // Cents symbol
    0x86 : 0xa3, // Pounds sterling
    0x87 : 0x266a, // Music 8'th note
    0x88 : 0xe0, // lowercase a, grave accent
    0x89 : 0x20, // transparent space (regular)
    0x8a : 0xe8, // lowercase e, grave accent
    0x8b : 0xe2, // lowercase a, circumflex accent
    0x8c : 0xea, // lowercase e, circumflex accent
    0x8d : 0xee, // lowercase i, circumflex accent
    0x8e : 0xf4, // lowercase o, circumflex accent
    0x8f : 0xfb, // lowercase u, circumflex accent
    // THIS BLOCK INCLUDES THE 32 EXTENDED (TWO-BYTE) LINE 21 CHARACTERS
    // THAT COME FROM HI BYTE=0x12 AND LOW BETWEEN 0x20 AND 0x3F
    0x90 : 0xc1, // capital letter A with acute
    0x91 : 0xc9, // capital letter E with acute
    0x92 : 0xd3, // capital letter O with acute
    0x93 : 0xda, // capital letter U with acute
    0x94 : 0xdc, // capital letter U with diaresis
    0x95 : 0xfc, // lowercase letter U with diaeresis
    0x96 : 0x2018, // opening single quote
    0x97 : 0xa1, // inverted exclamation mark
    0x98 : 0x2a, // asterisk
    0x99 : 0x2019, // closing single quote
    0x9a : 0x2501, // box drawings heavy horizontal
    0x9b : 0xa9, // copyright sign
    0x9c : 0x2120, // Service mark
    0x9d : 0x2022, // (round) bullet
    0x9e : 0x201c, // Left double quotation mark
    0x9f : 0x201d, // Right double quotation mark
    0xa0 : 0xc0, // uppercase A, grave accent
    0xa1 : 0xc2, // uppercase A, circumflex
    0xa2 : 0xc7, // uppercase C with cedilla
    0xa3 : 0xc8, // uppercase E, grave accent
    0xa4 : 0xca, // uppercase E, circumflex
    0xa5 : 0xcb, // capital letter E with diaresis
    0xa6 : 0xeb, // lowercase letter e with diaresis
    0xa7 : 0xce, // uppercase I, circumflex
    0xa8 : 0xcf, // uppercase I, with diaresis
    0xa9 : 0xef, // lowercase i, with diaresis
    0xaa : 0xd4, // uppercase O, circumflex
    0xab : 0xd9, // uppercase U, grave accent
    0xac : 0xf9, // lowercase u, grave accent
    0xad : 0xdb, // uppercase U, circumflex
    0xae : 0xab, // left-pointing double angle quotation mark
    0xaf : 0xbb, // right-pointing double angle quotation mark
    // THIS BLOCK INCLUDES THE 32 EXTENDED (TWO-BYTE) LINE 21 CHARACTERS
    // THAT COME FROM HI BYTE=0x13 AND LOW BETWEEN 0x20 AND 0x3F
    0xb0 : 0xc3, // Uppercase A, tilde
    0xb1 : 0xe3, // Lowercase a, tilde
    0xb2 : 0xcd, // Uppercase I, acute accent
    0xb3 : 0xcc, // Uppercase I, grave accent
    0xb4 : 0xec, // Lowercase i, grave accent
    0xb5 : 0xd2, // Uppercase O, grave accent
    0xb6 : 0xf2, // Lowercase o, grave accent
    0xb7 : 0xd5, // Uppercase O, tilde
    0xb8 : 0xf5, // Lowercase o, tilde
    0xb9 : 0x7b, // Open curly brace
    0xba : 0x7d, // Closing curly brace
    0xbb : 0x5c, // Backslash
    0xbc : 0x5e, // Caret
    0xbd : 0x5f, // Underscore
    0xbe : 0x7c, // Pipe (vertical line)
    0xbf : 0x223c, // Tilde operator
    0xc0 : 0xc4, // Uppercase A, umlaut
    0xc1 : 0xe4, // Lowercase A, umlaut
    0xc2 : 0xd6, // Uppercase O, umlaut
    0xc3 : 0xf6, // Lowercase o, umlaut
    0xc4 : 0xdf, // Esszett (sharp S)
    0xc5 : 0xa5, // Yen symbol
    0xc6 : 0xa4, // Generic currency sign
    0xc7 : 0x2503, // Box drawings heavy vertical
    0xc8 : 0xc5, // Uppercase A, ring
    0xc9 : 0xe5, // Lowercase A, ring
    0xca : 0xd8, // Uppercase O, stroke
    0xcb : 0xf8, // Lowercase o, strok
    0xcc : 0x250f, // Box drawings heavy down and right
    0xcd : 0x2513, // Box drawings heavy down and left
    0xce : 0x2517, // Box drawings heavy up and right
    0xcf : 0x251b // Box drawings heavy up and left
};

/**
 * Get Unicode Character from CEA-608 byte code
 */
function getCharForByte(byte: number): string {
    return String.fromCharCode(
        EXTENDED_CHAR_CODES[byte] || byte
    );
};

const SCREEN_ROW_COUNT: number = 15;
const SCREEN_COL_COUNT: number = 32;

const CHANNEL_1_ROWS_MAP: {[x: number]: number} = {
    0x11: 1,
    0x12: 3,
    0x15: 5,
    0x16: 7,
    0x17: 9,
    0x10: 11,
    0x13: 12,
    0x14: 14
};

const CHANNEL_2_ROWS_MAP: {[x: number]: number} = {
    0x19: 1,
    0x1A: 3,
    0x1D: 5,
    0x1E: 7,
    0x1F: 9,
    0x18: 11,
    0x1B: 12,
    0x1C: 14
};

export interface ISerializedPenState {
    foreground?: string;
    underline?: boolean;
    italics?: boolean;
    background?: string;
    flash?: boolean;
}

export interface ICCStyle {
    foreground: string;
    underline: boolean;
    italics: boolean;
    background: string;
    flash: boolean;
}

export interface IPACData extends ISerializedPenState {
    row: number;
    color: string | null;
    indent: number | null;
}

export class PenState {

    constructor(
        public foreground: string = "white",
        public underline: boolean = false,
        public italics: boolean = false,
        public background: string = "black",
        public flash: boolean = false) {};

    public reset(): void {
        this.foreground = "white";
        this.underline = false;
        this.italics = false;
        this.background = "black";
        this.flash = false;
    }

    public serialize(): ICCStyle {
        return {
            foreground: this.foreground,
            underline: this.underline,
            italics: this.italics,
            flash: this.flash,
            background: this.background
        };
    }

    public setStyles(styles: ISerializedPenState): void {
        if (styles.foreground) {
            this.foreground = styles.foreground;
        }
        if (styles.hasOwnProperty("underline")) {
            this.underline = styles.underline!;
        }
        if (styles.background) {
            this.background = styles.background;
        }
        if (styles.hasOwnProperty("flash")) {
            this.flash = styles.flash!;
        }
        if (styles.hasOwnProperty("italics")) {
            this.italics = styles.italics!;
        }
    }

    public isDefault(): boolean {
        return (this.foreground === "white" && !this.underline && !this.italics &&
                this.background === "black" && !this.flash);
    }

    public equals(other: PenState): boolean {
        return ( (this.foreground === other.foreground) &&
                 (this.underline === other.underline) &&
                 (this.italics === other.italics) &&
                 (this.background === other.background) &&
                 (this.flash === other.flash) );
    }

    public copy(newPenState: PenState): void {
        this.foreground = newPenState.foreground;
        this.underline = newPenState.underline;
        this.italics = newPenState.italics;
        this.background = newPenState.background;
        this.flash = newPenState.flash;
    }

}

export class StyledUnicodeChar {

    public penState: PenState;

    constructor(public uchar: string = " ", foreground?: string, underline?: boolean, italics?: boolean, background?: string, flash?: boolean) {
        this.penState = new PenState(foreground, underline, italics, background, flash);
    }

    public reset(): void {
        this.uchar = " ";
        this.penState.reset();
    }

    public setChar(uchar: string, newPenState: PenState): void {
        this.uchar = uchar;
        this.penState.copy(newPenState);
    }

    public setPenState(newPenState: PenState): void {
        this.penState.copy(newPenState);
    }

    public equals(other: StyledUnicodeChar): boolean {
        return this.uchar === other.uchar && this.penState.equals(other.penState);
    }

    public copy(newChar: StyledUnicodeChar): void {
        this.uchar = newChar.uchar;
        this.penState.copy(newChar.penState);
    }

    public isEmpty(): boolean {
        return this.uchar === " " && this.penState.isDefault();
    }

}

export class Row {

    public pos: number = 0;
    public currPenState: PenState = new PenState();
    public chars: StyledUnicodeChar[] = [
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar(),
        new StyledUnicodeChar()
    ];

    public equals(other: Row): boolean {
        for (let i = 0; i < SCREEN_COL_COUNT; i ++) {
            if (!this.chars[i].equals(other.chars[i])) {
                return false;
            }
        }
        return true;
    }

    public copy(other: Row): void {
        for (let i = 0; i < SCREEN_COL_COUNT; i ++) {
            this.chars[i].copy(other.chars[i]);
        }
    }

    public firstNonEmpty(): number {
        for (let i = 0; i < SCREEN_COL_COUNT; i++) {
            if (!this.chars[i].isEmpty()) {
                return i;
            }
        }
        return -1;
    }

    public isEmpty(): boolean {
        for (let i = 0; i < SCREEN_COL_COUNT; i++) {
            if (!this.chars[i].isEmpty()) {
                return false;
            }
        }
        return true;
    }

    public moveCursor(relPos: number): void {
        let newPos = this.pos + relPos;
        if (relPos > 1) {
            for (let i = this.pos + 1; i < newPos + 1; i++) {
                this.chars[i].setPenState(this.currPenState);
            }
        }
        this.pos = newPos;
    }

    public backSpace(): void {
        this.moveCursor(-1);
        this.chars[this.pos].setChar(" ", this.currPenState);
    }

    public insertChar(byte: number): void {
        if (byte >= 0x90) { // Extended char
            this.backSpace();
        }
        let char = getCharForByte(byte);
        this.chars[this.pos].setChar(char, this.currPenState);
        this.moveCursor(1);
    }

    public clearFromPos(startPos: number): void {
        let i;
        for (i = startPos ; i < SCREEN_COL_COUNT ; i++) {
            this.chars[i].reset();
        }
    }

    public clear(): void {
        this.clearFromPos(0);
        this.pos = 0;
        this.currPenState.reset();
    }

    public clearToEndOfRow(): void {
        this.clearFromPos(this.pos);
    }

    public setPenStyles(styles: ISerializedPenState): void {
        this.currPenState.setStyles(styles);
        let currChar = this.chars[this.pos];
        currChar.setPenState(this.currPenState);
    }
}

export interface IDataOutput {
    channel: number;
    roll: boolean;
    end: number;
    start: number;
    screen: ISerializedRow[];
}

export interface ISerializedRow {
    row: number; // row number
    pos: number; // col indent
    style: ICCStyle;
    cols: ISerializedStyledUnicodeChar[];
}

export interface ISerializedStyledUnicodeChar {
    style: ICCStyle;
    char: string;
}

export class CaptionScreen {

    public rows: Row[] = [
        new Row(),
        new Row(),
        new Row(),
        new Row(),
        new Row(),
        new Row(),
        new Row(),
        new Row(),
        new Row(),
        new Row(),
        new Row(),
        new Row(),
        new Row(),
        new Row(),
        new Row()
    ];

    public currRow: number = 14;
    public nrRollUpRows: number | null = null;

    public roll: boolean = false;

    constructor() {
        this.reset();
    }

    public serialize(): ISerializedRow[] {
        let results = [];
        for (let i = 0; i < SCREEN_ROW_COUNT; i++) {
            let row = this.rows[i];
            if (row.isEmpty()) {
                continue;
            } else {
                results.push({
                    row: i,
                    pos: row.firstNonEmpty(),
                    style: row.currPenState.serialize(),
                    cols: row.chars.map(this.serializeChar)
                });
            }
        }
        return results;
    }

    private serializeChar(char: StyledUnicodeChar): ISerializedStyledUnicodeChar {
        return {
            char: char.uchar,
            style: char.penState.serialize()
        };
    }

    public reset(): void {
        for (let i = 0; i < SCREEN_ROW_COUNT; i++) {
            this.rows[i].clear();
        }
        this.currRow = SCREEN_ROW_COUNT - 1;
    }

    public equals(other: CaptionScreen): boolean {
        let equal = true;
        for (let i = 0; i < SCREEN_ROW_COUNT; i++) {
            if (!this.rows[i].equals(other.rows[i])) {
                equal = false;
                break;
            }
        }
        return equal;
    }

    public copy(other: CaptionScreen): void {
        for (let i = 0; i < SCREEN_ROW_COUNT; i++) {
            this.rows[i].copy(other.rows[i]);
        }
    }

    public isEmpty(): boolean {
        let empty = true;
        for (let i = 0; i < SCREEN_ROW_COUNT; i++) {
            if (!this.rows[i].isEmpty()) {
                empty = false;
                break;
            }
        }
        return empty;
    }

    public backSpace(): void {
        this.rows[this.currRow]
            .backSpace();
    }

    public clearToEndOfRow(): void {
        this.rows[this.currRow]
            .clearToEndOfRow();
    }

    public insertChar(char: number): void {
        this.rows[this.currRow]
            .insertChar(char);
    }

    public setPen(styles: ISerializedPenState): void {
        this.rows[this.currRow]
            .setPenStyles(styles);
    }

    public moveCursor(relPos: number): void {
        this.rows[this.currRow]
            .moveCursor(relPos);
    }

    public setPAC(pacData: IPACData): void {
        let newRow = pacData.row - 1;
        this.currRow = newRow;
        let row = this.rows[this.currRow];
        if (pacData.indent !== null) {
            let indent = pacData.indent;
            let prevPos = Math.max(indent - 1, 0);
            row.pos = pacData.indent;
            pacData.color = row.chars[prevPos].penState.foreground;
        }
        this.setPen({
            foreground: pacData.color || "white",
            underline : pacData.underline,
            italics : pacData.italics || false,
            background : "black",
            flash : false
        });
    }

    public setBkgData(bkgData: ISerializedPenState): void {
        this.backSpace();
        this.setPen(bkgData);
        this.insertChar(0x20); // Space
    }

    public setRollUpRows(nrRows: number): void {
        this.nrRollUpRows = nrRows;
    }

    public rollUp(): void {
        // if the row is empty we have nothing
        // to roll-up
        if (this.nrRollUpRows === null || this.rows[this.currRow].isEmpty()) {
            return;
        }
        this.rows.splice((this.currRow - this.nrRollUpRows) + 1, 1);
        this.rows.push(new Row());
    }

}

export class Cea608Channel {

    public displayedMemory: CaptionScreen = new CaptionScreen();
    public nonDisplayedMemory: CaptionScreen = new CaptionScreen();
    public lastOutputScreen: CaptionScreen = new CaptionScreen();
    public writeScreen: CaptionScreen;
    public currRollUpRow: Row;
    public cueStartTime: number | null = null;
    public mode: string | null = null;

    private cmdMap: {[x: number]: () => void } = {
        0x20: () => this.cc_RCL(),
        0x21: () => this.cc_BS(),
        0x22: () => this.cc_AOF(),
        0x23: () => this.cc_AON(),
        0x24: () => this.cc_DER(),
        0x25: () => this.cc_RU(2),
        0x26: () => this.cc_RU(3),
        0x27: () => this.cc_RU(4),
        0x28: () => this.cc_FON(),
        0x29: () => this.cc_RDC(),
        0x2A: () => this.cc_TR(),
        0x2B: () => this.cc_RTD(),
        0x2C: () => this.cc_EDM(),
        0x2D: () => this.cc_CR(),
        0x2E: () => this.cc_ENM(),
        0x2F: () => this.cc_EOC()
    };

    constructor(public chNr: number, public parser: CEA608Parser) {
        this.currRollUpRow = this.displayedMemory.rows[SCREEN_ROW_COUNT - 1];
        this.writeScreen = this.displayedMemory;
        this.cueStartTime = null;
    }

    public reset(): void {
        this.mode = null;
        this.displayedMemory.reset();
        this.nonDisplayedMemory.reset();
        this.lastOutputScreen.reset();
        this.currRollUpRow = this.displayedMemory.rows[SCREEN_ROW_COUNT - 1];
        this.writeScreen = this.displayedMemory;
        this.cueStartTime = null;
    }

    public setPAC(pacData: IPACData): void {
        this.writeScreen.setPAC(pacData);
    }

    public runCmd(ccData1: number, ccData2: number): void {
        if (ccData1 === 0x14 || ccData1 === 0x1C) {
            this.cmdMap[ccData2]();
        } else { // a == 0x17 || a == 0x1F
            this.cc_TO(ccData2 - 0x20);
        }
    }

    public setBkgData(bkgData: ISerializedPenState): void {
        this.writeScreen.setBkgData(bkgData);
    }

    public setMode(newMode: string): void {
        if (newMode === this.mode) {
            return;
        }
        this.mode = newMode;
        if (this.mode === "MODE_POP-ON") {
            this.writeScreen = this.nonDisplayedMemory;
        } else {
            this.writeScreen = this.displayedMemory;
            this.writeScreen.reset();
        }
        if (this.mode !== "MODE_ROLL-UP") {
            this.displayedMemory.nrRollUpRows = null;
            this.nonDisplayedMemory.nrRollUpRows = null;
        }
        this.mode = newMode;
    }

    public insertChars(chars: number[]): void {
        for (let char of chars) {
            this.writeScreen.insertChar(char);
        }
        if (this.mode === "MODE_PAINT-ON" || this.mode === "MODE_ROLL-UP") {
            this.outputDataUpdate();
        }
    }

    public cc_RCL(): void { // Resume Caption Loading (switch mode to Pop On)
        this.setMode("MODE_POP-ON");
    }

    public cc_BS(): void { // BackSpace
        if (this.mode === "MODE_TEXT") {
            return;
        }
        this.writeScreen.backSpace();
        if (this.writeScreen === this.displayedMemory) {
            this.outputDataUpdate();
        }
    }

    public cc_AOF(): void { // Reserved (formerly Alarm Off)

    }

    public cc_AON(): void { // Reserved (formerly Alarm On)

    }

    public cc_DER(): void { // Delete to End of Row
        this.writeScreen.clearToEndOfRow();
        this.outputDataUpdate();
    }

    public cc_RU(nrRows: number): void { // Roll-Up Captions-2,3,or 4 Rows
        this.writeScreen = this.displayedMemory;
        this.setMode("MODE_ROLL-UP");
        this.writeScreen.setRollUpRows(nrRows);
    }

    public cc_FON(): void { // Flash On
        this.writeScreen.setPen({flash : true});
    }

    public cc_RDC(): void { // Resume Direct Captioning (switch mode to PaintOn)
        this.setMode("MODE_PAINT-ON");
    }

    public cc_TR(): void { // Text Restart in text mode (not supported, however)
        this.setMode("MODE_TEXT");
    }

    public cc_RTD(): void { // Resume Text Display in Text mode (not supported, however)
        this.setMode("MODE_TEXT");
    }

    public cc_EDM(): void { // Erase Displayed Memory
        this.displayedMemory.reset();
        this.outputDataUpdate();
    }

    public cc_CR(): void { // Carriage Return
        this.writeScreen.rollUp();
        this.outputDataUpdate(true);
    }

    public  cc_ENM(): void { // Erase Non-Displayed Memory
        this.nonDisplayedMemory.reset();
    }

    public cc_EOC(): void { // End of Caption (Flip Memories)
        if (this.mode === "MODE_POP-ON") {
            let tmp = this.displayedMemory;
            this.displayedMemory = this.nonDisplayedMemory;
            this.nonDisplayedMemory = tmp;
            this.writeScreen = this.nonDisplayedMemory;
        }
        this.outputDataUpdate();
    }

    public cc_TO(nrCols: number): void { // Tab Offset 1,2, or 3 columns
        this.writeScreen.moveCursor(nrCols);
    }

    public cc_MIDROW(secondByte: number): void { // Parse MIDROW command
        let styles: ISerializedPenState = {flash : false};
        styles.underline = secondByte % 2 === 1;
        styles.italics = secondByte >= 0x2e;
        if (!styles.italics) {
            let colorIndex = Math.floor(secondByte / 2) - 0x10;
            styles.foreground = PAC_DATA_COLORS[colorIndex];
        } else {
            styles.foreground = "white";
        }
        this.writeScreen.setPen(styles);
    }

    public outputDataUpdate(rolling: boolean = false): void {
        let t = this.parser.lastTime;
        if (t === null) {
            return;
        }

        if (this.cueStartTime === null && !this.displayedMemory.isEmpty()) { // Start of a new cue
            this.cueStartTime = t;
        } else if (!this.displayedMemory.equals(this.lastOutputScreen)) {

            if (this.cueStartTime !== null && !this.lastOutputScreen.isEmpty()) {
                this.parser.displayScreen({
                    channel: this.chNr,
                    roll: rolling,
                    start: this.cueStartTime | 0,
                    end: t | 0,
                    screen: this.lastOutputScreen.serialize()
                });
            }

            this.cueStartTime = this.displayedMemory.isEmpty() ? null : t;

        }

        this.lastOutputScreen.copy(this.displayedMemory);

    }

}

interface IFieldData {
    time: number;
    data: number[];
}

interface ICCData {
    fields: IFieldData[][];
}

function timeSorter(a: IFieldData, b: IFieldData): number {
    return a.time - b.time;
}

export class CEA608Parser {

    public channels: Cea608Channel[];
    public currChNr: number = -1;
    public lastTime: number | null = null;
    private lastCmdA?: number;
    private lastCmdB?: number;

    private dataField: number = 0;

    public displayScreen: (data: IDataOutput) => void = () => {
        // noop default
    }

    private timescale: number = 90000;

    constructor() {
        this.channels = [
            new Cea608Channel(1, this),
            new Cea608Channel(2, this)
        ];
    }

    public setPTS(pts: number): void {
        this.timescale = pts;
    }

    public setDataField(dataField: number): void {
        this.dataField = dataField;
    }

    public add(buf: ArrayBuffer): void {
        let file: CodemISO = parseBuffer(buf);
        let tfdts: TFDTAtom[] = file.fetchAll<TFDTAtom>("tfdt");
        let truns: TRUNAtom[] = file.fetchAll<TRUNAtom>("trun");
        let moofs: MOOFAtom[] = file.fetchAll<MOOFAtom>("moof");
        let raw: DataView = new DataView(buf);
        let allCcData: ICCData = {
            fields: [[], []]
        };
        for (let i = 0, length = truns.length; i < length; i++) {
            let trun: TRUNAtom = truns[i];
            let start = truns[i].data_offset + moofs[i]._raw.byteOffset;
            let dts = tfdts[i].baseMediaDecodeTime;
            for (let sample of trun.samples) {
                let ccDatas = getCCData(raw, start, sample.sample_size);
                if (ccDatas[0].length) {
                    allCcData.fields[0].push({
                        time: dts + sample.sample_composition_time_offset,
                        data: ccDatas[0]
                    });
                }
                if (ccDatas[1].length) {
                    allCcData.fields[1].push({
                        time: dts + sample.sample_composition_time_offset,
                        data: ccDatas[1]
                    });
                }
                dts += sample.sample_duration;
                start += sample.sample_size;
            }
        }

        allCcData.fields[this.dataField].sort(timeSorter);

        try {
            for (let cc of allCcData.fields[this.dataField]) {
                this.addData(Math.round((cc.time / this.timescale) * 1000), cc.data);
            }
        } catch (e) {
            console.warn("Unable to parse CC data");
        }
    }

    public addData(t: number, byteList: number[]): void {
        let a;
        let b;

        this.lastTime = t;

        for (let i = 0 ; i < byteList.length ; i += 2) {
            a = byteList[i] & 0x7f;
            b = byteList[i + 1] & 0x7f;

            if (a === 0 && b === 0) {
                continue;
            }

            if (!(this.parseCmd(a, b) ||
                this.parseMidrow(a, b) ||
                this.parsePAC(a, b) ||
                this.parseBackgroundAttributes(a, b))) {
                this.parseCharacters(a, b);
            }
        }
    }

    private parseCharacters(ccData1: number, ccData2: number): void {
        let charsFound: number[] = this.parseChars(ccData1, ccData2);
        if (charsFound) {
            if (this.currChNr && this.currChNr >= 0) {
                let channel = this.channels[this.currChNr - 1];
                channel.insertChars(charsFound);
            } else {
                console.warn("No channel found yet. TEXT-MODE?");
            }
        }
    }

    private hasCmd(ccData1: number, ccData2: number): boolean {
        return ((ccData1 === 0x14 || ccData1 === 0x1C) && (0x20 <= ccData2 && ccData2 <= 0x2F)) ||
            ((ccData1 === 0x17 || ccData1 === 0x1F) && (0x21 <= ccData2 && ccData2 <= 0x23));
    }

    public parseCmd(a: number, b: number): boolean {
        let chNr = null;

        if (this.hasCmd(a, b)) {

            /**
             * Duplicate CMD commands get skipped once
             */
            if (this.lastCmdA === a && this.lastCmdB === b) {
                this.lastCmdA = undefined;
                this.lastCmdB = undefined;
                return true;
            }

            if (a === 0x14 || a === 0x17) {
                chNr = 1;
            } else {
                chNr = 2; // (a === 0x1C || a=== 0x1f)
            }
            this.channels[chNr - 1].runCmd(a, b);
            this.currChNr = chNr;
            this.lastCmdA = a;
            this.lastCmdB = b;
            return true;
        }
        return false;
    }

    public parseMidrow(a: number, b: number): boolean {
        let chNr = null;

        if ( ((a === 0x11) || (a === 0x19)) && 0x20 <= b && b <= 0x2f) {
            if (a === 0x11) {
                chNr = 1;
            } else  {
                chNr = 2;
            }
            let channel = this.channels[chNr - 1];
            channel.cc_MIDROW(b);
            return true;
        }
        return false;
    }

    private hasPAC(ccData1: number, ccData2: number): boolean {
        return (((0x11 <= ccData1  && ccData1 <= 0x17) || (0x19 <= ccData1 && ccData1 <= 0x1F)) && (0x40 <= ccData2 && ccData2 <= 0x7F)) ||
            ((ccData1 === 0x10 || ccData1 === 0x18) && (0x40 <= ccData2 && ccData2 <= 0x5F));
    }

    public parsePAC(a: number, b: number): boolean {

        let chNr = null;
        let row = null;

        if (this.hasPAC(a, b)) {
            chNr = (a <= 0x17) ? 1 : 2;

            if (0x40 <= b && b <= 0x5F) {
                row = (chNr === 1) ? CHANNEL_1_ROWS_MAP[a] : CHANNEL_2_ROWS_MAP[a];
            } else { // 0x60 <= b <= 0x7F
                row = (chNr === 1) ? (CHANNEL_1_ROWS_MAP[a] + 1) : (CHANNEL_2_ROWS_MAP[a] + 1);
            }
            let pacData = this.interpretPAC(row, b);
            let channel = this.channels[chNr - 1];
            channel.setPAC(pacData);
            this.currChNr = chNr;
            return true;
        }
        return false;
    }

    public interpretPAC(row: number, byte: number): IPACData {
        let pacIndex = byte;
        let pacData: IPACData = {
            color: null,
            italics: false,
            indent: null,
            underline: false,
            row: row
        };

        if (byte > 0x5F) {
            pacIndex = byte - 0x60;
        } else {
            pacIndex = byte - 0x40;
        }

        pacData.underline = (pacIndex & 1) === 1;
        if (pacIndex <= 0xd) {
            pacData.color = PAC_DATA_COLORS[Math.floor(pacIndex / 2)];
        } else if (pacIndex <= 0xf) {
            pacData.italics = true;
            pacData.color = "white";
        } else {
            pacData.indent = (Math.floor((pacIndex - 0x10) / 2)) * 4;
        }

        return pacData;
    }

    public parseChars(a: number, b: number): number[] {

        let channelNr = null;
        let charCodes = null;
        let charCode1 = null;

        if (a >= 0x19) {
            channelNr = 2;
            charCode1 = a - 8;
        } else {
            channelNr = 1;
            charCode1 = a;
        }
        if (0x11 <= charCode1 && charCode1 <= 0x13) {
            // Special character
            let oneCode = b;
            if (charCode1 === 0x11) {
                oneCode = b + 0x50;
            } else if (charCode1 === 0x12) {
                oneCode = b + 0x70;
            } else {
                oneCode = b + 0x90;
            }
            charCodes = [oneCode];
        } else if (0x20 <= a && a <= 0x7f) {
            charCodes = (b === 0) ? [a] : [a, b];
        }
        return charCodes as number[];
    }

    private hasBackgroundAttributes(ccData1: number, ccData2: number): boolean {
        return (((ccData1 === 0x10 || ccData1 === 0x18) && (0x20 <= ccData2 && ccData2 <= 0x2f)) ||
                ((ccData1 === 0x17 || ccData1 === 0x1f) && (0x2d <= ccData2 && ccData2 <= 0x2f)));
    }

    public parseBackgroundAttributes(a: number, b: number): boolean {
        let bkgData: ISerializedPenState;
        let index;
        let chNr;
        let channel;
        if (!this.hasBackgroundAttributes(a, b)) {
            return false;
        }
        bkgData = {};
        if (a  === 0x10 || a === 0x18) {
            index = Math.floor((b - 0x20) / 2);
            bkgData.background = PAC_DATA_COLORS[index];
            if (b % 2 === 1) {
                bkgData.background = bkgData.background + "_semi";
            }
        } else if (b === 0x2d) {
            bkgData.background = "transparent";
        } else {
            bkgData.foreground = "black";
            if (b === 0x2f) {
                bkgData.underline = true;
            }
        }
        chNr = (a < 0x18) ? 1 : 2;
        channel = this.channels[chNr - 1];
        channel.setBkgData(bkgData);
        return true;
    }

    public reset(): void {
        this.channels
            .filter(Boolean)
            .forEach((channel) => channel.reset());
    }

}

/**
 * Get the data view of the SEI data
 */
function getSEIData(raw: DataView, startPos: number, endPos: number): DataView {

    let data = [];

    for (let x = startPos; x < endPos; x++) {
        if (x + 2 < endPos && raw.getUint8(x) === 0x00 && raw.getUint8(x + 1) === 0x00 && raw.getUint8(x + 2) === 0x03) {
            data.push(0x00);
            data.push(0x00);
            x += 2;
        } else {
            data.push(raw.getUint8(x));
        }
    }

    return new DataView(new Uint8Array(data).buffer);

}

function isCCType(type: number): boolean {
    return type === 0 || type === 1;
}

function isStartOfCCDataHeader(payloadType: number, sei: DataView, pos: number): boolean {
    return payloadType === 4 && sei.getUint32(pos) === 3036688711 && sei.getUint32(pos + 4) === 1094267907;
}

function isNonEmptyCCData(ccData1: number, ccData2: number): boolean {
    return (ccData1 & 0x7f) > 0 || (ccData2 & 0x7f) > 0;
}

function isRBSPNalUnitType(unitType: number): boolean {
    return unitType === 0x06;
}

function parseCCDataFromSEI(sei: DataView, fieldData: number[][]): void {
    let x = 0;
    while (x < sei.byteLength) {
        let payloadType = 0;
        let payloadSize = 0;
        let now;
        do {
            payloadType += now = sei.getUint8(x++);
        } while (now === 0xFF);
        do {
            payloadSize += now = sei.getUint8(x++);
        } while (now === 0xFF);
        if (isStartOfCCDataHeader(payloadType, sei, x)) {
            let pos = x + 10;
            let ccCount = pos + (sei.getUint8(pos - 2) & 0x1F) * 3;
            for (let i = pos; i < ccCount; i += 3) {
                let byte = sei.getUint8(i);
                if (byte & 0x4) {
                    let ccType = byte & 0x3;
                    if (isCCType(ccType)) {
                        let ccData1 = sei.getUint8(i + 1);
                        let ccData2 = sei.getUint8(i + 2);
                        if (isNonEmptyCCData(ccData1, ccData2)) {
                            fieldData[ccType].push(ccData1, ccData2);
                        }
                    }
                }
            }
        }
        x += payloadSize;
    }
}

function getCCData(raw: DataView, startPos: number, size: number): number[][] {
    let nalSize: number;
    let fieldData: number[][] = [[], []];
    for (let i = startPos; i < startPos + size - 5; i++) {
        nalSize = raw.getUint32(i);
        if (isRBSPNalUnitType(raw.getUint8(i + 4) & 0x1F)) {
            parseCCDataFromSEI(getSEIData(raw, i + 5, i + nalSize + 3), fieldData);
        }
        i += nalSize + 3;
    }
    return fieldData;
}

/** Incalculate interpreter (esolang)
 * I'm not sure what this is yet
 */

global.STACK = [[], [], []]
global.STACKP = 0 // index of the current stack
global.INSSET = 0
global.PC = 0
global.HALT = false
global.OUTBUFFER = ''
global.REGISTER = {
    pop: 0
}
const fs = require('fs');
const instructions = require('./instructions');
var file = fs.readFileSync('./code.txt').toString();
const util = require('util');
var split = file.split('')

global.SECTIONS = [];
global.CURRENT_SECTION = -1;

var sectionPointer = 0;
var findingBracket = false;
var tempBrackets = [];
var tbPointer = 0;

for (let i=0; i<split.length; i++) {
    let j = split[i]
    console.log(tbPointer, j, i)
    if (j === '[') {
        console.log(tbPointer, sectionPointer)
        tempBrackets[tbPointer++] = (i);
    }
    if (j === ']') {
        console.log(sectionPointer, tbPointer, util.inspect(tempBrackets))
        let h = tbPointer
        h -= 1
        console.log(h, tempBrackets[h], tempBrackets)
        SECTIONS[sectionPointer++] = [(tempBrackets[h]), parseInt(i)];
        tbPointer = h;
    }
}

global.SECTION_START = Object.values(SECTIONS).map(a => a[0]);
global.SECTION_END = Object.values(SECTIONS).map(a => a[1]);
// idea by el, hacks by me

console.log('----- DEBUGGING INFORMATION -----')
console.log(util.inspect(SECTIONS))
console.log(util.inspect(SECTION_START), util.inspect(SECTION_END));
console.log('----- END DEBUG INFORMATION -----')

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

let numbermode = false
let numbuffer = ''

let smode = false // string literal mode
let sbuffer = ''

global.closestMarker = 0

function commitNumbermode() {
    if (numbermode) {
        numbermode = false
        if (numbuffer.length > 0){
            STACK[STACKP].push(parseInt(numbuffer))
        }
        numbuffer = ''
    }
}

function commitStringmode() {
    smode = false
    for (let i of sbuffer) {
        STACK[STACKP].push(i.charCodeAt(0))
    }
    sbuffer = ''
}

while (true) {
    if (HALT) {
        commitNumbermode()
        commitStringmode()
        break
    }
    let currentIns = split[PC]
    for (let i in SECTIONS) {
        if (PC >= SECTIONS[i][0] && PC <= SECTIONS[i][1]) {
            CURRENT_SECTION = parseInt(i)
            break
        } else {
            CURRENT_SECTION = -1
        }
    }
    console.log(PC, CURRENT_SECTION, currentIns)
    PC++
    if (!currentIns) {
        commitNumbermode()
        commitStringmode()
        break
    }
    if (!smode && [' ', '[', ']'].includes(currentIns)) {
        continue
    }
    if (currentIns === '@') {
        if (numbermode) commitNumbermode()
        numbermode = true
        continue
    }
    if (currentIns === '"') {
        if (smode) {
            commitStringmode()
            continue
        }
        smode = true
        continue
    }
    if (smode) {
        sbuffer = sbuffer + currentIns
        continue
    }
    if (currentIns === ',') {
        INSSET--
        if (INSSET < 0) {
            INSSET = instructions.length-1
        }
        continue
    }
    if (currentIns === '.') {
        INSSET++
        if (INSSET > instructions.length) {
            INSSET = 0
        }
        continue
    }
    if (numbers.includes(currentIns)) {
        if (numbermode) {
            numbuffer = numbuffer + currentIns
            continue
        }
        STACK[STACKP].push(parseInt(numbers[numbers.indexOf(currentIns)]))
        continue
        // Excuse the horrible hack above
    } else {
        commitNumbermode()
    }
    let insfun = instructions[INSSET][currentIns];
    if (insfun) {
        insfun()
    } else {
        throw new Error(`Runtime error: Unknown instruction ${currentIns} for instruction set ${INSSET}!`)
    }
}

console.log(OUTBUFFER || 'No output.')
console.log()

console.log('Execution finished. Stacks:')
console.log(STACK)
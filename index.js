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
var split = file.split('')

var bracket = {};
var findingBracket = false;
var firstBracket = null;

for (let i=split.length; i>0; i--) {
    let j = split[i]
    if (j === ']') {
        if (findingBracket)
            throw new Error("Syntax error: ] found while searching for [!");
        firstBracket = parseInt(i);
        findingBracket = true;
    }
    if (j === '[') {
        if (!findingBracket)
            throw new Error("Syntax error: [ found without matching ]!");
        bracket[parseInt(firstBracket)] = parseInt(i);
        findingBracket = false;
    }
}

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
    let currentIns = split[PC++]
    if (!currentIns) {
        commitNumbermode()
        commitStringmode()
        break
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
    if (currentIns === '!') {
        closestMarker = PC
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
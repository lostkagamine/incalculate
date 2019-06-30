/** The Incalculate instruction set
 *  for the reference JavaScript interpreter
 *  (C) 2019
 */

module.exports = [
    {
        '>': function() { // moves forward in the stacklist
            STACKP++
            if (STACKP >= STACK.length) {
                STACKP = 0;
            }
        },
        '<': function() { // moves backward in the stacklist
            STACKP--
            if (STACKP < 0) {
                STACKP = STACK.length
            }
        },
        '+': function() { // numerical add
            let cstk = STACK[STACKP];
            cstk.push(cstk.pop() + cstk.pop());
        },
        '-': function() { // numerical subtract
            let cstk = STACK[STACKP];
            cstk.push(cstk.pop() - cstk.pop());
        },
        '/': function() { // numerical divide
            let cstk = STACK[STACKP];
            cstk.push(cstk.pop() / cstk.pop());
        },
        '*': function() { // numerical multiply
            let cstk = STACK[STACKP];
            cstk.push(cstk.pop() * cstk.pop());
        },
        'n': function() {}, // nop
        'E': function() { // halt
            HALT = true;
        },
        '?': function() { // restart section
            if (parseInt(CURRENT_SECTION) !== -1) {
                PC = SECTIONS[parseInt(CURRENT_SECTION)][0]
            }
        },
        '!': function() { // jump to end of section
            if (parseInt(CURRENT_SECTION) !== -1) {
                PC = SECTIONS[parseInt(CURRENT_SECTION)][1]
            }
        },
        'z': function() { // skip instruction if less than or equal to 0
            let cstk = STACK[STACKP];
            if (cstk[0] <= 0) {
                PC++
            }
        },
        'Z': function() { // skip instruction if greater than 0
            let cstk = STACK[STACKP];
            if (cstk[0] > 0) {
                PC++
            }
        },
        'v': function() { // skip instruction if value on stack is falsey
            let cstk = STACK[STACKP];
            if (!cstk[0]) {
                PC++
            }
        },
        'V': function() { // skip instruction if value on stack is truthy
            let cstk = STACK[STACKP];
            if (!!cstk[0]) {
                PC++
            }
        },
        'p': function() { // pop
            REGISTER.pop = STACK[STACKP].pop();
        },
        'o': function() { // add ASCII value to outbuffer
            OUTBUFFER = OUTBUFFER + String.fromCharCode(REGISTER.pop);
        },
        'O': function() { // add number to outbuffer
            OUTBUFFER = OUTBUFFER + REGISTER.pop.toString()
        },
        'P': function() { // print outbuffer
            console.log(OUTBUFFER)
        },
        'D': function() { // DEBUG: print the current stack
            console.log(STACK[STACKP]);
        },
        'd': function() { // DEBUG: print the stacks
            console.log(STACK);
        },
        'R': function() { // outbuffer reset
            OUTBUFFER = ''
        },
        'r': function() { // reverse the current stack
            STACK[STACKP] = STACK[STACKP].reverse()
        },
        'h': function() { // push the pop register to the stack
            STACK[STACKP].push(REGISTER.pop)
        },
        'x': function() { // destroy last value on stack
            STACK[STACKP].pop()
        }
    },
    {
        'f': function() { // floor
            STACK[STACKP].push(Math.floor(STACK[STACKP].pop()))
        },
        'F': function() { // ceil
            STACK[STACKP].push(Math.ceil(STACK[STACKP].pop()))
        },
        'n': function() { // bitwise not
            let cstk = STACK[STACKP]
            cstk.push(~(cstk.pop()))
        },
        'O': function() { // bitwise xor
            let cstk = STACK[STACKP]
            cstk.push(cstk.pop() ^ cstk.pop())
        },
        'o': function() { // bitwise or
            let cstk = STACK[STACKP]
            cstk.push(cstk.pop() | cstk.pop())
        }
    }
]
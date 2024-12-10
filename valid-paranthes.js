function isValid(str) {
    const charType = {
        "(": {
            type: 'open',
            match: ')'
        },
        "[": {
            type: 'open',
            match: ']'
        },
        ")": {
            type: 'close',
            match: '('
        },
        "]": {
            type: 'close',
            match: '['
        }
    }
    let counter = 0
    const stack = []
    for (let i=0 ; i < str.length; i++) {
        const char = str[i]
        if(charType[char].type === 'open') {
            counter++
            stack.push(char)
        }

        if(charType[char].type === 'close') {
            const lastOpen = stack.pop()
            
            if(lastOpen !== charType[char].match) {
                
                return false
            } else {
                counter--
            }
        }
    }
    if(counter !== 0) {
        return false
    }
    return true
}

console.log(isValid("((()))[]"))

// input "(([]))" return ture
// input "((])" return false
// input "()()" return true
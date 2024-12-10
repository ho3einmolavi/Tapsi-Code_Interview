function match(array1, array2) {
    const array1Map = createMap(array1);
    const array2Map = createMap(array2)
    console.log({ array1Map, array2Map })
    const result = []
    for (let i = 0; i < array1.length; i++) {
        const count = array1Map.get(array1[i])
        if (count === 1 && array2Map.has(array1[i]) && array2Map.get(array1[i]) === 1) {
            result.push(array1[i])
        }
    }
    return result
}

function createMap(array) {
    const map = new Map()
    for (let i = 0; i < array.length; i++) {
        const element = array[i]
        if (!map.has(element)) {
            map.set(element, 1)
        } else {
            // console.log(element)
            let elementCount = map.get(element)
            // console.log(elementCount)
            elementCount +=1
            // console.log(elementCount)
            map.set(element, elementCount)
        }
    }
    return map
}

console.log(match(['yektanet', 'is', 'a', 'place', 'a'], ['yek', 'yektanet', 'place', 'a']))
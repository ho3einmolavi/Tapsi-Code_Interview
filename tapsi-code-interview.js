// In-place quicksort function
function quicksort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pivotIndex = partition(arr, low, high)
        quicksort(arr, low, pivotIndex - 1)
        quicksort(arr, pivotIndex + 1, high)
    }
}

function partition(arr, low, high) {
    let pivot = arr[high]
    let i = low - 1
    
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++
            [arr[i], arr[j]] = [arr[j], arr[i]]
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    return i + 1
}

function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1
    while (low <= high) {
        let mid = Math.floor((low + high) / 2)
        if (arr[mid] === target) return mid
        else if (arr[mid] < target) low = mid + 1
        else high = mid - 1
    }
    return -1
}

function appearsOnce(sortedArray, targetIndex) {
    if (targetIndex === 0) {
        return sortedArray[targetIndex] !== sortedArray[targetIndex + 1]
    }
    if (targetIndex === sortedArray.length - 1) {
        return sortedArray[targetIndex] !== sortedArray[targetIndex - 1]
    }
    
    return sortedArray[targetIndex] !== sortedArray[targetIndex - 1] &&
           sortedArray[targetIndex] !== sortedArray[targetIndex + 1]
}


function findCommonUnique(l1, l2) {
    quicksort(l1)
    quicksort(l2)
    const result = []
    
    for (let i = 0; i < l1.length; i++) {
        if (appearsOnce(l1, i)) {
            const targetIndex = binarySearch(l2, l1[i])
            if (targetIndex >=0 && appearsOnce(l2, targetIndex)) {
                result.push(l1[i])
            }
        }
    }
    
    return result
}

const l1 = ['a', 'b', 'c', 'e', 'r', 't', 'p']
const l2 = ['b', 'c', 'p', 'r', 't', 'a', 'd', 'c', 'r', 'x']
const result = findCommonUnique(l1, l2)
console.log(result) // output: [ 'a', 'b', 'p', 't' ]

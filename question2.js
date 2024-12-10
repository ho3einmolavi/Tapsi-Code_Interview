function main(arr) {
    const arrayMap = new Map(arr.map(value => [value, true]))  // O(n)
    sortedArray = arr.sort() // O(n)
    for(let i=0; i < sortedArray.length; i++) { // O(n)
        for(let j = i + 1; j < sortedArray.length; j++) { // O(n - 1)
            if(arr[j]) {
                const sum = sortedArray[i] + sortedArray[j]
                // find sum in array
                if(arrayMap.has(sum)) { // O(1)
                    console.log([sortedArray[i], sortedArray[j], sum]) // O(1)
                }
            }
        }
    }
}  // 2 O(n) + O(n^2) ==> O(n^2)

// input [3,1,2] => [1,2,3]
// input [3,2,1,4] => [1,3,4], [1,2,3]

// [1,2,3,4, 5] => 

main([-1,0,1,2,3,4])
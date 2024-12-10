const versions = [
    '0.1',
    '0.2.1',
    '0.4',
    '1.0.1',
    '2.1',
    '3',
    '3.1',
    '2.3.45',
    '1.0.12.2',
    '0.3',
    '0.9',
    '9.1',
    '1.10.0',
];

function compareVersions(versionA, versionB) {
    const partsA = versionA.split('.').map(Number)
    const partsB = versionB.split('.').map(Number)

    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const n1 = partsA[i] || 0
        const n2 = partsB[i] || 0

        if (n1 < n2) return -1
        if (n1 > n2) return 1
    }
    return 0
}

console.log(versions)

//javascript sort function
versions.sort(compareVersions)

//print sorted versions
console.log(versions)

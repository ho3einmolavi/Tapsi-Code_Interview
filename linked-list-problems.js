class Node {
    constructor(value) {
        this.value = value
        this.next = null
    }
}

const a = new Node(2)
const b = new Node(3)
const c = new Node(7)
const d = new Node(6)
const e = new Node(5)
a.next = b
b.next = c
c.next = d
d.next = e

function linkedListSum(head) {
    let currentNode = head
    let sum = 0
    while(currentNode !== null) {
        sum += currentNode.value
        currentNode = currentNode.next
    }
    return sum
}

function findTargetValue(head, target) {
    let currentNode = head
    while(currentNode !== null) {
        if(currentNode.value === target) {
            return true
        }
        currentNode = currentNode.next
    }
    return false
}

function reverse(head) {
    let currentNode = head
    let prev = null
    while(currentNode !== null) {
        stack.push(currentNode)
        currentNode = currentNode.next
    }
}

function findNodeValueByIndex(head, index) {
    if(index === 0) {
        return head.value
    }
    let currentNode = head
    let counter = 0
    while(currentNode !== null) {
        if(counter === index) {
            return currentNode.value
        }
        currentNode = currentNode.next
        counter++
    }
    return null
}

// console.log(linkedListSum(a))
// console.log(findTargetValue(a, 1))
// console.log(findNodeValueByIndex(a, 3))
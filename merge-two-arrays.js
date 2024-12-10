// Definition for singly-linked list
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}

/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    console.log('List 1:', JSON.stringify(list1));
    console.log('List 2:', JSON.stringify(list2));

    // Create a dummy node to act as the starting point of the merged list
    let dummy = new ListNode(-1);
    let current = dummy;
    
    // Traverse both lists until we reach the end of one of them
    while (list1 !== null && list2 !== null) {
        if (list1.val <= list2.val) {
            current.next = list1;  // Add list1 node to merged list
            list1 = list1.next;    // Move list1 pointer forward
        } else {
            current.next = list2;  // Add list2 node to merged list
            list2 = list2.next;    // Move list2 pointer forward
        }
        current = current.next;    // Move the current pointer in the merged list
    }
    
    // If one of the lists is not fully traversed, append the remaining part
    if (list1 !== null) {
        current.next = list1;
    } else if (list2 !== null) {
        current.next = list2;
    }
    
    // The merged list starts from dummy.next
    return dummy.next;
};

// Helper function to print the linked list
function printList(head) {
    let result = [];
    let current = head;
    while (current !== null) {
        result.push(current.val);
        current = current.next;
    }
    console.log(result);
}

// Example usage
const list1 = new ListNode(1, new ListNode(2, new ListNode(4)));
const list2 = new ListNode(1, new ListNode(3, new ListNode(4)));

const mergedList = mergeTwoLists(list1, list2);
printList(mergedList); // Output the merged list

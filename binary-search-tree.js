class Node {
    constructor(data) {
        this.data = data
        this.right = null
        this.left = null
    }
}


class BinarySearchTree {
    constructor(root) {
        this.root = null
    }

    // Get the root of the tree
    getRootNode() {
        return this.root;
    }

    insert(data) {
        const newNode = new Node(data)
        if (this.root === null) {
            this.root = newNode
        } else {
            this.insertNode(this.root, newNode)
        }
    }

    insertNode(node, newNode) {
        if (newNode.data < node.data) {
            if (node.left === null) {
                node.left = newNode
            } else {
                this.insertNode(node.left, newNode)
            }
        }
        else {
            if (node.right === null) {
                node.right = newNode
            } else {
                this.insertNode(node.right, newNode)
            }
        }
    }

    search(node, data) {
        if (node === null) {
            return null
        }

        if (data < node.data) {
            this.search(node.left, data)
        } else if (data > node.data) {
            this.search(node.right, data)
        } else {
            console.log('whaaaaat', node)
            return node
        }
    }

    remove(data) {
        this.root = this.removeNode(this.root, data);
    }

    removeNode(node, data) {
        if (node === null) {
            return null;
        }
        if (data < node.data) {
            node.left = this.removeNode(node.left, data);
            return node;
        } else if (data > node.data) {
            node.right = this.removeNode(node.right, data);
            return node;
        } else {
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }

            if (node.left === null) {
                node = node.right;
                return node;
            } else if (node.right === null) {
                node = node.left;
                return node;
            }

            // Node with two children: Get the inorder successor
            const aux = this.findMinNode(node.right);
            node.data = aux.data;
            node.right = this.removeNode(node.right, aux.data);
            return node;
        }
    }

    findMinNode(node) {
        if (node.left === null) {
            return node;
        } else {
            return this.findMinNode(node.left);
        }
    }

     // Inorder traversal of the tree
     inorder(node) {
        if (node !== null) {
            this.inorder(node.left);
            console.log(node.data);
            this.inorder(node.right);
        }
    }

    // Preorder traversal of the tree
    preorder(node) {
        if (node !== null) {
            console.log(node.data);
            this.preorder(node.left);
            this.preorder(node.right);
        }
    }

    // Postorder traversal of the tree
    postorder(node) {
        if (node !== null) {
            this.postorder(node.left);
            this.postorder(node.right);
            console.log(node.data);
        }
    }

    // Display the tree with lines connecting nodes
    display(root = this.root) {
        if (!root) return;

        const height = this.getHeight(root);
        const width = Math.pow(2, height) - 1;
        const res = Array.from({ length: height * 2 }, () => Array(width).fill(" "));

        const fill = (node, row, left, right) => {
            if (!node) return;
            const mid = Math.floor((left + right) / 2);
            res[row][mid] = node.data.toString();

            if (node.left) {
                res[row + 1][mid - 1] = "/";
                fill(node.left, row + 2, left, mid - 1);
            }

            if (node.right) {
                res[row + 1][mid + 1] = "\\";
                fill(node.right, row + 2, mid + 1, right);
            }
        };

        fill(root, 0, 0, width - 1);

        res.forEach(row => console.log(row.join("")));
    }

    getHeight(node) {
        if (!node) return 0;
        return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }
}

const BST = new BinarySearchTree();
BST.insert(15);
BST.insert(25);
BST.insert(10);
BST.insert(7);
BST.insert(22);
BST.insert(17);
BST.insert(20);
BST.insert(2);
BST.insert(13);
BST.insert(5);
BST.insert(9);
BST.insert(27);
BST.insert(18);

const root = BST.getRootNode()
BST.display()
console.log("Inorder traversal:");
BST.inorder(root);

console.log("Preorder traversal:");
BST.preorder(root);

console.log("Postorder traversal:");
BST.postorder(root);

console.log("Tree structure:");
BST.display(root);

// console.log("Search for 17:");
// const node = BST.search(root, 17);
// console.log({node})

// if (node !== null) {
//     console.log("Found node with data:", node.data);
// } else {
//     console.log("Node not found.");
// }

BST.remove(17);
console.log("Inorder traversal after removing 17:");
BST.inorder(root);

console.log("Tree structure after removing 17:");
BST.display(root);
# merkle-tools

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
[![npm](https://img.shields.io/npm/l/merkle-tools.svg)](https://www.npmjs.com/package/merkle-tools)
[![npm](https://img.shields.io/npm/v/merkle-tools.svg)](https://www.npmjs.com/package/merkle-tools)

Tools for creating Merkle trees, generating merkle proofs, and verification of merkle proofs.

## Installation

```
$ npm install --save merkle-tools
```

### Create MerkleTools Object

```js
var MerkleTools = require('merkle-tools')

var treeOptions = {
  hashType: 'md5' // optional, defaults to 'sha256'
}
// valid hashTypes include all crypto hash algorithms
// such as 'MD5', 'SHA1', 'SHA224', 'SHA256', 'SHA384', 'SHA512'
// as well as the SHA3 family of algorithms
// including 'SHA3-224', 'SHA3-256', 'SHA3-384', and 'SHA3-512'

var merkleTools = new MerkleTools(treeOptions) // treeOptions is optional
```

## Methods

### addLeaf(value, doHash)

Adds a value as a leaf to the tree. The value must be either a Buffer or a hex string, otherwise set the optional doHash to true to have your value hashed prior to being added to the tree. 

```js
var hexData = '05ae04314577b2783b4be98211d1b72476c59e9c413cfb2afa2f0c68e0d93911'
var otherData = 'Some text data, perhaps'

merkleTools.addLeaf(hexData)
merkleTools.addLeaf(otherData, true)
```

### addLeaves(valueArray, doHash)

Adds an array of values as leaves to the tree. The values must be either a Buffers or a hex strings, otherwise set the optional doHash to true to have your values hashed prior to being added to the tree. 

```js
var hexData = ['05ae04314577b2783b4be98211d1b72476c59e9c413cfb2afa2f0c68e0d93911', 'c5ed1192d909d1af814f64c7dc9e6a4983a63891a2c59ed14448d90271cb5519', 
'4bac27393bdd9777ce02453256c5577cd02275510b2227f473d03f533924f877']
var otherData = ['l', 'm', 'n', 'o', 'p']

merkleTools.addLeaves(hexData)
merkleTools.addLeaves(otherData, true)
```

### getLeafCount()

Returns the number of leaves that are currently added to the tree. 

```js
var leafCount =  merkleTools.getLeafCount()
```

### getLeaf(index)

Returns the value of the leaf at the given index as a Buffer. Returns null if no leaf exists at the given index. 

```js
var leafValue =  merkleTools.getLeaf(5)
```

### resetTree()

Removes all the leaves from the tree, prepararing to begin creating a new tree.

```js
merkleTools.resetTree()
```

### makeTree(doubleHash)

Generates the merkle tree using the leaves that have been added.

```js
var doubleHash = false // true to hash pairs twice as the tree is constructed 

merkleTools.makeTree(doubleHash)
```

### makeBTCTree(doubleHash)

Generates the merkle tree with the flawed Bitcoin merkle tree implementation.
This should only be used when you need to replicate Bitcoin constructed merkle trees.

```js
var doubleHash = true // true to hash pairs twice as the tree is constructed 

merkleTools.makeBTCTree(doubleHash)
```

### getTreeReadyState()

Returns boolean indicating if the tree is built and ready to supply its root and proofs. The Ready state is True only after the tree is built with 'makeTree'.  Adding leaves or resetting the tree will change the ready state to False.

```js
var isReady =  merkleTools.getTreeReadyState()
```

### getMerkleRoot()

Returns the merkle root of the tree as a Buffer. If the tree is not ready, null is returned.

```js
var rootValue = merkleTools.getMerkleRoot()
```

### getProof(index, asBinary)

Returns the proof as an array of hash objects or array of Buffers for the leaf at the given index. If the tree is not ready or no leaf exists at the given index, null is returned.  

```js
var proof = merkleTools.getProof(2)

// By default, an array of hash objects is returned
// example: 
// proof == [
//   { right: '09096dbc49b7909917e13b795ebf289ace50b870440f10424af8845fb7761ea5' },
//   { right: 'ed2456914e48c1e17b7bd922177291ef8b7f553edf1b1f66b6fc1a076524b22f' },
//   { left: 'eac53dde9661daf47a428efea28c81a021c06d64f98eeabbdcff442d992153a8' }
// ]

var proof = merkleTools.getProof(2, true)

// With asBinary set to true, an array of Buffers is returned 
// 0x00 indicated 'left', 0x01 indicates 'right'
// example: 
// proof == [
//   <Buffer 01>,
//   <Buffer 09096dbc49b7909917e13b795ebf289ace50b870440f10424af8845fb7761ea5>,
//   <Buffer 01>
//   <Buffer ed2456914e48c1e17b7bd922177291ef8b7f553edf1b1f66b6fc1a076524b22f>,
//   <Buffer 00>
//   <Buffer eac53dde9661daf47a428efea28c81a021c06d64f98eeabbdcff442d992153a8>
// ]
```

The proof array contains a set of merkle sibling objects. Each object contains the sibling hash, with the key value of either right or left. The right or left value tells you where that sibling was in relation to the current hash being evaluated. This information is needed for proof validation, as explained in the following section.

### validateProof(proof, targetHash, merkleRoot, doubleHash)

Returns a boolean indicating whether or not the proof is valid and correctly connects the targetHash to the merkleRoot. Proof is a proof array as supplied by the 'getProof' method. The targetHash and merkleRoot parameters must be Buffers or hex strings. Setting doubleHash to true will double each hash operation to match the Bitcoin merkle tree style.

```js
var proof = [
   { right: '09096dbc49b7909917e13b795ebf289ace50b870440f10424af8845fb7761ea5' },
   { right: 'ed2456914e48c1e17b7bd922177291ef8b7f553edf1b1f66b6fc1a076524b22f' },
   { left: 'eac53dde9661daf47a428efea28c81a021c06d64f98eeabbdcff442d992153a8' },
 ]
var targetHash = '36e0fd847d927d68475f32a94efff30812ee3ce87c7752973f4dd7476aa2e97e'
var merkleRoot = 'b8b1f39aa2e3fc2dde37f3df04e829f514fb98369b522bfb35c663befa896766'

var isValid = merkleTools.validateProof(proof, targetHash, merkleRoot)
```

The proof process uses all the proof objects in the array to attempt to prove a relationship between the targetHash and the merkleRoot values. The steps to validate a proof are:

1. Concatenate targetHash and the first hash in the proof array. The right or left designation specifies which side of the concatenation that the proof hash value should be on.
2. Hash the resulting value.
3. Concatenate the resulting hash with the next hash in the proof array, using the same left and right rules.
4. Hash that value and continue the process until you’ve gone through each item in the proof array.
5. The final hash value should equal the merkleRoot value if the proof is valid, otherwise the proof is invalid.

## Common Usage

### Creating a tree and generating the proofs

```js
var MerkleTools = require('merkle-tools')

var merkleTools = new MerkleTools() // no options, defaults to sha-256 hash type

// add some leaves to the tree
merkleTools.addLeaf('7d49f074d2c3fa193e305bc109892f20760cbbecc218b43394a9356da35a72b3')
merkleTools.addLeaf('ba78a656108137a01f104b82a3554cedffce9f36e8a4149d68e0310b0943c09d')
merkleTools.addLeaves(['x', 'y', 'z'], true) // we must indicate these values need to be hashed

merkleTools.makeTree()

var proof0 = merkleTools.getProof(0)
var proof1 = merkleTools.getProof(1)
var proof2 = merkleTools.getProof(2)

merkleTools.resetTree() // use this when done with this tree and you intend on creating a new one

```

## Notes

### About tree generation using makeTree()

1. Internally, leaves are stored as Buffers. When the tree is built, it is generated by hashing together the Buffer values. 
2. Lonely leaf nodes are promoted to the next level up, as depicted below.

                         ROOT=Hash(H+E)
                         /        \
                        /          \
                 H=Hash(F+G)        E
                 /       \           \
                /         \           \
         F=Hash(A+B)    G=Hash(C+D)    E
          /     \        /     \        \
         /       \      /       \        \
        A         B    C         D        E


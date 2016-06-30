# merkle-tools

[![npm](https://img.shields.io/npm/l/merkle-tools.svg)](https://www.npmjs.com/package/merkle-tools)
[![npm](https://img.shields.io/npm/v/merkle-tools.svg)](https://www.npmjs.com/package/merkle-tools)

Tools for creating Merkle trees, generating merkle proofs, and verification of merkle proofs.

## Installation

```
$ npm install --save merkle-tools
```

### Create MerkleTools Object

```js
var merkletools = require('merkle-tools');

var treeOptions = {
  hashType: 'md5', // optional, any valid crypto hash algorithm, defaults to 'sha256'
};

var merkleTools = new merkletools(treeOptions); // treeOptions is optional
```

## Usage

### addLeaf(value, doHash)

Adds a leaf to the tree. The value must be either a Buffer or a hex string, otherwise set the optional doHash to true to have your value hashed prior to being added to the tree. 

```js
var hexData = '05ae04314577b2783b4be98211d1b72476c59e9c413cfb2afa2f0c68e0d93911';
var otherData = 'Some text data, perhaps';

merkleTools.addLeaf(hexData);
merkleTools.addLeaf(otherData, true);
```


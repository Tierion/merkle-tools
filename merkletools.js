/*jslint node: true */
'use strict';

var crypto = require('crypto');

var MerkleTools = function (treeOptions) {
    // in case 'new' was omitted
    if (!(this instanceof MerkleTools)) {
        return new MerkleTools(treeOptions);
    }

    var hashType = 'sha256';
    if (treeOptions) { //if tree options were supplied, then process them

        if (treeOptions.hashType !== undefined) { // set the hash function to the user's choice
            hashType = treeOptions.hashType;
        }
    }
    this.hashFunction = function (value) {
        return crypto.createHash(hashType).update(value).digest();
    };
    this.tree = {};
    this.tree.leaves = [];
    this.tree.levels = [];
    this.tree.isReady = false;
};

////////////////////////////////////////////
// Primary functions
////////////////////////////////////////////

// Resets the current tree to empty
MerkleTools.prototype.resetTree = function () {
    this.tree = {};
    this.tree.leaves = [];
    this.tree.levels = [];
    this.tree.isReady = false;
};

// Add a leaf to the tree
// Accepts hash value as a Buffer or hex string
MerkleTools.prototype.addLeaf = function (value) {
    this.tree.isReady = false;
    this.tree.leaves.push(this._getBuffer(value));
};

// Add a leaves to the tree
// Accepts hash values as an array of Buffers or hex strings
MerkleTools.prototype.addLeaves = function (valuesArray) {
    this.tree.isReady = false;
    var that = this;
    valuesArray.forEach(function (value) {
        that.tree.leaves.push(that._getBuffer(value));
    });
};

// Generates the merkle tree 
MerkleTools.prototype.makeTree = function () {
    this.tree.isReady = false;
    var leafCount = this.tree.leaves.length;
    if (leafCount > 0) { // skip this whole process if there are no leaves added to the tree
        var levelCount = Math.ceil(Math.log2(leafCount)) + 1;
        this.tree.levels.unshift(this.tree.leaves);
        while (this.tree.levels[0].length > 1) {
            this.tree.levels.unshift(this._calculateNextLevel());
        }
    }
    this.tree.isReady = true;
};

// Returns the merkle root value for the tree
MerkleTools.prototype.getMerkleRoot = function () {
    if (!this.tree.isReady) return null;
    return this.tree.levels[0][0].toString('hex');
};

// Returns the proof for a leaf at the given index as an array of merkle siblings in hex format
MerkleTools.prototype.getProof = function (index) {
    if (!this.tree.isReady) return null;
    var currentRowIndex = this.tree.levels.length - 1;
    if (index < 0 || index > this.tree.levels[currentRowIndex].length - 1) return null; // the index it out of the bounds of the leaf array

    var proof = [];
    for (var x = currentRowIndex; x > 0; x--) {

        var currentLevelNodeCount = this.tree.levels[x].length;
        // skip if this is an odd end node
        if (index == currentLevelNodeCount - 1 && currentLevelNodeCount % 2 == 1) {
            index = Math.floor(index / 2);
            continue;
        }

        // determine the sibling for the current index and get its value
        var isRightNode = index % 2;
        var siblingIndex = isRightNode ? (index - 1) : (index + 1);
        var sibling = {};
        var siblingPosition = isRightNode ? 'left' : 'right';
        var siblingValue = this.tree.levels[x][siblingIndex].toString('hex');
        sibling[siblingPosition] = siblingValue;

        proof.push(sibling);

        index = Math.floor(index / 2); // set index to the parent index
    }

    return proof;
};

// Takes a proof array, a target hash value, and a merkle root
// Checks the validity of the proof and return true or false
MerkleTools.prototype.validateProof = function (proof, targetHash, merkleRoot) {
    targetHash = this._getBuffer(targetHash);
    merkleRoot = this._getBuffer(merkleRoot);
    if (proof.length === 0) return targetHash.toString('hex') == merkleRoot.toString('hex'); // no siblings, single item tree, so the hash should also be the root

    var proofHash = targetHash;
    for (var x = 0; x < proof.length; x++) { 
        if(proof[x].left === undefined) { // then the sibling is a right node
            proofHash = this.hashFunction(Buffer.concat([proofHash, this._getBuffer(proof[x].right)]));
        } else { // the sibling is a left node
            proofHash = this.hashFunction(Buffer.concat([this._getBuffer(proof[x].left), proofHash]));
        }        
    }
    return proofHash.toString('hex') == merkleRoot.toString('hex');
};

//////////////////////////////////////////
// Utility functions
//////////////////////////////////////////

// Internally, trees are made of nodes containing Buffer values only
// This helps ensure that leaves being added are Buffers, and will convert hex to Buffer if needed
MerkleTools.prototype._getBuffer = function (value) {
    return (value instanceof Buffer ? value : new Buffer(value, 'hex'));
};

// Calculates the next level of node when building the merkle tree
// These values are calcalated off of the current highest level, level 0 and will be prepended to the levels array
MerkleTools.prototype._calculateNextLevel = function () {
    var nodes = [];
    var topLevel = this.tree.levels[0];
    var topLevelCount = topLevel.length;
    for (var x = 0; x < topLevelCount; x += 2) {
        if (x + 1 <= topLevelCount - 1) { // concatonate and hash the pair, add to the next level array
            nodes.push(this.hashFunction(Buffer.concat([topLevel[x], topLevel[x + 1]])));
        }
        else { // this is an odd ending node, promote up to the next level by itself
            nodes.push(topLevel[x]);
        }
    }
    return nodes;
};

module.exports = MerkleTools;
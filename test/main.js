var should = require('should');
var assert = require('assert');
var crypto = require('crypto');
var merkletools = require('../merkletools.js');


var bLeft = new Buffer('a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb', 'hex');
var bRight = new Buffer('cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c', 'hex');
var mRoot = crypto.createHash('sha256').update(Buffer.concat([bLeft, bRight])).digest();

describe("make tree with addLeaves", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaves([
        'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb',
        'cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c'
    ]);
    merkleTools.makeTree();

    it("merkle root value should be correct", function () {
        assert.equal(merkleTools.getMerkleRoot(), mRoot.toString('hex'));
    });

});

describe("reset tree", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaves([
        'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb',
        'cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c'
    ]);
    merkleTools.makeTree();
    merkleTools.resetTree();

    it("tree should be empty", function () {
        assert.equal(merkleTools.tree.leaves.length, 0);
        assert.equal(merkleTools.tree.isReady, false);
    });
});

describe("make tree with addLeaf hex", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaf('a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb');
    merkleTools.addLeaf('cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c');
    merkleTools.makeTree();

    it("merkle root value should be correct", function () {
        assert.equal(merkleTools.getMerkleRoot(), mRoot.toString('hex'));
    });

});

describe("make tree with addLeaf buffers", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaf(bLeft);
    merkleTools.addLeaf(bRight);
    merkleTools.makeTree();

    it("merkle root value should be correct", function () {
        assert.equal(merkleTools.getMerkleRoot(), mRoot.toString('hex'));
    });

});

describe("proof left node", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaf(bLeft);
    merkleTools.addLeaf(bRight);
    merkleTools.makeTree();
    var proof = merkleTools.getProof(0);

    it("proof array should be correct", function () {
        assert.equal(proof[0].right, 'cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c');
    });

});

describe("proof right node", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaf(bLeft);
    merkleTools.addLeaf(bRight);
    merkleTools.makeTree();
    var proof = merkleTools.getProof(1);

    it("proof array should be correct", function () {
        assert.equal(proof[0].left, 'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb');
    });

}); 
describe("validate bad proof", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaf(bLeft);
    merkleTools.addLeaf(bRight);
    merkleTools.makeTree();
    var proof = merkleTools.getProof(1);
    var isValid = merkleTools.validateProof(proof, bRight, 'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb');

    it("proof should be invalid", function () {
        assert.equal(isValid, false);
    });

});


describe("validate good proof", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaf(bLeft);
    merkleTools.addLeaf(bRight);
    merkleTools.makeTree();
    var proof = merkleTools.getProof(1);
    var isValid = merkleTools.validateProof(proof, bRight, mRoot);


    it("proof should be valid", function () {
        assert.equal(isValid, true);
    });
    
});
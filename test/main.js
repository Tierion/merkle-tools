var should = require('should');
var assert = require('assert');
var crypto = require('crypto');
var merkletools = require('../merkletools.js');


var bLeft = new Buffer('a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb', 'hex');
var bRight = new Buffer('cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c', 'hex');
var mRoot = crypto.createHash('sha256').update(Buffer.concat([bLeft, bRight])).digest();


describe("make tree with addLeaves hex", function () {

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

describe("make tree with addLeaves buffers", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaves([
        bLeft, bRight
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
        assert.equal(merkleTools.getLeafCount(), 0);
        assert.equal(merkleTools.getTreeReadyState(), false);
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

describe("make tree with 1 leaf", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaves([
        'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
    ]);
    merkleTools.makeTree();

    it("merkle root value should be correct", function () {
        assert.equal(merkleTools.getMerkleRoot(), 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb');
    });

});

describe("make tree with 5 leaves", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaves([
        'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
        '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
        '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6',
        '18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4',
        '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea'
    ]);
    merkleTools.makeTree();

    it("merkle root value should be correct", function () {
        assert.equal(merkleTools.getMerkleRoot(), 'd71f8983ad4ee170f8129f1ebcdd7440be7798d8e1c80420bf11f1eced610dba');
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

describe("proof one node", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaf(bLeft);
    merkleTools.makeTree();
    var proof = merkleTools.getProof(0);

    it("proof array should be correct", function () {
        assert.deepEqual(proof, []);
    });

}); 

describe("validate bad proof 2 leaves", function () {

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


describe("validate bad proof 5 leaves", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaves([
        'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
        '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
        '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6',
        '18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4',
        '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea'
    ]);
    merkleTools.makeTree();
    var proof = merkleTools.getProof(3);
    var isValid = merkleTools.validateProof(proof, 'badc3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4', 'd71f8983ad4ee170f8129f1ebcdd7440be7798d8e1c80420bf11f1eced610dba');


    it("proof should be invalid", function () {
        assert.equal(isValid, false);
    });
    
});

describe("validate good proof 5 leaves", function () {

    var merkleTools = new merkletools();
    merkleTools.addLeaves([
        'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
        '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
        '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6',
        '18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4',
        '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea'
    ]);
    merkleTools.makeTree();
    var proof = merkleTools.getProof(0);
    var isValid = merkleTools.validateProof(proof, 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'd71f8983ad4ee170f8129f1ebcdd7440be7798d8e1c80420bf11f1eced610dba');


    it("proof should be valid", function () {
        assert.equal(isValid, true);
    });
    
});
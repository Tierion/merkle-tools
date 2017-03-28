'use strict'

var Benchmark = require('benchmark')

var suite = new Benchmark.Suite()
var crypto = require('crypto')
var MerkleTools = require('./merkletools.js')

var merkleTools = new MerkleTools()

var leafCount = 75000
var leaves = []
// generate random hashes to use as leaves
for (let x = 0; x < leafCount; x++) {
  leaves.push(crypto.randomBytes(32).toString('hex'))
}

// add test to populate leaves, build tree, generate proofs, and reset tree
suite.add(leafCount + 'leaves', function () {
  merkleTools.addLeaves(leaves) // add random leaves to tree
  merkleTools.makeTree() // build the merkle tree
  for (let x = 0; x < leafCount; x++) { // generate the merkle proofs for each leaf
    merkleTools.getProof(x)
  }
  merkleTools.resetTree() // clear the tree
}).on('cycle', function (event) {
  console.log(String(event.target))
}).on('complete', function () {
  console.log(this[0].stats)
}).run({ 'async': true })

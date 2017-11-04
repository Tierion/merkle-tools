/* global describe, it */

var assert = require('assert')
var crypto = require('crypto')
var MerkleTools = require('../merkletools.js')

var bLeft = Buffer.from('a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb', 'hex')
var bRight = Buffer.from('cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c', 'hex')
var mRoot = crypto.createHash('sha256').update(Buffer.concat([bLeft, bRight])).digest()
var bLeftmd5 = Buffer.from('0cc175b9c0f1b6a831c399e269772661', 'hex')
var bRightmd5 = Buffer.from('92eb5ffee6ae2fec3ad71c777531578f', 'hex')
var mRootmd5 = crypto.createHash('md5').update(Buffer.concat([bLeftmd5, bRightmd5])).digest()

describe('Test basic functions', function () {
  describe('make tree with no leaves', function () {
    var merkleTools = new MerkleTools()
    merkleTools.makeTree()

    it('merkle root value should be null', function () {
      assert.equal(merkleTools.getMerkleRoot(), null)
    })
  })

  describe('make tree with addLeaves hex', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb',
      'cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c'
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), mRoot.toString('hex'))
    })
  })

  describe('make tree with addLeaves buffers', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      bLeft, bRight
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), mRoot.toString('hex'))
    })
  })

  describe('getLeaf after running makeTree', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb',
      'cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c'
    ])
    merkleTools.makeTree()

    it('returned leaf should be in right spot', function () {
      assert.equal(merkleTools.getLeaf(0).toString('hex'), 'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb')
    })
  })

  describe('getLeaf out of bounds returns null after running makeTree', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb',
      'cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c'
    ])
    merkleTools.makeTree()

    it('out of bounds leaf position returns null', function () {
      assert.equal(merkleTools.getLeaf(3), null)
      assert.equal(merkleTools.getLeaf(-1), null)
    })
  })

  describe('getLeaf before running makeTree', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb',
      'cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c'
    ])

    it('returned leaf should be in right spot', function () {
      assert.equal(merkleTools.getLeaf(0).toString('hex'), 'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb')
    })
  })

  describe('getLeaf out of bounds returns null before running makeTree', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb',
      'cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c'
    ])

    it('out of bounds leaf position returns null', function () {
      assert.equal(merkleTools.getLeaf(3), null)
      assert.equal(merkleTools.getLeaf(-1), null)
    })
  })

  describe('reset tree', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb',
      'cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c'
    ])
    merkleTools.makeTree()
    merkleTools.resetTree()

    it('tree should be empty', function () {
      assert.equal(merkleTools.getLeafCount(), 0)
      assert.equal(merkleTools.getTreeReadyState(), false)
    })
  })

  describe('make tree with addLeaf hex', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaf('a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb')
    merkleTools.addLeaf('cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c')
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), mRoot.toString('hex'))
    })
  })

  describe('make tree with addLeaves hex', function () {
    var hashes = []
    hashes.push('a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb')
    hashes.push('cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c')

    var merkleTools = new MerkleTools()
    merkleTools.addLeaves(hashes)
    merkleTools.makeTree()
    var targetProof0 = merkleTools.getProof(0)
    var targetProof1 = merkleTools.getProof(1)

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), mRoot.toString('hex'))
      assert.equal(targetProof0.length, 1)
      assert.equal(targetProof1.length, 1)
    })
  })

  describe('make tree with addLeaf buffers', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaf(bLeft)
    merkleTools.addLeaf(bRight)
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), mRoot.toString('hex'))
    })
  })

  describe('make tree with addLeaf bad hex', function () {
    var merkleTools = new MerkleTools()

    it('error should be thrown', function () {
      assert.throws(function () { merkleTools.addLeaf('nothexandnothashed') }, Error)
    })
  })

  describe('make tree with 1 leaf', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb')
    })
  })

  describe('make tree with 5 leaves', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
      '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6',
      '18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4',
      '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea'
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), 'd71f8983ad4ee170f8129f1ebcdd7440be7798d8e1c80420bf11f1eced610dba')
    })
  })

  describe('make tree with 5 leaves individually needing hashing', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaf('a', true)
    merkleTools.addLeaf('b', true)
    merkleTools.addLeaf('c', true)
    merkleTools.addLeaf('d', true)
    merkleTools.addLeaf('e', true)
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), 'd71f8983ad4ee170f8129f1ebcdd7440be7798d8e1c80420bf11f1eced610dba')
    })
  })

  describe('make tree with 5 leaves at once needing hashing', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves(['a', 'b', 'c', 'd', 'e'], true)
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), 'd71f8983ad4ee170f8129f1ebcdd7440be7798d8e1c80420bf11f1eced610dba')
    })
  })

  describe('make tree using makeBTCTree odd leaves', function () {
    var merkleTools = new MerkleTools()

    var hashes = [
      '1a02db5db5a24c5edc5b653051d8aaaddec3f9abc30354f7df358c49fe40f735',
      'd3f3eb471e368a27f5320ff7a961bed748519139435cf8348e84ebd6225d7150',
      '7cbcf6b5378e3e43b39734baa578efa501d02abf90289547f0e6621ee959f0e3'
    ]
    for (var x = 0; x < hashes.length; x++) {
      hashes[x] = hashes[x].match(/.{2}/g).reverse().join('')
    }
    merkleTools.addLeaves(hashes)
    merkleTools.makeBTCTree(true)

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex').match(/.{2}/g).reverse().join(''), '7099d100635a0e5f62ef12a8420c99426a408951078f191a0f63ddedc4dcd198')
    })
  })

  describe('make tree using makeBTCTree one leaf', function () {
    var merkleTools = new MerkleTools()

    var hashes = [
      '9c397f783042029888ec02f0a461cfa2cc8e3c7897f476e338720a2a86731c60'
    ]
    for (var x = 0; x < hashes.length; x++) {
      hashes[x] = hashes[x].match(/.{2}/g).reverse().join('')
    }
    merkleTools.addLeaves(hashes)
    merkleTools.makeBTCTree(true)

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex').match(/.{2}/g).reverse().join(''), '9c397f783042029888ec02f0a461cfa2cc8e3c7897f476e338720a2a86731c60')
    })
  })

  describe('make tree using makeBTCTree even leaves', function () {
    var merkleTools = new MerkleTools()

    var hashes = [
      '6584fd6a4d0a96e27f1f0f8549a206bc9367134064d45decd2116ca7d73e6cc4',
      '7e2087abb091d059749a6bfd36840743d818de95a39975c18fc5969459eb00b2',
      'd45f9b209556d52db69a900703dacd934701bb523cd2a03bf48ec658133e511a',
      '5ec499041da320458cf1719d06af02fecc97d3178739f4d331c4fb84c764933d'
    ]
    for (var x = 0; x < hashes.length; x++) {
      hashes[x] = hashes[x].match(/.{2}/g).reverse().join('')
    }
    merkleTools.addLeaves(hashes)
    merkleTools.makeTree(true)

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex').match(/.{2}/g).reverse().join(''), 'b02c190b3a4d8a32b2f053ffd6353495fb857ad03ff600002c581a3a2232f696')
    })
  })

  describe('make tree using md5', function () {
    var merkleTools = new MerkleTools(
      { hashType: 'md5' })
    merkleTools.addLeaves([bLeftmd5, bRightmd5])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), mRootmd5.toString('hex'))
    })
  })

  describe('proof left node', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaf(bLeft)
    merkleTools.addLeaf(bRight)
    merkleTools.makeTree()
    var proof = merkleTools.getProof(0)

    it('proof array should be correct', function () {
      assert.equal(proof[0].right, 'cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c')
    })
  })

  describe('proof right node', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaf(bLeft)
    merkleTools.addLeaf(bRight)
    merkleTools.makeTree()
    var proof = merkleTools.getProof(1)

    it('proof array should be correct', function () {
      assert.equal(proof[0].left, 'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb')
    })
  })

  describe('proof left node binary', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaf(bLeft)
    merkleTools.addLeaf(bRight)
    merkleTools.makeTree()
    var proof = merkleTools.getProof(0, true)

    it('binary proof array should be correct', function () {
      var expectedResult = [Buffer.from([0x01]), Buffer.from('cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c', 'hex')]
      assert.deepEqual(proof, expectedResult)
    })
  })

  describe('proof right node binary', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaf(bLeft)
    merkleTools.addLeaf(bRight)
    merkleTools.makeTree()
    var proof = merkleTools.getProof(1, true)

    it('binary proof array should be correct', function () {
      var expectedResult = [Buffer.from([0x00]), Buffer.from('a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb', 'hex')]
      assert.deepEqual(proof, expectedResult)
    })
  })

  describe('proof one node', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaf(bLeft)
    merkleTools.makeTree()
    var proof = merkleTools.getProof(0)

    it('proof array should be correct', function () {
      assert.deepEqual(proof, [])
    })
  })

  describe('validate bad proof 2 leaves', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaf(bLeft)
    merkleTools.addLeaf(bRight)
    merkleTools.makeTree()
    var proof = merkleTools.getProof(1)
    var isValid = merkleTools.validateProof(proof, bRight, 'a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb')

    it('proof should be invalid', function () {
      assert.equal(isValid, false)
    })
  })

  describe('validate bad proof 5 leaves', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
      '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6',
      '18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4',
      '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea'
    ])
    merkleTools.makeTree()
    var proof = merkleTools.getProof(3)
    var isValid = merkleTools.validateProof(proof, 'badc3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4', 'd71f8983ad4ee170f8129f1ebcdd7440be7798d8e1c80420bf11f1eced610dba')

    it('proof should be invalid', function () {
      assert.equal(isValid, false)
    })
  })

  describe('validate good proof 5 leaves', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
      '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6',
      '18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4',
      '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea'
    ])
    merkleTools.makeTree()
    var proof = merkleTools.getProof(4)
    var isValid = merkleTools.validateProof(proof, '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea', 'd71f8983ad4ee170f8129f1ebcdd7440be7798d8e1c80420bf11f1eced610dba')

    it('proof should be valid', function () {
      assert.equal(isValid, true)
    })
  })

  describe('validate good proof 5 leaves B', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
      '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6',
      '18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4',
      '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea'
    ])
    merkleTools.makeTree()
    var proof = merkleTools.getProof(1)
    var isValid = merkleTools.validateProof(proof, '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d', 'd71f8983ad4ee170f8129f1ebcdd7440be7798d8e1c80420bf11f1eced610dba')

    it('proof should be valid', function () {
      assert.equal(isValid, true)
    })
  })

  describe('validate good proof BTC doubleHash', function () {
    var merkleTools = new MerkleTools()
    merkleTools.addLeaves([
      '1a02db5db5a24c5edc5b653051d8aaaddec3f9abc30354f7df358c49fe40f735',
      'd3f3eb471e368a27f5320ff7a961bed748519139435cf8348e84ebd6225d7150',
      '7cbcf6b5378e3e43b39734baa578efa501d02abf90289547f0e6621ee959f0e3'
    ])
    merkleTools.makeBTCTree(true)
    var proof = merkleTools.getProof(1)
    var isValid = merkleTools.validateProof(proof, 'd3f3eb471e368a27f5320ff7a961bed748519139435cf8348e84ebd6225d7150', '502606f374e3e0ec3b7022bfe6631b9a9c9f5cf6dcbe74f171ef5b14676c9ee0', true)

    it('proof should be valid', function () {
      assert.equal(isValid, true)
    })
  })
})

describe('Test other hash functions', function () {
  describe('make SHA224 tree with 2 leaves', function () {
    var merkleTools = new MerkleTools({ hashType: 'SHA224' })
    merkleTools.addLeaves([
      '90a3ed9e32b2aaf4c61c410eb925426119e1a9dc53d4286ade99a809',
      '35f757ad7f998eb6dd3dd1cd3b5c6de97348b84a951f13de25355177'
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), 'f48bc49bb77d3a3b1c8f8a70db693f41d879189cd1919f8326067ad7')
    })
    it('proof array should be correct', function () {
      assert.equal(merkleTools.getProof(0)[0].right, '35f757ad7f998eb6dd3dd1cd3b5c6de97348b84a951f13de25355177')
    })
    it('proof should be valid', function () {
      assert.equal(merkleTools.validateProof(merkleTools.getProof(0), '90a3ed9e32b2aaf4c61c410eb925426119e1a9dc53d4286ade99a809', 'f48bc49bb77d3a3b1c8f8a70db693f41d879189cd1919f8326067ad7'), true)
    })
  })

  describe('make SHA256 tree with 2 leaves', function () {
    var merkleTools = new MerkleTools({ hashType: 'SHA256' })
    merkleTools.addLeaves([
      '1516f000de6cff5c8c63eef081ebcec2ad2fdcf7034db16045d024a90341e07d',
      'e20af19f85f265579ead2578859bf089c92b76a048606983ad83f27ba8f32f1a'
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), '77c654b3d1605f78ed091cbd420c939c3feff7d57dc30c171fa45a5a3c81fd7d')
    })
    it('proof array should be correct', function () {
      assert.equal(merkleTools.getProof(0)[0].right, 'e20af19f85f265579ead2578859bf089c92b76a048606983ad83f27ba8f32f1a')
    })
    it('proof should be valid', function () {
      assert.equal(merkleTools.validateProof(merkleTools.getProof(0), '1516f000de6cff5c8c63eef081ebcec2ad2fdcf7034db16045d024a90341e07d', '77c654b3d1605f78ed091cbd420c939c3feff7d57dc30c171fa45a5a3c81fd7d'), true)
    })
  })

  describe('make SHA384 tree with 2 leaves', function () {
    var merkleTools = new MerkleTools({ hashType: 'SHA384' })
    merkleTools.addLeaves([
      '84ae8c6367d64899aef44a951edfa4833378b9e213f916c5eb8492cc37cb951c726e334dace7dbe4bb1dc80c1efe33d0',
      '368c89a00446010def75ad7b179cea9a3d24f8cbb7e2755a28638d194809e7b614eb45453665032860b6c1a135fb6e8b'
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), 'c363aa3b824e3f3b927034fab826eff61a9bfa2030ae9fc4598992edf9f3e42f8b497d6742946caf7a771429eb1745cf')
    })
    it('proof array should be correct', function () {
      assert.equal(merkleTools.getProof(0)[0].right, '368c89a00446010def75ad7b179cea9a3d24f8cbb7e2755a28638d194809e7b614eb45453665032860b6c1a135fb6e8b')
    })
    it('proof should be valid', function () {
      assert.equal(merkleTools.validateProof(merkleTools.getProof(0), '84ae8c6367d64899aef44a951edfa4833378b9e213f916c5eb8492cc37cb951c726e334dace7dbe4bb1dc80c1efe33d0', 'c363aa3b824e3f3b927034fab826eff61a9bfa2030ae9fc4598992edf9f3e42f8b497d6742946caf7a771429eb1745cf'), true)
    })
  })

  describe('make SHA512 tree with 2 leaves', function () {
    var merkleTools = new MerkleTools({ hashType: 'SHA512' })
    merkleTools.addLeaves([
      'c0a8907588c1da716ce31cbef05da1a65986ec23afb75cd42327634dd53d754be6c00a22d6862a42be5f51187a8dff695c530a797f7704e4eb4b473a14ab416e',
      'df1e07eccb2a2d4e1b30d11e646ba13ddc426c1aefbefcff3639405762f216fdcc40a684f3d1855e6d465f99fd9547e53fa8a485f18649fedec5448b45963976'
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), 'd9d27704a3a785d204257bfa2b217a1890e55453b6686f091fa1be8aa2b265bc06c285a909459996e093546677c3f392458d7b1fc34a994a86689ed4100e8337')
    })
    it('proof array should be correct', function () {
      assert.equal(merkleTools.getProof(0)[0].right, 'df1e07eccb2a2d4e1b30d11e646ba13ddc426c1aefbefcff3639405762f216fdcc40a684f3d1855e6d465f99fd9547e53fa8a485f18649fedec5448b45963976')
    })
    it('proof should be valid', function () {
      assert.equal(merkleTools.validateProof(merkleTools.getProof(0), 'c0a8907588c1da716ce31cbef05da1a65986ec23afb75cd42327634dd53d754be6c00a22d6862a42be5f51187a8dff695c530a797f7704e4eb4b473a14ab416e', 'd9d27704a3a785d204257bfa2b217a1890e55453b6686f091fa1be8aa2b265bc06c285a909459996e093546677c3f392458d7b1fc34a994a86689ed4100e8337'), true)
    })
  })

  describe('make SHA3-224 tree with 2 leaves', function () {
    var merkleTools = new MerkleTools({ hashType: 'SHA3-224' })
    merkleTools.addLeaves([
      '6ed712b9472b671fd70bb950dc4ccfce197c92a7969f6bc2aa6b6d9f',
      '08db5633d406804d044a3e67683e179b5ee51249ed2139c239d1e65a'
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), '674bc9f53d5c666174cdd3ccb9df04768dfb7759655e7d937aef0c3a')
    })
    it('proof array should be correct', function () {
      assert.equal(merkleTools.getProof(0)[0].right, '08db5633d406804d044a3e67683e179b5ee51249ed2139c239d1e65a')
    })
    it('proof should be valid', function () {
      assert.equal(merkleTools.validateProof(merkleTools.getProof(0), '6ed712b9472b671fd70bb950dc4ccfce197c92a7969f6bc2aa6b6d9f', '674bc9f53d5c666174cdd3ccb9df04768dfb7759655e7d937aef0c3a'), true)
    })
  })

  describe('make SHA3-256 tree with 2 leaves', function () {
    var merkleTools = new MerkleTools({ hashType: 'SHA3-256' })
    merkleTools.addLeaves([
      '1d7d4ea1cc029ca460e486642830c284657ea0921235c46298b51f0ed1bb7bf7',
      '89b9e14eae37e999b096a6f604adefe7feea4dc240ccecb5e4e92785cffc7070'
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), '6edf674f5ce762e096c3081aee2a0a977732e07f4d704baf34f5e3804db03343')
    })
    it('proof array should be correct', function () {
      assert.equal(merkleTools.getProof(0)[0].right, '89b9e14eae37e999b096a6f604adefe7feea4dc240ccecb5e4e92785cffc7070')
    })
    it('proof should be valid', function () {
      assert.equal(merkleTools.validateProof(merkleTools.getProof(0), '1d7d4ea1cc029ca460e486642830c284657ea0921235c46298b51f0ed1bb7bf7', '6edf674f5ce762e096c3081aee2a0a977732e07f4d704baf34f5e3804db03343'), true)
    })
  })

  describe('make SHA3-384 tree with 2 leaves', function () {
    var merkleTools = new MerkleTools({ hashType: 'SHA3-384' })
    merkleTools.addLeaves([
      'e222605f939aa69b964a0a03d7075676bb3dbb40c3bd10b22f0adcb149434e7c1085c206f0e3371470a49817aa6d5b16',
      'ae331b6f8643ed7e404471c81be9a74f73fc84ffd5140a0ec9aa8596fa0d0a2ded5f7b780bb2fbfc4e2226ee2a04a2fa'
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), 'bd54df0015fa0d4fee713fbf5c8ae232c93239c75fb9d41c7dd7a9278711764a6ee83c81766b3945ed94030254537b57')
    })
    it('proof array should be correct', function () {
      assert.equal(merkleTools.getProof(0)[0].right, 'ae331b6f8643ed7e404471c81be9a74f73fc84ffd5140a0ec9aa8596fa0d0a2ded5f7b780bb2fbfc4e2226ee2a04a2fa')
    })
    it('proof should be valid', function () {
      assert.equal(merkleTools.validateProof(merkleTools.getProof(0), 'e222605f939aa69b964a0a03d7075676bb3dbb40c3bd10b22f0adcb149434e7c1085c206f0e3371470a49817aa6d5b16', 'bd54df0015fa0d4fee713fbf5c8ae232c93239c75fb9d41c7dd7a9278711764a6ee83c81766b3945ed94030254537b57'), true)
    })
  })

  describe('make SHA3-512 tree with 2 leaves', function () {
    var merkleTools = new MerkleTools({ hashType: 'SHA3-512' })
    merkleTools.addLeaves([
      '004a237ea808cd9375ee9db9f85625948a890c54e2c30f736f54c969074eb56f0ff3d43dafb4b40d5d974acc1c2a68c046fa4d7c2c20cab6df956514040d0b8b',
      '0b43a85d08c05252d0e23c96bc6b1bda11dfa787049ff452b3c86f4c6135e870c058c05131f199ef8619cfac937a736bbc936a667e4d96a5bf68e4056ce5fdce'
    ])
    merkleTools.makeTree()

    it('merkle root value should be correct', function () {
      assert.equal(merkleTools.getMerkleRoot().toString('hex'), '3dff3f19b67628591d294cba2c07ed20d20d83e1624af8c1dca8fcf096127b9f86435e2d6a84ca4cee526525cacd1c628bf06ee938983413afafbb4598c5862a')
    })
    it('proof array should be correct', function () {
      assert.equal(merkleTools.getProof(0)[0].right, '0b43a85d08c05252d0e23c96bc6b1bda11dfa787049ff452b3c86f4c6135e870c058c05131f199ef8619cfac937a736bbc936a667e4d96a5bf68e4056ce5fdce')
    })
    it('proof should be valid', function () {
      assert.equal(merkleTools.validateProof(merkleTools.getProof(0), '004a237ea808cd9375ee9db9f85625948a890c54e2c30f736f54c969074eb56f0ff3d43dafb4b40d5d974acc1c2a68c046fa4d7c2c20cab6df956514040d0b8b', '3dff3f19b67628591d294cba2c07ed20d20d83e1624af8c1dca8fcf096127b9f86435e2d6a84ca4cee526525cacd1c628bf06ee938983413afafbb4598c5862a'), true)
    })
  })
})

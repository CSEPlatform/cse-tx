'use strict'

const Transaction = require('./index.js')
const util = require('cse-util')

module.exports = class FakeTransaction extends Transaction {
  constructor (data) {
    super(data)

    var self = this

    /**
     * @prop {Buffer} from (read/write) Set from address to bypass transaction signing.
     */
    Object.defineProperty(this, 'from', {
      enumerable: true,
      configurable: true,
      get: this.getSenderAddress.bind(self),
      set: function (val) {
        if (val) {
          self._from = util.toBuffer(val)
        }
      }
    })

    this.from = data.from
  }

  /**
   * Computes a sha3-256 hash of the serialized tx, using the sender address to generate a fake signature.
   * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
   * @return {Buffer}
   */
  hash (includeSignature = true) {
    if (includeSignature && this._from && this._from.toString('hex') !== '') {
      // include a fake signature using the from address as a private key
      let fakeKey = Buffer.concat([this._from, this._from.slice(0, 12)])
      this.sign(fakeKey)
    }

    return super.hash(includeSignature)
  }
}


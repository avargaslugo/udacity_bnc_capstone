// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
let squareVerifier = artifacts.require('verifier');
//Using require node.js will look for a proof.js file first and if not found
//then it will look for a proof.json file.
let correctproof = require('../../zokrates/code/square/proof');

contract('TestSquareVerifier', accounts => {

    const account_one = accounts[0];
// Test verification with correct proof
describe('test verification with correct proof', function(){
    beforeEach(async function () {
        this.contract = await squareVerifier.new({from: account_one});
})
it('verification with correct proof',async function(){
    //console.log('proof:' + correctproof.proof.input);
    let verified = await this.contract.verifyTx.call(correctproof.proof.A,correctproof.proof.A_p,correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,correctproof.proof.K,correctproof.input,{from:account_one});
    assert.equal(verified,true,"verification is valid");
})

// - use the contents from proof.json generated from zokrates steps


// Test verification with incorrect proof
it('verification with incorrect proof',async function(){
    //change proof input to wrong value
    correctproof.input=[1,12];
    let verified = await this.contract.verifyTx.call(correctproof.proof.A,correctproof.proof.A_p,correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,correctproof.proof.K,correctproof.input,{from:account_one});
    assert.equal(verified,false,"verification is valid");
})
})
});
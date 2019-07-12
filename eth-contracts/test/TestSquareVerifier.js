// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
let Verifier = artifacts.require('Verifier');

let correctProof = require('../../zokrates/code/square/proof');

contract('TestSquareVerifier', accounts => {

    const account_one = accounts[0];
    // Test verification with correct proof
    describe('test verification with correct proof', function(){
        beforeEach(async function () {
            this.contract = await Verifier.new({from: account_one});
        });
    it('Verifies correct a proof',async function(){
        let verified = await this.contract.verifyTx.call(correctProof.proof.A,correctProof.proof.A_p,correctProof.proof.B,correctProof.proof.B_p,correctProof.proof.C,correctProof.proof.C_p,correctProof.proof.H,correctProof.proof.K,correctProof.input,{from:account_one});
        assert.equal(verified,true,"Rejected correct input");
    });
    // Test verification with incorrect proof
    it('Does not verify an incorrect proof',async function(){
        //change proof input to wrong value
        let wrongInput = [1,12];
        let verified = await this.contract.verifyTx.call(correctProof.proof.A,correctProof.proof.A_p,correctProof.proof.B,correctProof.proof.B_p,correctProof.proof.C,correctProof.proof.C_p,correctProof.proof.H,correctProof.proof.K,wrongInput,{from:account_one});
        assert.equal(verified,false,"Accepted wrong input");
    })
    })
});
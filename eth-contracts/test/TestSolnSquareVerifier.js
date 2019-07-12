// truffle-assertions is used to look for emited event and their properties
const truffleAssert = require('truffle-assertions');
// contract produced by Zokrates
let Verifier = artifacts.require('Verifier');
let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
// proof computed by Zokrates
let correctProof = require('../../zokrates/code/square/proof');

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    beforeEach(async function () {
        // we first need to deply the `Verifier` contract
        const verifier = await Verifier.new({from:account_one});
        // we use the address of the `Verifier` contract to create and deploy the `SolnSquareVerifier` contract.
        this.contract = await SolnSquareVerifier.new(verifier.address,{from: account_one});
    });

     it('Can add a new correct solution and use it to mint a new token',async function(){
         /*
         This test looks for a `SolutionAdded` event with the right parameters to check if a solution was added. It
          also checks at the ownership of the newly minted token to assert it's the expected owner.
         */
         let tokenid = 1;
         // mint token `tokenid` for `account_two`
        let tx = await this.contract.mintToken(account_two,tokenid,correctProof.proof.A,correctProof.proof.A_p,
        correctProof.proof.B,correctProof.proof.B_p,correctProof.proof.C,correctProof.proof.C_p,correctProof.proof.H,
        correctProof.proof.K,correctProof.input,{from:account_one});
        // assert that the transaction emitted a `SolutionAdded` event with the right parameters.
        truffleAssert.eventEmitted(tx, 'SolutionAdded', (ev) => {return ev.to === account_two && ev.tokenid == tokenid;});
        // assert that the token was minted and now belongs to the intended account
        let owner = await this.contract.ownerOf(tokenid);
         assert.equal(owner,account_two, "owner of minted token is not the expected one")
    });

     // Test verification with incorrect proof
    it('Cannot mint a token with a wrong proof',async function(){
        let mintAllowed = true;
        let tokenid = 12;
        let wrongInput=[233,132];
        // try to mint new token with a wrong proof
       try{
            await this.contract.mintToken(account_two,tokenid,correctProof.proof.A,correctProof.proof.A_p,
        correctProof.proof.B,correctProof.proof.B_p,correctProof.proof.C,correctProof.proof.C_p,correctProof.proof.H,
        correctProof.proof.K,wrongInput,{from:account_one});
       }
       catch(e) {
           mintAllowed = false;
       }
         assert.equal(mintAllowed,false,"can mint a token with wrong proof");
    });

    it('Cannot mint a new token with an already used proof',async function(){
        let tokenid = 1;
        let doubleSolutionAccepted = true;
        // mint one token with provided solution
       await this.contract.mintToken(account_two,tokenid,correctProof.proof.A,correctProof.proof.A_p,
            correctProof.proof.B,correctProof.proof.B_p,correctProof.proof.C,correctProof.proof.C_p,correctProof.proof.H,
            correctProof.proof.K,correctProof.input,{from:account_one});
       // tries to mint a new token with the same solution
        try{
            await this.contract.mintToken(account_two,3,correctProof.proof.A,correctProof.proof.A_p,
            correctProof.proof.B,correctProof.proof.B_p,correctProof.proof.C,correctProof.proof.C_p,correctProof.proof.H,
            correctProof.proof.K,correctProof.input,{from:account_one});
        }
        catch(e)
        {
            doubleSolutionAccepted=false;
        }
            assert.equal(doubleSolutionAccepted,false,"Repeated solution was accepted");
    });





});
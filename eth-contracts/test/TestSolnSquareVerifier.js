// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
const truffleAssert = require('truffle-assertions');
let Verifier = artifacts.require('Verifier');
let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

let correctproof = require('../../zokrates/code/square/proof');

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    beforeEach(async function () {
        const verifier = await Verifier.new({from:account_one});
        this.contract = await SolnSquareVerifier.new(verifier.address,{from: account_one});
    });

     it('it can add a new correct solution and use it to mint a new token',async function(){
         /*
         This test looks for a `SolutionAdded` event with the right parameters to check if a solution was added. It
          also checks at the ownership of the newly minted token to assert it's the expected owner.
         */
         let tokenid = 1;
        let tx = await this.contract.mintToken(account_two,tokenid,correctproof.proof.A,correctproof.proof.A_p,
        correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,
        correctproof.proof.K,correctproof.input,{from:account_one});
        truffleAssert.eventEmitted(tx, 'SolutionAdded', (ev) => {return ev.to === account_two && ev.tokenid == tokenid;});

        let owner = await this.contract.ownerOf(tokenid)
         assert.equal(owner,account_two, "owner of minted token is not the expected one")

    });

     // Test verification with incorrect proof
    it('cannot mint a token with a wrong proof',async function(){
        let mintAllowed = true;
        let tokenid = 12;
        let wrongInput=[233,132]
       try{
            await this.contract.mintToken(account_two,tokenid,correctproof.proof.A,correctproof.proof.A_p,
        correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,
        correctproof.proof.K,wrongInput,{from:account_one});
       }
       catch(e) {
           mintAllowed = false;
       }
         assert.equal(mintAllowed,false,"can mint a token with wrong proof");
    });

    it('it cannot mint a new token with an already used proof',async function(){
        let tokenid = 1;
        let doubleSolutionAccepted = true;
        // mint one token with provided solution
       await this.contract.mintToken(account_two,tokenid,correctproof.proof.A,correctproof.proof.A_p,
            correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,
            correctproof.proof.K,correctproof.input,{from:account_one});
       // tries to mint a new token with the same solution
        try{
            await this.contract.mintToken(account_two,3,correctproof.proof.A,correctproof.proof.A_p,
            correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,
            correctproof.proof.K,correctproof.input,{from:account_one});
        }
        catch(e)
        {
            doubleSolutionAccepted=false;
        }
            assert.equal(doubleSolutionAccepted,false,"Repeated solution was accepted");
    });





});
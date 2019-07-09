var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            // deploy token with `test` as name and `tst` as symbol
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1, {from: account_one});
            await this.contract.mint(account_one, 2, {from: account_one});
            await this.contract.mint(account_one, 3, {from: account_one});
            await this.contract.mint(account_two, 4, {from: account_one});
        });

        it('should return total supply', async function () { 
            let total = await this.contract.totalSupply.call();
            assert.equal(total, 4, "result not correct");
        });

        it('should get token balance', async function () {
            let balance1 = await this.contract.balanceOf(account_one);
            let balance2 = await this.contract.balanceOf(account_two);
            assert.equal(balance1, 3, "the balance was not what was expected");
            assert.equal(balance2, 1, "the balance was not what was expected");

        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
           let uri1 = await this.contract.tokenURI.call(1);
           let uri2 = await this.contract.tokenURI.call(2);
           assert.equal(uri1,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", 'the token uri was' +
               ' not what was expected');
           assert.equal(uri2,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", 'the token uri was' +
               ' not what was expected');

        });

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferFrom(account_one, account_three, 1);
            let owner = await this.contract.ownerOf(1);
            assert.equal(owner, account_three, "token was not transfered");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        });

        it('should fail when minting when address is not contract owner', async function () {
            let success = true
            try{
             await this.contract.mint(account_three, 1, {from: account_three});
            }
            catch (e) {
                success = false;
            }
            assert.equal(success, false, "non-contract owner was able to mint");
        });

        it('should return contract owner', async function () { 
            let owner =  await this.contract.getOwner();
            assert.equal(owner, account_one, "owner of contract is not the expected one")
        })

    });
})
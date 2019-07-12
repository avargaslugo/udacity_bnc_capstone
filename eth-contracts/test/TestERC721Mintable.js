var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    describe('Token contract can be instantiated, mint tokens and main functionality is in place', function () {
        beforeEach(async function () {
            // deploy new contract
            this.contract = await ERC721MintableComplete.new({from: account_one});
            // mint 4 tokens using the contract. 3 tokens are given to `account_one` while 1 is given to `account_two`
            await this.contract.mint(account_one, 1, {from: account_one});
            await this.contract.mint(account_one, 2, {from: account_one});
            await this.contract.mint(account_one, 3, {from: account_one});
            await this.contract.mint(account_two, 4, {from: account_one});
        });

        it('Returns the total supply of tokens', async function () {
            let total = await this.contract.totalSupply.call();
            assert.equal(total, 4, "Total supply is not what was expected");
        });

        it('Returns token balance for specific account', async function () {
            // get balance for `account_one`
            let balance1 = await this.contract.balanceOf(account_one);
            // get balance for `account_two`
            let balance2 = await this.contract.balanceOf(account_two);
            // check that balances are what was expected.
            assert.equal(balance1, 3, "the balance was not what was expected");
            assert.equal(balance2, 1, "the balance was not what was expected");
        });

        it('Returns toke uris', async function () {
            // fetches tokenUris for tokens 1 and 2
           let uri1 = await this.contract.tokenURI.call(1);
           let uri2 = await this.contract.tokenURI.call(2);
           let baseUri = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
           assert.equal(uri1,baseUri + "1", 'unexpected token uri');
           assert.equal(uri2,baseUri + "2", 'unexpected token uri');
        });

        it('Transfers tokens from one account to an other one', async function () {
            // transfers token 1 from `account_one` to `account_three`
            await this.contract.transferFrom(account_one, account_three, 1);
            // fetches owner of token 1
            let owner = await this.contract.ownerOf(1);
            // asserts the owner for token 1 is `account_three`
            assert.equal(owner, account_three, "token transfer failed");
        })
    });

    describe('Main contract ownership properties work correctly', function () {
        beforeEach(async function () {
            // contract owner is `account_one`
            this.contract = await ERC721MintableComplete.new({from: account_one});
        });

        it('Fails to mint tokens using a non-contract owner account', async function () {
            let success = true;
            try{
             await this.contract.mint(account_three, 1, {from: account_three});
            }
            catch (e) {
                success = false;
            }
            assert.equal(success, false, "non-contract owner was able to mint");
        });

        it('Returns contract owner', async function () {
            let owner =  await this.contract.getOwner();
            assert.equal(owner, account_one, "returned wrong contract owner")
        })

    });
});
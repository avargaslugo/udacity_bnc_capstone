// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var CustomERC721Token = artifacts.require('CustomERC721Token');


module.exports = function(deployer) {
  deployer.deploy(CustomERC721Token);

  deployer.deploy(Verifier)
   .then(() => {
     return deployer.deploy(SolnSquareVerifier,Verifier.address);
   });

};

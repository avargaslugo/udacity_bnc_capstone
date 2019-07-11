pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./Verifier.sol";
import "./ERC721Mintable.sol";

contract SolnSquareVerifier is  CustomERC721Token{
    // declare variable for verifier contract
    Verifier public verifierContract;

    constructor(address verifierAddress) CustomERC721Token() public
    {
        verifierContract = Verifier(verifierAddress);
    }


    //  define a solutions struct that can hold an index & an address
    struct Solutions{
        uint tokenId;
        address to;
    }

    // define an array of the above struct
    Solutions[] solutions;

    // define a mapping to store unique solutions submitted
    mapping (bytes32 => Solutions) private uniqueSolutions;


    //  Create an event to emit when a solution is added

    event SolutionAdded(uint tokenid,address to);

    //  Create a function to add the solutions to the array and emit the event

    function addSolution(address _to,uint _tokenId,bytes32 key) public
    {
        Solutions memory solution = Solutions({tokenId:_tokenId,to:_to});
        solutions.push(solution);
        uniqueSolutions[key] = solution;
        emit SolutionAdded(_tokenId,_to);
    }

    //  Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(address _to,uint _tokenId,
                uint[2] memory a,
                uint[2] memory a_p,
                uint[2][2] memory b,
                uint[2] memory b_p,
                uint[2] memory c,
                uint[2] memory c_p,
                uint[2] memory h,
                uint[2] memory k,
                uint[2] memory input)
                public
    {
        bytes32 key = keccak256(abi.encodePacked(a,a_p,b,b_p,c,c_p,h,k,input));
        require(uniqueSolutions[key].to == address(0),"Solution has already been used");
        require(verifierContract.verifyTx(a,a_p,b,b_p,c,c_p,h,k,input)," solution not valid");

        addSolution(_to,_tokenId,key);
        mint(_to,_tokenId);
    }
}
  



























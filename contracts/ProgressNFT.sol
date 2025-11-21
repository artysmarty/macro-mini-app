// contracts/ProgressNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProgressNFT
 * @dev NFT for milestone achievements and challenge completions
 */
contract ProgressNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    struct NFTMetadata {
        uint256 challengeId;
        string goalType;
        string outcomeStats;
        uint256 timestamp;
    }

    mapping(uint256 => NFTMetadata) public tokenMetadata;
    mapping(address => uint256[]) public userTokens;

    event ProgressNFTMinted(address indexed to, uint256 indexed tokenId, uint256 challengeId);

    constructor() ERC721("Macro Tracker Progress", "FITPROG") Ownable(msg.sender) {}

    /**
     * @dev Mint a progress NFT for milestone achievement
     */
    function mintProgressNFT(
        address to,
        uint256 challengeId,
        string memory goalType,
        string memory outcomeStats,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        tokenMetadata[tokenId] = NFTMetadata({
            challengeId: challengeId,
            goalType: goalType,
            outcomeStats: outcomeStats,
            timestamp: block.timestamp
        });

        userTokens[to].push(tokenId);

        emit ProgressNFTMinted(to, tokenId, challengeId);
        return tokenId;
    }

    /**
     * @dev Get all tokens owned by a user
     */
    function getUserTokens(address user) external view returns (uint256[] memory) {
        return userTokens[user];
    }

    /**
     * @dev Get metadata for a token
     */
    function getTokenMetadata(uint256 tokenId) external view returns (NFTMetadata memory) {
        return tokenMetadata[tokenId];
    }
}


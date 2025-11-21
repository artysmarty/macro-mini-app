// contracts/ChallengePot.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ChallengePot
 * @dev Smart contract for managing fitness challenge pots
 */
contract ChallengePot is Ownable, ReentrancyGuard {
    struct Challenge {
        uint256 id;
        address creator;
        uint256 stakeAmount;
        address stakeToken; // ERC20 token address, or address(0) for native ETH
        uint256 startTime;
        uint256 endTime;
        uint256 potSize;
        bool isActive;
        bool isCompleted;
    }

    struct Participant {
        address participant;
        uint256 stakeAmount;
        bool hasStaked;
        bool hasWithdrawn;
    }

    mapping(uint256 => Challenge) public challenges;
    mapping(uint256 => mapping(address => Participant)) public participants;
    mapping(uint256 => address[]) public participantList;
    mapping(uint256 => mapping(address => uint256)) public scores; // Adherence scores
    mapping(uint256 => address[]) public winners; // Top 3 winners

    uint256 public challengeCounter;
    uint256 public constant MAX_PARTICIPANTS = 100;
    uint256 public constant WINNER_SHARE_1 = 50; // 50% for 1st place
    uint256 public constant WINNER_SHARE_2 = 30; // 30% for 2nd place
    uint256 public constant WINNER_SHARE_3 = 20; // 20% for 3rd place

    event ChallengeCreated(uint256 indexed challengeId, address indexed creator, uint256 stakeAmount);
    event ParticipantJoined(uint256 indexed challengeId, address indexed participant, uint256 stakeAmount);
    event ChallengeCompleted(uint256 indexed challengeId);
    event WinnersSet(uint256 indexed challengeId, address[] winners);
    event PayoutDistributed(uint256 indexed challengeId, address indexed winner, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new challenge
     */
    function createChallenge(
        uint256 _stakeAmount,
        address _stakeToken,
        uint256 _durationDays
    ) external returns (uint256) {
        challengeCounter++;
        
        challenges[challengeCounter] = Challenge({
            id: challengeCounter,
            creator: msg.sender,
            stakeAmount: _stakeAmount,
            stakeToken: _stakeToken,
            startTime: block.timestamp,
            endTime: block.timestamp + (_durationDays * 1 days),
            potSize: 0,
            isActive: true,
            isCompleted: false
        });

        emit ChallengeCreated(challengeCounter, msg.sender, _stakeAmount);
        return challengeCounter;
    }

    /**
     * @dev Join a challenge by staking tokens
     */
    function joinChallenge(uint256 _challengeId) external payable nonReentrant {
        Challenge storage challenge = challenges[_challengeId];
        require(challenge.isActive, "Challenge not active");
        require(block.timestamp < challenge.endTime, "Challenge has ended");
        require(!participants[_challengeId][msg.sender].hasStaked, "Already joined");
        require(participantList[_challengeId].length < MAX_PARTICIPANTS, "Challenge full");

        if (challenge.stakeToken == address(0)) {
            // Native ETH
            require(msg.value == challenge.stakeAmount, "Incorrect stake amount");
            challenge.potSize += msg.value;
        } else {
            // ERC20 token
            IERC20 token = IERC20(challenge.stakeToken);
            require(token.transferFrom(msg.sender, address(this), challenge.stakeAmount), "Transfer failed");
            challenge.potSize += challenge.stakeAmount;
        }

        participants[_challengeId][msg.sender] = Participant({
            participant: msg.sender,
            stakeAmount: challenge.stakeAmount,
            hasStaked: true,
            hasWithdrawn: false
        });

        participantList[_challengeId].push(msg.sender);
        emit ParticipantJoined(_challengeId, msg.sender, challenge.stakeAmount);
    }

    /**
     * @dev Set adherence scores (called by backend after challenge ends)
     */
    function setScores(uint256 _challengeId, address[] calldata _participants, uint256[] calldata _scores) external onlyOwner {
        require(_participants.length == _scores.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < _participants.length; i++) {
            scores[_challengeId][_participants[i]] = _scores[i];
        }
    }

    /**
     * @dev Set winners and distribute pot (called by backend after challenge ends)
     */
    function setWinnersAndDistribute(uint256 _challengeId, address[] calldata _winners) external onlyOwner {
        Challenge storage challenge = challenges[_challengeId];
        require(block.timestamp >= challenge.endTime, "Challenge not ended");
        require(!challenge.isCompleted, "Already completed");
        require(_winners.length <= 3, "Too many winners");

        challenge.isCompleted = true;
        challenge.isActive = false;
        winners[_challengeId] = _winners;

        emit WinnersSet(_challengeId, _winners);

        // Distribute pot
        if (_winners.length > 0 && challenge.potSize > 0) {
            uint256 share1 = (challenge.potSize * WINNER_SHARE_1) / 100;
            uint256 share2 = (challenge.potSize * WINNER_SHARE_2) / 100;
            uint256 share3 = (challenge.potSize * WINNER_SHARE_3) / 100;

            if (_winners.length >= 1) {
                _distributePayout(_challengeId, _winners[0], share1);
            }
            if (_winners.length >= 2) {
                _distributePayout(_challengeId, _winners[1], share2);
            }
            if (_winners.length >= 3) {
                _distributePayout(_challengeId, _winners[2], share3);
            }
        }

        emit ChallengeCompleted(_challengeId);
    }

    function _distributePayout(uint256 _challengeId, address _winner, uint256 _amount) internal {
        Challenge storage challenge = challenges[_challengeId];
        
        if (challenge.stakeToken == address(0)) {
            // Native ETH
            (bool success, ) = _winner.call{value: _amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 token
            IERC20 token = IERC20(challenge.stakeToken);
            require(token.transfer(_winner, _amount), "Token transfer failed");
        }

        emit PayoutDistributed(_challengeId, _winner, _amount);
    }

    function getChallenge(uint256 _challengeId) external view returns (Challenge memory) {
        return challenges[_challengeId];
    }

    function getParticipants(uint256 _challengeId) external view returns (address[] memory) {
        return participantList[_challengeId];
    }
}


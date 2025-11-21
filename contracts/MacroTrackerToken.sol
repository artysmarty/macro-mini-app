// contracts/MacroTrackerToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MacroTrackerToken
 * @dev ERC-20 token for Macro Tracker rewards
 */
contract MacroTrackerToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant DAILY_REWARD = 10 * 10**18; // 10 tokens per day
    uint256 public constant WEEKLY_REWARD = 50 * 10**18; // 50 tokens per week
    uint256 public constant MONTHLY_REWARD = 200 * 10**18; // 200 tokens per month

    mapping(address => uint256) public lastDailyReward;
    mapping(address => uint256) public lastWeeklyReward;
    mapping(address => uint256) public lastMonthlyReward;

    event DailyRewardClaimed(address indexed user, uint256 amount);
    event WeeklyRewardClaimed(address indexed user, uint256 amount);
    event MonthlyRewardClaimed(address indexed user, uint256 amount);

    constructor() ERC20("Macro Tracker Token", "FIT") Ownable(msg.sender) {
        // Mint initial supply to contract owner for distribution
        _mint(msg.sender, MAX_SUPPLY / 2);
    }

    /**
     * @dev Claim daily reward for hitting macros
     */
    function claimDailyReward() external {
        require(
            block.timestamp >= lastDailyReward[msg.sender] + 1 days,
            "Daily reward already claimed"
        );
        
        lastDailyReward[msg.sender] = block.timestamp;
        _mint(msg.sender, DAILY_REWARD);
        
        emit DailyRewardClaimed(msg.sender, DAILY_REWARD);
    }

    /**
     * @dev Claim weekly reward for consistent adherence
     */
    function claimWeeklyReward() external {
        require(
            block.timestamp >= lastWeeklyReward[msg.sender] + 7 days,
            "Weekly reward already claimed"
        );
        
        lastWeeklyReward[msg.sender] = block.timestamp;
        _mint(msg.sender, WEEKLY_REWARD);
        
        emit WeeklyRewardClaimed(msg.sender, WEEKLY_REWARD);
    }

    /**
     * @dev Claim monthly reward for milestone achievement
     */
    function claimMonthlyReward() external {
        require(
            block.timestamp >= lastMonthlyReward[msg.sender] + 30 days,
            "Monthly reward already claimed"
        );
        
        lastMonthlyReward[msg.sender] = block.timestamp;
        _mint(msg.sender, MONTHLY_REWARD);
        
        emit MonthlyRewardClaimed(msg.sender, MONTHLY_REWARD);
    }

    /**
     * @dev Admin function to mint rewards (for challenge payouts, etc.)
     */
    function mintReward(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}


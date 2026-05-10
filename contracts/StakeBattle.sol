// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract StakeBattle {
    event BattleCreated(
    uint256 indexed battleId,
    address indexed player1,
    uint256 amount
    );

    event BattleJoined(
        uint256 indexed battleId,
        address indexed player2
    );

    event BattleResolved(
        uint256 indexed battleId,
        address indexed winner,
        uint256 prize
    );
    uint256 public battleCount;

    struct Battle {
        address player1;
        address player2;
        uint256 amount;
        bool finished;
        address winner;
    }

    mapping(uint256 => Battle) public battles;

    function createBattle() external payable {
        require(msg.value > 0, "Send ETH");

        battles[battleCount] = Battle({
            player1: msg.sender,
            player2: address(0),
            amount: msg.value,
            finished: false,
            winner: address(0)
        });

        emit BattleCreated(
            battleCount,
            msg.sender,
            msg.value
        );

        battleCount++;
    }

    function joinBattle(uint256 battleId) external payable {
        Battle storage battle = battles[battleId];

        require(battle.player1 != address(0), "Battle not found");
        require(battle.player2 == address(0), "Already joined");
        require(msg.value == battle.amount, "Wrong ETH amount");
        require(msg.sender != battle.player1, "Cannot join own battle");

        battle.player2 = msg.sender;
        emit BattleJoined(
            battleId,
            msg.sender
        );
    }

    function resolveBattle(uint256 battleId) external {
        Battle storage battle = battles[battleId];

        require(!battle.finished, "Battle finished");
        require(battle.player2 != address(0), "No opponent");

        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    battle.player1,
                    battle.player2
                )
            )
        );

        address winner = random % 2 == 0
            ? battle.player1
            : battle.player2;

        battle.finished = true;
        battle.winner = winner;

        uint256 prize = battle.amount * 2;

        payable(winner).transfer(prize);
        emit BattleResolved(
            battleId,
            winner,
            prize
        );
    }
}
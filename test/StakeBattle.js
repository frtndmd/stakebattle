const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakeBattle", function () {
  let contract;
  let owner;
  let player2;

  beforeEach(async function () {
    [owner, player2] = await ethers.getSigners();

    const StakeBattle = await ethers.getContractFactory("StakeBattle");

    contract = await StakeBattle.deploy();

    await contract.waitForDeployment();
  });

  it("Should create a battle", async function () {
    await contract.createBattle({
      value: ethers.parseEther("0.1"),
    });

    const battle = await contract.battles(0);

    expect(battle.player1).to.equal(owner.address);
  });

  it("Should join battle", async function () {
    await contract.createBattle({
      value: ethers.parseEther("0.1"),
    });

    await contract.connect(player2).joinBattle(0, {
      value: ethers.parseEther("0.1"),
    });

    const battle = await contract.battles(0);

    expect(battle.player2).to.equal(player2.address);
  });

  it("Should prevent joining own battle", async function () {
    await contract.createBattle({
      value: ethers.parseEther("0.1"),
    });

    await expect(
      contract.joinBattle(0, {
        value: ethers.parseEther("0.1"),
      })
    ).to.be.revertedWith("Cannot join own battle");
  });

  it("Should resolve battle", async function () {
    await contract.createBattle({
      value: ethers.parseEther("0.1"),
    });

    await contract.connect(player2).joinBattle(0, {
      value: ethers.parseEther("0.1"),
    });

    await contract.resolveBattle(0);

    const battle = await contract.battles(0);

    expect(battle.finished).to.equal(true);
  });
});
async function main() {
  const StakeBattle = await ethers.getContractFactory("StakeBattle");

  const stakeBattle = await StakeBattle.deploy();

  await stakeBattle.waitForDeployment();

  console.log("Contract deployed to:", await stakeBattle.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
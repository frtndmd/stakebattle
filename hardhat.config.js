require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("solidity-coverage");

module.exports = {
  solidity: "0.8.24",
  networks: {
    opSepolia: {
      url: "https://sepolia.optimism.io",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
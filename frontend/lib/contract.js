import { ethers } from "ethers";

export const contractAddress =
  "0xFA1d49bB3Cf51Ffc316f499D2aE9E985bB86A078";

export const abi = [
  "function createBattle() payable",
  "function joinBattle(uint256 battleId) payable",
  "function resolveBattle(uint256 battleId)",
  "function battleCount() view returns (uint256)",
  "function battles(uint256) view returns(address player1,address player2,uint256 amount,bool finished,address winner)",
];

export async function getContract(readOnly = false) {
  const provider = new ethers.BrowserProvider(window.ethereum);

  if (readOnly) {
    return new ethers.Contract(contractAddress, abi, provider);
  }

  const signer = await provider.getSigner();

  return new ethers.Contract(contractAddress, abi, signer);
}
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const tokenAddress = "0xcdd6C68A007eE45DBe8D21fB6f612B2A7b3e7890"; // Replace with deployed token address

  const token = await ethers.getContractAt("TestToken", tokenAddress);

  const amount = ethers.parseEther("1000"); // Mint 1000 tokens
  const tx = await token.mint(deployer.address, amount);

  await tx.wait();
  console.log(
    `Minted ${ethers.formatEther(amount)} tokens to ${deployer.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

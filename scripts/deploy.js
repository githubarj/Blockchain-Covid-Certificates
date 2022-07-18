const hre = require("hardhat");
const { ethers, run, network } = require("hardhat"); 

async function main() {
    const ColdChainFactory = await ethers.getContractFactory(
        "ColdChain"
    );

    console.log("Deploying contract...");
    const coldChain = await ColdChainFactory.deploy();
    await coldChain.deployed();

    console.log(`Deployed contract to: ${coldChain.address}`);
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block txes...");
        await coldChain.deployTransaction.wait(6);
        await verify(coldChain.address, []);
    }
}

async function verify(contractAddress, args) {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified");
        } else {
            console.log(e);
        }
    }
}



main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

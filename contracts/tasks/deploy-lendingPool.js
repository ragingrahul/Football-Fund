const path = require("path")
const process = require("process")
const { networks } = require("../networks")

task("deploy-lendingPool", "Deploys the LendingPoolContract contract")
    .setAction(async () => {
        console.log(`Deploying LendingPool contract to ${network.name}`)

        console.log("\n__Compiling Contracts__")
        await run("compile")

        //const networkConfig = networks[network.name]

        const eusdcContractFactory = await ethers.getContractFactory("EUSDCToken")
        const eusdcContract = await eusdcContractFactory.deploy()

        console.log(`\EUSDC Token contract deployed to ${eusdcContract.address} on ${network.name}`)

        const lendingPoolContractFactory = await ethers.getContractFactory("BondToken")
        const lendingPoolContract = await lendingPoolContractFactory.deploy(eusdcContract.address)

        console.log(`\EUSDC Token contract deployed to ${lendingPoolContract.address} on ${network.name}`)

    })
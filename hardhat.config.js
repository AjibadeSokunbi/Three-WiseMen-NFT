require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();



/** @type import('hardhat/config').HardhatUserConfig */

const URL = process.env.URL;
const KEY = process.env.KEY
const EKEY = process.env.EKEY
const CKEY = process.env.CKEY

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    mainnet: {
        url: URL,
        accounts: [KEY],
        chainId: 1,
    },
  },

      solidity: {
        compilers: [
            {
                version: "0.8.9",
            },
        ],
      },
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      },
      paths: {
        sources: './contracts',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts'
      },
      mocha: {
        timeout: 40000
      },
 etherscan: {

    apiKey: {
      mainnet: EKEY
    },
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt", 
    noColors: true,
    currency: "USD",
    coinmarketcap: CKEY,
  },
};

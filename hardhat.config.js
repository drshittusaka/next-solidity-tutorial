require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/qH90oDD6OG7cTVBpXOTaOswW_LyBUMAY',//process.env.NODE_API_URL,
      accounts: ['7239cee07f9ba74af8521eb72c809e61f1835d4e7e8dc254acda5d65357d83f9'//process.env.SEPOLIA_PRIVATE_KEY
      ],
    },}
};

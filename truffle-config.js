var HDWalletProvider = require("truffle-hdwallet-provider");
require('babel-register');
require('babel-polyfill');
const MNEMONIC = 'C7F1AADA0C73ACE18CBF390DA2562E700750435907A373C66DAA78E345CBA2B9';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/9334955886e24cb38efdafc403852a37")
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

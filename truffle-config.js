module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    rinkeby: {
      
    }
  },
  compilers: {
    solc: {
      version: ">=0.7.0 <0.9.0",
    },
  },
};

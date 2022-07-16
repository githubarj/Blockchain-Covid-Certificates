const ConvertLib = artifacts.require("ConvertLib");
const Coldchain = artifacts.require("Coldchain");

module.exports = function(deployer) {
  deployer.deploy(Coldchain);
};

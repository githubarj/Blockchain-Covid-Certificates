const ColdChain = artifacts.require("ColdChain");

contract("ColdChain", (accounts) => {
  it("should ...", async () => {
    const coinInstance = await ColdChain.deployed();
    const balance = await coinInstance.getBalance.call(accounts[0]);

    assert.equal(actual, expected, errorMessage);
  });
});

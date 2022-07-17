const { expectEvent, BN } = require("@openzeppelin/test-helpers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const ColdChain = artifacts.require("ColdChain");

contract("ColdChain", (accounts) => {
  before(async () => {
    this.owner = accounts[0];

    this.VACCINE_BRANDS = {
      Pfizer: "Pfizer-BidNtech",
      Moderna: "Moderna",
      Janssen: "Johnson & Johnson's Janssen",
      Sputnik: "Sputnik V",
    };

    //enums
    this.ModeEnums = {
      ISSUER: { val: "ISSUER", pos: 0 },
      VERIFIER: { val: "VERIFIER", pos: 1 },
      PROVER: { val: "PROVER", pos: 2 },
    };
    this.StatusEnums = {
      manufacured: { val: "MANUFACTURED", pos: 0 },
      delivering1: { val: "DELIVERING_INTERNATIONAL", pos: 1 },
      stored: { val: "STORED", pos: 2 },
      delivering2: { val: "DELIVERING_LOCAL", pos: 3 },
      delivered: { val: "DELIVERED", pos: 4 },
    };

    this.defaultEntities = {
      manufacturerA: { id: accounts[1], mode: this.ModeEnums.PROVER.val },
      manufacturerB: { id: accounts[2], mode: this.ModeEnums.PROVER.val },
      inspector: { id: accounts[3], mode: this.ModeEnums.ISSUER.val },
      distributorGlobal: { id: accounts[4], mode: this.ModeEnums.VERIFIER.val },
      distributorLocal: { id: accounts[5], mode: this.ModeEnums.VERIFIER.val },
      immunizer: { id: accounts[6], mode: this.ModeEnums.ISSUER.val },
      traveller: { id: accounts[7], mode: this.ModeEnums.PROVER.val },
      borderAgent: { id: accounts[8], mode: this.ModeEnums.VERIFIER.val },
    };

    this.defaultVaccineBatches = {
      0: {
        brand: this.VACCINE_BRANDS.Pfizer,
        manufacturer: this.defaultEntities.manufacturerA.id,
      },
      1: {
        brand: this.VACCINE_BRANDS.Moderna,
        manufacturer: this.defaultEntities.manufacturerB.id,
      },
      2: {
        brand: this.VACCINE_BRANDS.Janssen,
        manufacturer: this.defaultEntities.manufacturerA.id,
      },
      3: {
        brand: this.VACCINE_BRANDS.Sputnik,
        manufacturer: this.defaultEntities.manufacturerB.id,
      },
      4: {
        brand: this.VACCINE_BRANDS.Pfizer,
        manufacturer: this.defaultEntities.manufacturerA.id,
      },
      5: {
        brand: this.VACCINE_BRANDS.Janssen,
        manufacturer: this.defaultEntities.manufacturerB.id,
      },
      6: {
        brand: this.VACCINE_BRANDS.Moderna,
        manufacturer: this.defaultEntities.manufacturerA.id,
      },
    };

    this.coldChainInstance = await ColdChain.deployed();
    this.providerOrUrl = "http://localhost:8545";
  });

  it("should add entities successfully", async () => {
    for (const entity in this.defaultEntities) {
      const { id, mode } = this.defaultEntities[entity];

      const result = await this.coldChainInstance.addEntity(id, mode, {
        from: this.owner,
      });
      console.log(result);

      expectEvent(result.receipt, "AddEntity", {
        entityId: id,
        entityMode: mode,
      });
      break;
      // assert.equal(actual, expected, errorMessage);
    }
  });
});

const { expectEvent, BN } = require("@openzeppelin/test-helpers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const ColdChain = artifacts.require("ColdChain");

contract("ColdChain", (accounts) => {
  before(async () => {
    this.owner = accounts[0];

    this.VACCINE_BRANDS = {
      Pfizer: "Pfizer-BioNTech",
      Mordena: "Mordena",
      Janssen: "Johnson & Johnson's Janssen",
      Sputnik: "Sputnik V",
    };

    this.ModeEnums = {
      ISSUER: { val: "ISSUER", pos: 0 },
      PROVER: { val: "PROVER", pos: 1 },
      VERIFIER: { val: "VERIFIER", pos: 2 },
    };

    this.StatusEnums = {
      manufactured: { val: "MANUFACTURED", pos: 0 },
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
        brand: this.VACCINE_BRANDS.Mordena,
        manufacturer: this.defaultEntities.manufacturerA.id,
      },
      2: {
        brand: this.VACCINE_BRANDS.Janssen,
        manufacturer: this.defaultEntities.manufacturerB.id,
      },
      3: {
        brand: this.VACCINE_BRANDS.Sputnik,
        manufacturer: this.defaultEntities.manufacturerB.id,
      },
      4: {
        brand: this.VACCINE_BRANDS.Pfizer,
        manufacturer: this.defaultEntities.manufacturerB.id,
      },
      5: {
        brand: this.VACCINE_BRANDS.Pfizer,
        manufacturer: this.defaultEntities.manufacturerA.id,
      },
      6: {
        brand: this.VACCINE_BRANDS.Mordena,
        manufacturer: this.defaultEntities.manufacturerA.id,
      },
      7: {
        brand: this.VACCINE_BRANDS.Mordena,
        manufacturer: this.defaultEntities.manufacturerB.id,
      },
      8: {
        brand: this.VACCINE_BRANDS.Sputnik,
        manufacturer: this.defaultEntities.manufacturerB.id,
      },
      9: {
        brand: this.VACCINE_BRANDS.Janssen,
        manufacturer: this.defaultEntities.manufacturerA.id,
      },
    };

    this.coldchainInstance = await ColdChain.deployed();
    this.providerOrUrl = "http://localhost:8545";
  });

  it("should add entities successfully", async () => {
    for (const entity in this.defaultEntities) {
      const { id, mode } = this.defaultEntities[entity];

      const result = await this.coldchainInstance.addEntity(id, mode, {
        from: this.owner,
      });
      expectEvent(result.receipt, "AddEntity", {
        entityId: id,
        entityMode: mode,
      });

      const retreivedEntity = await this.coldchainInstance.entities.call(id);
      assert.equal(id, retreivedEntity.id, "mismatched ids");
      assert.equal(
        this.ModeEnums[mode].pos,
        retreivedEntity.mode.toString(),
        "mismatched modes"
      );
      // assert.equal(
      //   balance.valueOf(),
      //   10000,
      //   "10000 wasn't in the first account"
      // );
    }
  });

  it("should add vaccine batches successfully", async () => {
    for (let i = 0; i < Object.keys(this.defaultVaccineBatches).length; i++) {
      const { brand, manufacturer } = this.defaultVaccineBatches[i];

      const result = await this.coldchainInstance.addVaccineBatch(
        brand,
        manufacturer,
        {
          from: this.owner,
        }
      );
      expectEvent(result.receipt, "AddVaccineBatch", {
        vaccineBatchId: String(i),
        manufacturer: manufacturer,
      });

      const retreivedVaccineBatch =
        await this.coldchainInstance.VaccineBatches.call(i);
      assert.equal(i, retreivedVaccineBatch.id);
      assert.equal(brand, retreivedVaccineBatch.brand);
      assert.equal(manufacturer, retreivedVaccineBatch.manufacturer);
      assert.equal(undefined, retreivedVaccineBatch.certificateIds);
    }
  });

  it("should sign a message and store a certificate from the issuer to the prover", async () => {
    const mnemonic =
      "void inflict sail case speak inject lift garden suspect bone cotton blush";
    const providerOrUrl = "http://localhost:8545";
    const provider = new HDWalletProvider({
      mnemonic,
      providerOrUrl,
    });
    this.web3 = new Web3(provider);
    const { inspector, manufacturerA } = this.defaultEntities;
    const vaccineBatchId = 0;
    const message = `Inspector (${inspector.id}) has certified vaccine batch #${vaccineBatchId} for Manufacturer (${manufacturerA.id}).`; //what an actual certifiacetw ould look like
    const signature = await this.web3.eth.sign(
      this.web3.utils.keccak256(message),
      inspector.id
    );

    const result = await this.coldchainInstance.issueCertificate(
      inspector.id,
      manufacturerA.id,
      this.StatusEnums.manufactured.val,
      vaccineBatchId,
      signature,
      { from: this.owner }
    );

    expectEvent(result.receipt, "IssueCertificate", {
      issuer: inspector.id,
      prover: manufacturerA.id,
      certificateId: new BN(0),
    });

    const retreivedCertificate = await this.coldchainInstance.certificates.call(
      0
    );

    assert.equal(retreivedCertificate.id, 0);
    assert.equal(retreivedCertificate.issuer["id"], inspector.id);
    assert.equal(retreivedCertificate.prover["id"], manufacturerA.id);
    assert.equal(retreivedCertificate.signature, signature);
    assert.equal(
      retreivedCertificate.status,
      this.StatusEnums.manufactured.pos.toString()
    );
  });

  it("should verify that the certificate signature matches the user", async () => {
    const { inspector, manufacturerA } = this.defaultEntities;
    const vaccineBatchId = 0;
    const message = `Inspector (${inspector.id}) has certified vaccine batch #${vaccineBatchId} for Manufacturer (${manufacturerA.id}).`; //what an actual certifiacetw ould look like

    const certificate = await this.coldchainInstance.certificates.call(0);

    const signerMatches = await this.coldchainInstance.isMatchingSignature(
      this.web3.utils.keccak256(message),
      certificate.id,
      inspector.id,
      {
        from: this.owner,
      }
    );

    assert.equal(signerMatches, true);
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { CashOut } from "../typechain-types";

describe("CashOut", function () {
  let owner: any;
  let user: any;
  let business: any;
  let signer: any;
  let other: any;
  let token: any;
  let tokenAddress: string;
  let cashOut: CashOut;

  beforeEach(async () => {
    [owner, user, business, signer, other] = await ethers.getSigners();
    // Deploy a mock ERC20 token
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    token = await ERC20Mock.deploy(
      "TestToken",
      "TTK",
      ethers.parseEther("1000000")
    );
    tokenAddress = token.target;
    // Deploy CashOut
    const factory = await ethers.getContractFactory("CashOut");
    cashOut = await factory.connect(owner).deploy();
    await cashOut.waitForDeployment();
    // Set token mapping
    await cashOut.connect(owner).addTokenMapping("TTK", tokenAddress);
  });

  it("should create a user", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    const u = await cashOut.users(user.address);
    expect(u.userAddress).to.equal(user.address);
    expect(u.metadata).to.equal("user-metadata");
    expect(u.exists).to.be.true;
  });

  it("should create a business and auto-register as signer", async () => {
    await cashOut.connect(business).createBusiness("biz-metadata");
    const b = await cashOut.businesses(business.address);
    expect(b.businessAddress).to.equal(business.address);
    expect(b.metadata).to.equal("biz-metadata");
    expect(b.exists).to.be.true;
    // Also registered as signer
    const s = await cashOut.signerInfo(business.address);
    expect(s.signerAddress).to.equal(business.address);
    expect(s.metadata).to.equal("biz-metadata");
    expect(s.exists).to.be.true;
  });

  it("should add a signer and allow registration", async () => {
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    await cashOut
      .connect(signer)
      .registerSigner(business.address, "signer-metadata");
    const s = await cashOut.signerInfo(signer.address);
    expect(s.signerAddress).to.equal(signer.address);
    expect(s.metadata).to.equal("signer-metadata");
    expect(s.exists).to.be.true;
    const isSigner = await cashOut.isSignerForBusiness(
      signer.address,
      business.address
    );
    expect(isSigner).to.be.true;
  });

  it("should set required signatures", async () => {
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    await cashOut.connect(business).setRequiredSignatures(1);
    const b = await cashOut.businesses(business.address);
    expect(b.requiredSignatures).to.equal(1);
  });

  it("should add token mappings", async () => {
    await cashOut.connect(owner).addTokenMappings(["TTK2"], [tokenAddress]);
    expect(await cashOut.tokenNameToAddress("TTK2")).to.equal(tokenAddress);
    expect(await cashOut.tokenAddressToName(tokenAddress)).to.equal("TTK2");
  });

  it("should create an invoice", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    const details = await cashOut.getInvoiceDetails(0);
    expect(details.creator).to.equal(user.address);
    expect(details.businessAddress).to.equal(business.address);
    expect(details.amount).to.equal(1000);
    expect(details.tokenAddress).to.equal(tokenAddress);
    expect(details.metadata).to.equal("invoice-metadata");
  });

  it("should approve an invoice with valid signatures", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    await cashOut
      .connect(signer)
      .registerSigner(business.address, "signer-metadata");
    await cashOut.connect(business).setRequiredSignatures(1);
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    const invoiceId = 0;
    const hash = await cashOut.getInvoiceHash(invoiceId);
    const sig = await signer.signMessage(ethers.getBytes(hash));
    await cashOut.connect(business).approveInvoice(invoiceId, [sig]);
    const details = await cashOut.getInvoiceDetails(invoiceId);
    expect(details[6]).to.equal(1); // status Approved
  });

  it("should settle an approved invoice", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    await cashOut
      .connect(signer)
      .registerSigner(business.address, "signer-metadata");
    await cashOut.connect(business).setRequiredSignatures(1);
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    const invoiceId = 0;
    const hash = await cashOut.getInvoiceHash(invoiceId);
    const sig = await signer.signMessage(ethers.getBytes(hash));
    await cashOut.connect(business).approveInvoice(invoiceId, [sig]);
    await token.connect(owner).approve(business.address, 1000);
    await token.connect(owner).transfer(business.address, 1000);
    await token.connect(business).approve(cashOut.target, 1000);
    await cashOut.connect(business).settleInvoice(invoiceId);
    const details = await cashOut.getInvoiceDetails(invoiceId);
    expect(details[6]).to.equal(2); // status Settled
  });

  it("should claim an approved invoice", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    await cashOut
      .connect(signer)
      .registerSigner(business.address, "signer-metadata");
    await cashOut.connect(business).setRequiredSignatures(1);
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    const invoiceId = 0;
    const hash = await cashOut.getInvoiceHash(invoiceId);
    const sig = await signer.signMessage(ethers.getBytes(hash));
    await cashOut.connect(business).approveInvoice(invoiceId, [sig]);
    await token.connect(owner).approve(cashOut.target, 1000);
    await token.connect(owner).transfer(cashOut.target, 1000);
    await cashOut.connect(user).claimInvoice(invoiceId);
    const details = await cashOut.getInvoiceDetails(invoiceId);
    expect(details[6]).to.equal(3); // status Claimed
  });

  it("should claim a settled invoice (Settled_And_Claimed)", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    await cashOut
      .connect(signer)
      .registerSigner(business.address, "signer-metadata");
    await cashOut.connect(business).setRequiredSignatures(1);
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    const invoiceId = 0;
    const hash = await cashOut.getInvoiceHash(invoiceId);
    const sig = await signer.signMessage(ethers.getBytes(hash));
    await cashOut.connect(business).approveInvoice(invoiceId, [sig]);
    await token.connect(owner).approve(business.address, 1000);
    await token.connect(owner).transfer(business.address, 1000);
    await token.connect(business).approve(cashOut.target, 1000);
    await cashOut.connect(business).settleInvoice(invoiceId);
    await token.connect(owner).approve(cashOut.target, 1000);
    await token.connect(owner).transfer(cashOut.target, 1000);
    await cashOut.connect(user).claimInvoice(invoiceId);
    const details = await cashOut.getInvoiceDetails(invoiceId);
    expect(details[6]).to.equal(4); // status Settled_And_Claimed
  });

  it("should settle a claimed invoice (Settled_And_Claimed)", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    await cashOut
      .connect(signer)
      .registerSigner(business.address, "signer-metadata");
    await cashOut.connect(business).setRequiredSignatures(1);
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    const invoiceId = 0;
    const hash = await cashOut.getInvoiceHash(invoiceId);
    const sig = await signer.signMessage(ethers.getBytes(hash));
    await cashOut.connect(business).approveInvoice(invoiceId, [sig]);
    await token.connect(owner).approve(cashOut.target, 1000);
    await token.connect(owner).transfer(cashOut.target, 1000);
    await cashOut.connect(user).claimInvoice(invoiceId);
    await token.connect(owner).approve(business.address, 1000);
    await token.connect(owner).transfer(business.address, 1000);
    await token.connect(business).approve(cashOut.target, 1000);
    await cashOut.connect(business).settleInvoice(invoiceId);
    const details = await cashOut.getInvoiceDetails(invoiceId);
    expect(details[6]).to.equal(4); // status Settled_And_Claimed
  });

  it("should reject an invoice", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    const invoiceId = 0;
    await cashOut.connect(business).rejectInvoice(invoiceId);
    const details = await cashOut.getInvoiceDetails(invoiceId);
    expect(details[6]).to.equal(5); // status Rejected
  });

  it("should get business signers", async () => {
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    const signers = await cashOut.getBusinessSigners(business.address);
    expect(signers).to.include(signer.address);
  });

  it("should get invoice approvers and signatures", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    await cashOut
      .connect(signer)
      .registerSigner(business.address, "signer-metadata");
    await cashOut.connect(business).setRequiredSignatures(1);
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    const invoiceId = 0;
    const hash = await cashOut.getInvoiceHash(invoiceId);
    const sig = await signer.signMessage(ethers.getBytes(hash));
    await cashOut.connect(business).approveInvoice(invoiceId, [sig]);
    const approvers = await cashOut.getInvoiceApprovers(invoiceId);
    expect(approvers).to.include(signer.address);
    const sigs = await cashOut.getInvoiceSignatures(invoiceId);
    expect(sigs.length).to.equal(1);
  });

  it("should get business and user invoices", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    const businessInvoices = await cashOut.getBusinessInvoices(
      business.address
    );
    expect(businessInvoices.length).to.equal(1);
    const userInvoices = await cashOut.getUserInvoices(user.address);
    expect(userInvoices.length).to.equal(1);
  });

  it("should check isSignerForBusiness", async () => {
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    await cashOut
      .connect(signer)
      .registerSigner(business.address, "signer-metadata");
    const isSigner = await cashOut.isSignerForBusiness(
      signer.address,
      business.address
    );
    expect(isSigner).to.be.true;
  });

  it("should not allow duplicate user registration", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await expect(
      cashOut.connect(user).createUser("user-metadata")
    ).to.be.revertedWith("User already exists");
  });

  it("should not allow duplicate business registration", async () => {
    await cashOut.connect(business).createBusiness("biz-metadata");
    await expect(
      cashOut.connect(business).createBusiness("biz-metadata")
    ).to.be.revertedWith("Business already exists");
  });

  it("should not allow non-invited signer to register", async () => {
    await cashOut.connect(business).createBusiness("biz-metadata");
    await expect(
      cashOut
        .connect(signer)
        .registerSigner(business.address, "signer-metadata")
    ).to.be.revertedWith("Not invited by this business");
  });

  it("should not allow settle before approval", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    await expect(cashOut.connect(business).settleInvoice(0)).to.be.revertedWith(
      "Invoice not approved by required signers"
    );
  });

  it("should not allow double approval by same signer", async () => {
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    await cashOut
      .connect(signer)
      .registerSigner(business.address, "signer-metadata");
    await cashOut.connect(business).setRequiredSignatures(1);
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    const invoiceId = 0;
    const hash = await cashOut.getInvoiceHash(invoiceId);
    const sig = await signer.signMessage(ethers.getBytes(hash));
    await cashOut.connect(business).approveInvoice(invoiceId, [sig]);
    await expect(
      cashOut.connect(business).approveInvoice(invoiceId, [sig])
    ).to.be.revertedWith("Duplicate signer detected");
  });

  it("should approve an invoice with multiple signers", async () => {
    // Setup: create user, business, and two signers
    await cashOut.connect(user).createUser("user-metadata");
    await cashOut.connect(business).createBusiness("biz-metadata");
    await cashOut.connect(business).addSigner(signer.address);
    await cashOut.connect(business).addSigner(other.address);

    // Both signers register
    await cashOut
      .connect(signer)
      .registerSigner(business.address, "signer1-metadata");
    await cashOut
      .connect(other)
      .registerSigner(business.address, "signer2-metadata");

    // Set required signatures to 2
    await cashOut.connect(business).setRequiredSignatures(2);

    // User creates invoice
    await cashOut
      .connect(user)
      .createInvoice(business.address, 1000, tokenAddress, "invoice-metadata");
    const invoiceId = 0;
    const hash = await cashOut.getInvoiceHash(invoiceId);

    // Both signers sign the hash
    const sig1 = await signer.signMessage(ethers.getBytes(hash));
    const sig2 = await other.signMessage(ethers.getBytes(hash));

    // Business approves invoice with both signatures
    await cashOut.connect(business).approveInvoice(invoiceId, [sig1, sig2]);

    // Check status is Approved
    const details = await cashOut.getInvoiceDetails(invoiceId);
    expect(details[6]).to.equal(1); // status Approved
    // Check both signers are in approvedBy
    const approvers = await cashOut.getInvoiceApprovers(invoiceId);
    expect(approvers).to.include(signer.address);
    expect(approvers).to.include(other.address);
  });
});

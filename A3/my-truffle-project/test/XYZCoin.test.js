const XYZCoin = artifacts.require("XYZCoin");
const truffleAssert = require('truffle-assertions');

contract("XYZCoin", async accounts => {
    it("should set the token name correctly", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        assert.equal(await xyzCoinInstance.name(), "XYZCoin");
    });

    it("should have the initial balance equal to the total supply", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let totalSupply = await xyzCoinInstance.totalSupply();
        let creatorBalance = await xyzCoinInstance.balanceOf(accounts[0]);
        assert.equal(creatorBalance.toString(), totalSupply.toString(), "Initial balance is not equal to total supply");
    });

    it("should transfer tokens correctly", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let amount = 10;

        let accountOneStartingBalance = await xyzCoinInstance.balanceOf(accounts[0]);
        let accountTwoStartingBalance = await xyzCoinInstance.balanceOf(accounts[1]);

        await xyzCoinInstance.transfer(accounts[1], amount, { from: accounts[0] });

        let accountOneEndingBalance = await xyzCoinInstance.balanceOf(accounts[0]);
        let accountTwoEndingBalance = await xyzCoinInstance.balanceOf(accounts[1]);

        assert.equal(accountOneEndingBalance.toString(), accountOneStartingBalance.subn(amount).toString(), "Amount wasn't correctly taken from the sender");
        assert.equal(accountTwoEndingBalance.toString(), accountTwoStartingBalance.addn(amount).toString(), "Amount wasn't correctly sent to the receiver");
    });

    it("should set and read allowance correctly", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let allowanceAmount = 20;

        await xyzCoinInstance.approve(accounts[1], allowanceAmount, { from: accounts[0] });

        let allowance = await xyzCoinInstance.allowance(accounts[0], accounts[1]);

        assert.equal(allowance.toString(), allowanceAmount.toString(), "Allowance wasn't set correctly");
    });

    it("should allow accounts to transfer tokens on behalf of other accounts", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let amount = 15;

        await xyzCoinInstance.approve(accounts[1], amount, { from: accounts[0] });

        let accountZeroStartingBalance = await xyzCoinInstance.balanceOf(accounts[0]);
        let accountTwoStartingBalance = await xyzCoinInstance.balanceOf(accounts[2]);

        await xyzCoinInstance.transferFrom(accounts[0], accounts[2], amount, { from: accounts[1] });

        let accountZeroEndingBalance = await xyzCoinInstance.balanceOf(accounts[0]);
        let accountTwoEndingBalance = await xyzCoinInstance.balanceOf(accounts[2]);

        assert.equal(accountZeroEndingBalance.toString(), accountZeroStartingBalance.subn(amount).toString(), "Amount wasn't correctly taken from the sender");
        assert.equal(accountTwoEndingBalance.toString(), accountTwoStartingBalance.addn(amount).toString(), "Amount wasn't correctly sent to the receiver");
    });

    it("should throw an error when trying to transfer tokens with insufficient balance", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let initialBalance = await xyzCoinInstance.balanceOf(accounts[1]);

        await truffleAssert.reverts(
            xyzCoinInstance.transfer(accounts[2], initialBalance.addn(1), { from: accounts[1] }),
            "ERC20: transfer amount exceeds balance"
        );
    });

    it("should revert transaction when transferring from an account without allowance", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        
        await truffleAssert.reverts(
            xyzCoinInstance.transferFrom(accounts[0], accounts[2], 10, { from: accounts[1] }),
            "ERC20: transfer amount exceeds allowance"
        );
    });

    it("should fire Transfer event on transfer", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();

        let result = await xyzCoinInstance.transfer(accounts[1], 0, { from: accounts[0] });

        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.from === accounts[0] && ev.to === accounts[1] && ev.value.toString() === '0';
        });
    });

    it("should fire Transfer event on transferFrom", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let amount = 10;

        await xyzCoinInstance.approve(accounts[1], amount, { from: accounts[0] });

        let result = await xyzCoinInstance.transferFrom(accounts[0], accounts[2], amount, { from: accounts[1] });

        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.from === accounts[0] && ev.to === accounts[2] && ev.value.toString() === amount.toString();
        });
    });

    it("should fire Approval event on approve", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let allowanceAmount = 20;

        let result = await xyzCoinInstance.approve(accounts[1], allowanceAmount, { from: accounts[0] });

        truffleAssert.eventEmitted(result, 'Approval', (ev) => {
            return ev.owner === accounts[0] && ev.spender === accounts[1] && ev.value.toString() === allowanceAmount.toString();
        });
    });
});

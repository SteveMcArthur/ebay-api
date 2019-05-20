const dotenv = require('dotenv');
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });
const Ebay = require('../index.js');
const fs = require('fs');
const chai = require("chai");
const assert = chai.assert;

let config = {
    devId: process.env.EBAY_DEVID,
    certId: process.env.EBAY_CERTID,
    appId: process.env.EBAY_APPID,
    sandbox: false,
    authToken: process.env.EBAY_AUTHTOKEN,
    outputRawData: true
}
const testItemId = process.env.EBAY_TEST_ITEMID;

const ebay = new Ebay(config);

describe("call getItem", function () {
    it("getItem", function (done) {
        ebay.outputRawData = true;
        ebay.getItem(testItemId, function (err, data) {
            assert.isNull(err);
            assert.isNotNull(data);
            assert.property(data, 'Item');
            done();
        });

    });

});

describe("call getSellerList", function () {
    it("getSellerList", function (done) {
        this.timeout(6000);
        ebay.outputRawData = true;
        ebay.getSellerList(function (err, data) {
            assert.isNull(err);
            assert.isNotNull(data);
            assert.property(data, 'Items');
            done();
        });
    });
});

describe("call findItemsByKeywords", function () {
    it("findItemsByKeywords", function (done) {
        this.timeout(6000);
        ebay.outputRawData = true;
        ebay.findItemsByKeywords("Doctor Who Birthday Card", "EBAY-GB",function (err, data) {
            assert.isNull(err);
            assert.isNotNull(data);
            assert.property(data, 'findItemsByKeywordsResponse');
            assert.property(data.findItemsByKeywordsResponse.searchResults[0].item[0], 'itemId');
            done();
        });
    });
});

describe("call getItem formatted", function () {
    it("getItem", function (done) {
        ebay.outputRawData = false;
        ebay.getItem(testItemId, function (err, data) {
            assert.isNull(err);
            assert.isNotNull(data);
            assert.property(data, 'itemid');
            done();
        });

    });

});
describe("call getSellerList formatted", function () {
    it("getSellerList", function (done) {
        this.timeout(6000);
        ebay.outputRawData = false;
        ebay.getSellerList(function (err, data) {
            assert.isNull(err);
            assert.isNotNull(data);
            assert.property(data[0], 'itemid');
            done();
        });
    });
});

describe("call findItemsByKeywords formatted", function () {
    it("findItemsByKeywords", function (done) {
        this.timeout(6000);
        ebay.outputRawData = false;
        ebay.findItemsByKeywords("Doctor Who Birthday Card", "EBAY-GB",function (err, data) {
            assert.isNull(err);
            assert.isNotNull(data);
            assert.property(data[0], 'itemid');
            done();
        });
    });
});

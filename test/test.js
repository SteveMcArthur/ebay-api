const dotenv = require('dotenv');
const path = require("path");
dotenv.config({ path:path.join(__dirname,".env")});
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
    let dataReturned = null;
    let errReturned = null;
    before(function(done){
        ebay.getItem(testItemId,function (err, data) {
            errReturned = err;
            dataReturned = data;
            done();
        });
    });
    
    it('error param should be null', function () {
        assert.isNull(errReturned);
    });
    it('data param should NOT be null', function () {
        assert.isNotNull(dataReturned);
    });
    it('data param should have property "Item"', function () {
        assert.property(dataReturned, 'Item');
    });
});

describe("call getMySelling", function () {
    let dataReturned = null;
    let errReturned = null;
    before(function(done){
        ebay.getMySelling(function (err, data) {
            errReturned = err;
            dataReturned = data;
            done();
        });
    });
    
    it('error param should be null', function () {
        assert.isNull(errReturned);
    });
    it('data param should NOT be null', function () {
        assert.isNotNull(dataReturned);
    });
    it('data param should have property "ActiveList"', function () {
        assert.property(dataReturned, 'ActiveList');
    });
    it('ActiveList[0] should have property "Items"', function () {
        assert.property(dataReturned.ActiveList[0], 'Items');
    });
});


function getMySelling() {
    ebay.getMySelling(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            fs.writeFileSync("activeListings.json", JSON.stringify(data, null, 4), "utf-8");
        }
    });
}
function getItem() {
    ebay.getItem("183619172569", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            fs.writeFileSync("getItem.json", JSON.stringify(data, null, 4), "utf-8");
        }
    });
}
//getItem();
//getMySelling();
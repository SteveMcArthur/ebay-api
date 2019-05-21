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
    outputRawData: false
}
const testItemId = process.env.EBAY_TEST_ITEMID;

const ebay = new Ebay(config);

const outputfolder = "output";
function outputFile(name,data) {
    let ext = ebay.outputXMLData ? ".xml" : ".json"
    let fname = name+ext;
    if (ebay.outputRawData && !ebay.outputXMLData) {
        fname = name+"-raw"+ext;
    }
    fname = path.resolve(outputfolder,fname);
    let txt = ebay.outputXMLData ? data : JSON.stringify(data,null,4);
    fs.writeFileSync(fname, txt, "utf-8");
}


function getMySelling() {
    ebay.getMySelling(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            outputFile("activeListings",data);
        }
    });
}
function getItem() {
    ebay.getItem("183545131259", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            outputFile("getItem",data);
        }
    });
}

function search() {
    let options = {
        site: "EBAY-GB"
    }
    ebay.findItemsByKeywords("Doctor Who Birthday Card", "EBAY-GB", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            outputFile("findItemsByKeywords",data);
        }
    });
}
function getSellerList() {
    ebay.getSellerList(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            outputFile("sellerlist",data);
        }
    });
}

function getSellerTransactions() {
    let day = 1000 * 60 * 60 * 24;
    let month = day * 30;
    let now = (new Date()).getTime();
    let from = now - (3 * month);
    let to = now - (2 * month);
    let fromdt = new Date(from);
    let todt = new Date(to);
    ebay.getSellerTransactions(fromdt, todt, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            outputFile("sellertransactions",data);
        }
    });

}

ebay.setOutputRawData(true);
//ebay.setOutputXMLData(true);
//getItem();
//getMySelling();
search();
//getSellerList();
//getSellerTransactions();
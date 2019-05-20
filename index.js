const ebayXML = require('./nodejs-ebay-api');
const ebayFind = require('./ebay-find-api');

const formatData = require("./lib/formatData");



function Ebay(config) {
    this.config = {
        devId: config.devId,
        certId: config.certId,
        appId: config.appId,
        authToken: config.authToken,
        sandbox: config.sandbox || false
    }
    this.outputRawData = config.outputRawData || false;
    if ((config.dataFormatter) && (typeof config.dataFormatter === "function")) {
        formatData = config.dataFormatter;
    }
}

Ebay.prototype.setOutputRawData = function (rawData) {
    this.outputRawData = rawData ? true : false;
}
Ebay.prototype.setOutputXMLData = function (xmlData) {
    this.outputXMLData = xmlData ? true : false;
    if(xmlData){
        this.outputRawData = true;//but don't change of false
    }
}

function getConfig(serviceName, opType, params) {
   
    let newConfig = {
        serviceName: serviceName,
        opType: opType,
        devId: this.config.devId,
        certId: this.config.certId,
        appId: this.config.appId,
        authToken: this.config.authToken,
        sandbox: this.config.sandbox,
        params: params
    }
    if (this.outputXMLData) {
        newConfig.raw = true;
    }
    return newConfig
}

function getFindConfig(serviceName, opType, params) {
    let globalID = params.site || "EBAY-US";
    let limit = params.limit || 100;
    let sellerInfo = true
    delete params.site;
    delete params.limit;
    let newConfig = {
        serviceName: serviceName,
        opType: opType,
        appId: this.config.appId,
        params: params,
        globalID: globalID,
        limit: limit,
        sellerInfo: sellerInfo,
        sandbox: this.config.sandbox
        //keywords: params.keywords
    }
    return newConfig;
}
function makeXMLRequest(serviceName, opType, params, callback) {
    let newConfig = getConfig.call(this, serviceName, opType, params);
    let self = this;
    ebayXML.xmlRequest(newConfig, function (error, results) {
        if (error) {
            console.log(error);
            callback(error)
        } else {

            let data = results;
            if (!self.outputRawData) {
                data = formatData(opType,results);
            }

            callback(null, data);
        }
    });
}

function makeURLRequest(serviceName, opType, params, callback) {
    let newConfig = getFindConfig.call(this, serviceName, opType, params);
    let self = this;
    ebayFind.findItemsByKeywords(newConfig, function (error, results) {
        if (error) {
            console.log(error);
            callback(error)
        } else {

            let data = results;
            if (!self.outputRawData) {
                data = formatData(opType,results);
            }
            callback(null, data);
        }
    });
}

Ebay.prototype.getItem = function (itemId, callback) {
    let opType = 'GetItem';
    let params = {
        itemID: itemId,
        DetailLevel: 'ReturnAll'
    }
    makeXMLRequest.call(this, "Trading", opType, params, callback);
}

Ebay.prototype.getMySelling = function (callback) {
    let opType = 'GetMyeBaySelling';
    let params = {
        ActiveList: {
            Include: true
        }
        //DetailLevel: 'ReturnAll' //this just returns active,sold and deactivate
    };
    makeXMLRequest.call(this, "Trading", opType, params, callback);
}

Ebay.prototype.getSellerList = function (callback) {
    let opType = 'GetSellerList';
    let day = 1000 * 60 * 60 * 24;
    let month = day * 30;
    let dt = new Date().getTime();
    let params = {
        EndTimeFrom: (new Date(dt - month)).toISOString(),
        EndTimeTo: (new Date(dt + month)).toISOString(),
        IncludeWatchCount: true,
        //GranularityLevel: "Fine",
        //DetailLevel: "ItemReturnDescription",
        DetailLevel: "ReturnAll",
        Pagination: {
            EntriesPerPage: 50,
            PageNumber: 1
        }
        
    };
    makeXMLRequest.call(this, "Trading", opType, params, callback);
}

Ebay.prototype.getSellerTransactions = function (dateFrom, dateTo, callback) {
    let opType = 'GetSellerTransactions';
    if (typeof dateFrom == "function") {
        callback = dateFrom;
        dateFrom = null;
        dateTo = null;
    }

    let params = {
        Pagination: {
            EntriesPerPage: 50,
            PageNumber: 1
        }
    }
    if (!dateFrom) {
        params.NumberOfDays = 30;
    } else {
        params.ModTimeFrom = dateFrom.toISOString();
        params.ModTimeTo = dateTo.toISOString();
    }

    makeXMLRequest.call(this, "Trading", opType, params, callback);

}

Ebay.prototype.findItemsByKeywords = function (keywords, countryId, callback) {
    let opType = 'findItemsByKeywords';
    let params = {
        keywords: keywords,
        site: countryId
    }

    makeURLRequest.call(this, "Finding", opType, params, callback);
}

module.exports = Ebay;



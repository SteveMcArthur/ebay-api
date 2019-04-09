var ebayAPI = require('./nodejs-ebay-api');

function formatItem(item) {
  let result = {
    price: item.SellingStatus.CurrentPrice.amount,
    shipping: item.ShippingDetails.ShippingServiceOptions.ShippingServiceCost.amount,
    sku: item.SKU,
    title: item.Title,
    itemid: item.ItemID,
    url: item.ListingDetails.ViewItemURL,
    img: item.PictureDetails.GalleryURL
  }
  return result;

}

const buildArray = (data) => {
  let items = data.ActiveList[0].Items;
  let result = [];
  let i = 1;
  let price = "";
  let title = "";
  let itemId = "";
  let itemIdArray = [];
  items.forEach((item) => {
    itemId = item.ItemID;
    if (itemIdArray.indexOf(itemId) === -1) {
      itemIdArray.push(itemId);
      formatted = formatItem(item);
      result.push(formatted);
      i++;
    }
  });
  return result;
}


function Ebay(config) {

  this.config = {
    devId: config.devId,
    certId: config.certId,
    appId: config.appId,
    authToken: config.authToken,
    sandbox: config.sandbox || false
  }
  this.outputRawData = config.outputRawData || false;

}


Ebay.prototype.setOutputRawData = function (rawData) {
  this.outputRawData = rawData ? true : false;
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

  return newConfig

}
function makeRequest(serviceName, opType, params, callback) {
  let newConfig = getConfig.call(this, serviceName, opType, params);
  let self = this;
  ebayAPI.xmlRequest(newConfig, function (error, results) {
    if (error) {
      console.log(error);
      callback(error)
    } else {

      let data = results;
      if (!self.outputRawData) {
        if (data.ActiveList) {
          data = buildArray(results);
        } else {
          data = formatItem(results.Item)
        }
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
  makeRequest.call(this, "Trading", opType, params, callback);
}

Ebay.prototype.getMySelling = function (callback) {
  let opType = 'GetMyeBaySelling';
  let params = {
      ActiveList: {
        Include: true
      }
  };
  makeRequest.call(this, "Trading", opType, params, callback);
}

module.exports = Ebay;



const getListingItemList = require('./getListingItemList');
const getListingItem = require('./getListingItem');
const formatTransactionData = require('./formatTransactions');

const formatters = {
    'GetItem' : function(data){
        return getListingItem(data.Item,'GetItem');
    },
    'findItemsByKeywords' : function(data){
        return getListingItemList(data.findItemsByKeywordsResponse[0].searchResult[0].item,'findItemsByKeywords');
    },
    'GetSellerList':  function(data){
        return getListingItemList(data.Items,'GetSellerList');
    },
    'GetMyeBaySelling':  function(data){
        //getListingItemList(data.ActiveList[0].Items);
        console.log("GetMyeBaySelling formatter not yet implemented")
    },
    'GetSellerTransactions':  function(data){
        return formatTransactionData(data,'GetSellerTransactions');
    },
    defaultFormatter: function(data){
        console.log("No formatter found for operation");
        return [];
    }
}


function formatData(opType,data) {
    let formatter = formatters[opType] || formatters.defaultFormatter;
    return formatter(data);
}

module.exports = formatData;
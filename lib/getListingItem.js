
function formatInternationalShipping(options) {
    let shipping = {};
    if (options) {
        if (options[0].ShipToLocation.indexOf("US") > -1) {
            shipping["US"] = options[0].ShippingServiceCost.amount
        }
        if (options[0].ShipToLocation.indexOf("EuropeanUnion") > -1) {
            shipping["EU"] = options[0].ShippingServiceCost.amount
        }
        if (options[1].ShipToLocation.indexOf("US") > -1) {
            shipping["US"] = options[1].ShippingServiceCost.amount
        }
        if (options[1].ShipToLocation.indexOf("EuropeanUnion") > -1) {
            shipping["EU"] = options[1].ShippingServiceCost.amount
        }
    }
    return shipping;
}

function formatInternationalShipping2(options) {
    if (options) {
        let results = options.map(function (item) {
            return {
                locations: Array.isArray(item.ShipToLocation) ? item.ShipToLocation.join(",") : item.ShipToLocation,
                cost: item.ShippingServiceCost.amount + item.ShippingServiceCost.currencyID,
                additional: item.ShippingServiceAdditionalCost.amount + item.ShippingServiceAdditionalCost.currencyID
            }
        });
        return results;
    } else {
        return {};
    }

}
function safeGetValue(item, props) {
    let current = item;
    let result = "";
    for (let prop of props) {       
        if (!current[prop]) {
            result = "-1";
            break;
        }else {
            current = current[prop];
            result = current;
        }
    }
    return result; 
}
const formatters = {
    'GetItem': function (item) {
        let category = item.PrimaryCategory ? item.PrimaryCategory.CategoryName : "";
        let intShipping = formatInternationalShipping(item.ShippingDetails.InternationalShippingServiceOption);
        let obj = {
            price: item.SellingStatus.CurrentPrice.amount,
            currency: item.SellingStatus.CurrentPrice.currencyID,
            convertedPrice: item.SellingStatus.ConvertedCurrentPrice.amount,
            convertedCurrency: item.SellingStatus.ConvertedCurrentPrice.currencyID,
            shipping: item.ShippingDetails.ShippingServiceOptions.ShippingServiceCost.amount,
            sku: item.SKU,
            title: item.Title,
            itemid: item.ItemID,
            category: category,
            description: item.Description,
            quantity: item.Quantity,
            status: item.SellingStatus.ListingStatus,
            timeleft: item.TimeLeft,
            watchCount: item.WatchCount,
            hitCount: item.HitCount,
            url: item.ListingDetails.ViewItemURL,
            img: item.PictureDetails.GalleryURL,
            pictureURL: item.PictureDetails.PictureURL,
            crossBorderTrade: item.CrossBorderTrade,
            dispatchTimeMax: item.DispatchTimeMax,
            USshipping: intShipping.US,
            EUshipping: intShipping.EU
        };
        return obj;
    },
    'findItemsByKeywords': function (item) {
        let category = safeGetValue(item,["primaryCategory",0,"categoryName",0]);
        let seller = safeGetValue(item,["sellerInfo",0,"sellerUserName",0]);
        let obj = {
            price: item.sellingStatus[0].currentPrice[0]["__value__"],
            currency: item.sellingStatus[0].currentPrice[0]["@currencyId"],
            convertedPrice: item.sellingStatus[0].convertedCurrentPrice[0]["__value__"],
            convertedCurrency: item.sellingStatus[0].convertedCurrentPrice[0]["@currencyId"],
            //shipping: item.shippingInfo[0].shippingServiceCost[0]["__value__"],
            shipping: safeGetValue(item,["shippingInfo",0,"shippingServiceCost",0,"__value__"]),
            sku: "",
            title: item.title[0],
            itemid: item.itemId[0],
            category: category,
            description: "",
            multivar: item.isMultiVariationListing[0],
            seller: seller,
            quantity: "",
            status: item.sellingStatus[0].sellingState[0],
            timeleft: item.sellingStatus[0].timeLeft[0],
            watchCount: item.listingInfo[0].watchCount ? item.listingInfo[0].watchCount[0] : "",
            hitCount: "",
            url: item.viewItemURL[0],
            img: item.galleryURL[0],
            pictureURL: "",
            crossBorderTrade: "",
            dispatchTimeMax: "",
            USshipping: "",
            EUshipping: ""
        };
        return obj;
    },
    'GetSellerList': function (item) {
        let category = item.PrimaryCategory ? item.PrimaryCategory.CategoryName : "";
        let intShipping = formatInternationalShipping(item.ShippingDetails.InternationalShippingServiceOption);
        let obj = {
            price: item.SellingStatus.CurrentPrice.amount,
            currency: item.SellingStatus.CurrentPrice.currencyID,
            convertedPrice: item.SellingStatus.ConvertedCurrentPrice.amount,
            convertedCurrency: item.SellingStatus.ConvertedCurrentPrice.currencyID,
            shipping: item.ShippingDetails.ShippingServiceOptions.ShippingServiceCost.amount,
            sku: item.SKU  || "",
            title: item.Title,
            itemid: item.ItemID,
            category: category,
            description: item.Description,
            quantity: item.Quantity,
            status: item.SellingStatus.ListingStatus,
            timeleft: item.TimeLeft || "",
            watchCount: item.WatchCount,
            hitCount: item.HitCount,
            url: item.ListingDetails.ViewItemURL,
            img: item.PictureDetails.GalleryURL,
            pictureURL: item.PictureDetails.PictureURL,
            crossBorderTrade: item.CrossBorderTrade,
            dispatchTimeMax: item.DispatchTimeMax,
            USshipping: intShipping.US,
            EUshipping: intShipping.EU
        };
        return obj;
    },
    'GetMyeBaySelling': {},
    'GetSellerTransactions': {},
    defaultFormatter: function (data) {
        console.log("No formatter found for operation");
        return [];
    }
}



function getListingItem(item, opType) {
    let formatter = formatters[opType] || formatters.defaultFormatter;
    return formatter(item);
}

module.exports = getListingItem;


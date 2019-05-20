
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

function formatItem(item) {
    let category = item.PrimaryCategory ? item.PrimaryCategory.CategoryName : "";
    let intShipping = formatInternationalShipping(item.ShippingDetails.InternationalShippingServiceOption)
    let result = {
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
    }
    return result;

}

function buildArray(items) {
    let result = [];
    let i = 1;
    let price = "";
    let title = "";
    let itemId = "";
    let itemIdArray = [];
    items.forEach((item) => {
        itemId = item.ItemID || item.itemId[0];
        if (itemIdArray.indexOf(itemId) === -1) {
            itemIdArray.push(itemId);
            formatted = formatItem(item);
            result.push(formatted);
            i++;
        }
    });
    return result;
}

function formatData(data) {
    let result = data;
    if (data.ActiveList) {
        result = buildArray(data.ActiveList[0].Items);
    } else if (data.Items){
        result = buildArray(data.Items);
    } else if (data.Item) {
        result = formatItem(data.Item)
    } else if (data.findItemsByKeywordsResponse) {
        result = buildArray(data.findItemsByKeywordsResponse[0].searchResult[0].item)
    } else if (data[0] && data[0].searchResult[0].item) {
        result = buildArray(data[0].searchResult[0].item)
    }
    return result;
}
module.exports = formatData;

function formatInternationalShipping(options) {
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

function formatItem(item) {
    let category = item.PrimaryCategory ? item.PrimaryCategory.CategoryName : "";
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
        crossBorderTrade: item.CrossBorderTrade,
        dispatchTimeMax: item.DispatchTimeMax,
        internationalShipping: formatInternationalShipping(item.ShippingDetails.InternationalShippingServiceOption)
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
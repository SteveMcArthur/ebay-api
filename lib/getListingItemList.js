const getListingItem = require("./getListingItem");
function getListingItemList(items,opType) {
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
            listingItem = getListingItem(item,opType);
            result.push(listingItem);
            i++;
        }
    });
    return result;
}

module.exports = getListingItemList;
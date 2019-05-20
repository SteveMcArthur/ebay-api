
function formatData(data){
    let result = []
    data.Transactions.forEach(function(item){
        result.push({
            transactionId: item.TransactionID,
            amountPaid: item.AmountPaid.amount,
            currencyPaid: item.AmountPaid.currencyID,
            buyer: item.Buyer.UserID,
            buyerSite: item.Buyer.Site,
            convertedPaid: item.ConvertedAmountPaid.amount,
            convertedCurrency: item.ConvertedAmountPaid.currencyID,
            transactionPrice: item.TransactionPrice.amount,
            shipping: item.ShippingServiceSelected.ShippingServiceCost.amount,
            paidTime: item.PaidTime,
            shippedTime: item.ShippedTime,
            transactionSiteId: item.TransactionSiteId,
            actualShippingCost: item.ActualShippingCost.amount,
            orderLineItemID: item.OrderLineItemID,
            quantity: item.QuantityPurchased,
            sku: item.Item.SKU || "",
            itemid: item.Item.ItemID,
            status: item.Status.CompleteStatus
        })
    })
    return result;
}

module.exports = formatData;
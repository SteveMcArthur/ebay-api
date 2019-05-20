
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

let obj = {
    "shippingInfo": [
        {
            "shippingServiceCost": [
                {
                    "@currencyId": "GBP",
                    "__value__": "0.0"
                }
            ],
            "shippingType": [
                "Free"
            ],
            "shipToLocations": [
                "Worldwide"
            ]
        }
    ]
}
console.log("Call safeGetValue");
let result = safeGetValue(obj,["shippingInfo",0,"shippingServiceCost",0,"__value__"]);
console.log("Result: "+result);
result = safeGetValue(obj,["shippingInfo",0,"shippingType",0]);
console.log("Result: "+result);
result = safeGetValue(obj,["shippingInfo",0,"shippingBox",0]);
console.log("Result: "+result);
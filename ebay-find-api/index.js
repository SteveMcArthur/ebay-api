const urlRequest = require('./request').urlRequest;

const PROD_BASE_URL = "api.ebay.com";
const SANDBOX_BASE_URL = "api.sandbox.ebay.com";
const BASE_SVC_URL = "svcs.ebay.com";
const BASE_SANDBX_SVC_URL = "svcs.sandbox.ebay.com";
const MERCH_SRVC_NAME = "MerchandisingService";
const PROD_ENV = "PROD";
const SANDBOX_ENV = "SANDBOX";


function buildSearchUrl(options) {
    let base_url = 'https://svcs.ebay.com/services/search/FindingService/v1?';
    if (options.sandbox) base_url = 'https://svcs.sandbox.ebay.com/services/search/FindingService/v1?';      
    base_url += "SECURITY-APPNAME=" + options.appId;
    base_url += "&OPERATION-NAME=" + options.opType;
    base_url += "&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON";
    for(key in options.params){
        base_url += "&" + key + "=" + options.params[key];
    }   
    base_url += options.limit ? "&paginationInput.entriesPerPage=" + options.limit : '';
    base_url += options.globalID ? "&GLOBAL-ID=" + options.globalID : '';
    base_url += options.pageNumber ? "&paginationInput.pageNumber=" + options.pageNumber : '';
    base_url += options.sellerInfo ? "&outputSelector(0)=SellerInfo" : '';
    return base_url;
};

function Ebay(options) {

    if (!options) throw new Error("Options is missing, please provide the input");
    if (!options.clientID) throw Error("Client ID is Missing\ncheck documentation to get Client ID http://developer.ebay.com/DevZone/account/");
    if (!(this instanceof Ebay)) return new Ebay(options);
    if (!options.env) options.env = PROD_ENV;
    options.baseUrl = PROD_BASE_URL;
    options.baseSvcUrl = BASE_SVC_URL;
    // handle sandbox env.
    if (options.env === SANDBOX_ENV) {
        options.baseUrl = SANDBOX_BASE_URL;
        options.baseSvcUrl = BASE_SANDBX_SVC_URL;
    }
    this.options = options;
    //this.options.globalID = options.countryCode || "EBAY-US";
}


function findItemsByKeywords(options,callback) {
    if (!options.params.keywords) throw new Error("Keywords is missing, Keywords is required");

    const url = buildSearchUrl(options);
    urlRequest(url,callback);
};

module.exports.findItemsByKeywords = findItemsByKeywords;
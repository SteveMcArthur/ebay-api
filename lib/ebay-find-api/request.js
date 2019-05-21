request = require('request');



function urlRequest(url,callback){
    request(url,function(error, response, body){
        if(!error){
            let data = JSON.parse(body);
            callback(error,data);
        }else {
            callback(error);
        }
    });

}

module.exports.urlRequest = urlRequest;
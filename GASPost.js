var request = require('request');

var headers = {
  'Content-Type':'application/json'
}

class GASPost {
    constructor() {
    }

    post(uuid) {
        //オプションを定義
        let jsonData =
        {
            "uuid": uuid,
        };
        let payload = JSON.stringify(jsonData);

        // request options
        let options = {
            url: process.env.SPREADSHEET_URL,
            method: 'POST',
            headers: headers,
            form: payload
        };

        return new Promise(function(resolve, reject) {
            request(options, function(error, response, body){
                if (!error && response.statusCode == 200) {
                    resolve(true);

                } else {
                    console.log('error: '+ response.statusCode + body);
                    reject(error);
                }
            });
        });

    }

}
module.exports = GASPost;
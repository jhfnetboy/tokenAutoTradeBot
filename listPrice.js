const request = require('request');
//request(options,callback)
const baseUrl = 'https://pro-api.coinmarketcap.com/v1/'
const endPoint = 'cryptocurrency'
// const surl = '/listings/latest'
const surl = "/quotes/latest"

require('dotenv').config();
const API_KEY = process.env.COINMARKET_API_KEY;

const requestOptions = {
  method: 'GET',
  uri: baseUrl+surl+endPoint,
  qs: {
    'id': '1,2',
    // 'start': '1',
    // 'limit': '2',
    // 'convert': 'USD',
    // 'sort': 'date_added',
    // 'sort_dir': 'desc'
  },
  headers: {
    'X-CMC_PRO_API_KEY': API_KEY
  },
  json: true,
  gzip: true
};

request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body)
    }
}); 

// {
//     url: baseUrl+surl+endPoint,//请求路径
//     method: "GET",//请求方式，默认为get
//     headers: {//设置请求头
//         "content-type": "application/json",
//     },
//     body: JSON.stringify(requestData)//post参数字符串
// }
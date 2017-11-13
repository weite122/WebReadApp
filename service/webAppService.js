var fs =require('fs')//访问文件系统
exports.get_test_data = function(){
    var content = fs.readFileSync('./mock/test.json','utf-8')
    return content
}

exports.get_search_data = function(start,end,keyword){
    return function(cb){
        var http = require('http')
        var qs = require('querystring')
        var data = {
            s: keyword,
            start: start,
            end: end
        }
        var content = qs.stringify(data)
        var http_request = {
            hostname: 'dushu.xiaomi.com',
            port : 80,
            path: '/store/v0/lib/query/onebox?' + content
        }
        req_obj = http.request(http_request,function(_res){
            var content = ''
            _res.setEncoding('utf8')
            _res.on('data',function(chunk){
                content +=chunk
            })
            _res.on('end',function(){
                cb(null,content)
            })
        })

        req_obj.on('error',function(){
            console.log('error')
        })
        req_obj.end()

    }
}



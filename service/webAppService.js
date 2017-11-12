var fs =require('fs')//访问文件系统
exports.get_test_data = function(){
    var content = fs.readFileSync('./mock/test.json','utf-8')
    return content
}
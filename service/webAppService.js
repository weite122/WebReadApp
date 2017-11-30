var fs =require('fs');//访问文件系统
exports.get_chapter_data = function(){
    var content = fs.readFileSync('./mock/reader/chapter.json','utf-8');
    return content;
}

exports.get_index_data = function(){
    var content = fs.readFileSync('./mock/home.json','utf-8');
    return content;
}

exports.get_rank_data = function(){
    var content = fs.readFileSync('./mock/rank.json','utf-8');
    return content;
}

exports.get_chapter_content_data = function(id){
    if(!id){
        id = "18218";
    }
    if(fs.readFileSync('./mock/reader/data/data'+id+'.json','utf-8')){
        return fs.readFileSync('./mock/reader/data/data'+id+'.json','utf-8');
    }else{
        return fs.readFileSync('./mock/mock/book/18218.json','utf-8');
    }
}
exports.get_category_data = function(){
    var content = fs.readFileSync('./mock/category.json', 'utf-8');
    return content;
}

exports.get_bookbacket_data = function(){
    var content = fs.readFileSync('./mock/bookbacket.json', 'utf-8');
    return content;
}

exports.get_female_data = function(){
    var content = fs.readFileSync('./mock/channel/female.json', 'utf-8');
    return content;
}

exports.get_male_data = function(){
    var content = fs.readFileSync('./mock/channel/male.json', 'utf-8');
    return content;
}

exports.get_check_data = function(){
    var content = fs.readFileSync('./mock/check.json', 'utf-8');
    return content;
}

exports.get_catedetail_data = function(){
    var content = fs.readFileSync('./mock/catedetail.json', 'utf-8');
    return content;
}

exports.get_book_data = function(id){
    if(!id){
        id = "18218";
    }
    var content = fs.readFileSync('./mock/book/'+id+'.json','utf-8');
    return content;
}

exports.get_catedetail_data = function(){
    var content = fs.readFileSync('./mock/catedetail.json','utf-8');
    return content;
}

exports.get_category_data = function(){
    var content = fs.readFileSync('./mock/category.json','utf-8');
    return content;
}
exports.get_check_data = function(){
    var content = fs.readFileSync('./mock/check.json','utf-8');
    return content;
}

exports.get_search_data = function(start,end,keyword){
    return function(cb){
        var http = require('http');
        var qs = require('querystring');
        var data = {
            s: keyword,
            start: start,
            end: end
        };
        var content = qs.stringify(data);
        var http_request = {
            hostname: 'dushu.xiaomi.com',
            port : 80,
            path: '/store/v0/lib/query/onebox?' + content
        };
        req_obj = http.request(http_request,function(_res){
            var content = '';
            _res.setEncoding('utf8');
            _res.on('data',function(chunk){
                content +=chunk;
            });
            _res.on('end',function(){
                cb(null,content);
            });
        });

        req_obj.on('error',function(){
            console.log('error');
        });
        req_obj.end();

    }
}



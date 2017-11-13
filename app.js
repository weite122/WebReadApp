var koa = require('koa')
var controller = require('koa-route')
var app = koa()

var views = require('co-views')
var render = views('./view',{
    map: { html : 'ejs'}
})
var service = require('./service/webAppService.js')
var koa_static = require('koa-static-server')


app.use(koa_static({
    rootDir: './static/',//URL
    rootPath:'/static/',//实际路径
    maxage: 0
}))

app.use(controller.get('/router_test',function*(){
    this.set('Cache-Control','no-cache')
    this.body = 'hello koa!'
}))

app.use(controller.get('/ejs_test',function*(){cd 
    this.set('Cache-Control','no-cache')
    this.body = yield render('test',{title:'title_test'})
}))//generator

app.use(controller.get('/api_test',function*(){
    this.set('Cache-Control','no-cache')
    this.body = service.get_test_data()
}))

app.use(controller.get('/ajax/index', function*(){
	this.set('Cache-Control', 'no-cache')
	this.body = service.get_index_data()
}))

app.use(controller.get('/ajax/rank', function*(){
	this.set('Cache-Control', 'no-cache')
	this.body = service.get_rank_data()
}))

app.use(controller.get('/ajax/catedetail', function*(){
	this.set('Cache-Control', 'no-cache')
	this.body = service.get_catedetail_data()
}))

app.use(controller.get('/ajax/category', function*(){
	this.set('Cache-Control', 'no-cache')
	this.body = service.get_category_data()
}))

app.use(controller.get('/ajax/check', function*(){
	this.set('Cache-Control', 'no-cache')
	this.body = service.get_check_data()
}))

app.use(controller.get('/ajax/book', function*(){
	this.set('Cache-Control', 'no-cache')
	var querystring = require('querystring')
	var params = querystring.parse(this.req._parsedUrl.query)
    var id = params.id
    if(!id){
        id = ''
    }
	this.body = service.get_book_data(id)
}))

app.use(controller.get('/ajax/search', function*(){
	this.set('Cache-Control', 'no-cache')
	var querystring = require('querystring')
	var _this = this
	var params = querystring.parse(this.req._parsedUrl.query)
    var start = params.start
    var end = params.end
    var keyword = params.keyword
	this.body = yield service.get_search_data(start, end, keyword)//因为异步返回，所以前面想要yield
}))



app.listen(3001)
console.log('koa server is started!')



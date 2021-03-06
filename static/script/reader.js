(function() {
    let Util = (function() {//封装方法
        /*该方法为H5在存储上提供了支持*/
        // 防止key被覆盖,防止同个域名下，他人误操作了localstorage,加了前缀
        let prefix = 'html5_reader_';
        let StorageGetter = function(key) {
            return localStorage.getItem(prefix + key);
        }
        let StorageSetter = function(key, val) {
            return localStorage.setItem(prefix + key, val);
        }

            
        let getBSONP = function(url,callback){
            return $.jsonp({
                url : url,
                cache : true,
                callback : 'duokan_fiction_chapter',
                success : function(result){
                    let data = $.base64.decode(result)
                    let json = decodeURIComponent(escape(data))
                    callback(json)
                }
            })
        }
        return {//对象
            StorageGetter: StorageGetter,
            StorageSetter: StorageSetter,
            getBSONP : getBSONP
        }
    })();
    let Dom = {//声明常量以便多次引用,提高性能,多次使用的东西要提前调用且缓存，只用一次的没有必要
        top_nav:$('#top-nav'),
        bottom_nav: $('.bottom_nav'),
        night_day_switch_button: $('#night-button'),
        font_container: $('.font-container'),
        font_button: $('#font-button'),
        color_button: $('.child-mod>li')
    }
    let Win = $(window)
    let Doc = $(document)
    let RootContainer = $('#fiction_container')
    let readerModel
    let readerUI
    let initFontSize = Util.StorageGetter('font-size')
    initFontSize = parseInt(initFontSize)    
    if(!initFontSize){
        initFontSize = 14
    }
    RootContainer.css('font-size',initFontSize)
    

    function main() {
        //todo 整个项目的入口函数
        EventHandler()
        readerModel = ReaderModel()
        readerUI = ReaderBaseFrame(RootContainer)
        readerModel.init(function(data){
            readerUI(data)
        })
    }

    function ReaderModel() {
        //todo 这是一个接口--实现和阅读器相关的数据交互方法，ajax请求，跨域数据请求，所有和服务器相关的放在这里
        let Chapter_id
        let ChapterTotal
        let init = function(UIcallback){
            getFictionInfoPromise().then(function(d){
                return getCurrentChapterContentPromise()
            }).then(function(data){
                UIcallback && UIcallback(data)
            })
        }

        let getFictionInfoPromise = function(){
            return new Promise(function(resolve,reject){
                $.get('ajax/chapter',function(data){
                    //TODO 获得章节信息的回调
                    if(data.result ===0){
                        Chapter_id = Util.StorageGetter('CurrentChapterId')
                        Chapter_id = parseInt(Chapter_id)  
                        if(!Chapter_id){
                            Chapter_id = data.chapters[1].chapter_id
                        }
                        ChapterTotal = data.chapters.length
                        resolve()
                    }else {
                        reject()
                    }
                },'json')  
            })
        }

        let getCurrentChapterContentPromise = function(){
            return new Promise(function(resolve,reject){
                $.get('ajax/chapter_data',{
                    id:Chapter_id
                },function(data){
                    if(data.result === 0){
                        let url = data.jsonp
                        Util.getBSONP(url,function(data){
                            // callback && callback(data)
                            resolve(data)
                        })
                    } else {
                        reject({message:'fail'})
                    }
                },'json')
            })
        }
        let preChapter = function(UIcallback){
            Chapter_id = parseInt(Chapter_id,10)
            if(Chapter_id === 0){
                return
            }
            Chapter_id -= 1;
            Util.StorageSetter('CurrentChapterId',Chapter_id)
            getCurrentChapterContent(Chapter_id,UIcallback) 
        }

        let nextChapter = function(UIcallback){
            Chapter_id = parseInt(Chapter_id,10)
            if(Chapter_id === ChapterTotal){
               return
            }
            Chapter_id +=  1;
            Util.StorageSetter('CurrentChapterId',Chapter_id)
            getCurrentChapterContent(Chapter_id,UIcallback) 
        }

        return {
            init : init,
            preChapter : preChapter,
            nextChapter : nextChapter
        }
    }
    function ReaderBaseFrame(container) {
        //todo 渲染基本的UI结构
        function parseChapterData(jsonData){
            let jsonObj = JSON.parse(jsonData)
            let html = '<h4>' + jsonObj.t + '</h4>'
            for(let i = 0; i < jsonObj.p.length; i++){
                html += '<p>' +jsonObj.p[i] +'<p>'
            }
            return html
        }
        return function(data){
            container.html(parseChapterData(data))
        }
        
    }

    function EventHandler() {
        //todo 交互的事件绑定
        //点击唤出上下边栏，click比touch,zepto tap好一点，因为click兼容想要在PC端访问移动端网站的用户
        $('#action_mid').click(function(){
            if (Dom.top_nav.css('display') === 'none') {
                Dom.bottom_nav.show()
                Dom.top_nav.show()
            } else {
                Dom.bottom_nav.hide()
                Dom.top_nav.hide()
                Dom.font_container.hide()
                Dom.font_button.removeClass('active')
            }
        })

        Dom.font_button.click(function(){
            if(Dom.font_container.css('display') === 'none'){
                Dom.font_container.show()
                Dom.font_button.addClass('active')
            } else {
                Dom.font_container.hide()
                Dom.font_button.removeClass('active')
            }
        })
        $('#night-button').click(function(){
            if ($('#day_icon').css('display') === 'block') {
                $('#day_icon').css('display', 'none');
                $('#night_icon').css('display', 'block');
                $('body').css('background','#e9dfc7');		    				
            } else {
                $('#night_icon').css('display', 'none');
                $('#day_icon').css('display', 'block');
                $('body').css('background-color', '#000');
            }
        })

        //背景颜色切换
        Dom.color_button.click(function(){
            let bodyColor = $(this).css('background-color')
            $('body').css('background', bodyColor);
        })

        $('#large-button').click(function(){
            if(initFontSize > 20){
                return
            }
            initFontSize += 1
            RootContainer.css('font-size',initFontSize)
            Util.StorageSetter('font-size',initFontSize)
        })
        $('#small-button').click(function(){
            if(initFontSize < 12){
                return
            }
            initFontSize -= 1
            RootContainer.css('font-size',initFontSize)
            Util.StorageSetter('font-size',initFontSize)
        })
        Win.scroll(function(){
            Dom.bottom_nav.hide()
            Dom.top_nav.hide()
            Dom.font_container.hide()
            Dom.font_button.removeClass('active')
        })

        $('#prev_button').click(function(){
            readerModel.preChapter(function(data){
                readerUI(data)
            })
        })

        $('#next_button').click(function(){
            readerModel.nextChapter(function(data){
                readerUI(data)
            })
        })

    }
    main()
})();
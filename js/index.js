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
                    callback(data)
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
    let initFontSize
    initFontSize = Util.StorageGetter('font-size',initFontSize)
    initFontSize = parseInt(initFontSize)
    
    if(!initFontSize){
        initFontSize = 14 * window.devicePixelRatio 
    }
    RootContainer.css('font-size',initFontSize)
    
    function main() {
        //todo 整个项目的入口函数
        EventHandler()
        let readerModel = ReaderModel()
        readerModel.init()
    }

    function ReaderModel() {
        //todo 这是一个接口--实现和阅读器相关的数据交互方法，ajax请求，跨域数据请求，所有和服务器相关的放在这里
        let Chapter_id
        let init = function(){
            getFictionInfo(function(){
                getCurrentChapterContent(Chapter_id,function(data){

                })
            })
        }
        let getFictionInfo = function(callback){
            $.get('data/chapter.json',function(data){
                //TODO 获得章节信息的回调
                Chapter_id = data.chapters[1].chapter_id
                callback && callback()
            },'json')
        }
        let getCurrentChapterContent = function(chapter_id,data){
            $.get('data/data' + chapter_id + '.json',function(data){
                if(data.result === 0){
                    let url = data.jsonp
                    Util.getBSONP(url,function(data){
                        // console.log(callback)
                        // callback && callback(data)
                    })
                }
            },'json')
        }
        return {
            init : init
        }
    }
    function ReaderBaseFrame() {
        //todo 渲染基本的UI结构
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
            if(initFontSize > 20 * window.devicePixelRatio){
                return
            }
            initFontSize += 1
            RootContainer.css('font-size',initFontSize)
            Util.StorageSetter('font-size',initFontSize)
        })
        $('#small-button').click(function(){
            if(initFontSize < 12 * window.devicePixelRatio){
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
    }
    main()
})();
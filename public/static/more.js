/*
 * * v0.1                        
 * general purpose function only
 * dependency: generalpurpose.css
 *
 */ 
(function($){
//******************************************************************
//     chester start    --- which will not depend on jQuery
//******************************************************************

window.chester = {
    version:"0.1",
    description:"chester general purpose function library"
};
  
chester.getQueryString = function(name) 
{//{{{ 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
    //unescape is deprecated, someone fix it
}//}}}


chester.stripDev = function(url)
{//{{{ 
    var reg=/(^|\.|\/)dev\./;  
    return reg.test(location.hostname)?url:url.replace(reg,"$1");
}//}}}


//******************************************************************
//     $.chester start  --- static method, which will depend on jQuery,
//******************************************************************
$.chester = {
    inform:function(msg)
    {//{{{
       var mask = $('<div class="g-mask"></div>').hide(),
           bubble = $('<div class="g-bubble"></div>').hide();
       if(!$(".g-mask").get(0)){
           $("body").append(mask, bubble);
       }
       mask = $(".g-mask");
       bubble = $(".g-bubble").html(msg);
       if(mask.data("isProcessing")){
           return;
       }
       //mask.stop(true, true);
       //bubble.stop(true, true);
       mask.data("isProcessing", true).fadeIn(100, function(){ bubble.fadeIn(100); })
           .fadeOut(1000, function(){ bubble.fadeOut(1000,function(){mask.data("isProcessing",false);}); });

    }//}}}
}



//******************************************************************
//     $.chester end  --- static method, which will depend on jQuery,
//******************************************************************


//******************************************************************
//     $.fn.* start  --- method, which will depend on jQuery,
//******************************************************************

/*
 * @name:   infiniteScroll
 * @param:  accept an init object
 * {
 *       url                           : from where to load data,
 *       [containerId = "body" or this]: to which the loaded data will be appended,
 *       [page = 1]                    : start by this page to load data,
 *       [rows = 20]                   : how many records(rows) contain in one page,
 *       [loadingImgUrl]               : the spinner when waiting for async request to respond, something like this: 
 *                                       http://i1.hdfimg.com/touch/images/t_loading.gif
 *       [jsonToDom:function(data){}]  : if the response data is formatted in json type, this function will be called 
 *       [finishMsg = "没有更多了"]        
 *                                       to transform json type data to dom and append the dom automatically,
 * }
 * @$.fn.infiniteScroll.defaults:change all the settings by default, an object is required.
 * CAUTION:if jQuery selector returns an Array, only the first item will take effect.
 *
 */
$.fn.infiniteScroll = function(obj) 
{//{{{
    that = this.first();
    obj = $.extend({}, $.fn.infiniteScroll.defaults, obj);
    var containIdDefault;
    if(!that.get(0).tagName || that.get(0).tagName.toUpperCase() == "HTML"){
        containIdDefault = "body";
    }else{
        containIdDefault = that;
    }
    obj.containerId = (!obj.containerId) ? containIdDefault : obj.containerId;
    var container = (typeof(obj.containerId) == "object") ? obj.containerId : $(obj.containerId),
        loadingImg = '<div class="loadingImg" style="text-align:center; display:none; color:#999999; min-height:30px; margin-top:10px;">正在加载...</div>';
    if(obj.loadingImgUrl) loadingImg = $(loadingImg).html('<img src="' + obj.loadingImgUrl + '" alt="正在加载..." >');
    container.append(loadingImg);

    var getRemoteData = (function(){
        var _this = that,
            _obj = obj,
            isLoading = false,
            isFinish = false;
        return function(){
            if(isLoading || isFinish) return;
            var aScrollHeight = !_this.get(0).scrollHeight ? $(document).height() : _this.get(0).scrollHeight, 
                aScrollTop = _this.scrollTop(),
                aHeight = _this.height();
            if(aScrollTop + aHeight + 110 < aScrollHeight){
                return;
            }

            isLoading = true;
            container.find(".loadingImg").show();
            $.ajax({
                url:_obj.url,
                data:{page:_obj.page, rows:_obj.rows},
                type:"POST",
                cache:false,
                success:function(data, status, xhr){
                    data = data.trim();
                    if(!data || data == "[]"){
                        isFinish = true;
                        container.find(".loadingImg").html(_obj.finishMsg);
                        return;
                    }
                    try {
                        var r = JSON.parse(data);
                        var dom = _obj.jsonToDom(r);
                    }catch(e){
                        var dom = data;
                    }
                    _obj.page++;
                    container.find(".loadingImg").before(dom).hide();
                    if(typeof obj.fn=='function'){
                        obj.fn();                                        
                    }
                    isLoading = false;
                },
                complete:function(xhr, status){
                    isLoading = false;
                }
            });
        };
    })();
    that.on("scroll.chester", getRemoteData);
    return this;
}//}}}

$.fn.infiniteScroll.defaults = 
{//{{{
    page:1,
    rows:20,
    finishMsg:"没有更多了"
}//}}}
 
//******************************************************************
//     $.fn.* end  --- method, which will depend on jQuery,
//******************************************************************
})(jQuery);


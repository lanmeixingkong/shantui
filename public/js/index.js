$(function() {

    // language点击
    $('.li03').click(function() {
        $('.language').slideToggle('fast');
    });
    // 我要询价点击
    $('.li01 a').click(function(event) {
        event.preventDefault();
        $('.top_form').slideToggle('fast');
    });
    // 点击询价内部关闭
    $('.top_form_close').click(function() {
        $('.top_form').slideUp('normal');
    });
    // 顶部搜索
    $('.li04').hover(function() {
        $('.li04 input').css({
            'border': '1px solid #ccc'
        }).animate({
            width: '170px'
        }, 300);
    }, function() {
        $('.li04 input').animate({
            width: '0px',
            borderWidth: '0px'
        }, 300);
    });

    //轮转区域-----------
    var oDiv = $('#playbox');
    var oPre = $('#playbox .pre');
    var oNext = $('#playbox .next');
    var oUlBig = $('#playbox .oUlplay');
    var aBigLi = $('.oUlplay li');
    var oDivSmall = $('#playbox .smalltitle');
    var aLiSmall = $('.smalltitle li');
    var now = 0;
    aLiSmall.each(function(e) {
        $(this).click(function() {
            now = e;
            tab();
        });
    });
    oPre.click(function() {
        now--
        if (now < 0) {
            now = aBigLi.length - 1;
        }
        tab();
    });
    oNext.click(function() {
        now++
        if (now == aBigLi.length) {
            now = 0;
        }
        tab();
    });
    var timer = setInterval(function() {
        now++;
        if (now < 8) {
            tab();
        } else {
            now = 0;
            tab();
        }
    }, 2000); //滚动间隔时间设置
    oDiv.mouseover(function() {
        clearInterval(timer);
    });
    oDiv.mouseout(function() {
        timer = setInterval(function() {
            now++;
            if (now < 8) {
                tab();
            } else {
                now = 0;
                tab();
            }
        }, 2000);; //滚动间隔时间设置
    });

    function tab() {
        aLiSmall.each(function() {
            aLiSmall.removeClass();
        });
        $('.smalltitle li:eq(' + now + ')').addClass('thistitle');
        startMove(oUlBig, 'left', -(now * aBigLi[0].offsetWidth));
    }

    function startMove(obj, att, add) {
        clearInterval(obj.timer)
        obj.timer = setInterval(function() {
            var cutt = Math.round(parseFloat(obj.css(att)));
            var speed = (add - cutt) / 8;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (cutt == add) {
                clearInterval(obj.timer)
            } else {
                obj.css(att, cutt + speed + 'px');
            }
        }, 30)
    }
    //轮转结束------

    //pc版nav
    $(window).scroll(function() {
        var scrolltop = $(document).scrollTop();
        if (scrolltop > 64) {
            $('nav').css({
                position: 'fix',
                top: scrolltop
            });
        } else {
            $('nav').css({
                position: 'absolute',
                top: '64px'
            });
        }
    });
    // $('.nav_li').hover(function() {
    //     $(this).children('.nav_div').slideDown('fast');
    // }, function() {
    //     $(this).children('.nav_div').slideUp('fast');
    // });

    $('.nav_li').mouseenter(function() {
        $(this).children('.nav_div').stop().slideDown('fast');
    }).mouseleave(function() {
        $(this).children('.nav_div').stop().slideUp('fast');
    });


    // main1部分产品列表
    $('.prolist li').mouseover(function() {
        $('.prolist li').removeClass('active');
        $(this).addClass('active');
    });

    //main3部分
    $('.main3 ul li a').each(function(i) {
        $(this).click(function(event) {
            event.preventDefault();
            $('.main3 ul li').removeClass('a_now');
            $(this).parent().addClass('a_now');
            $('.main3 div').removeClass('d_now');
            $('.main3 div:eq(' + i + ')').addClass('d_now');
        });
    });
    //main3背景
    // var s=0;
    // $(window).scroll(function(){
    // 	var aaa=2500;
    // 	var ttt=$(document).scrollTop();
    // 	var iii=aaa-ttt;

    // 	if (iii>0) {
    // 		s=s+20;
    // 		$('.main3').css({'background-position':' 50% -'+s+'px'});
    // 	}else{
    // 		s=s-20;
    // 		$('.main3').css({'background-position':' 50% -'+s+'px'});

    // 	}

    // 	// console.log(ttt);
    // });




    // main5 分支
    $('.fenzhi span').click(function() {
            $('.fzs').slideToggle('fast');
        })
        //回到顶部
    $('.backtop').click(function() {
        $(document).scrollTop(0);
    });
    // mobile版导航
    $('.mobilemenu').click(function(event) {
        event.preventDefault();
        $('.mobilenav ul').animate({
            left: '0px'
        }, 1000);
        $('.mobilenav div').show();
    });
    $('.mobilenav div').click(function() {
        $(this).hide();
        $('.mobilenav ul').animate({
            left: '-50%'
        }, 1000);
    });

    window.scrollReveal = new scrollReveal({
        reset: true
    });
});

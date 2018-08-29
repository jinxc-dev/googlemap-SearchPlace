
var showDetailPan, hideDetailPan, checkedCell, insertDetailInfo, initData;
$(document).ready(function(){
    $("img[alt='www.000webhost.com']").css('display','none');

    showDetailPan = function(){
    	if(!$('#detail-pan').hasClass('in')){
    		$('#detail-pan').addClass('in');
    	}
    }
    hideDetailPan =function(){
    	if($('#detail-pan').hasClass('in')){
    		$('#detail-pan').removeClass('in');	
    	}
    }
    closeSearch = function(){
    	$("#search_box").animate({width: "0px"});
    	$('#s_input').removeClass('active');
    	return false;
    }
    clickSearch =function(){
        if($('#search_box').hasClass('active')){
            $("#search_box").removeClass('active');
            return false;
        }else{
            $("#search_box").addClass('active');
            return true;
        }
    };
	$('#close_pan').click(function(){
		hideDetailPan();
    });
    $('#screen_mode').click(function(){
    	if($('#screen_mode').hasClass('full')){
    		$('#screen_mode').removeClass('full');
    		$('#full_mode').css('display', 'inline-block');
    		$('#exact_mode').css('display', 'none');

			if (document.exitFullscreen) {
			  document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
			  document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
			  document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
			  document.msExitFullscreen();
			}
    	}else{
    		$('#screen_mode').addClass('full');
    		$('#full_mode').css('display', 'none');
    		$('#exact_mode').css('display', 'inline-block');



    		var elem = document.documentElement;
    		if (elem.requestFullscreen) {
			    elem.requestFullscreen();
			} else if (elem.mozRequestFullScreen) { /* Firefox */
			    elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
			    elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) { /* IE/Edge */
			    elem.msRequestFullscreen();
			}
    	}
    });

    $('#viewerBtn').click(function(){
    	$('#mainView').addClass('show');
    	$('#maskView').addClass('show');
    	
    });

    $('#leftSlider').click(function(){
    	var act_Num = $('.item.active').attr('num');
    	if(act_Num == '1') return;

    	$('#item_'+act_Num).removeClass('active');
    	var pre_num = String(Number(act_Num) - 1);
    	$('#item_'+pre_num).addClass('active');
    	$('#pageOrder').text(pre_num);

    });
    $('#rightSlider').click(function(){
    	var act_Num = $('.item.active').attr('num');
    	if(act_Num == $('#pages').text()) return;

    	$('#item_'+act_Num).removeClass('active');
    	var next_num = String(Number(act_Num) + 1);
    	$('#item_'+next_num).addClass('active');
    	$('#pageOrder').text(next_num);
    });
    $('#f_btn').click(function(){
		var act_Num = $('.item.active').attr('num');
    	if(act_Num == '1') return;

    	$('#item_'+act_Num).removeClass('active');
    	$('#item_1').addClass('active');
    	$('#pageOrder').text('1');    	
    });
    $('.page-close').click(function(){
    	$('#mainView').removeClass('show');
    	$('#maskView').removeClass('show');
    });

    checkedCell = function(id){
    	if($('#'+id).hasClass('checked')){
    		$('#'+id).removeClass('checked');
    		return false;
    	}else{
    		$('#'+id).addClass('checked');
    		return true;
    	}
    };

    insertDetailInfo = function(data){
    	$('#mainPhoto').attr('src', data.mainPhoto);
        var p_name = data.name;
        if(p_name.length > 28) p_name = p_name.substr(0, 25) + '...';
    	$('#placeName').text(p_name);
    	// $('#dirUrl').attr('href', data.direction);
    	$('#placeName_1').text(data.name);
    	$('#description').text(data.description);
        var phone = data.phone;
        if(!phone) phone = '';
    	$('#address').text(data.address + ' ' + phone);
    	

    	var urlHost = '', siteUrl = '';
    	if(data.website){
    		siteUrl = data.website;
    		var url = new URL(siteUrl);
    		urlHost = url.host;
    	}
    	$('#website').text(urlHost);
    	$('#website').attr('href', data.website);

    	$('#toGoogle').attr('href', data.viewInGoogle);
    	$('#score').text(data.rating);
    	$('#star_back').css('width', String(Number(data.rating)*20) +"%");
    	$('#photo_count').text(data.photoCount);
    	$('#pages').text(data.photoCount);
		
		if(data.photoCount == 0){
			$('#thumbPhoto').css('display', 'none');
			$('#thumbPhoto').attr('src', '');	
		}else{
			$('#thumbPhoto').css('display', '');
			$('#pageOrder').text('1');
			$('#thumbPhoto').attr('src', data.mainPhoto);	
		}    	
    	

    	$('#place_name').text(data.name);
    	showDetailPan();
    }

});
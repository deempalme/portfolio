
$(document).ready(function(e){
	var $wi = $(window);
	var motion = null, position = 0, positionpx = 0, direction = 0, inmotion = 0, wide = 0, objective = 0, H, W, newpos;
	var fps = Math.round(1000/30);
	var $RC = $('#experience article section section');
	var $ET = $('#experience article section h1');
	var $TD = $('#experience article:last-child');
		
	function resizing(){
		W = $wi.width();
		H = $wi.height();
		positionpx = $(window).scrollTop();
		position = Math.floor($(window).scrollTop()/H);
		
		$('#welcome article, #objective article, #education article, #experience article, #knowledge article').height(H);
		$TD.height(H-64);
		var dT = H/2 - 57;
		$('#education article div').css('padding-top',dT+'px');
		var wCC = $TD.width() - $RC.width() - $ET.width() - 62;
		var hCC = $ET.height() + 61;
		var hRC = $TD.height() - $('div.D1').height() - $('div.D2').height() - 4;
		$('div.Ent').css({'width':wCC+'px', 'height':hCC+'px'});
		$RC.css('height',hRC+'px');
		
		var h1Mh = H/2 - $('#education h1').height()/2;
		$('#welcome h1').css('padding-top',h1Mh+'px');	
		$('#objective h1').css('padding-top',h1Mh+'px');	
		$('#education h1').css('padding-top',h1Mh+'px');
		$('#experience h1:first').css('padding-top',h1Mh+'px');
		$('#knowledge h1').css('padding-top',h1Mh+'px');
		$('#welcome article section').width(W/2 - 30);
		var h1 = H/2 - $('#welcome section:first-child').height()/2;
		var h2 = H/2 - $('#welcome section:last-child').height()/2;
		$('#welcome section:first-child').css('margin-top', h1+'px');
		$('#welcome section:last-child').css('margin-top', h2+'px');
		
		var h2Mh = H/2 - $('#objective blockquote').height()/2 - 30;
		$('#objective blockquote').css('padding-top',h2Mh+'px');
	}
	
	$(window).resize(function(e){ resizing();	});
	
	resizing();
	
	var scrollTimeout = null;
	var scrollendDelay = 400;
	
	function scrolling(){
		var posAct = $(window).scrollTop();
		var x = (Math.abs(posAct - objective)/wide - 0.5) * 2;
		var y = Math.round((-3*Math.pow(x,2)+3.1) * 15);
		if(direction < 0){
			y = posAct - y;
			if(y <= objective){
				y = objective;
				clearInterval(motion);
				inmotion = 0;
			}
		}else{
			y = posAct + y;
			if(y >= objective){
				y = objective;
				clearInterval(motion);
				inmotion = 0;
			}
		}
		$(window).scrollTop(y);
		$('#helper').html('y= '+y+' : wide='+wide+' : objective='+objective+' : direction='+direction+' : position='+position+' : posAct='+posAct+' : x='+x);
	}
	
	function scrollAnimation(){
		inmotion = 1;
		if(direction < 0){
			position = Math.ceil($(window).scrollTop()/H);
			position -= 1;
		}else if(direction > 0){
			position = Math.floor($(window).scrollTop()/H);
			position += 1;
		}
		if(position < 0){
			position = 0;
			inmotion = 0;
		}else if(position > 9){
			position = 9;
			inmotion = 0;
		}else{
			objective = position * H;
			wide = Math.abs($(window).scrollTop() - objective);
			motion = setInterval(scrolling, fps);
		}
	}
	
	function scrollbeginHandler() {
	}
	
	function scrollendHandler() {
		scrollTimeout = null;
	}
	
	$(document).keyup(function(event){
		if(inmotion == 0){
			if((event.which == 38) || (event.which == 37) || (event.which == 33)){
				direction = -1;
				scrollAnimation();
			}else if((event.which == 40) || (event.which == 39) || (event.which == 34)){
				direction = 1;
				scrollAnimation();
			}
		}
	});
	
	/*
	$(window).scroll(function() {
		if((scrollTimeout === null) && (inmotion == 0)) {
			scrollbeginHandler();
		}else{
			clearTimeout(scrollTimeout);
		}
		newpos = $(window).scrollTop();
		if(inmotion == 0) scrollTimeout = setTimeout(scrollendHandler, scrollendDelay);
	});
	*/
});

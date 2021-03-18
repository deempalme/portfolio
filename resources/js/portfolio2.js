
$(document).ready(function(e) {
	var w1 = $(window).width(), h1 = $(window).height(),
	w12 = Math.round(w1/2),
	h12 = Math.round(h1/2),
	h14 = Math.round(h12/2);
	
	var
	po = $('#portfolio'), pod = po.children('div'), podd = pod.children('div'), pos = podd.children('section'), pos2 = pos.eq(1), pos3 = pos.eq(2),
	pos1 = pos.eq(0),	pos1a = pos1.children('article'), pos1a1 = pos1a.eq(0), pos1a2 = pos1a.eq(1), pos1a3 = pos1a.eq(2), pos1a4 = pos1a.eq(3),
	pos1a3h1 = pos1a3.find('h1'), pos1a3h2 = pos1a3.find('h2'), pos1a3i = pos1a3.find('img'), pos2a = pos2.children('article'),
	pos2af = pos2a.children('figure'), pos2af1 = pos2af.eq(0), pos2af2 = pos2af.eq(1), pos2af3 = pos2af.eq(2), pos2af4 = pos2af.eq(3),
	pos2afv = pos2af.children('video'),	poh = po.find('header'), pos2afbp = pos2af.find('li:first-child'), pos2afb = pos2af.find('li'),
	pos2afbm = pos2af.find('li:last-child'), pos2aa = pos2a.children('article'), pos2abc = pos2aa.children('div:last-child'),
	pos2aav = pos2aa.find('video'), vid = $('.video'), vid2 = $('#exp2 video'), pos3a = pos3.children('article'),
	pos3aulul = pos3a.children('ul').children('li').children('ul').children('li'), ratio169 = 1.778, ratio = w1/h1;

	var play = [1, 1, 1, 1], HVfc = [70, 60, 88, 70], cvT = [], ctxT = [], cnT = [], cnTa = [], ccT = [], aaT = [], avaT = [], angO = 0, daT = 0;
	pmPX = 0, pmPY = 0, pamPX = 0, pamPY = 0;
	
	function pXY(obj, v1, v2, t, l){
		if(t == 1){
			obj.css('top',v1+'px');
		}else if(t == 2){
			obj.css('bottom',v1+'px');
		}
		if(l == 1){
			obj.css('left',v2+'px');
		}else if(l == 2){
			obj.css('right',v2+'px');
		}
	}
	
	po.height(h1);
	pod.height(h1);
	podd.height(h1);
	podd.width(w1*3);
	pXY(podd, 0, 0, 3, 1);
	
	pos.height(h1);
	pos1.width(w1);
	pos2.width(w1);
	pos3.width(w1);
	pXY(pos1, 0, w1, 1, 1);
	pXY(pos2, 0, w1*2, 1, 1);
	pXY(poh, 0, w12-112, 1, 1);
	
	pos2aa.width(w1-20);
	pos2aa.height(h1-20);
	for(i = 0; i < 4; i++){
		if(i != 1){
			pos2aav.eq(i).height(h1-20);
		}
	}
	vid.width(w1-20);
	vid.height(h1-20);
	vid2.width(w1-20);
	
	var lP1 = Math.round(w12 - 347),
	lP2 = Math.round(h12 - 39),
	lI1 = Math.round(w12 - 315),
	lI2 = Math.round(h12 - 90),
	dP1 = Math.round(h12 - pos1a1.height()/2),
	dP2 = Math.round(h12 - pos1a4.height()/2),
	dP3 = Math.round(-pos1a1.width()/2+40),
	dP4 = Math.round(-pos1a4.width()/2+40);
	
	pXY(pos1a1, dP1, dP3, 1, 1);
	pXY(pos1a2, lP2, lP1, 1, 1);
	pXY(pos1a3, 0, w12-83, 3, 1);
	pXY(pos1a4, dP2, dP4, 1, 2);
	
	pos2af.width(w12 - 15);
	pos2af.height(h12 - 15);
	
	pXY(pos2af1, 0, 0, 1, 1);
	pXY(pos2af2, 0, 0, 1, 2);
	pXY(pos2af3, 0, 0, 2, 1);
	pXY(pos2af4, 0, 0, 2, 2);
	
	if(ratio > ratio169){
		vidY = (w12 - 15) / ratio;
		vidY = ((h12 - 15) - vidY)/2;
		pXY(pos2afv, vidY, 0, 1, 1);
		
		vidY = (w1 - 20) / ratio;
		vidY = ((h1 - 20) - vidY)/2;
		pXY(vid2, vidY, 0, 1, 1);
	}else if(ratio < ratio169){
		pos2afv.css({'width':'inherit', 'height':'100%'});
		vidX = (h12 - 15) * ratio;
		vidX = ((w12 - 15) - vidX)/2;
		pXY(pos2afv, 0, vidX, 1, 1);
		
		vid2.css({'width':'inherit', 'height':'100%'});
		vidX = (h1 - 15) * ratio;
		vidX = ((w1 - 15) - vidX)/2;
		pXY(vid2, 0, vidX, 1, 2);
	}
	
	pos2af.hover(function(){
		$(this).children('figcaption').show();
	},function(){
		$(this).children('figcaption').hide();
	});

	pos2afb.hover(function(){
		$(this).css('background','#4CB5E0');
	},function(){
		$(this).css('background','none');
	});
	
	pos2afbm.click(function(){
		var e = $(this).parent().find('img').attr('id');
		
		switch(e){
			case 'v1':
				i = 1;
			break;
			case 'v2':
				i = 2;
			break;
			case 'v3':
				i = 3;
			break;
			case 'v4':
				i = 4;
			break;
		}
		
		$('#exp'+i).show();
		$('#exp'+i).find('video').get(0).play();
		for(i = 0; i < 4; i++){
			pos2afv.eq(i).get(0).pause();
		}
	});
	
	pos2abc.click(function(){
		for(i = 0; i < 4; i++){
			if(play[i] == 1){
				pos2afv.eq(i).get(0).play();
			}
		}
		$(this).parent().hide();
		$(this).parent().find('video').get(0).pause();
	});
	
	function btnColor(e){
		if(pos2afbp.eq(e).is(':hover')){
			pos2afbp.eq(e).css('background','#4CB5E0');
		}else{
			pos2afbp.eq(e).css('background','none)');
		}
	}
	
	pos2afbp.click(function(){
		$(this).css('background','#FF3C3C');
		setTimeout(function(){ btnColor(i); }, 150);
		
		var idV = $(this).children('img').attr('id');
		switch(idV){
			case 'v1':
				i = 0;
			break;
			case 'v2':
				i = 1;
			break;
			case 'v3':
				i = 2;
			break;
			case 'v4':
				i = 3;
			break;
		}
		if(play[i] == 0){
			$(this).children('img').attr('src','/resources/theme/pause.png');
			$(this).closest('figure').children('video').get(0).play();
			play[i] = 1;
		}else{
			$(this).children('img').attr('src','/resources/theme/play.png');
			$(this).closest('figure').children('video').get(0).pause();
			play[i] = 0;
		}
	});
	
	for(i = 0; i < 4; i++){
		tVh = Math.round(h14 - 7 - HVfc[i]);
		pos2af.eq(i).find('h1').css('padding-top',tVh+'px');
	}
	
	var bgP1 = document.createElement('canvas');
	bgP1.setAttribute('class','bgP1');
	bgP1.width = w1-20;
	bgP1.height = h1-20;
	pos3a.append(bgP1);
	ctxP = bgP1.getContext('2d');
	
	ctxP.beginPath();
	ctxP.rect(0, 0, w1-20, h1-20);
	var pGr = ctxP.createRadialGradient(w12-10, h12-10, 0, w12-10, h12-10, w12-10);
	pGr.addColorStop(0, '#315359');
	pGr.addColorStop(1, '#25373F');
	ctxP.fillStyle = pGr;
	ctxP.fill();

	var bgP2 = document.createElement('canvas');
	bgP2.setAttribute('class','bgP1');
	bgP2.width = w1-20;
	bgP2.height = h1-20;
	pos3a.append(bgP2);
	ctxP2 = bgP2.getContext('2d');
	
	ctxP2.beginPath();
	ctxP2.moveTo(w12-10, 0);
	ctxP2.lineTo(w12-10,h1-20);
	ctxP2.lineWidth = 2;
	ctxP2.strokeStyle = '#24B8E8';
	ctxP2.stroke();
	ctxP2.closePath();
	ctxP2.lineWidth = 1;
	
	var seP = Math.round((w12-13)/11);
	
	for(i = 1; i < 13; i++){
		var ptC = (i)/12 * 0.2;
		ptC = Math.round((0.1 + ptC)*10)/10;
		ctxP2.beginPath();
		ctxP2.arc(w12-10, h12-10, seP*i, 0, Math.PI*2);
		if(i == 1){
			var pGr2 = ctxP2.createRadialGradient(w12-10, h12-10, 0, w12-10, h12-10, seP*i);
			pGr2.addColorStop(0, '#34C5F2');
			pGr2.addColorStop(1, '#24B8E8');
			ctxP2.fillStyle = pGr2;
			ctxP2.fill();
		}else{
			ctxP2.strokeStyle = 'rgba(255,255,255,'+ptC+')';
			ctxP2.stroke();
		}
		ctxP2.closePath();
	}
	
	var anbT = 0;
	
	function circularText(text, diam, l){
		var lgmT = ctxT[l].measureText(ccT[l]),
		lgT = Math.round(lgmT.width);
		if((l > 7) && (l != 16)){
			anbT = Math.atan(lgT/(diam + 13*l));
			ctxT[l].rotate(1.57 - anbT);
		}else{
			anbT = Math.atan(lgT/(diam + 25*l));
			ctxT[l].rotate(-1.57 - anbT);
		}
		anbT = 0;
		for(u = 0; u < text.length; u++){
			lgmT = ctxT[l].measureText(text[u]);
			lgT = (lgmT.width < 13)? 13 : Math.round(lgmT.width);
			anbT = Math.atan(lgT/diam);
			ctxT[l].rotate(anbT);
			ctxT[l].fillText(text[u], 0, -diam);
		}
	}
	
	var nlyP = document.createElement('div'),
	nlyP2 = document.createElement('div');
	nlyP.setAttribute('class','nlyP');
	nlyP2.setAttribute('class','nlyP2');
	$(nlyP).height(h1-20);
	$(nlyP2).height(h1-20);
	$(nlyP).width(w12-10);
	$(nlyP2).width(w12-10);
	pos3a.append(nlyP);
	pos3a.append(nlyP2);
	
	for(i = 0; i < 16; i++){
		cnT[i] = [];
		ccT[i] = pos3aulul.eq(i).html().toUpperCase();
		cnT[i] = ccT[i].split('');
		aaT[i] = 0;
		
		cvT[i] = document.createElement('canvas');
		cvT[i].width = w1-20;
		cvT[i].height = h1-20;
		ctxT[i] = cvT[i].getContext('2d');
		ctxT[i].translate(w12-10, h12-10);
		ctxT[i].font = '200 25px/1 "Titillium Web", Roboto';
		ctxT[i].fillStyle = 'rgba(255,255,255,0.6)';
		ctxT[i].textAlign = 'center';
		a = (i > 7)? i - 6 : i + 1;
		avaT[i] = 0.0174*7/a;
		
		if(i > 7){
			cvT[i].setAttribute('class','ltP2');
			$(nlyP2).append(cvT[i]);
			e = (i - 7) * seP + seP*0.5 - 10;
		}else{
			cvT[i].setAttribute('class','ltP');
			$(nlyP).append(cvT[i]);
			e = (i + 1) * seP + seP*0.5 - 10;
		}
		$(cvT[i]).css('transform-origin','50% 50%');
		if(e > h12){
			cnTa[i] = Math.atan(h12/e);
		}else if(e > w12){
			cnTa[i] = Math.atan(e/w12);
		}else{
			cnTa[i] = 90*Math.PI/180;
		}
		circularText(cnT[i], e, i);
	}
	for(i = 16; i < 18; i++){
		cnT[i] = (i == 16)? 'ENGINEERING:   .' : '.  PROGRAMMING:';
		ccT[i] = cnT[i].toUpperCase();
		cvT[i] = document.createElement('canvas');
		cvT[i].width = w1-20;
		cvT[i].height = h1-20;
		ctxT[i] = cvT[i].getContext('2d');
		ctxT[i].translate(w12-10, h12-10);
		ctxT[i].font = '300 25px/1 "Titillium Web", Roboto';
		//ctxT[i].fillStyle = 'rgba(44,191,237,0.6)';
		ctxT[i].fillStyle = '#C39D5F';
		ctxT[i].textAlign = 'center';
		
		if(i > 16){
			cvT[i].setAttribute('class','ltP2');
			$(nlyP2).append(cvT[i]);
		}else{
			cvT[i].setAttribute('class','ltP');
			$(nlyP).append(cvT[i]);
		}
		e = 9*seP + seP*0.5 - 10;
		circularText(cnT[i], e, i);
	}
	
	var maxVM = Math.round(w1/10);
	
	function velMouse(){
		if(pamPY > 0){
			difX = pmPX - pamPX;
			difY = pmPY - pamPY;
			velM = Math.round(Math.sqrt(Math.pow(difX, 2) + Math.pow(difY, 2)));
			velM = ((difY < 0) || (difX < 0))? -velM : velM;
			angO = Math.round((velM/maxVM)*100)/100;
		}
		pamPX = pmPX;
		pamPY = pmPY;
	}
	
	pos3a.mousemove(function(z){
		pmPX = z.pageX;
		pmPY = z.pageY;
	});
	
	function acceleration(){
		for(i = 0; i < 16; i++){
			tangT  = (angO > 1)? cnTa[i] : cnTa[i] * angO;
			var ttangT = Math.abs(tangT - aaT[i]);

			if(ttangT > 0.0174){
				if(tangT < aaT[i]){
					aaT[i] -= avaT[i];
					var degA = Math.round((aaT[i]*180/Math.PI)*100)/100;
					//degA = (daT > 0)? -degA : degA;
					daT = (daT > 0)? 0 : 1;
					$(cvT[i]).css('transform','rotate('+degA+'deg)');
				}else if(tangT > aaT[i]){
					aaT[i] += avaT[i];
					var degA = Math.round((aaT[i]*180/Math.PI)*100)/100;
					//degA = (daT > 0)? -degA : degA;
					daT = (daT > 0)? 0 : 1;
					$(cvT[i]).css('transform','rotate('+degA+'deg)');
				}
			}
		}
	}
	
	var timeMouse = setInterval(velMouse, 100);
	var accel = setInterval(acceleration, 33);

});
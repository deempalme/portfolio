/*
© Copyleft following GNU GPL statement and:

	Any person has the right to freely distribute copies and modified versions of this code with
	the accompanying requirement that any resulting copies or adaptations are also bound by the same
	licensing agreement and they shall have the name and link of the original author.
	
	Original author: F. J. Ramirez Rodriguez - http://bio.ramirezrodriguez.de

*/
$(document).ready(function() {
	var w1 = $(window).width(), h1 = $(window).height(),
	w12 = Math.round(w1/2),
	h12 = Math.round(h1/2),
	h14 = Math.round(h12/2),
	h32 = h1 + h12,
	rds = [], div = [], obj = [], img = [], shd = [], ctx = [], ctx2 = [], hpl = [], div2 = [], pls = [], ctx3 = [],
	ocu = [], aP = [], iP = [], obP = [], k = [], rpts = [60, 28.5, 50.5, 58, 48, 120, 101.5, 84, 85], imgP = new Image(), strs = 400,
	pts = 8, rd = Math.round(w12/pts), rd2 = 0, anI = Math.PI, anMx = 70, pT = 0, tA = 0, anim = 0, Kp = 0, pK = 0, pl1r = 0, porM = 0,
	t1 = '+49 174', e1 = 'f', e2 = 'j', e3 = 'ramirez', e4 = 'rodriguez', t2 = ' 410 38 34', m1 = 'gm', m2 = 'ail', play = [1, 1, 1, 1],
	HVfc = [70, 60, 88, 70], cvT = [], ctxT = [], cnT = [], cnTa = [], ccT = [], aaT = [], avaT = [], angO = 0, daT = 0,
	pmPX = 0, pmPY = 0, pamPX = 0, pamPY = 0, seP = Math.round((w12-13)/11), anbT = 0, ratio169 = 1.778, ratio = w1/h1,
	maxVM = Math.round(w1/10), timeMouse, accel, mdpT = 0, blcM = 0;
	
	var //portfolio section jquery selectors
	po = $('#portfolio'), pod = po.children('div'), podd = pod.children('div'), pos = podd.children('section'), pos2 = pos.eq(1), pos3 = pos.eq(2),
	pos1 = pos.eq(0), pos1a = pos1.children('article'), pos1a1 = pos1a.eq(0), pos1a2 = pos1a.eq(1), pos1a3 = pos1a.eq(2), pos1a4 = pos1a.eq(3),
	pos1a3h1 = pos1a3.find('h1'), pos1a3h2 = pos1a3.find('h2'), pos1a3i = pos1a3.find('img'), pos2a = pos2.children('article'),
	pos2af = pos2a.children('figure'), pos2af1 = pos2af.eq(0), pos2af2 = pos2af.eq(1), pos2af3 = pos2af.eq(2), pos2af4 = pos2af.eq(3),
	pos2afv = pos2af.children('video'), poh = po.find('header'), pos2afbp = pos2af.find('li:first-child'), pos2afb = pos2af.find('li'),
	pos2afbm = pos2af.find('li:last-child'), pos2aa = pos2a.children('article'), pos2abc = pos2aa.children('div:last-child'),
	pos2aav = pos2aa.find('video'), vid = $('.video'), vid2 = $('#exp2 video'), pos3a = pos3.children('article'), pos1a4h1 = pos1a4.find('h1'),
	pos3au = pos3a.children('ul'), pos3aulul = pos3au.children('li').children('ul').children('li'), pos1a1h1 = pos1a1.find('h1'),
	poh6 = po.find('h6'), pos2h6 = poh6.eq(0), pos3h6 = poh6.eq(1);
	
	var //personal section jquery selectors
	pe = $('#personal'), pea = pe.find('article'), pea1 = pea.eq(0), pea2 = pea.eq(1), pel = pe.find('li'), pel1s = pel.eq(0).find('section'),
	pel2s = pel.eq(1).find('section'), pelLs = pel.last().find('section');
	
	var //contact section jquery selectors
	co = $('footer'), coa = co.find('article');
	
	var //header section jquery selectors
	he = $('#header'), hes = he.find('section').eq(0), hesa = hes.children('a'), hea = he.find('article');
	
	var //code section jquery selectors
	cod = $('#code'), coda = cod.children('article'), codas = coda.children('section'), codad = coda.children('div'),
	codaa = coda.children('a');
	
	//positioning any floating object
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
	
	$('#top').hide();
	pos3au.hide();
	
	po.height(h1);
	pod.height(h1);
	podd.height(h1);
	podd.width(w1*3);	
	pos.height(h1);
	pos1.width(w1);
	pos2.width(w1);
	pos3.width(w1);
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
	lI2 = Math.round(h12 - 90);
	
	pos1a1.width(h1);
	pos1a4.width(h1);
	pos2af.width(w12 - 15);
	pos2af.height(h12 - 15);
	pe.height(h1*3);
	he.height(h1*3.5);
	co.height(h1+200);
	pea1.height(h1);
	pel.height(h1);
	pos.height(h1);
	
	pXY(podd, 0, -w1, 3, 1);
	pXY(pos1, 0, w1, 1, 1);
	pXY(pos2, 0, w1*2, 1, 1);
	pXY(poh, 0, w12-112, 1, 1);
	pXY(poh6, h12-140, 0, 1, 3);	
	pXY(pos1a2, lP2, lP1, 1, 1);
	pXY(pos1a3, 0, w12-74, 3, 1);
	pXY(hea, lI2, lI1, 1, 1);
	pXY(hesa, h1-70, 0, 1, 3);
	prL1 = pea1.width()/2;
	prL2 = pea2.width()/2;
	pXY(pea1.find('img'), h12-110, prL1-182, 1, 1);
	psL1 = prL2 - pel2s.width()/2;
	psL2 = prL2 - pelLs.width()/2;
	psL3 = h12 - 195;
	psL4 = h12 - pelLs.height()/2;
	psL5 = h12 - pel1s.height()/2;
	pXY(pel1s, psL5, 0, 1, 3);
	pXY(pel2s, psL3, psL1, 1, 1);
	pXY(pelLs, psL4, psL2, 1, 1);
	pXY(coa, 0, w12-250, 3, 1);

	pXY(pos2af1, 0, 0, 1, 1);
	pXY(pos2af2, 0, 0, 1, 2);
	pXY(pos2af3, 0, 0, 2, 1);
	pXY(pos2af4, 0, 0, 2, 2);

	pel1s.find('i').html('');
		
	//creating the arrow keys
	for(i = 1; i < 5; i++){
		aP[i] = document.createElement('img');
		aP[i].setAttribute('src','/resources/theme/transparent.gif');
		aP[i].setAttribute('class','aP'+i);
		pos1a3h2.before(aP[i]);
	}
	pos1a3h1.remove();
	
	for(i = 1; i < 5; i++){
		k[i] = $(aP[i]);
	}
	
	//function to establsih the image backgroun for each arrow key
	function keysR(){
		k[1].css('background-position','-148px -6px');
		k[2].css('background-position','-4px -6px');
		k[3].css('background-position','-52px -6px');
		k[4].css('background-position','-100px -6px');

		switch(Kp){
			case 0:
				k[3].css('background-position','-52px -54px');
			break;
			case 1:
				k[1].css('background-position','-148px -54px');
				k[3].css('background-position','-52px -54px');
			break;
			case 2:
				k[1].css('background-position','-148px -54px');
				k[2].css('background-position','-4px -54px');
				k[3].css('background-position','-52px -54px');
				k[4].css('background-position','-100px -54px');
			break;
			case 3:
				k[1].css('background-position','-148px -54px');
			break;
			case 4:
				k[1].css('background-position','-148px -54px');
				k[2].css('background-position','-4px -54px');
				k[3].css('background-position','-52px -54px');
			break;
			case 5:
				k[1].css('background-position','-148px -54px');
				k[3].css('background-position','-52px -54px');
				k[4].css('background-position','-100px -54px');
			break;
		}
	}
	
	//function to make the arrow keys blink
	function keys(){
		switch(Kp){
			case 0:
				pK = (pK != 3)? 3 : 3;
			break;
			case 1:
				pK = (pK == 0)? 2 : pK;
				pK = (pK == 1)? 3 : pK;
			break;
			case 2:
			break;
			case 3:
				pK = (pK != 2)? 2 : 2;
			break;
			case 4:
				pK = (pK == 1)? 2 : pK;
			break;
			case 5:
				pK = (pK == 0)? 1 : pK;
			break;
		}
		switch(pK){
			case 0:
				k[2].css('background-position','-4px -101px');
				pK = 1;
			break;
			case 1:
				k[4].css('background-position','-100px -101px');
				pK = 2;
			break;
			case 2:
				k[1].css('background-position','-148px -101px');
				pK = 3;
			break;
			case 3:
				k[3].css('background-position','-52px -101px');
				pK = 0;			
			break;
		}
		setTimeout(keysR, 200);
	}
	
	var blinking = setInterval(keys, 700);
	
	//creating the planets
	rds[0] = [];
	rds[0][0] = 0;	//translation radius
	rds[0][1] = 0;	//initial angle
	rds[0][2] = tA = rpts[0];	//planet radius
	ocu[0] = 0;

	for(i = 1; i <= pts; i++){
		rds[i] = [];
		pT = rds[i - 1][2];
		rds[i][0] = tA = pT + rpts[i] + tA;	//translation radius
		rds[i][1] = Math.random() * (Math.PI * 2);	//initial angle
		rds[i][2] = rpts[i];	//planet radius
		ocu[i] = 0;
	}

	div[0] = document.createElement('div');
	obj[0] = document.createElement('canvas');
	hes.append(div[0]);
	rd = rds[0][2];
	obj[0].width = obj[0].height = div[0].width = div[0].height = rd * 2;
	div[0].setAttribute('class', 'pts');
	$(div[0]).css('z-index', -9);
	$(div[0]).append(obj[0]);
	pXY($(div[0]), h12-rd, w12-rd, 1, 1);
	ctx[0] = obj[0].getContext('2d');
	
	ctx[0].beginPath();
	ctx[0].arc(rd, rd, rd, 0, 2 * Math.PI, false);
	var sunGr = ctx[0].createRadialGradient(rd, rd, rd*0.85, rd, rd, rd);
	sunGr.addColorStop(0, 'rgba(255,255,255,0.5)');
	sunGr.addColorStop(1, 'rgba(255,255,255,0)');
	ctx[0].fillStyle = sunGr;
	ctx[0].fill();
	
	ctx[0].beginPath();
	ctx[0].arc(rd, rd, rd*0.88, 0, 2 * Math.PI, false);
	ctx[0].fillStyle = '#FFE88A';
	ctx[0].fillStyle = '#fff';
	ctx[0].fill();
		
	for(i = 1; i <= (pts + 4); i++){
		div[i] = document.createElement('div');
		if(i <= pts){
			obj[i] = document.createElement('img');
			shd[i] = document.createElement('canvas');
			obj[i].setAttribute('src', '/resources/theme/p'+i+'.png')
			obj[i].setAttribute('class', 'pts2');
			shd[i].setAttribute('class', 'shd');
			if(i == 6){
				pXY($(obj[i]), -63, -73, 1, 1);
			}
			div[i].width = div[i].height = shd[i].width = shd[i].height = rds[i][2] * 2;
			$(div[i]).append(shd[i]);
			ctx2[i] = shd[i].getContext('2d');
			div[i].setAttribute('class', 'pts');
			$(div[i]).css('z-index', i);
		}else{
			div[i].setAttribute('class', 'npts');
			obj[i] = document.createElement('canvas');
			obj[i].width = w1;
			if(i >= (pts + 3)){
				obj[i].height = h32;
				pXY($(div[i]), -h12, 0, 1, 3);
				if(i == (pts + 4)){
					$(div[i]).css('opacity','0.3');
				}
			}else{
				obj[i].height = h1;
			}
			ctx[i] = obj[i].getContext('2d');
			$(div[i]).css('z-index', (-i-1-pts));
		}
		hes.append(div[i]);
		$(div[i]).append(obj[i]);
		
		//put in the shadow behind planet, interacting planet-star
		if(i <= pts){
			img[i] = document.createElement('img');
			img[i].setAttribute('src', '/resources/theme/shadow.png');
			rd = (rds[i][2] * 2) / 65;
			wd = Math.floor(458 * rd);
			hg = Math.floor(75 * rd);
			mh = Math.round(5 * rd);
			rd = rds[i][2];
			img[i].setAttribute('width', wd);
			img[i].setAttribute('height', hg);
			wd /= 2;
			img[i].setAttribute('class', 'shadow');
			$(div[i]).append(img[i]);
			pXY($(img[i]), -mh, rd-wd, 1, 1);
		}
	}
	
	//creating the background stars
	for(e = 3; e <= 4; e++){
		ctx[pts + e].fillStyle = '#fff';
		for(i = 0; i < strs; i++){
			cX = Math.round(w1 * Math.random());
			cY = Math.round(h32 * Math.random());
			rs = Math.round(((1 * Math.random()) + 0.2) * 10)/10;
			ctx[pts + e].beginPath();
			ctx[pts + e].arc(cX, cY, rs, 0, 2*Math.PI, false);
			ctx[pts + e].fill();
			ctx[pts + e].closePath();
		}
	}

	//function to calculate the angles after scrolling
	function angles(aZ){
		aY = 100;
		AA = aZ * Math.PI / 180;
		BB = -aY * Math.PI / 180;
		senA = Math.sin(AA);
		senB = Math.sin(BB);
		cosB = Math.cos(BB);
		cosAcosB = Math.cos(AA) * cosB;
		cosAsenB = Math.cos(AA) * senB;
	}
	var X, Z, X2, Y2, srR,
	cX = w12,
	cY = h12,
	vC = Math.PI * 2,
	lpol = 0;
	
	//calculating the translation trajectory of each planet and drawing them in stage
	function trajectories(){
		ctx[pts + 2].clearRect(0, 0, w1, h1);
		ctx[pts + 2].lineWidth = 1;
		ctx[pts + 2].strokeStyle = 'rgba(255, 255, 255, 0.1)';
		
		for(i = 1; i <= pts; i++){
			ctx[pts + 2].beginPath();
			rd = rds[i][0];
			for(an = 0; an <= vC; an += 0.05){
				Y = rd * Math.cos(an);
				X = rd * Math.sin(an);
				Z = -(X * senA);
				X2 = cX + (X * cosAcosB) - (Y * senB) - Z;
				Y2 = cY + (X * cosAsenB) + (Y * cosB) - Z;
				
				if(an == 0) ctx[pts + 2].moveTo(X2, Y2);
				ctx[pts + 2].lineTo(X2, Y2);
			}
			ctx[pts + 2].closePath();
			ctx[pts + 2].stroke();
		}
	}

	angles(25);
	trajectories();

	//loop to obtain each XY point for planets in an 2D space
	for(i = 1; i <= pts; i++){
		rd = rds[i][0];
		an = rds[i][1];
		Y = rd * Math.cos(an);
		X = rd * Math.sin(an);
		Z = -(X * senA);
		rds[i][3] = X2 = Math.round(cX + (X * cosAcosB) - (Y * senB) - Z);
		rds[i][4] = Y2 = Math.round(cY + (X * cosAsenB) + (Y * cosB) - Z);
	}
		
	//this function is performed together with the animation to know the frame XY point for each planet, simulating a planetary translation
	function calXY(r){
		rd = rds[r][0];
		an = rds[r][1];
		ma = (0.005 * (pts - r + 1)*2)/10;
		an = (an < vC)? an + ma : ma;
		
		X = rd * Math.cos(an);
		Y = rd * Math.sin(an);
		Z = (-X * senA);

		rds[r][3] = pX = Math.round((cX + (X * cosAcosB) - (Y * senB) - Z)*100)/100;
		rds[r][4] = pY = Math.round((cY + (X * cosAsenB) + (Y * cosB) - Z)*100)/100;
		rds[r][1] = an;
		an = an - (Math.PI / 4);
		if((an >= anI) || (an < 0)){
			$(div[r]).css('z-index', (-r-1-pts));
		}else{
			$(div[r]).css('z-index', ((-r-1-pts) + (pts * 2) - ((pts - r) * 2)));
		}
	}
			
	// this function change the size of the planet depending on the position in the translation, further then smaller
	function tamanio(n){
		an -= anMx;
		an = (an < 0)? an + 360 : an;
		
		if((an >= 0) && (an < 180)){
			prc = an / 225;
			prc = 1 - prc;
		}else{
			an2 = an - 180;
			prc = (an2 / 180)*0.80+0.2;
		}
		$(div[n]).css('transform','scale('+prc+')');
		prc = (prc - 0.2)*1.25;
		prc = (prc > 1)? 1 : prc;
		$(img[n]).css('opacity', prc);
	}
	
	for(i = 1; i <= pts; i++){
		$(div[i]).css('transform-origin',rds[i][2]+'px '+rds[i][2]+'px');
		wd = shd[i].width;
		ctx2[i].translate(wd/2, wd/2);
	}
	
	//this function creates the shadows over the planets, the shadows are created by the angle with star
	function shadows(n){
		an = rds[n][1];
		rd = rds[n][2];
		ctx2[n].clearRect(-rd, -rd, rd*2, rd*2);
		
		an1 = an - Math.PI/2;
		an1 = (an1 < 0)? an1 + 270 : an1;
		an2 = an - Math.PI/4;
		an3 = an2 - Math.PI/2;
		pX = rd * Math.cos(an);
		pY = rd * Math.sin(an);
		rd2 = rd * 1.5 * Math.cos(an);
		pX2 = rd2 * Math.cos(an2);
		pY2 = rd2 * Math.sin(an2);
		pX3 = rd2 * Math.cos(an3);
		pY3 = rd2 * Math.sin(an3);
		
		ctx2[n].beginPath();
		ctx2[n].moveTo(pX, pY);
		if((an1 >= Math.PI) || (an < 0)){
			ctx2[n].bezierCurveTo(pX2, pY2, pX3, pY3, -pX, -pY);
			a = 1;
		}else{
			ctx2[n].bezierCurveTo(pX3, pY3, pX2, pY2, -pX, -pY);
			a = 0;
		}
		ctx2[n].arc(0, 0, rd, an+Math.PI, an, false);
		ctx2[n].closePath();
		
		ctx2[n].fillStyle = 'rgba(0,0,0,0.75)';
		ctx2[n].fill();
	}
	
	//hidding or showing the planets
	function ocultar(ok){
		$(div[ok]).hide();
		ocu[ok] = 1;
	}
	function mostrar(ok){
		$(div[ok]).show();
		ocu[ok] = 0;
	}
	
	//radial gradient behind star
	var i = pts + 1,
	pX = w12,
	pY = h12;
	
	var grd = ctx[i].createRadialGradient(pX, pY, 0, pX, pY, 400);
	grd.addColorStop(0, 'rgba(191,130,62, 0.3)');
	grd.addColorStop(1, 'rgba(191,130,62, 0)');

	var grd2 = ctx[i].createRadialGradient(pX, pY, 0, pX, pY, 300);
	grd2.addColorStop(0, 'rgba(193,147,60, 0.3)');
	grd2.addColorStop(1, 'rgba(193,147,60, 0)');

	var grd3 = ctx[i].createRadialGradient(pX, pY, 0, pX, pY, 200);
	grd3.addColorStop(0, 'rgba(171,82,84, 0.3)');
	grd3.addColorStop(1, 'rgba(171,82,84, 0)');

	var grd4 = ctx[i].createRadialGradient(pX, pY, 0, pX, pY, 100);
	grd4.addColorStop(0, 'rgba(255,255,255, 0.5)');
	grd4.addColorStop(1, 'rgba(191,130,62, 0)');

	ctx[i].rect(0, 0, w1, h1);
	ctx[i].fillStyle = grd;
	ctx[i].fill();
	
	ctx[i].rect(0, 0, w1, h1);
	ctx[i].fillStyle = grd2;
	ctx[i].fill();
	
	ctx[i].rect(0, 0, w1, h1);
	ctx[i].fillStyle = grd3;
	ctx[i].fill();

	ctx[i].rect(0, 0, w1, h1);
	ctx[i].fillStyle = grd4;
	ctx[i].fill();
		
	//planet animation function
	function animate() {
		for(i = 1; i <= pts; i++){
			calXY(i);
			rd = rds[i][2];
			pY -= rd;
			pX -= rd;
			d = rd * 2 + 80;
			rd += 80;
			if(((pY > (-d)) && (pY < (h1 + rd))) && ((pX > (-d)) && (pX < (w1 + rd)))){
				mostrar(i);
				pXY($(div[i]), pY, pX, 1, 1);
				an = Math.round(rds[i][1] * 180 / Math.PI) - 90;
				$(img[i]).css('transform', 'rotate('+an+'deg)');
				tamanio(i);
				shadows(i);
			}else{
				ocultar(i);
			}
		}
	}
	
	//creating the moon
	rd3 = 672;
	div2[0] = document.createElement('div');
	pls[0] = document.createElement('canvas');
	div2[0].width = div2[0].height = pls[0].width = pls[0].height = rd3;
	div2[0].setAttribute('class','lpl2');
	$(div2[0]).append(pls[0]);
	he.append(div2[0]);
	ctx3[0] = pls[0].getContext('2d');
	
	div2[1] = document.createElement('div');
	pls[1] = document.createElement('img');
	pls[1].setAttribute('src','/resources/theme/pl2.gif');
	div2[1].setAttribute('class','lpl');
	$(div2[1]).append(pls[1]);
	he.append(div2[1]);
	
	div2[2] = document.createElement('div');
	pls[2] = document.createElement('img');
	pls[2].setAttribute('src','/resources/theme/pl2.gif');
	div2[2].setAttribute('class','lpl3');
	$(div2[2]).append(pls[2]);
	co.append(div2[2]);
	$(div2[2]).css('transform','rotate(180deg)');
	
	rd4 = Math.round(w1/1000);
	pls[1].width = pls[2].width = w1;
	div2[1].height = pls[1].height = div2[2].height = pls[2].height = Math.round(318 * rd4);
	
	rd2 = 336;
	pXY($(div2[0]), h1, w12-rd2, 1, 1);

	imgP.onload = function(){
		rd2 = 336;
		ctx3[0].beginPath();
		ctx3[0].arc(rd2, rd2, rd2-4, 0, Math.PI * 2, false);
		ctx3[0].clip();
		ctx3[0].drawImage(imgP,0,0,rd3,rd3);
	};
	imgP.src = '/resources/theme/pl1.jpg';

	var animacion = setInterval(animate, 33);
	
	//turn on or off the interval for planets animation
	function apagar(){
		if(anim == 0){
			clearInterval(animacion);
			anim = 1;
		}
	}
	function encender(){
		if(anim == 1){
			animacion = setInterval(animate, 33);
			anim = 0;
		}
	}
	
	//rotating the planet for the begining and end
	function rotation(n, scT){
		if(n == 1){
			if(pl1r == 0){
				$(div2[0]).css('transform','rotate(180deg)');
				pl1r = 1;
				for(i = 1; i <= pts; i++){
					$(div[i]).hide();
				}
				$(div[pts+2]).hide();
				hea.hide();
				pXY($(div[0]), tH, 0, 1, 3);
				pXY($(div[pts+1]), tH2, 0, 1, 3);
			}
			
			pYp2 = tH4 - Math.round(80 * (scT - perT2)/conT2);
			pXY($(div2[0]), pYp2, 0, 1, 3);
			if(scT > conT){
				coa.css({'position':'fixed','top':(pYp2+350)+'px'});
			}else{
				coa.css({'position':'absolute','top':0});
			}
		}else{
			if(pl1r == 1){
				$(div2[0]).css('transform','rotate(0deg)');
				pl1r = 0;
				for(i = 1; i <= pts; i++){
					if(ocu[i] == 0){
						$(div[i]).show();
					}
				}
				$(div[pts+2]).show();
				hea.show();
				pXY($(div[0]), tH3, 0, 1, 3);
				$(div[pts+1]).css('top','0');
				coa.css({'position':'absolute','top':0});
			}
		}
	}

	//checking screen ratio and modifying variables if needed
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
	
	//portfolio video hover
	pos2af.hover(function(){
		$(this).children('figcaption').show();
	},function(){
		$(this).children('figcaption').hide();
	});

	//portfolio buttons hover
	pos2afb.hover(function(){
		$(this).css('background','#4CB5E0');
	},function(){
		$(this).css('background','none');
	});
	
	//portfolio button "see more" click
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
	
	//portfolio video detail button close click
	pos2abc.click(function(){
		for(i = 0; i < 4; i++){
			if(play[i] == 1){
				pos2afv.eq(i).get(0).play();
			}
		}
		$(this).parent().hide();
		$(this).parent().find('video').get(0).pause();
	});
	
	//changing color of button after pressed
	function btnColor(e){
		if(pos2afbp.eq(e).is(':hover')){
			pos2afbp.eq(e).css('background','#4CB5E0');
		}else{
			pos2afbp.eq(e).css('background','none)');
		}
	}
	
	//portfolio button play click
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
	
	//creating circular backgroung in knowledge
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
	
	//function to create circular text in knowledge section
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
	
	//creating every layer for each text in knowledge section
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
//        ccT[i] = pos3aulul.eq(i).html();
        cnT[i] = ccT[i].split('');
		aaT[i] = 0;
		
		cvT[i] = document.createElement('canvas');
		cvT[i].width = w1-20;
		cvT[i].height = h1-20;
		ctxT[i] = cvT[i].getContext('2d');
        ctxT[i].translate(w12-10, h12-10);
        ctxT[i].font = '500 25px/1 Roboto, "Titillium Web", Roboto';
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
        cnT[i] = (i == 16)? 'ENGINEERING:    ' : '   PROGRAMMING:';
		ccT[i] = cnT[i].toUpperCase();
		cvT[i] = document.createElement('canvas');
		cvT[i].width = w1-20;
		cvT[i].height = h1-20;
		ctxT[i] = cvT[i].getContext('2d');
		ctxT[i].translate(w12-10, h12-10);
        ctxT[i].font = '500 25px/1 Roboto';
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
	
	//function to calculate the mouse speed
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
	
	//check if mouse moves
	pos3a.mousemove(function(z){
		pmPX = z.pageX;
		pmPY = z.pageY;
	});
	
	//circular text in knowledge section animation
	function acceleration(){
        /*
        for(i = 0; i < 16; i++){
			tangT  = (angO > 1)? cnTa[i] : cnTa[i] * angO;
			var ttangT = Math.abs(tangT - aaT[i]);

			if(ttangT > 0.0174){
				if(tangT < aaT[i]){
					aaT[i] -= avaT[i];
					var degA = Math.round((aaT[i]*180/Math.PI)*100)/100;
					daT = (daT > 0)? 0 : 1;
					$(cvT[i]).css('transform','rotate('+degA+'deg)');
				}else if(tangT > aaT[i]){
					aaT[i] += avaT[i];
					var degA = Math.round((aaT[i]*180/Math.PI)*100)/100;
					daT = (daT > 0)? 0 : 1;
					$(cvT[i]).css('transform','rotate('+degA+'deg)');
				}
			}
		}
        */
    }
	
	//writting contact data
	coa.find('li').eq(1).html(e1+'.'+e2+'.'+e3+e4+'@'+m1+m2+'.com');
	coa.find('li').last().html(t1+t2);

	//functions to deactivate the velocity sensor for mouse
	function offMouse(){
		clearInterval(timeMouse);
		clearInterval(accel);
	}
	function onMouse(){
		clearInterval(timeMouse);
		clearInterval(accel);
		timeMouse = setInterval(velMouse, 100);
		accel = setInterval(acceleration, 33);
	}
	
	//functions to play/stop videos in portfolio section
	function playV(){
		for(i = 0; i < 4; i++){
			if(play[i] == 1){
				pos2afv.eq(i).get(0).play();
			}
		}
	}
	function stopV(){
		for(i = 0; i < 4; i++){
			pos2afv.eq(i).get(0).pause();
			$('#exp'+(i+1)).find('video').get(0).pause();
			$('#exp'+(i+1)).hide();
		}
	}

	//variables for object offsets
	var perT = Math.round(pe.offset().top);
	var conT = Math.round(co.offset().top);
	var perT2 = Math.round(conT - h1);
	var conT2 = Math.round(h1*2 + 200);
	var conT3 = Math.round(conT + 200);
	var porT3 = Math.round(po.offset().top);
	var porT = Math.round(porT3 - 150);
	var porT2 = Math.round(porT3 + 100);
	var tH = Math.round(h1*0.75-rds[0][2]), tH2 = Math.round(h1*0.25), tH3 = Math.round(h12-rds[0][2]), tH4 = Math.round(h1*0.75-630);
	
	//function which established the scrolling levels
	function mvtP(nu){
		if(mdpT == 0){
			var scT2 = $(window).scrollTop();
			var left = podd.offset().left;
			mdpT = 1;
			switch(nu){
				case 1:
					$('body, html').animate({ scrollTop:porT3 }, 5000, function(){
						mdpT = 0;
						if(left == 0){
							onMouse();
						}else if(left <= (-w1*2)){
							playV();
						}
					});
				break;
				case 2:
					offMouse();
					if(left <= -w1*2){ stopV(); }
					$('body, html').animate({ scrollTop:perT }, 2000, function(){ mdpT = 0; });
				break;
				case 3:
					offMouse();
					if(left <= -w1*2){ stopV(); }
					$('body, html').animate({ scrollTop:perT+h1 }, 2000, function(){ mdpT = 0; });
				break;
				case 4:
					offMouse();
					if(left <= -w1*2){ stopV(); }
					$('body, html').animate({ scrollTop:perT2 }, 2000, function(){ mdpT = 0; });
				break;
				case 5:
					offMouse();
					if(left <= -w1*2){ stopV(); }
					$('body, html').animate({ scrollTop:conT3 }, 2000, function(){ mdpT = 0; });
				break;
				case 6:
					$('body, html').animate({ scrollTop:porT3 }, 2000, function(){
						mdpT = 0;
						if(left == 0){
							onMouse();
						}else if(left <= (-w1*2)){
							playV();
						}
					});
					if(left >= 0){
						Kp = 5;
					}else if(left >= -w1){
						Kp = 2;
					}else{
						Kp = 4;
					}
				break;
				case 7:
					offMouse();
					if(scT2 != porT3){
						$('body, html').animate({ scrollTop:porT3 }, 2000);
					}
					podd.animate({ 'left':-w1*2 }, 2000, function(){ mdpT = 0; playV(); });
					Kp = 4;
				break;
				case 8:
					offMouse();
					if(left <= -w1*2){ stopV(); }
					if(scT2 != porT3){
						$('body, html').animate({ scrollTop:porT3 }, 2000);
					}
					podd.animate({ 'left':-w1 }, 2000, function(){ mdpT = 0; });
					Kp = 2;
				break;
				case 9:
					onMouse();
					if(left <= -w1*2){ stopV(); }
					if(scT2 != porT3){
						$('body, html').animate({ scrollTop:porT3 }, 2000);
					}
					podd.animate({ 'left':0 }, 2000, function(){ mdpT = 0; });
					Kp = 5;
				break;
				default:
					offMouse();
					if(left <= -w1*2){ stopV(); }
					$('body, html').animate({ scrollTop:0 }, 3000, function(){ mdpT = 0; });
				break;
			}
		}
	}
	
	//automatic scroll movement
	$(window).keydown(function(pk2){
		if(blcM == 0){
			var key = pk2.which;
			if((key == 33) || (key == 34) || (key == 35) || (key == 36) || (key == 37) || (key == 38) || (key == 39) || (key == 40)){
				pk2.preventDefault();
			}
		}
	});
	
	//function to define movement directions
	function movUp(){
		var scT2 = $(window).scrollTop();
		if((scT2 > 0) && (scT2 <= porT3)){
			mvtP(0);
		}else if((scT2 > porT3) && (scT2 <= perT)){
			mvtP(6);
		}else if((scT2 > perT) && (scT2 <= (perT+h1))){
			mvtP(2);
		}else if((scT2 > (perT+h1)) && (scT2 <= perT2)){
			mvtP(3);
		}else if((scT2 > perT2) && (scT2 <= conT3)){
			mvtP(4);
		}
	}
	function movDn(){
		var scT2 = $(window).scrollTop();
		if((scT2 >= 0) && (scT2 < porT3)){
			mvtP(1);
		}else if((scT2 >= porT3) && (scT2 < perT)){
			mvtP(2);
		}else if((scT2 >= perT) && (scT2 < (perT+h1))){
			mvtP(3);
		}else if((scT2 >= (perT+h1)) && (scT2 < perT2)){
			mvtP(4);
		}else if((scT2 >= perT2) && (scT2 < conT3)){
			mvtP(5);
		}
	}
	function movLf(){
		var left = podd.offset().left;
		if(left == -w1){
			mvtP(9);
		}else if(left == (-w1*2)){
			mvtP(8);
		}else if(left == 0){
			mvtP(9);
		}
	}
	function movRt(){
		var left = podd.offset().left;
		if(left == 0){
			mvtP(8);
		}else if(left == -w1){
			mvtP(7);
		}else if(left == (-w1*2)){
			mvtP(7);
		}
	}
	
	//directional key press detector
	$(window).keyup(function(pk){
		if(blcM == 0){
			var key = pk.which;
			if((key == 40) || (key == 34)){
				movDn();
			}else if((key == 38) || (key == 33)){
				movUp();
			}else if(key == 39){
				movRt();
			}else if(key == 37){
				movLf();
			}else if(key == 36){
				mvtP(0);
			}else if(key == 35){
				mvtP(5);
			}
		}
	});
	
	//function for clicking in movement indicator buttons
	pos1a1h1.click(function(){
		mvtP(9);
	});
	pos1a4h1.click(function(){
		mvtP(7);
	});
	pos2h6.click(function(){
		mvtP(8);
	});
	pos3h6.click(function(){
		mvtP(8);
	});
	k[1].click(function(){
		movUp();
	});
	k[2].click(function(){
		movLf();
	});
	k[3].click(function(){
		movDn();
	});
	k[4].click(function(){
		movRt();
	});
	hesa.click(function(hclck){
		hclck.preventDefault();
		cod.show();
		apagar();
		pXY(codaa, 0, 17, 3, 2);
		blcM = 1;
		$('body').css('overflow','hidden');
		codas.load('code.php', function(){
			codad.hide();
		});
	});
	codaa.click(function(){
		encender();
		codad.show();
		$('body').css('overflow','auto');
		cod.hide();
		codas.html('');
		pXY(codaa, 0, 0, 3, 2);
		blcM = 0;
	});
	
	//function to developt any action after scrolling
	$(window).scroll(function(e){
		scT = $(window).scrollTop();
		if(scT < (h1*3.2)){
			encender();
			scT2 = scT/(he.height()*0.65);
			pYp = Math.round((scT2 * h12)*1000)/1000;
			pY1 = h1 - pYp;
			pY2 = pYp*0.1 - h12;
			pY3 = pYp*0.05 - h12;
			pYl = lI2 - scT;
			pY4 = h1 - 70 - Math.round(scT/2);
			pXY($(div2[0]), pY1, 0, 1, 3);
			pXY($(div[pts + 3]), pY2, 0, 1, 3);
			pXY($(div[pts + 4]), pY3, 0, 1, 3);
			pXY(hea, pYl, 0, 1, 3);
			pXY(hesa, pY4, 0, 1, 3);
			an2 = (2-(pY1+rd2)/(h1+rd2))*15;
			angles(an2+10);
			trajectories();
		}else{
			apagar();
			pXY(hesa, -200, 0, 1, 3);
		}
		if(scT > perT){
			if(scT > perT2){
				scT2 = perT2 - scT;
				pea1.css({'position':'fixed','top':scT2+'px'});
				rotation(1,scT);
			}else{
				pea1.css({'position':'fixed','top':'0'});
				rotation(0,scT);
			}
		}else{
			pea1.css({'position':'absolute','top':'0'});
			rotation(0,scT);
		}
		if(scT > porT2){
			if(porM == 0){
				pos1a3.animate({ left:w1*0.2-74 }, 400);
				porM = 1;
			}
		}else{
			if(porM == 1){
				pos1a3.animate({ left:w12-74 }, 400);
				porM = 0;
			}
		}
		var left = podd.offset().left;
		if(scT >= conT3){
			Kp = 3;
			if(left <= -w1*2){ stopV(); }
		}else if(scT >= perT){
			Kp = 1;
			if(left <= -w1*2){ stopV(); }
		}else if(scT >= porT){
			if(left == -w1){
				Kp = 2;
			}else if(left == 0){
				Kp = 5;
			}else if(left == -w1*2){
				Kp = 4;
				playV();
			}
		}else if(scT > 0){
			Kp = 1;
			if(left <= -w1*2){ stopV(); }
		}else{
			Kp = 0;
			if(left <= -w1*2){ stopV(); }
			
		}
		keysR();
	});
	
	scT = $(window).scrollTop();
	if(scT >= (h1*3.2)){
		apagar();
		for(i = 1; i <= pts; i++){
			$(div[i]).hide();
		}
	}
	
});

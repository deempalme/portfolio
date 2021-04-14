/*
© Copyleft following GNU GPL statement and:

	Any person has the right to freely distribute copies and modified versions of this code with
	the accompanying requirement that any resulting copies or adaptations are also bound by the same
	licensing agreement and they shall have the name and link of the original author.
	
	Original author: F. J. Ramirez Rodriguez - http://portfolio.ramirezrodriguez.de

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
	poh = po.find('header'), pos2aa = pos2a.children('article'), pos2abc = pos2aa.children('div:last-child'),
	pos3a = pos3.children('article'), pos1a4h1 = pos1a4.find('h1'), pos1a1h1 = pos1a1.find('h1'), poh6 = po.find('h6'),
	pos2h6 = poh6.eq(0), pos3h6 = poh6.eq(1), pos3as = pos3a.children('section'), pos3asa = pos3as.children('article'),
	pos2as = pos2a.children('section'), pos2asa = pos2as.children('article'), pos2asf = pos2asa.children('figure'),
	pos3ass = pos3as.children('section'), pos3assa = pos3ass.children('article'), pos3assaf = pos3assa.children('figure'),
	pos3assad = pos3assa.children('div'), pos3ash2 = pos3as.children('h2'), pos3ash2ul = pos3ash2.find('li'), pos2ash2 = pos2as.children('h2'),
	pos2ash2ul = pos2ash2.find('li'), pos3assap = pos3assa.children('p'), pos3assaps = pos3assap.children('span');
		
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
			obj.css({'left':v2+'px','right':'auto'});
		}else if(l == 2){
			obj.css({'right':v2+'px','left':'auto'});
		}
	}
	
	$('#top').hide();
	
	po.height(h1);
	pod.height(h1);
	podd.height(h1).width(w1*3);	
	pos.height(h1);
	pos1.width(w1);
	pos2.width(w1);
	pos3.width(w1);
	pos2as.width(w1-20).height(h1-20);

	var lP1 = Math.round(w12 - 347),
	lP2 = Math.round(h12 - 39),
	lI1 = Math.round(w12 - 315),
	lI2 = Math.round(h12 - 90);
	
	pos1a1.width(h1);
	pos1a4.width(h1);
	pe.height(h1*3);
	he.height(h1*3.5);
	pea1.height(h1);
	pel.height(h1);
	pos.height(h1);
	
	pXY(podd, 0, -w1*1, 3, 1);
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
	div2[1].height = pls[1].height = div2[2].height = pls[2].height = nrd4 = Math.round(318 * rd4);
	co.height(h1 + nrd4 - 120);
	
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
				coa.css({'position':'fixed','top':(pYp2+nrd4+50)+'px'});
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
			
	//writting contact data
	coa.find('li').eq(1).html(e1+'.'+e2+'.'+e3+e4+'@'+m1+m2+'.com');
	coa.find('li').last().html(t1+t2);
	
	//variables for object offsets
	var perT = Math.round(pe.offset().top);
	var conT = Math.round(co.offset().top);
	var perT2 = Math.round(conT - h1);
	var conT2 = Math.round(h1*2 + nrd4 - 117);
	var conT3 = Math.round(conT + nrd4 - 117);
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
							
						}else if(left <= (-w1*2)){
							
						}
					});
				break;
				case 2:
					$('body, html').animate({ scrollTop:perT }, 2000, function(){ mdpT = 0; });
				break;
				case 3:
					$('body, html').animate({ scrollTop:perT+h1 }, 2000, function(){ mdpT = 0; });
				break;
				case 4:
					$('body, html').animate({ scrollTop:perT2 }, 2000, function(){ mdpT = 0; });
				break;
				case 5:
					$('body, html').animate({ scrollTop:conT3 }, 2000, function(){ mdpT = 0; });
				break;
				case 6:
					$('body, html').animate({ scrollTop:porT3 }, 2000, function(){
						mdpT = 0;
						if(left == 0){
							
						}else if(left <= (-w1*2)){
							
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
					if(scT2 != porT3){
						$('body, html').animate({ scrollTop:porT3 }, 2000);
					}
					podd.animate({ 'left':-w1*2 }, 2000, function(){ mdpT = 0;  });
					Kp = 4;
				break;
				case 8:
					if(scT2 != porT3){
						$('body, html').animate({ scrollTop:porT3 }, 2000);
					}
					podd.animate({ 'left':-w1 }, 2000, function(){ mdpT = 0; });
					Kp = 2;
				break;
				case 9:
					if(scT2 != porT3){
						$('body, html').animate({ scrollTop:porT3 }, 2000);
					}
					podd.animate({ 'left':0 }, 2000, function(){ mdpT = 0; });
					Kp = 5;
				break;
				default:
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
		codas.load('code2.php', function(){
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
		}else if(scT >= perT){
			Kp = 1;
		}else if(scT >= porT){
			if(left == -w1){
				Kp = 2;
			}else if(left == 0){
				Kp = 5;
			}else if(left == -w1*2){
				Kp = 4;
			}
		}else if(scT > 0){
			Kp = 1;
		}else{
			Kp = 0;
			
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
	
	var nw16 = Math.floor((w1-45)/6),
	nh1 = h1 - 20,
	nw1 = w1 - 20;
	
	pos3asa.width(nw16).height(nh1);
	
	//creating the animation for button detail in web detail
	pos2asa.find('li').find('img').hover(function(){
		$(this).parent().find('b').animate({ marginTop:0 });
	}, function(){
		$(this).parent().find('b').animate({ marginTop:-30 });
	});
	
	var hSc = [245,190,225,229,211],
	wSc = Math.round((w1 - 470)/2),
	w4 = Math.round((w1-20)/5),
	w4a = Math.round((w4-64)/2),
	w30 = w1 - 320,
	h4 = Math.round((h1+430)/2),
	nfg = Math.round((h1 - 620)/2),
	nfgl = Math.round((w1 - 450)/2),
	nfgl2 = (nfgl >= 440)? 0 : nfgl - 440;
	
	pos2asa.height(nh1).width(w4);
	
	//code to establish vertical positions of text, titles and images in web gallery
	var plusH = (h1 > 1220)? Math.round((h1 - 1200)/2) : 0;
	
	function restartP(obm){
		pXY(obm.eq(0), 200*0+plusH, 0, 1, 1);
		pXY(obm.eq(1), 200*1+plusH, 0, 1, 1);
		pXY(obm.eq(2), 200*2+plusH, 0, 1, 1);
		pXY(obm.eq(3), 200*3+plusH, 0, 1, 1);
		pXY(obm.eq(4), 200*4+plusH, 0, 1, 1);
		pXY(obm.eq(5), 200*5+plusH, 0, 1, 1);
	}
	
	for(i = 0; i < pos2asa.length; i++){
		var nhSc = Math.round((h1 - hSc[i] - 20)/2),
		nhSc2 = Math.round((nhSc - 193)/2);
		
		pXY(pos2asa.eq(i), 0, w4*i+10, 0, 1);
		pXY(pos2asa.eq(i).children('section'), nhSc-30, wSc, 1, 1);
		pos2asa.eq(i).find('ul').css('padding-top',nhSc2);
		pos2asa.eq(i).children('aside').eq(1).width(w4);
		pos2asa.eq(i).children('aside').eq(1).children('h1').css({'left':w4a, 'top':h4});
		
		restartP(pos2asa.eq(i).children('figure'));
	}

	for(i = 0; i < pos3asa.length; i++){
		var nw6a = Math.round((nw16 - pos3asa.eq(i).children('div').children('h1').height() - 20)/2);
		pos3asa.eq(i).children('div').children('h1').css({'left':nw6a, 'top':h4});
	}
	
	//function to move positions and animate images in web detail
	function startP(obm){
		pXY(obm.eq(0), nfg, nfgl2-540, 1, 1);
		pXY(obm.eq(1), nfg+170, nfgl2-465, 1, 1);
		pXY(obm.eq(2), nfg+340, nfgl2-390, 1, 1);
		pXY(obm.eq(3), nfg, nfgl2-540, 1, 2);
		pXY(obm.eq(4), nfg+170, nfgl2-465, 1, 2);
		pXY(obm.eq(5), nfg+340, nfgl2-390, 1, 2);
		obm.children('img').width(350);
		obm.eq(3).addClass('nfigp2');
		obm.eq(4).addClass('nfigp2');
		obm.eq(5).addClass('nfigp2');
	}
	
	//function to show web detail after click event on web gallery
	function showW(obj){
		var objT = obj.parent(), nm,
		objT2 = objT.children('figure');
		objT.hide().width(nw1).css({'left':10, 'z-index':4}).fadeIn(500).children('div').show();
		startP(objT2);
		objT2.addClass('nfigp');
		obj.hide();
		switch(objT.attr('id')){
			case "w0": nm = 0; break;
			case "w1": nm = 1; break;
			case "w2": nm = 2; break;
			case "w3": nm = 3; break;
			case "w4": nm = 4; break;
		}
		pos2ash2ul.children('img').eq(nm).attr('src','/resources/theme/dot_g.png');
		pos2ash2.fadeIn(500);
	}

	//function to hide web details after click event on close button
	function hideW(obj){
		var objT = obj.parent(),
		objT2 = objT.children('figure');
		obj.hide();

		objT.fadeOut(500, function(){
			for(i = 0; i < pos2asa.length; i++){
				pXY(pos2asa.eq(i), 0, w4*i+10, 0, 1);
			}
			objT.width(w4).css('z-index',1);
			restartP(objT2);
			objT2.children('img').width(700);
			objT2.eq(3).removeClass('nfigp2');
			objT2.eq(4).removeClass('nfigp2');
			objT2.eq(5).removeClass('nfigp2');
			objT2.removeClass('nfigp');
			objT.fadeIn(500).children('aside').show();
		});
		pos2ash2ul.children('img').attr('src','/resources/theme/dot_b.png');
		pos2ash2.fadeOut(500);
	}

	//function to show web details after navigation menu click event
	function showW2(obj, nm){
		var objT = obj.children('div'),
		objT2 = obj.children('figure');
		obj.children('aside').eq(1).hide();
		obj.hide().width(nw1).css({'left':10, 'z-index':4}).fadeIn(500);
		for(i = 0; i < pos2asa.length; i++){
			if(i != nm){
				var obji = pos2asa.eq(i),
				obji2 = obji.children('figure');
				obji.width(w4).css('z-index',1);;
				pXY(obji, 0, w4*i+10, 0, 1);
				restartP(obji2);
				obji2.children('img').width(700);
				obji2.eq(3).removeClass('nfigp2');
				obji2.eq(4).removeClass('nfigp2');
				obji2.eq(5).removeClass('nfigp2');
				obji2.removeClass('nfigp');
				obji.children('aside').eq(1).show();
				obji.children('div').hide();
			}
		}
		startP(objT2);
		objT2.addClass('nfigp');
		objT.show();
		pos2ash2ul.children('img').attr('src','/resources/theme/dot_b.png');
		pos2ash2ul.children('img').eq(nm).attr('src','/resources/theme/dot_g.png');
	}

	//click events for the navigation menu (points) for web gallery
	pos2ash2ul.eq(0).click(function(){ showW2(pos2asa.eq(0), 0); });
	pos2ash2ul.eq(1).click(function(){ showW2(pos2asa.eq(1), 1); });
	pos2ash2ul.eq(2).click(function(){ showW2(pos2asa.eq(2), 2); });
	pos2ash2ul.eq(3).click(function(){ showW2(pos2asa.eq(3), 3); });
	pos2ash2ul.eq(4).click(function(){ showW2(pos2asa.eq(4), 4); });
	
	//click event on the web gallery; to show and hide web detail
	pos2asa.children('aside').click(function(){ showW($(this)); });
	pos2asa.children('div').click(function(){ hideW($(this)); });
	
	pos3assa.width(nw1).height(nh1);
	pos3assaf.width(w12-10).height(nh1);
	if(w1 < 1300){
		pos3assaps.css({'background-color':'rgba(0,92,204,0.8)', 'color':'#fff'});
	}
	
	//code to establish the vertical position in the text and titles in the logotype gallery
	var nh1L = [], npL = [], nhqL = [50,20,90,30,30,30], hh1L = [67,67,99,35,67,67], hpL = [150,95,95,210,100,150];
	for(i = 0; i < pos3assa.length; i++){
		var nassaf = pos3assa.eq(i).children('figure');
		pXY(nassaf.eq(0), -nh1, 0, 1, 0);
		pXY(nassaf.eq(1), -nh1, 0, 2, 0);
		nh1L[i] = pos3assa.eq(i).children('h1');
		npL[i] = pos3assa.eq(i).children('p');
		
		var nhL = Math.round((nh1 - hh1L[i] - hpL[i])/2) - nhqL[i];
		pXY(nh1L[i], nhL, 0, 1, 0);
		pXY(npL[i], nhL+hh1L[i]+20, 0, 1, 0);
		
		nh1L[i].detach().appendTo(nassaf);
		npL[i].detach().appendTo(nassaf);
	}
	
	//function to show a respective logotype clicked
	function showPL(nL){
		pos3assa.eq(nL).show();
		pos3assa.eq(nL).children('figure').eq(0).animate({top:0}, 1000);
		pos3assa.eq(nL).children('figure').eq(1).animate({bottom:0}, 1000);
		pos3ash2.fadeIn(500);
		pos3ash2.find('img').eq(nL).attr('src','/resources/theme/dot_g.png');
	}
	
	//click event for each logotype
	pos3asa.eq(0).click(function(){ showPL(0); });
	pos3asa.eq(1).click(function(){ showPL(1); });
	pos3asa.eq(2).click(function(){ showPL(2); });
	pos3asa.eq(3).click(function(){ showPL(3); });
	pos3asa.eq(4).click(function(){ showPL(4); });
	pos3asa.eq(5).click(function(){ showPL(5); });

	//button close in logotype gallery clicked
	pos3assad.click(function(){
		$(this).parent().fadeOut(500);
		$(this).parent().children('figure').eq(0).animate({top:-nh1}, 500);
		$(this).parent().children('figure').eq(1).animate({bottom:-nh1}, 500);
		pos3ash2.fadeOut(500);
		pos3ash2.find('img').attr('src','/resources/theme/dot_b.png');
	});
	
	//function to show the different logotypes after the points menu is clicked
	function showPL2(nL){
		pos3assa.css('z-index',1);
		pos3assa.eq(nL).css('z-index',10);
		pos3ash2.find('img').attr('src','/resources/theme/dot_b.png');
		pos3ash2.find('img').eq(nL).attr('src','/resources/theme/dot_g.png');
		pos3assa.eq(nL).show();
		pos3assa.eq(nL).children('figure').eq(0).animate({top:0}, 1000);
		pos3assa.eq(nL).children('figure').eq(1).animate({bottom:0}, 1000, function(){
			for(i = 0; i < pos3assa.length; i++){
				if(i != nL){
					pos3assa.eq(i).hide();
					pos3assa.eq(i).children('figure').eq(0).css('top',-nh1);
					pos3assa.eq(i).children('figure').eq(1).css('bottom',-nh1);
				}
			}
		});
	}
	
	//navigation menu (points) click event in Print Gallery
	pos3ash2ul.eq(0).click(function(){ showPL2(0); });
	pos3ash2ul.eq(1).click(function(){ showPL2(1); });
	pos3ash2ul.eq(2).click(function(){ showPL2(2); });
	pos3ash2ul.eq(3).click(function(){ showPL2(3); });
	pos3ash2ul.eq(4).click(function(){ showPL2(4); });
	pos3ash2ul.eq(5).click(function(){ showPL2(5); });
});
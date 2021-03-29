
$(document).ready(function(e) {
	var ancho = $(window).width();
	var alto = $(window).height();
	var mar = [], psM = [];
	var pos = stp = 0;
	var aZ, aY, AA, BB, senA, senB, cosB, cosAcosB, cosAsenB, bdH, nvH, spM, lxM, lnM;
	var posTB = alto/2 - 400;
	
	$('#logo h1').remove();
	var lgX = (ancho / 2) - 283;
	var lgY = (alto / 2) - 49;
	var lgH = alto - lgY;
	$('body').css('background','#050A12');
	$('header').css('height', (alto*7)+'px');
	
	$('#logo').css('top',lgY);
	$('#logo').css('left',lgX);
	$('#logo').height(lgH);
	if(alto > 1333){
		$('nav').height(1000);
		$('nav').css('top', (alto-1000)/2+'px')
	}else{
		$('nav').height(alto - (alto/4));
		$('nav').css('top', alto/8+'px')
	}
	
	function scrolling(){
		switch(pos){
			case 0:
			$('.down').css('background-position','50px -69px');
			break;
			case 1:
			$('.down').css('background-position','50px -138px');
			break;
			case 2:
			$('.down').css('background-position','50px 0');
			break;
		}
		pos = (pos == 2)? 0 : pos + 1;
	}
	
	var scroller = setInterval(function(){ scrolling() }, 400);
	
	var rds = [],
	pts = [],
	tray = [],
	bli = [],
	pol = [],
	obj = [],
	div = [],
	ctx = [],
	img = [],
	shd = [],
	shw = [],
	men = [],
	hpl = Spl = [0, 0, 0, 0, 0, 0, 0],
	menu = ['Home', 'Information', 'Objetive', 'Education', 'Mechatronics', 'Designer', 'Interests'];
	var pls = 7,
	ext = 3,
	tmM = 24;
	var rd, P, cC, aA, cn, dR, dA, ps, tA, pT, clr;
	var mxR = 60, mnR = 25, mxA = 4, mnA = 3;
	
	var rango = mxR - mnR;
	var porR = 1/(rango);
	var ranA = (mxA - mnA);
	
	rds[0] = [];
	rds[0][0] = tA = Math.round(mxR * 1.5);
	rds[0][1] = Math.round((ancho / 6) * 2);
	rds[0][2] = Math.round((alto / 5) * 3);
	rds[0][3] = Math.round(mxA * 1.2);
	rds[0][4] = 0;
	rds[0][5] = 5;

	rd = (ancho / 2) * 1.2;
	rds[pls] = [];
	rds[pls][0] = Math.floor(rd);
	rds[pls][1] = 0;
	rds[pls][2] = 0;
	rds[pls][3] = 7;
	rds[pls][4] = Math.PI/4;
	rds[pls][5] = 21;
	
	//for loop to establish the radious, translation radious from star, position angle, poligon quantity factor, predominant color
	for(i = 1; i < pls; i++){
		rd = Math.floor(Math.random() * rango);
		
		rds[i] = [];
		rds[i][0] = rd + mnR;
		pT = (i != 1) ? rds[i - 1][0] : 0;
		tray[i - 1] = tA = 1.1 * (tA + (2 * rds[i][0]) + pT);
		rds[i][1] = 0;
		rds[i][2] = 0;
		rds[i][3] = mnA + Math.floor((rd * porR) * ranA);
		rds[i][4] = (Math.random() * (Math.PI * 2));
		rds[i][5] = Math.floor(Math.random() * 47);
	}
	
	//loop to create canvas objects and their containers
	for(i = 0; i <= (pls + ext); i++){
		div[i] = document.createElement('div');
		obj[i] = document.createElement('canvas');
		$('body').append(div[i]);
		
		if(i < pls){
			men[i] = document.createElement('canvas');
			shw[i] = document.createElement('canvas');
			$('nav ul li a[href="#'+menu[i]+'"]').append(men[i]);
			$('nav ul li a[href="#'+menu[i]+'"]').append(shw[i]);
			
			shd[i] = document.createElement('canvas');
			obj[i].width = obj[i].height = shd[i].width = shd[i].height = rds[i][0] * 2;
			men[i].width = men[i].height = tmM - 8;
			shw[i].width = shw[i].height = tmM - 6;
			men[i].setAttribute('class', 'menu');
			if(i == 0) $(men[i]).css('background-position', '0 -24px');
			shw[i].setAttribute('class', 'shwmenu');
			ctx[i+20] = men[i].getContext('2d');
			ctx[i+30] = shw[i].getContext('2d');
			div[i].setAttribute('class', 'canvas1');
			$(div[i]).css('z-index', (-i-1-pls));
			if(i > 0){
				shd[i].setAttribute('class', 'canvas4');
				ctx[i+pls+ext] = shd[i].getContext('2d');
				$(div[i]).append(shd[i]);
			}
		}else if(i == pls){			
			obj[i].width = ancho;
			obj[i].height = rds[pls][0] * 2;
			obj[i].setAttribute('class', 'swpl0');
		}else{
			obj[i].width = ancho;
			obj[i].height = alto;
			$(div[i]).css('z-index', (-i-1-pls));
			if(i == (pls + ext)){
				div[i].setAttribute('class', 'canvas3');
			}else{
				div[i].setAttribute('class', 'canvas2');
			}
		}
		if(i != pls){
			$(div[i]).append(obj[i]);
		}else{
			$('#Welcome').append(obj[i]);
		}
		
		//put in the shadow behind planet, interacting planet-star
		if((i < pls) && (i > 0)){
			img[i] = document.createElement('img');
			img[i].setAttribute('src', 'theme/shadow.png');
			rd = (rds[i][0] * 2) / 65;
			wd = Math.floor(458 * rd);
			hg = Math.floor(75 * rd);
			mh = 10 * (rd / 2);
			rd = rds[i][0];
			img[i].setAttribute('width', wd);
			img[i].setAttribute('height', hg);
			wd /= 2;
			img[i].setAttribute('class', 'shadow');
			$(div[i]).append(img[i]);
			$(img[i]).css({'top':-mh+'px','left':rd-wd+'px'});
		}
		ctx[i] = obj[i].getContext('2d');
	}
	
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
	var X, Z, X2, Y2, srR;
	var cX = rds[0][1];
	var cY = rds[0][2];
	var vC = Math.PI * 2,
	lpol = 0;
	
	//calculating the translation trajectory of each planet and drawing them in stage
	function trajectories(){
		ctx[pls + 1].clearRect(0, 0, ancho, alto);
		ctx[pls + 1].lineWidth = 1;
		ctx[pls + 1].strokeStyle = 'rgba(255, 255, 255, 0.1)';
		
		for(i = 0; i < tray.length; i++){
			ctx[pls + 1].beginPath();
			rd = tray[i];
			for(an = 0; an <= vC; an += 0.05){
				Y = rd * Math.cos(an);
				X = rd * Math.sin(an);
				Z = -(X * senA);
				X2 = cX + (X * cosAcosB) - (Y * senB) - Z;
				Y2 = cY + (X * cosAsenB) + (Y * cosB) - Z;
				
				if(an == 0) ctx[pls + 1].moveTo(X2, Y2);
				ctx[pls + 1].lineTo(X2, Y2);
			}
			ctx[pls + 1].closePath();
			ctx[pls + 1].stroke();
		}
	}

	angles(25);
	trajectories();

	//loop to obtain each XY point for planets in an 2D space
	for(i = 1; i < pls; i++){
		rd = tray[i - 1];
		an = rds[i][4];
		Y = rd * Math.cos(an);
		X = rd * Math.sin(an);
		Z = -(X * senA);
		rds[i][1] = X2 = Math.round(cX + (X * cosAcosB) - (Y * senB) - Z);
		rds[i][2] = Y2 = Math.round(cY + (X * cosAsenB) + (Y * cosB) - Z);
	}
	
	//rotating the planet to simulate a 3D appearance
	for(i = 0; i <= pls; i++){
		rd = rds[i][0];
		X = rds[i][1];
		Y = rds[i][2];
		ctx[i].translate(rd, rd);
		ctx[i].rotate(15*Math.PI/180);
		ctx[i].translate(-rd, -rd);

		if(i != pls){
			$(div[i]).css({'top':(Y - rd)+'px', 'left':(X - rd)+'px'});
			X = Y = (tmM - 8) / (rd * 2);
			ctx[i+20].scale(X, Y);
		}
	}

	var dm, sp, s1, s2, ds, p, an, f, c, im, i2, dX, dY;
	
	//obtain the center point of a 3-point poligon
	function cntg(pp1, pp2, pp3, ii){
		dX = pts[ii][pp1][0];
		dX += pts[ii][pp2][0];
		dX += pts[ii][pp3][0];
		dX = Math.round(dX / 3);

		dY = pts[ii][pp1][1];
		dY += pts[ii][pp2][1];
		dY += pts[ii][pp3][1];
		dY = Math.round(dY / 3);
	}
	
	//loop to create the corners of each poligon, inside of the planets
	for(i = 0; i <= pls; i++){
		rd = rds[i][0];
		dm = rd * 2;
		sp = rds[i][3] * 2;
		ds = dm / sp;
		ds2 = dm /(sp + 2);
		s1 = sp * (sp + 2);
		s2 = (sp * 2) + 2;
		an = Math.PI / sp;
		pts[i] = [];
		f = 1;
		c = 0;
		
		im = sp / 4;
		i2 = Math.floor(im);
		im = (i2 < im)? -1 : 1;
				
		for(n = 0; n < s2; n++){
			X = Math.round(rd * Math.cos(an * n));
			Y = Math.round(rd * Math.sin(an * n));
			
			p = pts[i].length;
			pts[i][p] = [];
			pts[i][p][0] = X;
			pts[i][p][1] = Y;
			pts[i][p][2] = rd;
		}
		for(m = 1; m < s1; m++){
			if(f < (sp+2)){
				if(c < sp){
					pX = (c * ds) - rd;
					pX = (im > 0)? pX + (ds / 2) : pX;
					pY = (f * ds2) - rd;
					d = Math.sqrt(Math.pow(pX, 2) + Math.pow(pY, 2));
					if(d < rd){
						p = pts[i].length;
						pts[i][p] = [];
						pts[i][p][0] = Math.round(pX);
						pts[i][p][1] = Math.round(pY);
						pts[i][p][2] = Math.round(d);
					}
					c++;
				}else{
					f++;
					im *= -1;
					c = (im > 0)? 0 : 1;
				}
			}
		}
		
		// a new array is created to help to know which point will conform a poligon, based in the distance between points
		tp = pts[i].length;
		bli[i] = [];
		
		for(o = 0; o < tp; o++){
			X = pts[i][o][0];
			Y = pts[i][o][1];
			bli[i][o] = [];
			
			for(p = 0; p < tp; p++){
				pX = pts[i][p][0];
				pY = pts[i][p][1];
				d = Math.sqrt(Math.pow(pX - X, 2) + Math.pow(pY - Y, 2));
				d2 = ds + (ds / 3);
				if((d < d2) && (d > 0)){
					m = bli[i][o].length;
					bli[i][o][m] = p;
				}
			}
		}
		for(q = 0; q < s2; q++){
			m = bli[i][q].length;
			if(m <= 0) bli[i][q] = [];
			bli[i][q][m] = (q == (s2 - 1))? 0 : q + 1;
		}
		
		for(u = 0; u < bli[i].length; u++){
			m = bli[i][u].length;
			for(v = 0; v < m; v++){
				pX = bli[i][u][v];
				d = (bli[i][pX])? bli[i][pX].indexOf(u) : -1;
				if(d >= 0) bli[i][pX].splice(d,1);
			}
		}
		
		m = bli[i].length;
		for(u = 0; u < m; u++){
			if(bli[i][u]){
				p1 = u;
				q = bli[i][u].length;
				for(o = 0; o < q; o++){
					p2 = bli[i][u][o];
					r = (bli[i][p2])? bli[i][p2].length : -1;
					for(v = 0; v < r; v++){
						d = bli[i][p2][v];
						w = bli[i][d].indexOf(p1);
						if(w < 0){
							w = bli[i][p1].indexOf(d);
						}
						p3 = d;

						if(w >= 0){
							q = pol.length;
							cntg(p1, p2, p3, i);
							pol[q] = [];
							pol[q][0] = p1;
							pol[q][1] = p2;
							pol[q][2] = p3;
							pol[q][3] = i;
							pol[q][4] = dX;
							pol[q][5] = dY;
							lpol = (i == 0)? q : lpol;
						}
					}
				}
			}
		}
	}
	while(bli.length > 0){
		bli.pop();
	}
	
	for(i = 0; i <= pls; i++){
		for(u = 0; u < pts[i].length; u++){
			rd = rds[i][0];
			pX = pts[i][u][0];
			pY = pts[i][u][1];
			d = pts[i][u][2];

			if((d > 0) && (d < rd)){
				ang = Math.atan(pY / pX);
				nd = (1 + ((1 - (d / rd)) / 1.2)) * d;
				pX2 = Math.round(nd * Math.cos(ang));
				pY2 = Math.round(nd * Math.sin(ang));
				
				if(((pX < 0) && (pX2 >= 0)) || ((pX >= 0) && (pX2 < 0))) pX2 *= -1;
				if(((pY < 0) && (pY2 >= 0)) || ((pY >= 0) && (pY2 < 0))) pY2 *= -1;
				
				pts[i][u][0] = pX2;
				pts[i][u][1] = pY2;
				pts[i][u][2] = nd;
			}
		}
	}
	
	var gr, bl;
	var pRX = pRY = 0;
	
	//color selector function; choose a random color based on chromatic circle; select 3 different colors for each planet, 3 harmonics colors.
	function colP(){
		rd = rds[r][0];
		an = rds[r][5];
		an2 = rds[r][4];
		if(r > 0) pRX = pRY = rd/2;
		//colors from corner instead of center
		if(r != 0){
			dX += rd*Math.cos(an2-Math.PI/2);
			dY += rd*Math.sin(an2-Math.PI/2);
		}
		dm = rd / 2;
		d = Math.sqrt(Math.pow(dX - pRX, 2) + Math.pow(dY - pRY, 2)) - dm;
		q = ((d / rd) * 8);
		an = an + q;
		an = (an > 47)? an - 47 : an;
		an = (an < 0)? an + 47 : an;
		ps1 = an / 4;
		ps2 = Math.floor(ps1);
		rd = gr = bl = 0;
		prc = ps1 - ps2;
		
		switch(ps2){
			case 11:
			rd = 129 * prc;
			gr = 255;
			break;
			case 10:
			gr = 255;
			bl = 128 - (129 * prc);
			break;
			case 9:
			gr = 255;
			bl = 255 - (129 * prc);
			break;
			case 8:
			gr = 128 + (129 * prc);
			bl = 255;
			break;
			case 7:
			gr = 129 * prc;
			bl = 255;
			break;
			case 6:
			rd = 128 - (129 * prc);
			bl = 255;
			break;
			case 5:
			rd = 255 - (129 * prc);
			bl = 255;
			break;
			case 4:
			rd = 255;
			bl = 128 + (129 * prc);
			break;
			case 3:
			rd = 255;
			bl = 129 * prc;
			break;
			case 2:
			rd = 255;
			gr = 128 - (129 * prc);
			break;
			case 1:
			rd = 255;
			gr = 255 - (129 * prc);
			break;
			case 0:
			if(r == 0){
				rd = 255;
				gr = 255;
				bl = 180 - (181 * prc);
			}else{
				rd = 128 + (129 * prc);
				gr = 255;
			}
			break;
		}
		rd = Math.floor(rd);
		gr = Math.floor(gr);
		bl = Math.floor(bl);
	}
	
	function pXY(r, p){
		if(r != pls){
			pX = rds[r][0] + pts[r][p][0];
			pY = rds[r][0] + pts[r][p][1];
		}else{
			sp = (rds[r][0] - ancho/2)*0.259;
			pX = ancho/2 + pts[r][p][0];
			pY = rds[r][0] + sp + pts[r][p][1];
		}
	}
	
	// this function will create whole poligons in stage and then color them
	function redibujo(ini, end, op){
		for(i = ini; i < end; i++){
			p1 = pol[i][0];
			p2 = pol[i][1];
			p3 = pol[i][2];
			r = pol[i][3];
			dX = pol[i][4];
			dY = pol[i][5];
			
			ctx[r].beginPath();
			if((op == 1) && (r != pls)) ctx[r+20].beginPath();
			pXY(r, p1);
			ctx[r].moveTo(pX, pY);
			if((op == 1) && (r != pls)) ctx[r+20].moveTo(pX, pY);
			pXY(r, p2);
			ctx[r].lineTo(pX, pY);
			if((op == 1) && (r != pls)) ctx[r+20].lineTo(pX, pY);
			pXY(r, p3);
			ctx[r].lineTo(pX, pY);
			if((op == 1) && (r != pls)){
				ctx[r+20].lineTo(pX, pY);
				ctx[r+20].closePath();
			}
			ctx[r].closePath();
			
			if(op == 1){
				colP();
				pol[i][6] = rd;
				pol[i][7] = gr;
				pol[i][8] = bl;
				if(r != pls){
					ctx[r+20].fillStyle = 'rgb('+rd+', '+gr+', '+bl+')';
					ctx[r+20].fill();
					ctx[r+20].lineWidth = 0.5;
					ctx[r+20].strokeStyle = 'rgb('+Math.round(rd*0.7)+', '+Math.round(gr*0.7)+', '+Math.round(bl*0.7)+')';
					ctx[r+20].stroke();
				}
			}else{
				rd = pol[i][9];
				gr = pol[i][10];
				bl = pol[i][11];
			}
			
			ctx[r].fillStyle = 'rgb('+rd+', '+gr+', '+bl+')';
			ctx[r].fill();
			ctx[r].lineWidth = 0.5;
			if(r != pls){
				ctx[r].strokeStyle = 'rgb('+Math.round(rd*0.7)+', '+Math.round(gr*0.7)+', '+Math.round(bl*0.7)+')';
			}else{
				ctx[r].strokeStyle = '#000';
			}
			ctx[r].stroke();
		}
	}
			
	var anI = Math.PI;
	redibujo(0, pol.length, 1);
	
	//this function is performed together with the animation to know the frame XY point for each planet, simulating a planetary translation
	function calXY(r){
		rd = tray[r-1];
		an = rds[r][4];
		ma = (0.005 * (pls*2 - r))/10;
		an = (an < vC)? an + ma : ma;
		
		X = rd * Math.cos(an);
		Y = rd * Math.sin(an);
		Z = (-X * senA);

		rds[r][1] = pX = Math.round(cX + (X * cosAcosB) - (Y * senB) - Z);
		rds[r][2] = pY = Math.round(cY + (X * cosAsenB) + (Y * cosB) - Z);
		rds[r][4] = an;
		an = an - (Math.PI / 4);
		if((an >= anI) || (an < 0)){
			$(div[r]).css('z-index', (-r-1-pls));
		}else{
			$(div[r]).css('z-index', ((-r-1-pls) + (pls * 2) - ((pls - r) * 2)));
		}
	}
	
	var sol = 15,
	rsol = rds[0][0],
	irs = Math.round(rsol / 30);
	
	//function to create a white wave in the sun
	function solar(){
		for(i = 0; i <= lpol; i++){
			dX = pol[i][4];
			dY = pol[i][5];
			rd = pol[i][6];
			gr = pol[i][7];
			bl = pol[i][8];
			d = Math.sqrt(Math.pow(dX,2) + Math.pow(dY,2));
			
			if(d <= (sol/2)){
				prc = 0;
			}else if(d <= sol){
				prc = d / sol;
			}else{
				prc = 1 - sol / d;
			}
			prc *= 0.4;
			rd += (255 - rd) * prc;
			gr += (255 - gr) * prc;
			bl += (255 - bl) * prc;
			pol[i][9] = (rd > 255)? 255 : Math.floor(rd);
			pol[i][10] = (gr > 255)? 255 : Math.floor(gr);
			pol[i][11] = (bl > 255)? 255 : Math.floor(bl);
		}
		sol = (sol < rsol)? sol + irs : 15;
		
		//ctx[0].save();
		//ctx[0].setTransform(1,0,0,1,0,0);
		ctx[0].clearRect(0, 0, obj[0].width, obj[0].height);
		//ctx[0].restore();
		
		redibujo(0, lpol + 1, 0);
	}
	
	var anMx = 70,
	anMn = 250;
	
	// this function change the size of the planet depending on the position in the translation, further then smaller
	function tamanio(n){
		an -= anMx;
		an = (an < 0)? an + 360 : an;
		
		prc = an / 360;
		if((an >= 0) && (an < 180)){
			prc = 1 - prc;
		}
		
		d = Math.round(2 * rd * prc);
		$(div[n]).css('transform','scale('+prc+')');
	}
	
	for(i = 1; i < pls; i++){
		wd = shd[i].width;
		ctx[i+pls+ext].translate(wd/2, wd/2);
	}
	
	//this function creates the shadows over the planets, the shadows are created by the angle with star
	function shadows(n){
		an = rds[n][4];
		q = n + pls + ext;
		rd = rds[n][0];
		ctx[q].clearRect(-rd, -rd, rd*2, rd*2);
		
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
		
		ctx[q].beginPath();
		ctx[q].moveTo(pX, pY);
		if((an1 >= Math.PI) || (an < 0)){
			ctx[q].bezierCurveTo(pX2, pY2, pX3, pY3, -pX, -pY);
			a = 1;
		}else{
			ctx[q].bezierCurveTo(pX3, pY3, pX2, pY2, -pX, -pY);
			a = 0;
		}
		ctx[q].arc(0, 0, rd, an+Math.PI, an, false);
		ctx[q].closePath();
		
		ctx[q].fillStyle = 'rgba(0,0,0,0.75)';
		ctx[q].fill();
	}
	
	spM = ($('nav').height() - tmM*7)/6;
	spM = Math.round(spM);
	rd = (tmM - 6)/2;
	for(i = 0; i < pls; i++){
		$('nav ul li a[href="#'+menu[i]+'"]').css('top', spM*i+'px');
		psM[i] = Math.floor($('#'+menu[i]).offset().top);
		
		if(i > 0){
			ctx[i+30].beginPath();
			ctx[i+30].arc(rd, rd, rd, 0, vC, false);
			ctx[i+30].fillStyle = 'rgba(0, 0, 0, 0.8)';
			ctx[i+30].fill();
		}
	}
	
	function ocultar(ok){
		if(hpl[ok] == 0){
			$(div[ok]).hide();
			hpl[ok] = 1;
		}
	}
	function mostrar(ok){
		if(hpl[ok] == 1){
			$(div[ok]).show();
			hpl[ok] = 0;
		}
	}
	
	//radial gradient behind star
	var i = pls + 2,
	pX = rds[0][1],
	pY = rds[0][2];
	
	ctx[i].rect(0, 0, ancho, alto);
	var grd = ctx[i].createRadialGradient(pX, pY, 10, pX, pY, 300);
	grd.addColorStop(0, 'rgba(255, 255, 0, 0.5)');
	grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
	
	ctx[i].fillStyle = grd;
	ctx[i].fill();
	
	function apagar(){
		if(stp == 0){
			stp = 1;
			for(i = 0; i <= 9; i++){
				$(div[i]).hide();
			}
			clearInterval(scroller);
		}
	}
	function encender(){
		if(stp == 1){
			stp = 0;
			for(i = 0; i <= 9; i++){
				$(div[i]).show();
			}
			scroller = setInterval(function(){ scrolling() }, 400);
		}
	}
	
	bdH = $('body').height() - alto;
	nvH = $('nav').height();
	spM = Math.round(nvH / 6);
	
	function bck_mos(pi){
		for(i = 0; i <= pi; i++){
			if(Spl[i] == 0){
				$(men[i]).css('background-position','0 -24px');
				Spl[i] = 1;
			}
		}
		for(i = pi+1; i < pls; i++){
			if(Spl[i] == 1){
				$(men[i]).css('background-position','0 0');
				Spl[i] = 0;
			}
		}
	}
	
	//this function help to control the shadow inside each planet at the navigation menu
	function shad(q, po){
		if(q < 6){
			X = (psM[q+1] - psM[q]);
			bl = X/2;
			gr = 5*X/7;
			po -= psM[q];
			//wd = (po >= bl)? po - bl : po;
			if(po >= gr){
				wd = po - gr;
				bl = 2*X/7;
			}else if(po >= bl){
				wd = 0;
			}else{
				wd = po;
			}
			an = Math.round((1 - wd/bl) * 112) - 56;
		}else{
			bl = 1;
			po = 0;
			an = 56;
		}
		d = (tmM - 6);
		rd = d/2
		
		for(i = 0; i < pls; i++){
			ctx[i+30].clearRect(0, 0, d, d);
			ctx[i+30].beginPath();
			ctx[i+30].arc(rd, rd, rd, 0, vC, false);
			ctx[i+30].fillStyle = 'rgba(0, 0, 0, 0.8)';
			ctx[i+30].fill();
		}
		
		an = an * Math.PI/180;
		pX = 0;
		pY = rd;
		rd2 = rd * (1 + (0.7 * Math.abs(Math.sin(an))));
		pX2 = rd + rd2 * Math.cos(an);
		pY2 = rd - rd2 * Math.sin(an);
		pX3 = rd - rd2 * Math.cos(an);
		pY3 = rd - rd2 * Math.sin(an);
		
		q = (po >= bl)? q + 1 : q;
		ctx[q+30].clearRect(0, 0, d, d);
		ctx[q+30].beginPath();
		if(po >= bl){
			ctx[q+30].moveTo(d, pY);
			ctx[q+30].bezierCurveTo(pX2, pY2, pX3, pY3, pX, pY);
			ctx[q+30].arc(rd, rd, rd, Math.PI, 0, true);
		}else{
			ctx[q+30].moveTo(pX, pY);
			ctx[q+30].bezierCurveTo(pX3, pY3, pX2, pY2, d, pY);
			ctx[q+30].arc(rd, rd, rd, 0, Math.PI, true);
		}
		ctx[q+30].closePath();
		
		ctx[q+30].fillStyle = 'rgba(0, 0, 0, 0.8)';
		ctx[q+30].fill();
	}
	
	//this function will calculate the actual position when the user is scrolling and add the effects to the nevigation menu
	function posScr(po){
		if(po >= psM[6]){
			Y = nvH;
			bck_mos(6);
			shad(6, po);
		}else if(po >= psM[5]){
			Y = (spM * 5) + (((po - psM[5]) / (psM[6] - psM[5])) * spM);
			bck_mos(5);
			shad(5, po);
		}else if(po >= psM[4]){
			Y = (spM * 4) + (((po - psM[4]) / (psM[5] - psM[4])) * spM);
			bck_mos(4);
			shad(4, po);
		}else if(po >= psM[3]){
			Y = (spM * 3) + (((po - psM[3]) / (psM[4] - psM[3])) * spM);
			bck_mos(3);
			shad(3, po);
		}else if(po >= psM[2]){
			Y = (spM * 2) + (((po - psM[2]) / (psM[3] - psM[2])) * spM);
			bck_mos(2);
			shad(2, po);
		}else if(po >= psM[1]){
			Y = (spM * 1) + (((po - psM[1]) / (psM[2] - psM[1])) * spM);
			bck_mos(1);
			shad(1, po);
		}else{
			Y = (po / psM[1]) * spM;
			bck_mos(0);
			shad(0, po);
		}
		Y = 1000 - Math.round(Y);
		$('nav').css('background-position', '12px -'+Y+'px');
	}
	
	//adding shadows to big planet
	rd = rds[pls][0];
	X = Math.floor(ancho/2);
	sp = (rd - X)*0.259;
	var ips2 = X;
	$(obj[pls]).css('top', '-'+X+'px');
	ctx[pls].beginPath();
	ctx[pls].arc(X, rd + sp, rd, 0, vC, false);
	
	var grd = ctx[pls].createRadialGradient(rd, rd*1.2, rd, rd, rd*1.3, rd*1.4);
	grd.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
	grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
	ctx[pls].fillStyle = grd;
	ctx[pls].fill(); 

	ctx[pls].beginPath();
	ctx[pls].arc(X, rd + sp, rd, 0, vC, false);
	
	pX = rd;
	pY = rd * 1.7;
	var grd = ctx[pls].createRadialGradient(pX, pY, rd*0.5, pX, pY, rd*0.8);
	grd.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
	grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
	ctx[pls].fillStyle = grd;
	ctx[pls].fill(); 
	
	var adpl = document.createElement('canvas');
	adpl.width = adpl.height = rd;
	var cxa = adpl.getContext('2d');
	adpl.setAttribute('class', 'adplc');
	$('#Welcome').append(adpl);
	rd /= 2;
	$(adpl).css({'left':Math.floor(ancho/2 - rd)+'px', 'top':Math.floor(rd - rd/2)+'px'});
	
	//creating the city lights in the big planet
	var mtx = [],
	pth = [];
	var paths = 7,
	brands = 30,
	lights = 20;
	d = 10;
	p = 70;
	sp = 6.2832 / paths;
	
	cxa.strokeStyle = "rgba(255,255,255,0.3)";
	cxa.strokeStyle = "rgba(139,228,254,0.2)";
	//cxa.strokeStyle = "rgba(255,255,0,0.3)";
	cxa.lineWidth = 0.2;
	cxa.fillStyle = '#8BE4FE';
	cxa.fillStyle = '#BAEFFE';
	cxa.fillStyle = '#fff';
	//cxa.fillStyle = '#ffa';
	
	function city_lights(qq, po){
		qq = (qq == 0)? q + 1 : brands;
		if(i2 == q){
			iX = pX;
			iY = pY;
		}
		if(po != 1000) an += 1.0472;
		for(w = q; w < qq; w++){
			pX += d * Math.cos(an);
			pY += d * Math.sin(an);
			//an += Math.random() * (1.0472) - 0.5236;
			an += Math.random() * (0.5236) - 0.2618;
			cxa.lineTo(pX, pY);
			cxa.fillRect(pX, pY, 1, 1);
			ds = 1 - w/brands;
			n = Math.floor(ds * lights);
			for(r = 0; r < n; r++){
				bl = Math.random() * 6.2632;
				dm = (p * ds) * Math.random();
				X = dm * Math.cos(bl);
				Y = dm * Math.sin(bl);
				gr = (1.5 - dm/(p*ds)) * 1;
				cxa.fillRect(pX + X, pY + Y, gr, gr);
				cxa.lineTo(pX + X, pY + Y);
				cxa.moveTo(pX, pY);
			}
		}
		if(po != 1000){
			an = po;
			pX = iX;
			pY = iY;
			cxa.moveTo(pX, pY);
		}
	}
	
	for(i = 0; i < paths; i++){
		pX = pY = rd;
		an = sp * i + 0.2618;
		i2 = Math.floor(Math.random() * 4 * brands/5) + brands/5;
		cxa.beginPath();
		cxa.moveTo(pX, pY);
		for(q = 0; q < brands; q++){
			if(i2 == q){
				city_lights(1, an);
			}else{
				city_lights(0, 1000);
			}
		}
		cxa.stroke();
	}
	bl = rd * 4/5;
	for(i = 0; i < 300; i++){
		dm = bl * Math.random();
		an = Math.random() * 6.2832;
		pX = rd + dm * Math.cos(an);
		pY = rd + dm * Math.sin(an);
		gr = Math.random() * 1.5;
		cxa.fillRect(pX, pY, gr, gr);
		n = Math.floor(Math.random() * 4);
		for(q = 0; q < n; q++){
			dm = Math.random() * d;
			an = Math.random() * 6.2832;
			X = pX + dm * Math.cos(an);
			Y = pY + dm * Math.sin(an);
			gr = (1 - dm/d) * 1;
			cxa.fillRect(X, Y, gr, gr);
		}
	}
	
	//comet's creation
	$('#Home').css('height', Math.floor(alto*2.3)+'px');
	rd = alto * 1.5;
	var tailwaste = [];
	var comet = document.createElement('img');
	comet.setAttribute('src', 'theme/asteroid.png');
	comet.setAttribute('class', 'comet');
	
	
	var comets = document.createElement('div');
	comets.setAttribute('class', 'comets');
	$('#Welcome').append(comets);
	
	pX = $(adpl).offset().top - $('#Welcome').offset().top + Math.floor(2*adpl.height/7);
	$(comets).css({'top':pX+'px', 'width':ancho+'px', 'height':alto+'px'});
	
	var tail = document.createElement('canvas');
	var shine = document.createElement('canvas');
	tail.height = shine.height = alto;
	tail.width = shine.width = ancho;
	tail.setAttribute('class', 'tail');
	shine.setAttribute('class', 'shine');
	var ctxA = tail.getContext('2d');
	var ctxB = shine.getContext('2d');
	$(comets).append(tail);
	$(comets).append(shine);
	$(comets).append(comet);
	
	ctxA.fillStyle = '#899EA3';
	
	var scT = 0,
	ps1 = alto*1.5,
	ps2 = $(comets).offset().top,
	ps3 = ps2 + (alto * 3),
	ps4 = ps3 + alto,
	ps5 = ps2 + (alto * 2),
	fps2 = objPY = pss = pss2 = comt = shin = psh = pjX = pjY = way = psA = asP = 0,
	pXA = Math.floor(ancho - ($(adpl).offset().left + $(adpl).width()/3)),
	pYA = alto - Math.floor(adpl.height/2),
	am = (pYA + 200) / (Math.pow(pXA + 200, 2)),
	piX = ancho + 200,
	piY = alto + 200,
	WelTop = $('#Welcome').offset().top;
	
	//this section is for avoid the movement of big planet when scrolls
	function fix1A(){
		if(fps2 == 0){
			objPY =  WelTop - ps2;
			$('#Welcome').css({'position':'fixed', 'top':objPY+'px'});
			$(comet).css({'visibility':'visible'});
			$(tail).css('visibility','visible');
			fps2 = 1;
		}
		if(scT <= ps5){
			pss = 1 - (ps5 - scT)/(alto * 2);
			comt = 1;
		}else{
			pss = comt = 1;
		}
		if((scT <= ps3) && (scT > ps5)){
			psh = 1 - (ps3 - scT)/alto;
			shin = 1;
		}
	}

	function fix1B(){
		pY = Math.floor(objPY - (1 - (ps4 - scT)/alto)*(obj[pls].height + objPY - ips2 + alto/3));
		$('#Welcome').css({'position':'fixed', 'top':pY+'px'});
		$(comet).css({'visibility':'hidden', 'right':'-200px'});
		$(tail).css('visibility','hidden');
	}

	function fix1C(){
		if(fps2 == 1){
			$('#Welcome').css({'position':'relative', 'top':'0px'});
			$(comet).css({'visibility':'hidden', 'right':'-200px'});
			$(tail).css('visibility','hidden');
			comt = 0;
			fps2 = 0;
		}
	}

	//animation function
	function animate() {
		if(stp == 0){
			for(i = 1; i < pls; i++){
				calXY(i);
				rd = rds[i][0]
				pY -= rd;
				pX -= rd;
				d = rd * 2 + 1;
				if(((pY > (-d)) && (pY < (alto + rd))) && ((pX > (-d)) && (pX < (ancho + rd)))){
					mostrar(i);
					$(div[i]).css({'top':pY, 'left':pX});
					an = Math.floor(rds[i][4] * 180 / Math.PI) - 90;
					$(img[i]).css('transform', 'rotate('+an+'deg)');
					//tamanio(i);
					shadows(i);
				}else{
					ocultar(i);
				}
			}
			solar();
		}else if(comt == 1){
			pss2 = (pss2 > 1)? pss : pss2;
			pss2 = (pss2 < 0)? 0 : pss2;
			
			pjX = $(comet).offset().left;
			pjY = $(comet).offset().top - $(comets).offset().top;
			
			if(way == 1){
				pss2 += 0.04;
				pss2 = (pss2 >= pss)? pss : pss2;
				if(pss2 >= pss) comt = 0;
				rd = (1 - pss2) * 0.3 + 0.7;
				
				if(asP < pss2){
					d = $(comet).width()/2 * rd
					for(i = 0; i < 40; i++){
						dm = Math.random() * d;
						sp = Math.random() * 1.75 + 0.25;
						an2 = Math.random() * 3.1416 - 0.74;
						X = pjX + dm * Math.cos(an2);
						Y = pjY + dm * Math.sin(an2);
						ctxA.fillRect(X, Y, sp, sp);
					}
				}
				asP = (pss2 > asP)? pss2 : asP;
			}else if(way == -1){
				pss2 -= 0.04;
				pss2 = (pss2 <= 0)? 0 : pss2;
				if(pss2 <= pss) comt = 0;
				rd = (1 - pss2) * 0.3 + 0.7;
			}
			pX = Math.floor(pss2 * (pXA + 200)) - 200;
			pY = Math.floor(am * Math.pow(pX + 200, 2) - 200)+'px';
			$(comet).css({'right':pX+'px', 'bottom':pY, 'transform':'scale('+rd+','+rd+')'});

			pjX = $(comet).offset().left + $(comet).width()/3;
			pjY = $(comet).offset().top - $(comets).offset().top + $(comet).height()/3;
			dm = Math.floor(Math.sqrt(Math.pow(piX - pjX, 2) + Math.pow(piY - pjY, 2)));
			$(tail).css({'clip-path':'circle('+dm+'px at '+piX+'px '+piY+'px)', '-webkit-clip-path':'circle('+dm+'px at '+piX+'px '+piY+'px)'});
		}
	}
	
	$(window).scroll(function(e){
		scT = $(window).scrollTop();
		posScr(scT);
		
		way = (scT > psA)? 1 : -1;
		psA = scT;
		
		if((scT >= ps2) && (scT <= ps3)){
			fix1A();
		}else if((scT > ps3) && (scT <= ps4)){
			fix1B();
		}else{
			fix1C();
		}
		if(scT > ps1){
			apagar();
		}else{
			angles(scT/1100 * 16 + 25);
			trajectories();
			$(div[10]).css('background-position','center '+(posTB + Math.round(scT*0.07))+'px');
			encender();
		}
		
	});
	
	var animacion = setInterval(function(){ animate() }, 1000 / 30);

});
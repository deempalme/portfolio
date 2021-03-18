
$(document).ready(function(e) {
	var ancho = $(window).width();
	var alto = $(window).height();
	
	$('#logo h1').remove();
	$('body').css('background','#030409');
	
	var rds = [],
	pts = [],
	tray = [],
	bli = [],
	pol = [],
	obj = [],
	div = [],
	ctx = [],
	img = [];
	shd = [];
	var pls = 6;
	var ext = 3;
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
	
	//for loop to establish the radious, translation radious from star, position angle, poligon quantity factor, predominant color
	for(i = 1; i <= pls; i++){
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
	for(i = 0; i < (pls + ext); i++){
		div[i] = document.createElement('div');
		obj[i] = document.createElement('canvas');
		$('body').append(div[i]);
		
		if(i <= pls){
			shd[i] = document.createElement('canvas');
			obj[i].width = obj[i].height = shd[i].width = shd[i].height = rds[i][0] * 2;
			div[i].setAttribute('class', 'canvas1');
			$(div[i]).css('z-index', (-i-1-pls));
			if(i > 0){
				shd[i].setAttribute('class', 'canvas4');
				ctx[i+pls+ext] = shd[i].getContext('2d');
				$(div[i]).append(shd[i]);
			}
		}else{
			obj[i].width = ancho;
			obj[i].height = alto;
			$(div[i]).css('z-index', (-i-1-pls));
			if((i+1) == (pls + ext)){
				div[i].setAttribute('class', 'canvas3');
			}else{
				div[i].setAttribute('class', 'canvas2');
			}
		}
		$(div[i]).append(obj[i]);
		
		//put in the shadow behind planet, interacting planet-star
		if((i <= pls) && (i > 0)){
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
		
	var aY = 100;
	var aZ = 25;
	var AA = aZ * Math.PI / 180;
	var BB = -aY * Math.PI / 180;
	var senA = Math.sin(AA);
	var senB = Math.sin(BB);
	var cosB = Math.cos(BB);
	var cosAcosB = Math.cos(AA) * cosB;
	var cosAsenB = Math.cos(AA) * senB;
	var X, Z, X2, Y2, srR;
	var cX = rds[0][1];
	var cY = rds[0][2];
	var vC = Math.PI * 2,
	lpol = 0;

	ctx[pls + 1].lineWidth = 1;
	ctx[pls + 1].strokeStyle = 'rgba(255, 255, 255, 0.1)';
	
	//calculating the translation trajectory of each planet and drawing them in stage
	for(i = 0; i < tray.length; i++){
		ctx[pls + 1].beginPath();
		rd = tray[i];
		for(an = 0; an <= vC; an += 0.05){
			Y = rd * Math.cos(an);
			X = rd * Math.sin(an);
			Z = -(X * senA);
			X2 = cX + (X * cosAcosB) - (Y * senB) - Z;
			Y2 = cY + (X * cosAsenB) + (Y * cosB) - Z;
			
			if(an == 0) ctx[pls + 2].moveTo(X2, Y2);
			ctx[pls + 1].lineTo(X2, Y2);
		}
		ctx[pls + 1].closePath();
		ctx[pls + 1].stroke();
	}

	//loop to obtain each XY point for planets in an 2D space
	for(i = 1; i < rds.length; i++){
		rd = tray[i - 1];
		an = rds[i][4];
		Y = rd * Math.cos(an);
		X = rd * Math.sin(an);
		Z = -(X * senA);
		rds[i][1] = X2 = Math.round(cX + (X * cosAcosB) - (Y * senB) - Z);
		rds[i][2] = Y2 = Math.round(cY + (X * cosAsenB) + (Y * cosB) - Z);
	}
	
	//rotating the planet to simulate a 3D appearance
	for(i = 0; i < rds.length; i++){
		$(div[i]).css({'top':rds[i][2] - rds[i][0], 'left':rds[i][1] - rds[i][0]});
		ctx[i].translate(rds[i][0], rds[i][0]);
		ctx[i].rotate(15*Math.PI/180);
		ctx[i].translate(-rds[i][0], -rds[i][0]);
	}

	var lgA = (ancho / 2) - ($('#logo').width() / 2);
	var lgH = (alto / 2) - ($('#logo').height() / 2);
	
	$('#logo').css('top',lgH);
	$('#logo').css('left',lgA);
	
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
	for(i = 0; i < rds.length; i++){
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
	
	for(i = 0; i < rds.length; i++){
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
	
	function pXY(r, p){
		pX = rds[r][0] + pts[r][p][0];
		pY = rds[r][0] + pts[r][p][1];
	}
	
	//color selector function; choose a random color based on chromatic circle; select 3 different colors for each planet, 3 harmonics colors.
	function colP(){
		rd = rds[r][0];
		an = rds[r][5];
		if(r > 0) pRX = pRY = rd/2;
		//colors from corner instead of center
		if(r != 0){
			dX += rd*Math.cos(an-Math.PI/2);
			dY += rd*Math.sin(an-Math.PI/2);
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
			pXY(r, p1);
			ctx[r].moveTo(pX, pY);
			pXY(r, p2);
			ctx[r].lineTo(pX, pY);
			pXY(r, p3);
			ctx[r].lineTo(pX, pY);
			ctx[r].closePath();
			
			if(op == 1){
				colP();
				pol[i][6] = rd;
				pol[i][7] = gr;
				pol[i][8] = bl;
			}else{
				rd = pol[i][9];
				gr = pol[i][10];
				bl = pol[i][11];
			}
			
			ctx[r].fillStyle = 'rgb('+rd+', '+gr+', '+bl+')';
			ctx[r].fill();
			ctx[r].lineWidth = 0.5;
			ctx[r].strokeStyle = 'rgb('+Math.round(rd*0.7)+', '+Math.round(gr*0.7)+', '+Math.round(bl*0.7)+')';
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
	
	for(i = 1; i <= pls; i++){
		wd = shd[i].width;
		ctx[i+pls+ext].translate(wd/2, wd/2);
	}
	
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

	//animation function
	function animate() {
		for(i = 1; i <= pls; i++){
			calXY(i);
			rd = rds[i][0]
			pY -= rd;
			pX -= rd;
			d = rd * 2 + 1;
			if(((pY > (-d)) && (pY < (alto + rd))) && ((pX > (-d)) && (pX < (ancho + rd)))){
				$(div[i]).css({'top':pY, 'left':pX});
				an = Math.floor(rds[i][4] * 180 / Math.PI) - 90;
				$(img[i]).css('transform', 'rotate('+an+'deg)');
				//tamanio(i);
				shadows(i);
			}
			//if(i == 1) $('#frm').val(an);
		}
		solar();
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
	
	var animacion = setInterval(function(){ animate() }, 1000 / 30);
});

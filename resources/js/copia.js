// JavaScript Document
$(document).ready(function(e) {
	var ancho = $(window).width();
	var alto = $(window).height();
	
    var fondo = document.createElement('canvas');
    fondo.width = ancho;
    fondo.height = alto;
	$('#bckgrd').append(fondo);
	var context = fondo.getContext('2d');
	
	var radios = [];
	var puntos = [];
	var planetas = 6;
	var rad, P, cntA, sepA;
	var maxR = 100, minR = 25, maxA = 6, minA = 3;
	
	var rango = maxR - minR;
	var porR = 1/(rango);
	var ranA = (maxA - minA);
		
	for(pl = 0; pl < planetas; pl++){
		rad = Math.floor(Math.random() * rango);
		radios[pl] = [];
		radios[pl][0] = rad + minR;
		radios[pl][1] = Math.floor(Math.random() * ancho);
		radios[pl][2] = Math.floor(Math.random() * alto);
		radios[pl][3] = 2 * (minA + Math.floor((rad * porR) * ranA));
	}
	
	for(r = 0; r < radios.length; r++){
		rad = radios[r][0];
		cntA = radios[r][3];
		sepA = Math.PI / cntA;
		
		for(posA = 0; posA < cntA; posA++){
			P = puntos.length;
			ang = posA * sepA;
			puntos[P] = [];
			puntos[P][0] = r;
			puntos[P][1] = Math.floor(rad * Math.cos(ang));
			puntos[P][2] = Math.floor(rad * Math.sin(ang));
			
			if(ang == 0){
				puntos[P+1] = [];
				puntos[P+1][0] = r;
				puntos[P+1][1] = Math.floor(rad * Math.cos(Math.PI));
				puntos[P+1][2] = Math.floor(rad * Math.sin(Math.PI));
			}else{
				puntos[P+1] = [];
				puntos[P+1][0] = r;
				puntos[P+1][1] = Math.floor(rad * Math.cos(-ang));
				puntos[P+1][2] = Math.floor(rad * Math.sin(-ang));
			}
		}
	}
	for(pt = 0; pt < puntos.length; pt++){
		var actX = radios[puntos[pt][0]][1] + puntos[pt][1];
		var actY = radios[puntos[pt][0]][2] + puntos[pt][2];
		
		context.fillStyle = '#ccc';
		context.fillRect(actX,actY,2,2);
	}
	/*
	for(rds = 0; rds < radios.length; rds++){
		var cenX = radios[rds][1];
		var cenY = radios[rds][2];
		var radT = radios[rds][0];
		
		context.beginPath();
		context.arc(cenX, cenY, radT, 0, 2 * Math.PI, false);
		context.lineWidth = 2;
		context.strokeStyle = '#ccc';
		context.stroke();
	}
	*/
	
	//llenado de la trayectoria del planeta por medio de rectangulos
	/*
	context.lineWidth = 1;
	context.strokeStyle = '#29292E';
	context.fillStyle = '#818184';
	for(id = 0; id < rR.length; id++){
		for(Y = -rR[id]; Y <= rR[id]; Y += 3){
			X = Math.sqrt(srR - Math.pow(Y,2));
			X2 = cX + (X * cosAcosB) - (Y * senB);
			Y2 = cY + (X * cosAsenB) + (Y * cosB);
			
			context.fillRect(X2, Y2, 1, 1);
		}
		for(Y = -rR[id]; Y <= rR[id]; Y += 3){
			X = -Math.sqrt(srR - Math.pow(Y,2));
			X2 = cX + (X * cosAcosB) - (Y * senB);
			Y2 = cY + (X * cosAsenB) + (Y * cosB);
			
			context.fillRect(X2, Y2, 1, 1);
			
			/*
			context.beginPath();
			context.moveTo(X2, Y2);
			context.lineTo(X2+1, Y2+1);
			context.stroke();
			
		}
	}
	*/
	
	//creacion de la matriz de puntos por medio de angulos
	/*
	context.lineWidth = 1;
	context.strokeStyle = '#29292E';
	context.fillStyle = '#818184';
	for(id = 0; id < rR.length; id++){
		for(Y = -rR[id]; Y <= rR[id]; Y += 3){
			X = Math.sqrt(srR - Math.pow(Y,2));
			X2 = cX + (X * cosAcosB) - (Y * senB);
			Y2 = cY + (X * cosAsenB) + (Y * cosB);
			
			context.fillRect(X2, Y2, 1, 1);
		}
		for(Y = -rR[id]; Y <= rR[id]; Y += 3){
			X = -Math.sqrt(srR - Math.pow(Y,2));
			X2 = cX + (X * cosAcosB) - (Y * senB);
			Y2 = cY + (X * cosAsenB) + (Y * cosB);
			
			context.fillRect(X2, Y2, 1, 1);
			
			/*
			context.beginPath();
			context.moveTo(X2, Y2);
			context.lineTo(X2+1, Y2+1);
			context.stroke();
			
		}
	}
	*/

	//establecimiento de puntos en la circunferencia por separaciones en alturas iguales
	/*
	for(i = 0; i < rds.length; i++){
		rd = rds[i][0];
		dm = rds[i][0] * 2;
		sp = rds[i][3] * 2;
		ds = dm / sp;
		d2 = dm * -2;
		pts[i] = [];
				
		for(n = d2; n <= 0; n += ds){
			d3 = n + dm;
			if(d3 <= 0){
				Y = d3 + rd;
				X = -Math.round(Math.sqrt(Math.pow(rd, 2) - Math.pow(Y, 2)));
			}else{
				Y = -(d3 - rd);
				X = Math.round(Math.sqrt(Math.pow(rd, 2) - Math.pow(Y, 2)));
			}
			p = pts[i].length;
			pts[i][p] = [];
			pts[i][p][0] = X;
			pts[i][p][1] = Math.round(Y);
		}
	}
	*/

});


$(document).ready(function(e) {
	var ancho = $(window).width();
	var alto = $(window).height();
	
	var rds = [];
	var pts = [];
	var tray = [];
	var bli = [];
	var pol = [];
	var obj = [];
	var div = [];
	var ctx = [];
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
	
	for(i = 1; i <= pls; i++){
		rd = Math.floor(Math.random() * rango);
		
		rds[i] = [];
		rds[i][0] = rd + mnR;
		pT = (i != 1) ? rds[i - 1][0] : 0;
		tray[i - 1] = tA = 1.1 * (tA + (2 * rds[i][0]) + pT);
		rds[i][1] = 0;
		rds[i][2] = 0;
		rds[i][3] = mnA + Math.floor((rd * porR) * ranA);
		rds[i][4] = Math.round((Math.random() * (tA * 2)) - tA);
		
		clrR = Math.round(Math.random() * 255);
		clrG = Math.round(Math.random() * 255);
		clrB = Math.round(Math.random() * 255);
		
		rds[i][5] = clrR;
		rds[i][6] = clrG;
		rds[i][7] = clrB;
	}
		
	for(i = 0; i < (pls + ext); i++){
		div[i] = document.createElement('div');
		obj[i] = document.createElement('canvas');
		$('body').append(div[i]);
		
		if(i <= pls){
			obj[i].width = obj[i].height = rds[i][0] * 2;
			div[i].setAttribute('class', 'canvas1');
			$(div[i]).css('z-index', (-i-1));
		}else{
			obj[i].width = ancho;
			obj[i].height = alto;
			div[i].setAttribute('class', 'canvas2');
			$(div[i]).css('z-index', (-i-1));
		}
		$(div[i]).append(obj[i]);
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

	ctx[pls + 2].lineWidth = 1;
	ctx[pls + 2].strokeStyle = '#29292E';
	
	for(i = 0; i < tray.length; i++){
		ctx[pls + 2].beginPath();
		srR = Math.pow(tray[i],2);
		for(Y = -tray[i]; Y <= tray[i]; Y += 5){
			X = Math.sqrt(srR - Math.pow(Y,2));
			Z = -(X * senA);
			X2 = cX + (X * cosAcosB) - (Y * senB) - Z;
			Y2 = cY + (X * cosAsenB) + (Y * cosB) - Z;
			
			if(Y == -tray[i]){
				ctx[pls + 2].moveTo(X2, Y2);
			}
			ctx[pls + 2].lineTo(X2, Y2);
		}
		for(Y = tray[i]; Y >= -tray[i]; Y -= 5){
			X = -Math.sqrt(srR - Math.pow(Y,2));
			Z = -(X * senA);
			X2 = cX + (X * cosAcosB) - (Y * senB) - Z;
			Y2 = cY + (X * cosAsenB) + (Y * cosB) - Z;
			
			ctx[pls + 2].lineTo(X2, Y2);
		}
		ctx[pls + 2].closePath();
		ctx[pls + 2].stroke();
	}

	for(i = 1; i < rds.length; i++){
		Y = -rds[i][4];
		X = Math.sqrt(Math.pow(tray[i - 1],2) - Math.pow(Y,2));
		Z = -(X * senA);
		rds[i][1] = X2 = Math.round(cX + (X * cosAcosB) - (Y * senB) - Z);
		rds[i][2] = Y2 = Math.round(cY + (X * cosAsenB) + (Y * cosB) - Z);
		rd = rds[i][0];
	}
	
	for(i = 0; i < rds.length; i++){
		$(div[i]).css({'top':rds[i][2] - rds[i][0], 'left':rds[i][1] - rds[i][0]});
		ctx[i].translate(rds[i][0], rds[i][0]);
		ctx[i].rotate(BB);
		ctx[i].translate(-rds[i][0], -rds[i][0]);
	}

	var lgA = (ancho / 2) - ($('#logo').width() / 2);
	var lgH = (alto / 2) - ($('#logo').height() / 2);
	
	$('#logo').css('top',lgH);
	$('#logo').css('left',lgA);
	
	var dm, sp, s1, s2, ds, p, an, f, c, im, i2;
	
	function cntg(pp1, pp2, pp3, ii){
		dps = pts[ii][pp1][2];
		dps += pts[ii][pp2][2];
		dps += pts[ii][pp3][2];
		dps = Math.round(dps / 3);
		
		return dps;
	}
	
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
							pol[q] = [];
							pol[q][0] = p1;
							pol[q][1] = p2;
							pol[q][2] = p3;
							pol[q][3] = i;
							pol[q][4] = cntg(p1, p2, p3, i);
						}
					}
				}
			}
		}
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
	
	function pXY(r, p){
		pX = rds[r][0] + pts[r][p][0];
		pY = rds[r][0] + pts[r][p][1];
	}
	
	for(i = 0; i < pol.length; i++){
		p1 = pol[i][0];
		p2 = pol[i][1];
		p3 = pol[i][2];
		r = pol[i][3];
		
		ctx[r].beginPath();
		pXY(r, p1);
		ctx[r].moveTo(pX, pY);
		pXY(r, p2);
		ctx[r].lineTo(pX, pY);
		pXY(r, p3);
		ctx[r].lineTo(pX, pY);
		ctx[r].closePath();
		
		//ctx[r].fillStyle = "rgba(204, 204, 204, 1)"
		//ctx[r].fill();
		ctx[r].lineWidth = 0.3;
		ctx[r].strokeStyle = "#ccc";
		ctx[r].stroke();
	}
		
	var f1 = cosAcosB + senA,
	f2 = cosAsenB + senA,
	f3 = cosB * f1,
	f4 = senB * f2,
	f5 = cX * cosB,
	f6 = cY * senB,
	f7 = f5 + f6,
	f8 = f3 + f4;
	
	function calXY(r){
		rd = rds[r][0];
		pX = rds[r][1];
		pY = rds[r][2];
		
		X = (((pX * cosB) + (pY * senB) - f7) / f8);
		Y = ((pY - cY - (X * f2)) / cosB);
		Z = (-X * senA);
		if(X == 0){
			Y = (Y > 0)? Y-- : Y++;
		}else if(X > 0){
			Y++;
		}else if(X < 0){
			Y--;
		}

		rds[r][1] = pX2 = (cX + (X * cosAcosB) - (Y * senB) - Z);
		rds[r][2] = pY2 = (cY + (X * cosAsenB) + (Y * cosB) - Z);
		pX2 = Math.round(pX2);
		pY2 = Math.round(pY2);
		
		$('#frm').val('X=' + X + ' : pX=' + pX + ' : pX2=' + pX2 + ' : y=' + Y + ' : pY=' + pY + ' : pY2=' + pY2 + '\n');
	}

	function animate() {
		for(i = 1; i <= 3; i++){
			calXY(i);
			$(div[i]).css({'top':pY2 - rds[i][0], 'left':pX2 - rds[i][0]});
		}
	}
	
	var animacion = setInterval(function(){ animate() }, 1000 / 25);
});


	function colP(){
		rd = rds[r][0];
		an = rds[r][5];
		dm = rd * 2;
		dm = dm + ((0.4142 * dm) / 2);
		rd = dm / 2;
		d = Math.sqrt(Math.pow(dX - pRX, 2) + Math.pow(dY - pRY, 2)) - rd;
		an = an + ((d / dm) * 8);
		an = (an > 47)? an - 47 : an;
		an = (an < 0)? an + 47 : an;
		ps1 = an / 4;
		ps2 = Math.floor(ps1);
		rd = gr = bl = 0;
		prc = ps1 - ps2;
		
		$('#frm').val($('#frm').val()+'pl='+r+' : an='+an+'\n');
		
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
			rd = 128 + (129 * prc);
			gr = 255;
			break;
		}
		rd = Math.floor(rd);
		gr = Math.floor(gr);
		bl = Math.floor(bl);
	}

	//degradado lineal blanco en el fondo
	var i = ctx.length - 1,
	pX = rds[0][1],
	pY = rds[0][2];
	
	ctx[i].rect(0, 0, ancho, alto);
	var grd = ctx[i].createRadialGradient(pX, pY, 10, pX, pY, ancho - (2 * pX));
	grd.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
	grd.addColorStop(1, 'rgba(255, 255, 255, 0)');
	
	ctx[i].fillStyle = grd;
	ctx[i].fill();

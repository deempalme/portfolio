/*
© Copyleft following GNU GPL statement and:

  Any person has the right to freely distribute copies and modified versions of this code with
  the accompanying requirement that any resulting copies or adaptations are also bound by the same
  licensing agreement and they shall have the name and link of the original author.
  
  Original author: F. J. Ramirez Rodriguez - http://bio.ramrod.tech
*/

var w, h, w2, h2, h4, h15, rds = [], div = [], obj = [], img = [], shd = [], ctx = [], ctx2 = [];
var hpl = [], div2 = [], pls = [], ctx3 = [], ocu = [], aP = [], iP = [], obP = [], k = [];
var rd = 0, rd2 = 0, pT = 0, tA = 0, anim = 0, blinking;
var Kp = 0, pK = 0, pl1r = 0, porM = 0, play = [1, 1, 1, 1], cvT = [];
var ctxT = [], cnT = [], cnTa = [], ccT = [], aaT = [], avaT = [], angO = 0, daT = 0, pmPX = 0;
var pmPY = 0, pamPX = 0, pamPY = 0, seP = 0, anbT = 0;
var ratio = 0, maxVM = 0, time_mouse, accel, mdpT = 0, blcM = 0;
var imgP = new Image(), lP1, lP2, lI1, lI2;
var prL1, prL2, psL1, psL2, psL3, psL4, psL5;

const strs = 400, ratio169 = 1.778, anI = Math.PI, anMx = 70, HVfc = [70, 60, 88, 70];
const t1 = '+49 176', e1 = 'f', e2 = 'j', e3 = 'ramirez', e4 = 'rodriguez', t2 = ' 210 32 331';
const m1 = 'gm', m2 = 'ail';
const planet_count = 8;

//portfolio section jquery selectors
var $po, $pod, $podd, $pos, $pos2, $pos3, $pos1, $pos1a, $pos1a1, $pos1a2, $pos1a3, $pos1a4;
var $pos1a3h1, $pos1a3h2, $pos1a3i, $pos2a, $pos2af, $pos2af1, $pos2af2, $pos2af3, $pos2af4;
var $pos2afv, $poh, $pos2afbp, $pos2afb, $pos2afbm, $pos2aa, $pos2abc, $pos2aav, $vid, $vid2;
var $pos3a, $pos1a4h1, $pos3au, $pos3aulul, $pos1a1h1, $poh6, $pos2h6, $pos3h6;

//personal section jquery selectors
var $pe, $pea, $pea1, $pea2, $pel, $pel1s, $pel2s, $pelLs;

//contact section jquery selectors
var $co, $coa;

//header section jquery selectors
var $he, $hes, $hesa, $hea;

//code section jquery selectors
var $cod, $coda, $codas, $codad, $codaa;

const degree_360 = Math.PI * 2.0, degree_270 = Math.PI * 1.5, degree_180 = Math.PI;
const degree_90 = Math.PI * 0.5, degree_45 = Math.PI * 0.25, degree_70 = Math.PI * 0.3888889;
const degree_225 = Math.PI * 1.25;
const to_radian = Math.PI / 180.0;

//positioning any floating object
function positionate_xy($object, x, y, top = true, left = true){
  if(top){
    $object.style.top = y + 'px';
    $object.style.bottom = 'auto';
  }else{
    $object.style.top = 'auto';
    $object.style.bottom = y + 'px';
  }

  if(left){
    $object.style.left = x + 'px';
    $object.style.right = 'auto';
  }else{
    $object.style.left = 'auto';
    $object.style.right = x + 'px';
  }
}

function initialize_variables(){
  w = $(window).width();
  h = $(window).height();
  w2 = Math.round(w/2);
  h2 = Math.round(h/2);
  h4 = Math.round(h2/2);
  h15 = h + h2;
  rd = Math.round(w2/planet_count);
  seP = Math.round((w2 - 13)/11.0);
  maxVM = Math.round(w/10.0);
  ratio = w/h;
  lP1 = Math.round(w2 - 347);
  lP2 = Math.round(h2 - 39);
  lI1 = Math.round(w2 - 315);
  lI2 = Math.round(h2 - 90);

  $po        = $('#portfolio');
  $pod       = $po.children('div');
  $podd      = $pod.children('div');
  $pos       = $podd.children('section');
  $pos2      = $pos.eq(1);
  $pos3      = $pos.eq(2);
  $pos1      = $pos.eq(0);
  $pos1a     = $pos1.children('article');
  $pos1a1    = $pos1a.eq(0);
  $pos1a2    = $pos1a.eq(1);
  $pos1a3    = $pos1a.eq(2);
  $pos1a4    = $pos1a.eq(3);
  $pos1a3h1  = $pos1a3.find('h1');
  $pos1a3h2  = $pos1a3.find('h2');
  $pos1a3i   = $pos1a3.find('img');
  $pos2a     = $pos2.children('article');
  $pos2af    = $pos2a.children('figure');
  $pos2af1   = $pos2af.eq(0);
  $pos2af2   = $pos2af.eq(1);
  $pos2af3   = $pos2af.eq(2);
  $pos2af4   = $pos2af.eq(3),
  $pos2afv   = $pos2af.children('video');
  $poh       = $po.find('header');
  $pos2afbp  = $pos2af.find('li:first-child');
  $pos2afb   = $pos2af.find('li'),
  $pos2afbm  = $pos2af.find('li:last-child');
  $pos2aa    = $pos2a.children('article');
  $pos2abc   = $pos2aa.children('div:last-child'),
  $pos2aav   = $pos2aa.find('video');
  $vid       = $('.video');
  $vid2      = $('#exp2 video');
  $pos3a     = $pos3.children('article');
  $pos1a4h1  = $pos1a4.find('h1'),
  $pos3au    = $pos3a.children('ul');
  $pos3aulul = $pos3au.children('li').children('ul').children('li');
  $pos1a1h1  = $pos1a1.find('h1'),
  $poh6      = $po.find('h6');
  $pos2h6    = $poh6.eq(0);
  $pos3h6    = $poh6.eq(1);

  $pe    = $('#personal');
  $pea   = $pe.find('article');
  $pea1  = $pea.eq(0);
  $pea2  = $pea.eq(1);
  $pel   = $pe.find('li');
  $pel1s = $pel.eq(0).find('section');
  $pel2s = $pel.eq(1).find('section');
  $pelLs = $pel.last().find('section');

  $co  = $('footer');
  $coa = $co.find('article');

  $he   = $('#header');
  $hes  = $he.find('section').eq(0);
  $hesa = $hes.children('a');
  $hea  = $he.find('article');

  $cod   = $('#code');
  $coda  = $cod.children('article');
  $codas = $coda.children('section');
  $codad = $coda.children('div');
  $codaa = $coda.children('a');
}

//function to establsih the image backgroun for each arrow key
function keys_restart(){
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
function keys_animation(){
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
  setTimeout(keys_restart, 300);
}

var senA, senB, cosB, cosAcosB, cosAsenB;

//function to calculate the angles after scrolling
function calculate_angles(angle){
  const aY = 100;
  const AA = angle * to_radian;
  const BB = -aY * to_radian;
  senA = Math.sin(AA);
  senB = Math.sin(BB);
  cosB = Math.cos(BB);
  cosAcosB = Math.cos(AA) * cosB;
  cosAsenB = Math.cos(AA) * senB;
}

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

$(document).ready(function(){
  initialize_variables();

  $('#top').hide();
  $pos3au.hide();

  $po.height(h);
  $pod.height(h);
  $podd.height(h);
  $podd.width(w * 3);  
  $pos.height(h);
  $pos1.width(w);
  $pos2.width(w);
  $pos3.width(w);
  $pos2aa.width(w - 20);
  $pos2aa.height(h - 20);

  $pos1a1.width(h);
  $pos1a4.width(h);
  $pos2af.width(w2 - 15);
  $pos2af.height(h2 - 15);
  $pe.height(h * 3);
  $he.height(h * 3.5);
  $co.height(h + 200);
  $pea1.height(h);
  $pel.height(h);

  for(i = 0; i < 4; i++){
    if(i != 1){
      $pos2aav.eq(i).height(h - 20);
    }
  }
  $vid.width(w - 20);
  $vid.height(h - 20);
  $vid2.width(w - 20);

  positionate_xy($podd, 0, -w, 3, 1);
  positionate_xy($pos1, 0, w, 1, 1);
  positionate_xy($pos2, 0, w * 2, 1, 1);
  positionate_xy($poh, 0, w2 - 112, 1, 1);
  positionate_xy($poh6, h2 - 140, 0, 1, 3);
  positionate_xy($pos1a2, lP2, lP1, 1, 1);
  positionate_xy($pos1a3, 0, w2 - 74, 3, 1);
  positionate_xy($hea, lI2, lI1, 1, 1);
  positionate_xy($hesa, h - 70, 0, 1, 3);
  prL1 = $pea1.width()/2;
  prL2 = $pea2.width()/2;
  positionate_xy($pea1.find('img'), h2 - 110, prL1 - 182, 1, 1);
  psL1 = prL2 - $pel2s.width()/2;
  psL2 = prL2 - $pelLs.width()/2;
  psL3 = h2 - 195;
  psL4 = h2 - $pelLs.height()/2;
  psL5 = h2 - $pel1s.height()/2;
  positionate_xy($pel1s, psL5, 0, 1, 3);
  positionate_xy($pel2s, psL3, psL1, 1, 1);
  positionate_xy($pelLs, psL4, psL2, 1, 1);
  positionate_xy($coa, 0, w2 - 250, 3, 1);

  positionate_xy($pos2af1, 0, 0, 1, 1);
  positionate_xy($pos2af2, 0, 0, 1, 2);
  positionate_xy($pos2af3, 0, 0, 2, 1);
  positionate_xy($pos2af4, 0, 0, 2, 2);

  $pel1s.find('i').html('');

  //creating the arrow keys
  for(i = 1; i < 5; i++){
    aP[i] = document.createElement('img');
    aP[i].setAttribute('src','/resources/theme/transparent.gif');
    aP[i].setAttribute('class','aP'+i);
    $pos1a3h2.before(aP[i]);
  }
  $pos1a3h1.remove();
  
  for(i = 1; i < 5; i++){
    k[i] = $(aP[i]);
  }

  blinking = setInterval(keys_animation, 700);
  
});


// :::::::::::::::::::::::::::::::::::::::::: NEW CODE ::::::::::::::::::::::::::::::::::::::::::

class Planet {
  constructor(translation, angle, radius, index, hidden = false){
    this.translation = translation;
    this.angle = angle;
    this.radius = radius;
    this.hidden = hidden;
    // Planet shadow
    this.shadow = document.createElement('canvas');
    this.shadow.setAttribute('class', 'shadow');
    this.context = this.shadow.getContext('2d');

    const radius_2 = this.radius * 2 / 65.0;
    // External ambient occlusion
    this.occlusion = document.createElement('img');
    this.occlusion.setAttribute('src', '/resources/theme/shadow.png');
    this.occlusion.width = Math.floor(458 * radius_2);
    this.occlusion.height = Math.floor(75 * radius_2);
    this.occlusion.setAttribute('class', 'long-shadow');
    posicionate_xy(
      this.occlusion, -Math.round(5 * radius_2), this.radius - this.occlusion.width * 0.5
    );
    // Planet div
    this.div = document.createElement('div');
    this.div.setAttribute('class', 'planet');
    // Planet image
    this.img = document.createElement('img');
    this.img.setAttribute('src', '/resources/theme/p' + index + '.png');
    this.img.setAttribute('class', 'planet2');

    this.div.width = this.div.height = this.shadow.width = this.shadow.height = this.radius * 2;
    this.x = w2;
    this.y = h2;

    this.calculate_xy();
  }

  append($object){
    $(this.div).append(this.img, this.shadow, this.occlusion);
    $object.append(this.div);
  }

  //hidding or showing the planets
  visibility(hidden = false){
    this.hidden = hidden;
    if(hidden){
      $(this.div).hide();
    }else{
      $(this.div).show();
    }
  }

  rotate_shadow(){
    var inclination_1 = this.inclination - degree_90;
    // TODO: should it be 270 or 360?
    if(inclination_1 < 0) inclination_1 += degree_270;
    const inclination_2 = this.inclination - degree_45;
    const inclination_3 = inclination_2 - degree_90;

    const p_x = this.radius * Math.cos(this.inclination);
    const p_y = this.radius * Math.sin(this.inclination);
    const radius_2 = this.radius * 1.5 * Math.cos(this.inclination);
    const p_x2 = radius_2 * Math.cos(inclination_2);
    const p_y2 = radius_2 * Math.sin(inclination_2);
    const p_x3 = radius_2 * Math.cos(inclination_3);
    const p_y3 = radius_2 * Math.sin(inclination_3);

    this.context.clearRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
    this.context.beginPath();
    this.context.moveTo(p_x, p_y);
    if((inclination_1 >= degree_180) || (this.inclination < 0)){
      this.context.bezierCurveTo(p_x2, p_y2, p_x3, p_y3, -p_x, -p_y);
    }else{
      this.context.bezierCurveTo(p_x3, p_y3, p_x2, p_y2, -p_x, -p_y);
    }
    this.context.arc(0, 0, this.radius, this.inclination + degree_180, this.inclination, false);
    this.context.closePath();

    this.context.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.context.fill();
  }

  // This function is performed together with the animation to know the frame XY point for 
  // each planet, simulating a planetary translation
  calculate_xy(){
    if(this.index == 0) return;

    this.angle += (0.005 * (planet_count - this.index + 1) * 2) / 10.0;
    if(this.angle > degree_360) this.angle -= degree_360;

    const new_x = this.translation * Math.cos(this.angle);
    const new_y = this.translation * Math.sin(this.angle);
    const new_z = -new_x * senA;
    this.x = Math.round((w2 + (new_x * cosAcosB) - (new_y * senB) - new_z) * 100) / 100.0;
    this.y = Math.round((h2 + (new_x * cosAsenB) + (new_y * cosB) - new_z) * 100) / 100.0;

    const angle = this.angle - degree_45;
    if((angle >= degree_180) || (angle < 0)){
      $(this.div).css('z-index', -this.index - 1 - planet_count);
    }else{
      $(this.div).css('z-index', -1 - planet_count + this.index);
    }
  }

  resize(){
    var scale;
    var angle = this.angle - degree_70;
    if(angle < 0) angle += degree_360;

    if((angle >= 0) && (angle < degree_180)){
      scale = angle / degree_225;
      scale = 1 - scale;
    }else{
      angle -= degree_180;
      scale = (angle / degree_180) * 0.8 + 0.2;
    }
    $(this.div).css('transform', 'scale(' + scale + ')');
    scale = (scale - 0.2) * 1.25;
    if(scale > 1) scale = 1;

    $(this.img).css('opacity', scale);
  }

  translate(){

  }
}

var planets = [], planet_translation, added_translation = 0;
const planet_radius = [60, 28.5, 50.5, 58, 48, 120, 101.5, 84, 85];

// Creating the SUN
planets[0] = new Planet(0, 0, added_translation = planet_radius[0]);

// Creating all other planets
for(var i = 1; i <= planet_count; ++i){
  planet_translation = planets[i - 1].radius;
  planets[i] = new Planet(
    added_translation = planet_radius[i] + planet_translation + added_translation,
    Math.random() * degree_360,
    planet_radius[i],
    i
  );
}





//global variable definition
var i_chassis, i_auto, i_print, bck_chassis, bck_auto, bck_print;
var s_chassis, s_auto, s_print, s_assembly, m_chassis, m_auto, m_print, m_assembly,
h_ap1, h_ap2, h_ap3, h_ap4, m_about, s_about,  m_motiv, s_motiv, m_ap1, m_ap2, m_ap3, m_ap4 = 0;
var m_menu, d_logo, d_covering, m_nav, i_nav;
var i_move, i_rotate, l_move, l_rotate, d_interact, m_interact;
var lang;
var menu_visible = false, down_hidden = false;

function mouseDown(e) {
  drag = true;
  old_x = e.pageX, old_y = e.pageY;

  if (e.which == 2)
    middle = true;
  else
    middle = false;

  clearInterval(mover);
  $(d_logo).fadeOut(500);

  e.preventDefault();
  return false;
};

function mouseUp(e) {
  drag = false;
}

function menu_hover(){
  $('#menu img').attr('src', '/resources/theme/menu_close.svg');
  menu_visible = true;
  m_nav.animate({ right: "0" }, 200);
  clearInterval(i_nav);
}

function menu_out(){
  clearInterval(i_nav);
  i_nav = setInterval(hide_menu, 300);
}

function hide_menu(){
  clearInterval(i_nav);
  $('#menu img').attr('src', '/resources/theme/menu_open.svg');
  menu_visible = false;
  m_nav.animate({ right: "-135" }, 200);
}

var compensation = 90;

function change_position_from_home(id, event){
  $('html, body').stop(true);

  
  if(menu_visible && w_a < 1000){
    m_nav.hide();
    menu_visible = false;
    $('#menu img').attr('src', '/resources/theme/menu_open.svg')
  }


  if(id < 0){
    var actual_position = $(window).scrollTop();
    if(actual_position >= Math.floor($("#impressum").offset().top))
      return null;
    else if(actual_position >= Math.floor($("#about").offset().top))
      id = 7;
    else if(actual_position >= Math.floor($("#assembly").offset().top))
      id = 6;
    else if(actual_position >= Math.floor($("#print").offset().top))
      id = 5
    else if(actual_position >= Math.floor($("#auto").offset().top))
      id = 4
    else if(actual_position >= Math.floor($("#chassis").offset().top))
      id = 3
    else if(actual_position >= Math.floor($("#motivation").offset().top))
      id = 2
    else
      id = 1
  }

  switch(id){
    case 1:
      $('html, body').animate({ scrollTop: $("#motivation").offset().top + compensation }, 1000);
    break;
    case 2:
    $('html, body').animate({ scrollTop: $("#chassis").offset().top + compensation }, 1000);
    break;
    case 3:
      $('html, body').animate({ scrollTop: $("#auto").offset().top + compensation }, 1000);
    break;
    case 4:
      $('html, body').animate({ scrollTop: $("#print").offset().top + compensation }, 1000);
    break;
    case 5:
      $('html, body').animate({ scrollTop: $("#assembly").offset().top + compensation }, 1000);
    break;
    case 6:
      $('html, body').animate({ scrollTop: $("#about").offset().top + compensation }, 1000);
    break;
    case 7:
      $('html, body').animate({ scrollTop: $("#impressum").offset().top }, 1000);
    break;
    default:
      $('html, body').animate({ scrollTop: $("#home").offset().top }, 1000);
    break;
  }

  event.preventDefault();
  event.stopPropagation();
}

function set_new_events(){
  d_covering = document.createElement('div');

  d_covering.addEventListener("mousedown", mouseDown, false);
  d_covering.addEventListener("mouseup", mouseUp, false);
  d_covering.addEventListener("mouseout", mouseUp, false);
  d_covering.addEventListener("mousemove", mouseMove, false);

  hammertime = new Hammer(d_covering);
  hammertime.get('rotate').set({ enable: true });
  hammertime.on("rotatestart", touch_rotation_start);
  hammertime.on("rotatemove", touch_rotation_move);

  hammertime.get('pinch').set({ enable: true });
  hammertime.on("pinchstart", touch_zoom_start);
  hammertime.on("pinchmove", touch_zoom_move);

  hammertime.on("panstart", touch_pan_start);
  hammertime.on("panmove", touch_pan_move);

  zoom_in = $('#zoom_in');
  zoom_out = $('#zoom_out');
  home_position = $('#home_position');
  top_position = $('#top_position');

  zoom_in.on("mousedown", function () { zooming(1) });
  home_position.on("mousedown", function () { zooming(0) });
  top_position.on("mousedown", function () { zooming(2) });
  zoom_out.on("mousedown", function () { zooming(-1) });

  lang = $('#language_input');

  i_move = document.createElement('img');
  if(w_a < 1000)
    i_move.src = "/resources/theme/two_fingers.svg";
  else
    i_move.src = "/resources/theme/move.svg";
  $(i_move).addClass("move");

  i_rotate = document.createElement('img');
  if(w_a < 1000)
    i_rotate.src = "/resources/theme/two_fingers.svg";
  else
    i_rotate.src = "/resources/theme/rotate.svg";
  $(i_rotate).addClass("rotate");

  l_move = document.createElement('div');
  if(lang.val() == "de")
    l_move.innerHTML = "Bewegen";
  else
    l_move.innerHTML = "Move";
  $(l_move).addClass("d_move").prepend($(i_move));

  l_rotate = document.createElement('div');
  if(lang.val() == "de")
    l_rotate.innerHTML = "Rotieren";
  else
    l_rotate.innerHTML = "Rotate";
  $(l_rotate).addClass("d_rotate").prepend($(i_rotate));

  d_logo = document.createElement('div');
  $(d_logo).addClass("logotype");
  $('#home').append($(d_logo)).append($(d_covering));
  $(d_covering).addClass("covering").append($(l_move)).prepend($(l_rotate));
  
  m_auto = $('#auto');
  m_print = $('#print');
  m_chassis = $('#chassis');
  m_assembly = $('#assembly');
  m_about = $('#about');
  m_motiv = $('#motivation');

  s_auto = $('#auto section');
  s_print = $('#print section');
  s_assembly = $('#assembly section');
  s_chassis = $('#chassis section');
  s_about = $('#about section');
  s_motiv = $('#motivation section');
  h_ap1 = $('#ap1 img');
  h_ap2 = $('#ap2 img');
  h_ap3 = $('#ap3 img');
  h_ap4 = $('#ap4 img');

  m_ap1 = $('#home .ap1');
  m_ap2 = $('#home .ap2');
  m_ap3 = $('#home .ap3');
  m_ap4 = $('#home .ap4');

  m_menu = $('header nav ul');

  m_nav = $('nav');
  m_nav.css({ 'right':'-135px' });

  m_nav.on("mouseover", menu_hover);
  m_nav.on("mouseout", menu_out);

  $('#link_home').on("mouseup", function(e){ change_position_from_home(0, e); });
  $('#ap1').on("mouseup", function(e){ change_position_from_home(2, e); });
  $('#ap2').on("mouseup", function(e){ change_position_from_home(3, e); });
  $('#ap3').on("mouseup", function(e){ change_position_from_home(4, e); });
  $('#ap4').on("mouseup", function(e){ change_position_from_home(5, e); });
  $('#link_motivation').on("mouseup", function(e){ change_position_from_home(1, e); });
  $('#link_chassis').on("mouseup", function(e){ change_position_from_home(2, e); });
  $('#link_auto').on("mouseup", function(e){ change_position_from_home(3, e); });
  $('#link_print').on("mouseup", function(e){ change_position_from_home(4, e); });
  $('#link_assembly').on("mouseup", function(e){ change_position_from_home(5, e); });
  $('#link_about').on("mouseup", function(e){ change_position_from_home(6, e); });
  $('#link_impressum, #more_info').on("mouseup", function(e){ change_position_from_home(7, e); });
  $('#logotype').on("mouseup", function(e){ change_position_from_home(0, e); });

  $('#menu').on("mouseup", function(){
    menu_visible = !menu_visible;
    if(menu_visible && w_a < 1000){
      m_nav.fadeIn(300);
      $('#menu img').attr('src', '/resources/theme/menu_close.svg');
    }else if(!menu_visible && w_a < 1000){
      m_nav.fadeOut(300);
      $('#menu img').attr('src', '/resources/theme/menu_open.svg');
    }else if(menu_visible && w_a >= 1000){
      menu_hover();
    }else if(!menu_visible && w_a >= 1000){
      hide_menu();
    }
  });

  $('#go_down').on('mouseup', function(e){ change_position_from_home(-1, e); });

  var t_mail = $('#mail_dir').html();
  $('#mail_dir').html(t_mail);
  $('#mail_dir').attr('href', 'mailto:' + t_mail);
}

// ------------------------------------------------------------------------------------ //
// ---------------------------------- main function ----------------------------------- //
// ------------------------------------------------------------------------------------ //

$(document).ready(function () {

  //set_new_events();

  //initGL();
  //resize_gl();

  //$("#chassis p, #auto p, #print p, #assembly p, #impressum p").hyphenate('en');

  $('#code_view_solar').on('click', function(){
    $.post('/bio/code', {
      solar: 1
    }, function(data){

    }, 'json');
  });

});

// ------------------------------------------------------------------------------------ //
// ---------------------------- resize window event handler --------------------------- //
// ------------------------------------------------------------------------------------ //

$(window).resize(function () {
  w = w_a = window.innerWidth;
  h = window.innerHeight;
  w2 = w / 2;
  h2 = h / 2;

  increasingW = 1.3 * Math.PI / w;
  increasingH = 1.3 * Math.PI / h;

  //resize_gl();
});

$(window).scroll(function() {
  /*
  var height = $(window).scrollTop();

  var scrollHeight = $(document).height();
	var scrollPosition = $(window).height() + height;

  if((scrollHeight - scrollPosition) / scrollHeight === 0){
    $('#go_down').fadeOut(300);
    down_hidden = true;
  }else if(down_hidden){
    $('#go_down').fadeIn(300);
    down_hidden = false;
  }
  */
});

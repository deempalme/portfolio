
import $ from 'jquery';
import { section } from './classes';

class home
{
  private width  : number = 0;
  private height : number = 0;

  private font_size : number = 16;

  // Current scroll position
  private scroll_y : number = 0;

  // Main objects
  private navigation : Array<section>;
  
  // Event binders
  private resize_event : any;
  private scroll_event : any;
  private unload_event : any;

  constructor(){
    const nav_childs = document.getElementsByTagName('nav').item(0)?.getElementsByTagName('a');

    let canv : HTMLCanvasElement;

    // Getting the navigation anchors from the html
    this.navigation = [
      {
        object  : document.getElementById('universe')!,
        link    : document.createElement('b'),
        canvas  : canv = document.createElement('canvas'),
        context : canv.getContext('2d')!,
        start   : 0, end : 0
      },
      {
        object  : document.getElementById('portfolio')!,
        link    : document.createElement('b'),
        canvas  : canv = document.createElement('canvas'),
        context : canv.getContext('2d')!,
        start   : 0, end : 0
      },
      {
        object  : document.getElementById('projects')!,
        link    : document.createElement('b'),
        canvas  : canv = document.createElement('canvas'),
        context : canv.getContext('2d')!,
        start   : 0, end : 0
      },
      {
        object  : document.getElementById('about_me')!,
        link    : document.createElement('b'),
        canvas  : canv = document.createElement('canvas'),
        context : canv.getContext('2d')!,
        start   : 0, end : 0
      },
      {
        object  : document.getElementById('knowledge')!,
        link    : document.createElement('b'),
        canvas  : canv = document.createElement('canvas'),
        context : canv.getContext('2d')!,
        start   : 0, end : 0
      },
      {
        object  : document.getElementById('studies')!,
        link    : document.createElement('b'),
        canvas  : canv = document.createElement('canvas'),
        context : canv.getContext('2d')!,
        start   : 0, end : 0
      },
      {
        object  : document.getElementById('contact_me')!,
        link    : document.createElement('b'),
        canvas  : canv = document.createElement('canvas'),
        context : canv.getContext('2d')!,
        start   : 0, end : 0
      }
    ];

    // Navigation not found
    if(!nav_childs || nav_childs.length == 0){
      console.error('Navigation not found');
    }else{
      // Creating a canvas for each anchor in the nvaigation
      for(var i : number = 0; i < this.navigation.length; ++i){
        this.navigation[i].link.textContent = nav_childs.item(i)!.textContent;
        nav_childs.item(i)!.textContent = '';
        nav_childs.item(i)!.appendChild(this.navigation[i].link);
        nav_childs.item(i)!.appendChild(this.navigation[i].canvas);
      }
    }

    // Creating a window resize event handler
    this.resize_event = this.resize.bind(this);
    window.addEventListener('resize', this.resize_event);

    // Creating a window unload event handler
    this.scroll_event = this.scroll.bind(this);
    window.addEventListener('scroll', this.scroll_event);

    // Creating a window unload event handler
    this.unload_event = this.destroy.bind(this);
    window.addEventListener('unload', this.unload_event);

    this.resize();
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    window.removeEventListener('resize', this.resize_event);
    window.removeEventListener('scroll', this.scroll_event);
    window.removeEventListener('unload', this.unload_event);
  }
  /**
   * @brief Resizing event handler
   */
  public resize() : void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Gettting the start and ending offset for all html sections
    for(var i in this.navigation){
      this.navigation[i].start = $(this.navigation[i].object).offset()!.top;
      this.navigation[i].end = this.navigation[i].start + $(this.navigation[i].object).height()!;
      this.navigation[i].canvas.width = this.navigation[i].canvas.height = this.font_size * 1.25;
    }
  }

  public scroll() : void {
    let rel : number = (window.pageYOffset/5874 - 0.1) * 1.3;
    let dia : number = this.navigation[6].canvas.width;
    let rad : number = dia / 2;

    this.navigation[6].context.clearRect(0, 0, dia, dia);
    this.navigation[6].context.beginPath();
    this.navigation[6].context.moveTo(0, 0);
    this.navigation[6].context.lineTo(0, rad);
		this.navigation[6].context.bezierCurveTo(0, rel * dia, dia, rel * dia, dia, rad);
    this.navigation[6].context.lineTo(dia, 0);
		this.navigation[6].context.closePath();
		this.navigation[6].context.fillStyle = 'rgba(0,0,0,0.75)';
		this.navigation[6].context.fill();
  }
}

var home_object : home | null = null;

window.onload = function(){
  home_object = new home;
}
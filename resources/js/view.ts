declare var media : any;

class view {
  private media_object : any = null;

  private adult : boolean;
  private autoplay : boolean;
  private crop_height : number;
  private crop_width : number;
  private height : number;
  private is_image : boolean;
  private looping : boolean;
  private muted : boolean;
  private speed : number;
  private time_position : number;
  private width : number;
  private x : number;
  private y : number;
  private zoom : number;

  private window_height : number;
  private window_width : number;
  private active_input : boolean = false;

  private key_down_event : any;
  private resize_event : any;
  private unload_event : any;

  private tag_add_button : HTMLElement | null = null;
  private tag_input : HTMLElement | null = null;
  private zoom_input : any = null;

  constructor(){
    this.media_object = document.getElementById('media_handler');
    this.window_height = window.innerHeight;
    this.window_width = window.innerWidth;

    this.adult = media.adult;
    this.autoplay = media.autoplay;
    this.crop_height = media.crop_height;
    this.crop_width = media.crop_width;
    this.height = media.height;
    this.is_image = media.is_image;
    this.looping = media.looping;
    this.muted = media.muted;
    this.speed = media.speed;
    this.time_position = media.time_position;
    this.width = media.width;
    this.x = media.position_x;
    this.y = media.position_y;
    this.zoom = media.zoom;

    if(!this.is_image){
      this.media_object.currentTime = this.time_position;
      if(!this.autoplay || this.speed != 1.0) this.media_object.pause();
      if(!this.looping) this.media_object.loop = true;
      if(this.muted) this.media_object.muted = true;
    }

    this.key_down_event = this.key_down.bind(this);
    window.addEventListener("keydown", this.key_down_event);
    this.resize_event = this.resize.bind(this);
    window.addEventListener("resize", this.resize_event);
    this.unload_event = this.destroy.bind(this);
    window.addEventListener("unload", this.unload_event);

    this.tag_add_button = document.getElementById("tag_add");
    this.tag_input = document.getElementById("tag_input");
    this.zoom_input = document.getElementById("zoom_input");

    media = null;

    this.initialize();
  }

  public add_tag(){}

  public crop(){}

  public delete(){}

  public destroy(){
    window.removeEventListener("keydown", this.key_down_event);
    window.removeEventListener("resize", this.resize_event);
    window.removeEventListener("unload", this.unload_event);
  }

  public full_screen(){
    const factor_x = this.window_width / this.width;
    const factor_y = this.window_height / this.height;

    if(factor_x > factor_y)
      this.zooming(factor_y);
    else
      this.zooming(factor_x);
  }

  public initialize(){
    if(this.x == 0 && this.y == 0 && this.crop_width == 0 && this.crop_height == 0
    && this.zoom == 1.0){
      this.full_screen();
      return;
    }
    this.media_object.width = this.width * this.zoom;
    this.media_object.height = this.height * this.zoom;
    this.media_object.style.left = this.x + 'px';
    this.media_object.style.top = this.y + 'px';
  }

  /**
   * Handles a key down event
   * 
   * @param {KeyboardEvent} event Keyboard's event
   */
  private key_down(event : KeyboardEvent){
    if(this.active_input) return false;

    switch(event.key){
      case 'x':
        this.crop();
      break;
      case 'Delete':
        this.delete();
      break;
      case 'r':
        this.restore();
      break;
      case 'f':
        this.full_screen();
      break;
      case '+':
        this.zoom_in();
      break;
      case '-':
        this.zoom_out();
      break;
      case '*':
        this.speed_up();
      break;
      case '_':
        this.speed_down();
      break;
      case 'Space':
        this.pause();
      break;
      case 'p':
        this.pause();
      break;
      case 'Enter':
        this.pause();
      break;
      case 't':
        this.add_tag();
      break;
      default: console.log(event.key); break;
    }
  }

  public pause(){
    if(this.is_image) return false;
  }

  public resize(){
    this.window_height = window.innerHeight;
    this.window_width = window.innerWidth;
    this.zooming(this.zoom);
  }

  public restore(){
    this.zooming(1);
  }

  public speed_down(){
    if(this.is_image) return false;
    this.speed *= 0.8;
  }

  public speed_up(){
    if(this.is_image) return false;
    this.speed *= 1.25;
  }

  public zooming(new_value : number){
    const new_width = Math.round(this.width * new_value);
    const new_height = Math.round(this.height * new_value);
    this.zoom = new_value;
    this.x = Math.round((this.window_width - new_width) / 2);
    this.y = Math.round((this.window_height - new_height) / 2);
    this.media_object.width = new_width;
    this.media_object.height = new_height;
    this.media_object.style.left = this.x + 'px';
    this.media_object.style.top = this.y + 'px';
    this.zoom_input.value = Math.round(this.zoom * 100) + '%';
  }

  public zoom_in(){
    this.zooming(this.zoom * 1.25);
  }

  public zoom_out(){
    this.zooming(this.zoom * 0.8);
  }
}

var page_object = null;

window.onload = function(){
  page_object = new view;
}


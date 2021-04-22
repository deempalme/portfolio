
import $ from 'jquery';
import { navigation } from './navigation';
import { portfolio } from './portfolio';


export class keys {
  private navigation : navigation;
  private portfolio : portfolio;

  private down   : HTMLElement;
  private left   : HTMLElement;
  private right  : HTMLElement;
  private up     : HTMLElement;

  private down_active  : boolean = true;
  private left_active  : boolean = true;
  private right_active : boolean = true;
  private up_active    : boolean = false;

  private going_down : boolean = false;
  private going_up : boolean = false;

  // Event binders
  private down_event  : any;
  private up_event    : any;
  private key_up_event : any;
  private key_down_event : any;
  private restore_down_binder : any;
  private restore_up_binder : any;


  constructor(parent : string, navigation : navigation, portfolio : portfolio){
    this.navigation = navigation;
    this.portfolio = portfolio;

    // Creting the key buttons
    this.down  = document.createElement('button');
    this.left  = document.createElement('button');
    this.right = document.createElement('button');
    this.up    = document.createElement('button');

    // Deactivated appearance CSS
    this.up.className = 'inactive';

    let parent_obj : Element = document.getElementById(parent)!.children.item(0)!;
    parent_obj.innerHTML = "";
    parent_obj.append(this.up);
    parent_obj.append(this.left);
    parent_obj.append(this.down);
    parent_obj.append(this.right);

    this.restore_up_binder = this.restore.bind(this, true);
    this.restore_down_binder = this.restore.bind(this, false);

    // Creating a mouse down events for all buttons
    this.down_event = this.go_down.bind(this);
    this.down.addEventListener('mouseup', this.down_event);
    this.right.addEventListener('mouseup', this.down_event);

    this.up_event = this.go_up.bind(this);
    this.up.addEventListener('mouseup', this.up_event);
    this.left.addEventListener('mouseup', this.up_event);

    this.key_down_event = this.key_down.bind(this);
    window.addEventListener('keydown', this.key_down_event);

    this.key_up_event = this.key_up.bind(this);
    window.addEventListener('keyup', this.key_up_event);
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    this.down.removeEventListener('mouseup', this.down_event);
    this.right.removeEventListener('mouseup', this.down_event);
    this.up.removeEventListener('mouseup', this.up_event);
    this.left.removeEventListener('mouseup', this.up_event);
    window.removeEventListener('keydown', this.key_down_event);
    window.removeEventListener('keyup', this.key_up_event);
  }
  /**
   * @brief Animating the vertical scroll towards the next page's section
   */
  public go_down() : void {
    // Returning if we are already going down or a portfolio's article is active
    if(this.going_down || this.portfolio.active()) return;

    // Stoping previous animations
    $('html, body').stop(true, false);
    this.going_up = false;

    // Animate scrolling with constant speed
    this.going_down = true;
    let target : number = this.navigation.next();
    let rate : number = Math.abs($(window).scrollTop()! - target) * 0.5;
    if(rate > 0)
      $('html, body').animate({ scrollTop: target }, rate, this.restore_down_binder);
  }
  /**
   * @brief Animating the vertical scroll towards the previous page's section
   */
  public go_up() : void {
    // Returning if we are already going up or a portfolio's article is active
    if(this.going_up || this.portfolio.active()) return;

    // Stoping previous animations
    $('html, body').stop(true, false);
    this.going_down = false;

    // Animate scrolling with constant speed
    this.going_up = true;
    let target : number = this.navigation.previous();
    let rate : number = Math.abs($(window).scrollTop()! - target) * 0.5;
    if(rate > 0)
      $('html, body').animate({ scrollTop: target }, rate, this.restore_up_binder);
  }
  /**
   * @brief Checking if the top, bottom, left, or right corners are reached
   * 
   * It will also disable the key functions related to them.
   * 
   * @param page_offset Indicates the current window's page vertical offset
   */
  public scroll(page_offset : number) : void {
    if(page_offset == 0 && this.up_active){
      this.up.className = 'inactive';
      this.up_active = false;
      this.left.className = 'inactive';
      this.left_active = false;
    }else if(!this.up_active){
      this.up.className = '';
      this.up_active = true;
      this.left.className = '';
      this.left_active = true;
    }
  }
  /**
   * @brief Animates the scrolling until the target offset is reached
   * 
   * @param target_offset Vertical offset in pixel that should be reached
   */
  public scroll_to(target_offset : number) : void {
    const current : number = $(window).scrollTop()!;
    // Stoping previous animations
    $('html, body').stop(true, false);

    if(current === target_offset) return;
    else if(current > target_offset){
      this.going_down = true;
      this.going_up = false;
    }else{
      this.going_down = false;
      this.going_up = true;
    }

    // Animate scrolling with constant speed
    let rate : number = Math.abs(current - target_offset) * 0.5;
    if(rate > 0)
      $('html, body').animate({ scrollTop: target_offset }, rate, this.restore_up_binder);
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::

  private key_down(event : KeyboardEvent) : void {
    if(event.repeat) return;

    if(event.code === 'ArrowUp'){
      this.up.className += ' down';
      this.go_up();
    }else if(event.code === 'ArrowLeft'){
      this.left.className += ' down';
      this.go_up();
    }else if(event.code === 'ArrowDown'){
      this.down.className += ' down';
      this.go_down();
    }else if(event.code === 'ArrowRight'){
      this.right.className += ' down';
      this.go_down();
    }
  }

  private key_up(event : KeyboardEvent) : void {
    if(event.repeat) return;

    if(event.code === 'ArrowUp')
      this.up.className = this.up_active ? '' : 'inactive';
    else if(event.code === 'ArrowLeft')
      this.left.className = this.left_active ? '' : 'inactive';
    else if(event.code === 'ArrowDown')
      this.down.className = this.down_active ? '' : 'inactive';
    else if(event.code === 'ArrowRight')
      this.right.className = this.right_active ? '' : 'inactive';
  }

  private restore(up : boolean) : void {
    if(up) this.going_up = false;
    else this.going_down = false;
  }
};
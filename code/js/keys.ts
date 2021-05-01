
import $ from 'jquery';
import { navigation } from './navigation';
import { portfolio } from './portfolio';


export class keys {
  private navigation_ : navigation;
  private portfolio_  : portfolio;

  private down_   : HTMLElement;
  private left_   : HTMLElement;
  private right_  : HTMLElement;
  private up_     : HTMLElement;

  private bottom_ : number = 0;

  private down_active_  : boolean = true;
  private left_active_  : boolean = true;
  private right_active_ : boolean = true;
  private up_active_    : boolean = false;

  // Event binders
  private down_event_  : any;
  private up_event_    : any;
  private key_up_event_ : any;
  private key_down_event_ : any;

  /**
   * @brief Creates the keyboard images locatec in the bottom-left corner
   * 
   * @param parent Container HTMLElement
   * @param navigation Navigation class' object
   * @param portfolio Portfolio class' object
   */
  constructor(parent : string, navigation : navigation, portfolio : portfolio){
    this.navigation_ = navigation;
    this.portfolio_ = portfolio;

    // Creting the key buttons
    this.down_  = document.createElement('button');
    this.left_  = document.createElement('button');
    this.right_ = document.createElement('button');
    this.up_    = document.createElement('button');

    // Deactivated appearance CSS
    this.up_.className = 'inactive';

    let parent_obj : Element = document.getElementById(parent)!.children.item(0)!;
    parent_obj.innerHTML = "";
    parent_obj.append(this.up_);
    parent_obj.append(this.left_);
    parent_obj.append(this.down_);
    parent_obj.append(this.right_);

    // Creating a mouse down events for all buttons
    this.down_event_ = this.go_down.bind(this);
    this.down_.addEventListener('mouseup', this.down_event_);
    this.right_.addEventListener('mouseup', this.down_event_);

    this.up_event_ = this.go_up.bind(this);
    this.up_.addEventListener('mouseup', this.up_event_);
    this.left_.addEventListener('mouseup', this.up_event_);

    this.key_down_event_ = this.key_down.bind(this);
    window.addEventListener('keydown', this.key_down_event_);

    this.key_up_event_ = this.key_up.bind(this);
    window.addEventListener('keyup', this.key_up_event_);

    this.resize();
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    this.down_.removeEventListener('mouseup', this.down_event_);
    this.right_.removeEventListener('mouseup', this.down_event_);
    this.up_.removeEventListener('mouseup', this.up_event_);
    this.left_.removeEventListener('mouseup', this.up_event_);
    window.removeEventListener('keydown', this.key_down_event_);
    window.removeEventListener('keyup', this.key_up_event_);
  }
  /**
   * @brief Animating the vertical scroll towards the next page's section
   */
  public go_down() : void {
    // Returning if there is a portfolio's article active
    if(this.portfolio_.active()) return;

    // Stoping previous animations
    $('html, body').stop(true, false);

    // Animate scrolling with constant speed
    let target : number = this.navigation_.next();
    let rate : number = Math.abs($(window).scrollTop()! - target) * 0.5;
    if(rate > 0)
      $('html, body').animate({ scrollTop: target }, rate);
  }
  /**
   * @brief Animating the vertical scroll towards the previous page's section
   */
  public go_up() : void {
    // Returning if there is a portfolio's article active
    if(this.portfolio_.active()) return;

    // Stoping previous animations
    $('html, body').stop(true, false);

    // Animate scrolling with constant speed
    let target : number = this.navigation_.previous();
    let rate : number = Math.abs($(window).scrollTop()! - target) * 0.5;
    if(rate > 0)
      $('html, body').animate({ scrollTop: target }, rate);
  }
  /**
   * @brief Getting the bottom offset position after a resizing
   */
  public resize() : void {
    this.bottom_ = $(document).height()! - $(window).height()!;
  }
  /**
   * @brief Checking if the top, bottom, left, or right corners are reached
   * 
   * It will also disable the key functions related to them.
   * 
   * @param page_offset Indicates the current window's page vertical offset
   */
  public scroll(page_offset : number) : void {
    if(page_offset == 0 && this.up_active_){
      this.up_.className = 'inactive';
      this.up_active_ = false;
      this.left_.className = 'inactive';
      this.left_active_ = false;
    }else if(!this.up_active_){
      this.up_.className = '';
      this.up_active_ = true;
      this.left_.className = '';
      this.left_active_ = true;
    }
    if(page_offset > (this.bottom_ - 50) && this.down_active_){
      this.down_.className = 'inactive';
      this.down_active_ = false;
      this.right_.className = 'inactive';
      this.right_active_ = false;
    }else if(!this.down_active_){
      this.down_.className = '';
      this.down_active_ = true;
      this.right_.className = '';
      this.right_active_ = true;
    }
  }
  /**
   * @brief Animates the scrolling until the target offset is reached
   * 
   * @param target_offset Vertical offset in pixel that should be reached
   */
  public scroll_to(target_offset : number) : void {
    // Returning if there is a portfolio's article active
    if(this.portfolio_.active()) return;

    // Going to the bottom
    if(target_offset < 0) target_offset = this.bottom_;

    const current : number = $(window).scrollTop()!;
    // Stoping previous animations
    $('html, body').stop(true, false);

    if(current === target_offset) return;

    // Animate scrolling with constant speed
    let rate : number = Math.abs(current - target_offset) * 0.5;
    if(rate > 0)
      $('html, body').animate({ scrollTop: target_offset }, rate);
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::

  private key_down(event : KeyboardEvent) : boolean {
    // Remove preventDefaults if an portfolio's article is active
    if(this.portfolio_.active()) return true;

    // No repeated keyboard events
    if(event.repeat) return true;

    if(event.code === 'PageUp'){
      event.preventDefault();
      this.up_.className += ' down';
      this.go_up();
      return true;
    }else if(event.code === 'ArrowLeft'){
      this.left_.className += ' down';
      this.go_up();
      return true;
    }else if(event.code === 'PageDown'){
      event.preventDefault();
      this.down_.className += ' down';
      this.go_down();
      return true;
    }else if(event.code === 'ArrowRight'){
      this.right_.className += ' down';
      this.go_down();
      return true;
    }else if(event.code === 'End'){
      event.preventDefault();
      this.scroll_to(-1);
      return true;
    }else if(event.code === 'Home'){
      event.preventDefault();
      this.scroll_to(0);
      return true;
    }else if(event.code === 'ArrowDown' || event.code === 'ArrowUp')
      $('html, body').stop(true, false);

    return true;
  }

  private key_up(event : KeyboardEvent) : void {
    if(event.repeat) return;

    if(event.code === 'PageUp')
      this.up_.className = this.up_active_ ? '' : 'inactive';
    else if(event.code === 'ArrowLeft')
      this.left_.className = this.left_active_ ? '' : 'inactive';
    else if(event.code === 'PageDown')
      this.down_.className = this.down_active_ ? '' : 'inactive';
    else if(event.code === 'ArrowRight')
      this.right_.className = this.right_active_ ? '' : 'inactive';
  }
};
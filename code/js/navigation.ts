
import $ from 'jquery';
import { section } from './section';


export class navigation {
  // Main navigation objects
  private nav_ : HTMLElement;
  private links_ : Array<section>;
  private active_link_ : number = 0;

  private timer_ : number;

  // Event binder
  private timeout_event_   : any;
  private mouseover_event_ : any;
  private mouseout_event_  : any;

  /**
   * @brief Creates the main navigation menu (on the right side) and animates the circle's
   */
  constructor(){
    this.nav_ = document.getElementById('navigation')!;

    const nav_childs = document.getElementsByTagName('nav').item(0)?.getElementsByTagName('a');

    // Getting the navigation anchors from the html
    this.links_ = [
      new section('universe'),
      new section('portfolio'),
      new section('projects'),
      new section('about_me'),
      new section('knowledge'),
      new section('studies'),
      new section('contact_me'),
    ];

    // Creating a canvas for each anchor in the nvaigation
    for(var i : number = 0; i < this.links_.length; ++i)
      this.links_[i].set_link(nav_childs!.item(i)!);

    this.hide();

    // Creating a timeout event handler
    this.timeout_event_ = this.hide.bind(this);
    this.timer_ = setTimeout(this.timeout_event_, 1000);

    // Creating a mouseover event handler
    this.mouseover_event_ = this.show.bind(this);
    this.nav_.addEventListener('mouseover', this.mouseover_event_);

    // Creating a mouseout event handler
    this.mouseout_event_ = this.counter.bind(this);
    this.nav_.addEventListener('mouseout', this.mouseout_event_);
  }
  /**
   * @brief Indicates which navigation's menu element is active (visible)
   * 
   * @returns Array index of the active link (visible)
   */
  public active() : number {
    return this.active_link_;
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    clearTimeout(this.timer_);
    this.nav_.removeEventListener('mouseover', this.mouseover_event_);
    this.nav_.removeEventListener('mouseout', this.mouseout_event_);
  }
  /**
   * @brief Starts the timer to hide the navigation menu
   */
  public counter() : void {
    this.timer_ = setTimeout(this.timeout_event_, 1000);
  }
  /**
   * @brief Hides the navigation menu
   */
  public hide() : void {
    $('nav li > a > b').hide(500);
  }
  /**
   * @brief Getting the scroll's top offset of the next page section
   * 
   * @returns Scroll's top offset of the next section (of the visible section)
   */
  public next() : number {
    let next_link : number = this.active_link_ + 1;
    if(next_link >= this.links_.length)
      return this.links_[this.active_link_].top();
    
    return this.links_[next_link].top();
  }
  /**
   * @brief Getting the scroll's top offset of the previous page section
   * 
   * @returns Scroll's top offset of the previous section (of the visible section)
   */
  public previous() : number {
    let prev_link : number = this.active_link_ - 1;
    if(prev_link < 0)
      return 0;
    
    return this.links_[prev_link].top();
  }
  /**
   * @brief Changing the canvas size and the linked object's start and end position
   * 
   * @param font_size Current page's main font size
   */
  public resize(font_size : number) : void {
    // Gettting the start and ending offset for all html sections
    for(var i in this.links_)
      this.links_[i].resize(font_size);
  }
  /**
   * @brief Changing the planet's shadow depending on the window's page vertical offset
   * 
   * @param page_offset Indicates the current window's page vertical offset
   */
  public scroll(page_offset : number) : void {
    // Moving the shadow for the link's canvas
    for(var i in this.links_){
      this.links_[i].scroll(page_offset);
      if(page_offset >= (this.links_[i].top() - 50) && page_offset < this.links_[i].bottom())
        this.active_link_ = parseInt(i);
    }
  }
  /**
   * @brief Shows the navigation menu
   */
  public show() : void {
    clearTimeout(this.timer_);
    $('nav li > a > b').show(500);
  }
}
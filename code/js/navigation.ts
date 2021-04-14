
import $ from 'jquery';
import { section } from './section';

export class navigation {
  // Main navigation objects
  private nav : HTMLElement;
  private links : Array<section>;
  private active_link : number = 0;

  private timer : number;

  // Event binder
  private timeout_event   : any;
  private mouseover_event : any;
  private mouseout_event  : any;

  constructor(){
    this.nav = document.getElementById('navigation')!;

    const nav_childs = document.getElementsByTagName('nav').item(0)?.getElementsByTagName('a');

    // Getting the navigation anchors from the html
    this.links = [
      new section('universe'),
      new section('portfolio'),
      new section('projects'),
      new section('about_me'),
      new section('knowledge'),
      new section('studies'),
      new section('contact_me'),
    ];

    // Creating a canvas for each anchor in the nvaigation
    for(var i : number = 0; i < this.links.length; ++i)
      this.links[i].set_link(nav_childs!.item(i)!);

    this.hide();

    // Creating a timeout event handler
    this.timeout_event = this.hide.bind(this);
    this.timer = setTimeout(this.timeout_event, 1000);

    // Creating a mouseover event handler
    this.mouseover_event = this.show.bind(this);
    this.nav.addEventListener('mouseover', this.mouseover_event);

    // Creating a mouseout event handler
    this.mouseout_event = this.counter.bind(this);
    this.nav.addEventListener('mouseout', this.mouseout_event);
  }
  public active() : number {
    return this.active_link;
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    clearTimeout(this.timer);
    this.nav.removeEventListener('mouseover', this.mouseover_event);
    this.nav.removeEventListener('mouseout', this.mouseout_event);
  }
  /**
   * @brief Starts the timer to hide the navigation menu
   */
  public counter() : void {
    this.timer = setTimeout(this.timeout_event, 1000);
  }
  /**
   * @brief Hides the navigation menu
   */
  public hide() : void {
    $('nav li > a > b').hide(500);
  }
  /**
   * @brief Changing the canvas size and the linked object's start and end position
   * 
   * @param font_size Current page's main font size
   */
  public resize(font_size : number) : void {
    // Gettting the start and ending offset for all html sections
    for(var i in this.links)
      this.links[i].resize(font_size);
  }
  /**
   * @brief Changing the planet's shadow depending on the window's page vertical offset
   * 
   * @param page_offset Indicates the current window's page vertical offset
   */
  public scroll(page_offset : number) : void {
    // Moving the shadow for the link's canvas
    for(var i in this.links){
      this.links[i].scroll(page_offset);
      if(page_offset >= this.links[i].top() && page_offset < this.links[i].bottom())
        this.active_link = parseInt(i);
    }
  }
  /**
   * @brief Shows the navigation menu
   */
  public show() : void {
    clearTimeout(this.timer);
    $('nav li > a > b').show(500);
  }
}
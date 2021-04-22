
import $ from 'jquery';
import { keys } from './keys';

export class section {
  private object_    : HTMLElement;
  private link_      : HTMLElement | null;
  private link_text_ : HTMLElement;
  private canvas_    : HTMLCanvasElement;
  private context_   : CanvasRenderingContext2D;

  private static keys_ : keys | null = null;

  // Canvas properties
  private diameter_ : number = 0;
  private radius_   : number = 0;

  // Linked object's start and end position relative to the document
  private start_ : number = 0;
  private end_   : number = 0;
  private size_  : number = 0;

  // Indicates if the linked object is currently visible on screen
  private blacked_ : boolean = false;
  private whited_  : boolean = false;

  private mouse_binder_ : any;


  constructor(object : string){
    this.link_ = null;
    this.link_text_ = document.createElement('b');
    this.object_ = document.getElementById(object)!;
    this.canvas_ = document.createElement('canvas');
    this.context_ = this.canvas_.getContext('2d')!;
    this.mouse_binder_ = this.mouse_up.bind(this);
  }
  /**
   * @brief Getting the bottom offset of this section
   * 
   * @returns Bottom offset in pixels relative to the document
   */
  public bottom() : number {
    return this.end_;
  }
  /**
   * @brief Getting the height of this section
   * 
   * @returns The heigh in pixels including padding, border, and margin
   */
  public height() : number {
    return this.size_;
  }
  /**
   * @brief Changing the canvas size and the linked object's start and end position
   * 
   * @param font_size Current page's main font size
   */
  public resize(font_size : number) : void {
    this.size_ = $(this.object_).outerHeight()!;
    this.start_ = $(this.object_).offset()!.top;
    this.end_ = this.start_ + this.size_;
    this.canvas_.width = this.canvas_.height = this.diameter_ = font_size * 1.25;
    this.radius_ = this.diameter_ * 0.5;

    // Triggering a redraw becuase canvas' resizing cleared all the content
    this.blacked_ = false;
    this.whited_ = false;
    this.scroll(window.pageYOffset);
  }
  /**
   * @brief Changing the planet's shadow depending on the window's page vertical offset
   * 
   * @param page_offset Indicates the current window's page vertical offset
   */
  public scroll(page_offset : number) : void {
    if(page_offset > this.end_){
      if(this.blacked_) return;
      // Painting it black
      this.context_.clearRect(0, 0, this.diameter_, this.diameter_);
      this.context_.fillStyle = 'rgba(0,0,0,0.75)';
      this.context_.fillRect(0, 0, this.diameter_, this.diameter_);
      this.blacked_ = true;
      this.whited_ = false;
    }else if(page_offset < this.start_){
      if(this.whited_) return;
      // Cleaning the canvas so it's transparent
      this.context_.clearRect(0, 0, this.diameter_, this.diameter_);
      this.whited_ = true;
      this.blacked_ = false;
    }else if(page_offset >= this.start_ && page_offset <= this.end_){
      this.blacked_ = this.whited_ = false;

      const y : number = ((page_offset - this.start_) / this.size_ - 0.1) * this.diameter_ * 1.3;

      this.context_.clearRect(0, 0, this.diameter_, this.diameter_);
      this.context_.beginPath();
      this.context_.moveTo(0, 0);
      this.context_.lineTo(0, this.radius_);
      this.context_.bezierCurveTo(0, y, this.diameter_, y, this.diameter_, this.radius_);
      this.context_.lineTo(this.diameter_, 0);
      this.context_.closePath();
      this.context_.fillStyle = 'rgba(0,0,0,0.75)';
      this.context_.fill();
    }
  }
  /**
   * @brief Setting the keys object for scrolling
   * 
   * @param keys keys object
   */
  public static set_keys(keys : keys) : void {
    this.keys_ = keys;
  }
  /**
   * @brief Creating a canvas into the HTML anchor element
   * 
   * Such canvas will be used to display a planet for each navigation's link and create a
   * dynamic shadow that will move depending on the page's scroll position
   * 
   * @param link HTML anchor element to which this objects belongs
   */
  public set_link(link : HTMLAnchorElement) : void {
    // Removes old event listeners
    if(this.link_ !== null) this.link_.removeEventListener('mouseup', this.mouse_binder_);

    this.link_ = link;
    this.link_text_.textContent = link.textContent;
    link.textContent = '';
    link.appendChild(this.link_text_);
    link.appendChild(this.canvas_);
    link.addEventListener('mouseup', this.mouse_binder_);
  }
  /**
   * @brief Getting this object top offset
   *  
   * @returns Top offset in pixels relative to the document
   */
  public top() : number {
    return this.start_;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * @brief MOuse up event listener
   */
  private mouse_up(event : MouseEvent) : boolean {
    if(section.keys_ === null || event.button == 1) return true;
    event.preventDefault();

    section.keys_.scroll_to(this.start_);
    return false;
  }
}
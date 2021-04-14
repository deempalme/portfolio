
import $ from 'jquery';

export class section {
  private object   : HTMLElement;
  private link     : HTMLElement;
  private canvas   : HTMLCanvasElement;
  private context  : CanvasRenderingContext2D;

  // Canvas properties
  private diameter : number = 0;
  private radius   : number = 0;

  // Linked object's start and end position relative to the document
  private start : number = 0;
  private end   : number = 0;
  private size  : number = 0;

  // Indicates if the linked object is currently visible on screen
  private blacked : boolean = false;
  private whited  : boolean = false;

  constructor(object : string){
    this.object = document.getElementById(object)!;
    this.link = document.createElement('b');
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
  }
  public bottom() : number {
    return this.end;
  }
  public height() : number {
    return this.size;
  }
  /**
   * @brief Changing the canvas size and the linked object's start and end position
   * 
   * @param font_size Current page's main font size
   */
  public resize(font_size : number) : void {
    this.size = $(this.object).height()!;
    this.start = $(this.object).offset()!.top;
    this.end = this.start + this.size;
    this.canvas.width = this.canvas.height = this.diameter = font_size * 1.25;
    this.radius = this.diameter * 0.5;

    // Triggering a redraw becuase canvas' resizing cleared all the content
    this.blacked = false;
    this.whited = false;
    this.scroll(window.pageYOffset);
  }
  /**
   * @brief Changing the planet's shadow depending on the window's page vertical offset
   * 
   * @param page_offset Indicates the current window's page vertical offset
   */
  public scroll(page_offset : number) : void {
    if(page_offset > this.end){
      if(this.blacked) return;
      // Painting it black
      this.context.clearRect(0, 0, this.diameter, this.diameter);
      this.context.fillStyle = 'rgba(0,0,0,0.75)';
      this.context.fillRect(0, 0, this.diameter, this.diameter);
      this.blacked = true;
      this.whited = false;
    }else if(page_offset < this.start){
      if(this.whited) return;
      // Cleaning the canvas so it's transparent
      this.context.clearRect(0, 0, this.diameter, this.diameter);
      this.whited = true;
      this.blacked = false;
    }else if(page_offset >= this.start && page_offset <= this.end){
      this.blacked = this.whited = false;

      const y : number = ((page_offset - this.start) / this.size - 0.1) * this.diameter * 1.3;

      this.context.clearRect(0, 0, this.diameter, this.diameter);
      this.context.beginPath();
      this.context.moveTo(0, 0);
      this.context.lineTo(0, this.radius);
      this.context.bezierCurveTo(0, y, this.diameter, y, this.diameter, this.radius);
      this.context.lineTo(this.diameter, 0);
      this.context.closePath();
      this.context.fillStyle = 'rgba(0,0,0,0.75)';
      this.context.fill();
    }
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
    this.link.textContent = link.textContent;
    link.textContent = '';
    link.appendChild(this.link);
    link.appendChild(this.canvas);
  }
  public top() : number {
    return this.start;
  }
}


export class keys {
  private parent : Element;
  private down   : HTMLElement;
  private left   : HTMLElement;
  private right  : HTMLElement;
  private up     : HTMLElement;

  private down_active  : boolean = true;
  private left_active  : boolean = true;
  private right_active : boolean = true;
  private up_active    : boolean = false;

  private disable : boolean = false;

  // Event binders
  private down_event  : any;
  private left_event  : any;
  private right_event : any;
  private up_event    : any;  

  constructor(parent : string){
    // Creting the key buttons
    this.down  = document.createElement('button');
    this.left  = document.createElement('button');
    this.right = document.createElement('button');
    this.up    = document.createElement('button');

    // Deactivated appearance CSS
    this.up.className = 'inactive';

    this.parent = document.getElementById(parent)!.children.item(0)!;
    this.parent.innerHTML = "";
    this.parent.append(this.up);
    this.parent.append(this.left);
    this.parent.append(this.down);
    this.parent.append(this.right);

    // Creating a mouse down events for all buttons
    this.down_event = this.go_down.bind(this);
    window.addEventListener('mouseup', this.down_event);    

    this.left_event = this.go_left.bind(this);
    window.addEventListener('mouseup', this.left_event);    

    this.right_event = this.go_right.bind(this);
    window.addEventListener('mouseup', this.right_event);    

    this.up_event = this.go_up.bind(this);
    window.addEventListener('mouseup', this.up_event);    
  }
  /**
   * @brief Destroying all event listeners
   */
   public destroy() : void {
    window.removeEventListener('mouseup', this.down_event);    
    window.removeEventListener('mouseup', this.left_event);    
    window.removeEventListener('mouseup', this.right_event);    
    window.removeEventListener('mouseup', this.up_event);    
  }
  public go_down() : void {
    
  }
  public go_left() : void {
    
  }
  public go_right() : void {
    
  }
  public go_up() : void {
    
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
    }else if(!this.up_active){
      this.up.className = '';
      this.up_active = true;
    }
  }
};
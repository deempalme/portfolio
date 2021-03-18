

class universe
{
  private width  : number = 0;
  private height : number = 0;

  private main_object : HTMLElement | null;

  private resize_event : any;
  private unload_event : any;

  constructor(){
    this.main_object = document.getElementById('universe');

    // Creating a window resize event handler
    this.resize_event = this.resize.bind(this);
    window.addEventListener('resize', this.resize_event);

    // Creating a window unload event handler
    this.unload_event = this.destroy.bind(this);
    window.addEventListener('unload', this.unload_event);

    this.resize();
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy(){
    window.removeEventListener('resize', this.resize_event);
    window.removeEventListener('unload', this.unload_event);
  }
  /**
   * @brief Resizing event handler
   */
  public resize(){
    if(this.main_object){
      this.width = window.innerWidth;
      this.height = this.main_object.clientWidth;
    }
  }
}

var universe_object = null;

window.onload = function(){
  universe_object = new universe;
}
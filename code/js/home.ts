
import { keys } from './keys';
import { navigation } from './navigation';
import { universe } from './universe';

class home
{
  private width  : number = 0;
  private height : number = 0;

  private font_size : number = 16;

  // Main navigation objects
  private nav : navigation;
  // Navigation keyboard
  private key : keys;

  private universe : universe;
  
  // Event binders
  private resize_event : any;
  private scroll_event : any;
  private unload_event : any;

  constructor(){
    this.nav = new navigation();
    this.key = new keys('keys');
    this.universe = new universe('universe');

    // Creating a window resize event handler
    this.resize_event = this.resize.bind(this);
    window.addEventListener('resize', this.resize_event);

    // Creating a window unload event handler
    this.scroll_event = this.scroll.bind(this);
    window.addEventListener('scroll', this.scroll_event);

    // Creating a window unload event handler
    this.unload_event = this.destroy.bind(this);
    window.addEventListener('unload', this.unload_event);

    // Forcing an initial sizes' calculation
    this.resize();
    // Forcing the activation of scroll dependant actions
    this.scroll();
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    window.removeEventListener('resize', this.resize_event);
    window.removeEventListener('scroll', this.scroll_event);
    window.removeEventListener('unload', this.unload_event);

    this.universe.destroy();
  }
  /**
   * @brief Resizing event handler
   */
  public resize() : void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Gettting the start and ending offset for all html sections
    this.nav.resize(this.font_size);
    this.universe.resize();
  }
  /**
   * @brief Scroll event handler
   */
  public scroll() : void {
    const page_offset : number = window.pageYOffset;

    // Moving the shadow for the link's canvas
    this.nav.scroll(page_offset);
    // Activating/deactivating frame animation of the universe
    if(this.nav.active() == 0)
      this.universe.activate();
    else
      this.universe.deactivate();

    // Checking if a key should be inactive
    this.key.scroll(page_offset);
    this.universe.scroll(page_offset);
  }
};

var home_object : home | null = null;

window.onload = function(){
  home_object = new home;
}
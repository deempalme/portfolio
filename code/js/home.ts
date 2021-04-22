
import { about_me } from './about_me';
import { keys } from './keys';
import { loader } from './loader';
import { navigation } from './navigation';
import { portfolio } from './portfolio';
import { section } from './section';
import { universe } from './universe';

class home
{
  private html : HTMLElement;
  private width  : number = 0;
  private height : number = 0;
  private scroll_width : number = 0;

  private font_size : number = 16;

  // Main navigation objects
  private nav : navigation;
  // Navigation keyboard
  private key : keys;

  private universe : universe;
  private portfolio : portfolio;
  private about_me : about_me;
  
  // Event binders
  private resize_event : any;
  private scroll_event : any;
  private unload_event : any;
  private resize_binder : any;
  private resize_timer : number = 0;

  constructor(){
    this.html = document.documentElement;

    // Add temporary box to wrapper
    let scrollbox = document.createElement('div');
    // Make box scrollable
    scrollbox.style.overflow = 'scroll';
    // Append box to document
    document.body.appendChild(scrollbox);
    // Measure inner width of box
    this.scroll_width = scrollbox.offsetWidth - scrollbox.clientWidth;
    // Remove box
    document.body.removeChild(scrollbox);

    // Setting the loader display
    let loader_element : HTMLElement = document.getElementById('loader')!;
    loader.set_loader(loader_element, loader_element.children.item(0) as HTMLElement);

    this.nav = new navigation();
    this.universe = new universe('universe');
    this.portfolio = new portfolio('portfolio');
    this.about_me = new about_me('about_me');
    this.key = new keys('keys', this.nav, this.portfolio);

    section.set_keys(this.key);

    this.about_me.add_image('/resources/images/right_side.jpg');
    this.about_me.add_image('/resources/images/plane.jpg');
    this.about_me.add_image('/resources/images/pem_module.jpg');
    this.about_me.add_image('/resources/images/fixture.jpg');
    this.about_me.add_image('/resources/images/kfs.jpg');
    this.about_me.add_image('/resources/images/mover.jpg');

    // Creating a window resize event handler
    this.resize_event = this.resize.bind(this);
    this.resize_binder = this.resize_call.bind(this);
    window.addEventListener('resize', this.resize_binder);

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
    this.html.style.width = (this.width - this.scroll_width) + 'px';

    // Gettting the start and ending offset for all html sections
    this.nav.resize(this.font_size);
    this.portfolio.resize(this.width - this.scroll_width);
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
  /**
   * @brief Getting the width of the scrollbar
   * 
   * @returns Width in pixels of the scrollbar
   */
  public scroll_size() : number {
    return this.scroll_width;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::

  private resize_call() : void {
    // Returning if the window size is the same
    if(this.width === window.innerWidth && this.height === window.innerHeight) return;

    clearTimeout(this.resize_timer);
    this.resize_timer = setTimeout(this.resize_event, 100);
  }
};

var home_object : home | null = null;

window.onload = function(){
  home_object = new home;
}
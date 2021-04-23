
import { about_me } from './about_me';
import { contact_me } from './contact_me';
import { keys } from './keys';
import { loader } from './loader';
import { navigation } from './navigation';
import { portfolio } from './portfolio';
import { section } from './section';
import { universe } from './universe';

class home
{
  private html_ : HTMLElement;
  private width_  : number = 0;
  private height_ : number = 0;
  private scroll_width_ : number = 0;

  private font_size_ : number = 16;

  // Main navigation objects
  private nav_ : navigation;
  // Navigation keyboard
  private key_ : keys;
  // Modules
  private universe_ : universe;
  private portfolio_ : portfolio;
  private about_me_ : about_me;
  private contact_me_ : contact_me;
  
  // Event binders
  private resize_event_ : any;
  private scroll_event_ : any;
  private unload_event_ : any;
  private resize_binder_ : any;
  private resize_timer_ : number = 0;

  constructor(){
    this.html_ = document.documentElement;

    // Add temporary box to wrapper
    let scrollbox = document.createElement('div');
    // Make box scrollable
    scrollbox.style.overflow = 'scroll';
    // Append box to document
    document.body.appendChild(scrollbox);
    // Measure inner width of box
    this.scroll_width_ = scrollbox.offsetWidth - scrollbox.clientWidth;
    // Remove box
    document.body.removeChild(scrollbox);

    // Setting the loader display
    let loader_element : HTMLElement = document.getElementById('loader')!;
    loader.set_loader(loader_element, loader_element.children.item(0) as HTMLElement);

    this.nav_ = new navigation();
    this.contact_me_ = new contact_me('contact_me');
    this.universe_ = new universe('universe', this.contact_me_);
    this.portfolio_ = new portfolio('portfolio');
    this.about_me_ = new about_me('about_me');
    this.key_ = new keys('keys', this.nav_, this.portfolio_);

    section.set_keys(this.key_);

    this.about_me_.add_image('/resources/images/right_side.jpg');
    this.about_me_.add_image('/resources/images/plane.jpg');
    this.about_me_.add_image('/resources/images/pem_module.jpg');
    this.about_me_.add_image('/resources/images/fixture.jpg');
    this.about_me_.add_image('/resources/images/kfs.jpg');
    this.about_me_.add_image('/resources/images/mover.jpg');

    // Creating a window resize event handler
    this.resize_event_ = this.resize.bind(this);
    this.resize_binder_ = this.resize_call.bind(this);
    window.addEventListener('resize', this.resize_binder_);

    // Creating a window unload event handler
    this.scroll_event_ = this.scroll.bind(this);
    window.addEventListener('scroll', this.scroll_event_);

    // Creating a window unload event handler
    this.unload_event_ = this.destroy.bind(this);
    window.addEventListener('unload', this.unload_event_);

    // Forcing an initial sizes' calculation
    this.resize();
    // Forcing the activation of scroll dependant actions
    this.scroll();
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    window.removeEventListener('resize', this.resize_event_);
    window.removeEventListener('scroll', this.scroll_event_);
    window.removeEventListener('unload', this.unload_event_);

    this.universe_.destroy();
  }
  /**
   * @brief Resizing event handler
   */
  public resize() : void {
    this.width_ = window.innerWidth;
    this.height_ = window.innerHeight;
    this.html_.style.width = (this.width_ - this.scroll_width_) + 'px';

    // Gettting the start and ending offset for all html sections
    this.nav_.resize(this.font_size_);
    this.portfolio_.resize(this.width_ - this.scroll_width_);
    this.universe_.resize();
    this.key_.resize();
  }
  /**
   * @brief Scroll event handler
   */
  public scroll() : void {
    const page_offset : number = window.pageYOffset;

    // Moving the shadow for the link's canvas
    this.nav_.scroll(page_offset);
    // Activating/deactivating frame animation of the universe
    if(this.nav_.active() == 0)
      this.universe_.activate();
    else
      this.universe_.deactivate();

    // Checking if a key should be inactive
    this.key_.scroll(page_offset);
    this.universe_.scroll(page_offset);
  }
  /**
   * @brief Getting the width of the scrollbar
   * 
   * @returns Width in pixels of the scrollbar
   */
  public scroll_size() : number {
    return this.scroll_width_;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::

  private resize_call() : void {
    // Returning if the window size is the same
    if(this.width_ === window.innerWidth && this.height_ === window.innerHeight) return;

    clearTimeout(this.resize_timer_);
    this.resize_timer_ = setTimeout(this.resize_event_, 100);
  }
};

var home_object : home | null = null;

window.onload = function(){
  home_object = new home;
}
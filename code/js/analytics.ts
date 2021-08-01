
declare const t45_husz : string;

import $ from 'jquery';


export class analytics
{
  private id_ : string = '';
  private token_ : string = '';
  private color_depth_ : number = 0;
  private inner_height_ : number = 0;
  private inner_width_  : number = 0;
  private height_ : number = 0;
  private width_  : number = 0;
  
  // Event binders
  private resize_binder_ : any;
  private resize_event_  : any;
  private resize_timer_  : number = 0;
  private unload_event_  : any;
  private update_binder_ : any;
  private update_timer_  : number = 0;

  constructor(){
    // Verifying if token exist
    if(!this.verify_token()) return;

    // Forcing an initial sizes' calculation
    this.resize();

    this.new_user();

    this.geolocation_check();

    // Updating user time_out every 2 seconds
    this.update_binder_ = this.update_user.bind(this);
    this.update_timer_ = setInterval(this.update_binder_, 2000);
    
    // Creating a window unload event handler
    this.unload_event_ = this.destroy.bind(this);
    window.addEventListener('unload', this.unload_event_);

    // Creating a window resize event handler
    this.resize_event_ = this.resize.bind(this);
    this.resize_binder_ = this.resize_call.bind(this);
    window.addEventListener('resize', this.resize_binder_);
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    this.update_user();
    clearInterval(this.update_timer_);
    window.removeEventListener('resize', this.resize_event_);
    window.removeEventListener('unload', this.unload_event_);
  }
  /**
   * @brief Resizing event handler
   */
  public resize() : void {
    this.color_depth_ = window.screen.colorDepth;
    this.inner_height_ = window.innerHeight;
    this.inner_width_ = window.innerWidth;
    this.height_ = window.screen.height;
    this.width_ = window.screen.width;

    $.post('/analytics', {
      update_screen : true,
      user_id : this.id_,
      token : this.token_,
      height : this.height_,
      width : this.width_,
      inner_height : this.inner_height_,
      inner_width : this.inner_width_,
      color_depth : this.color_depth_
    }, null, 'text')
      //.done(result => console.log('resize', result))
      .fail(error => console.log('error', error));
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * @brief Obtaining the IP geolocation information
   * 
   * @param ip IP address to look up
   */
  private geolocate(found : boolean, ip : string) : void {
    if(found) return;

    $.get('https://api.geoapify.com/v1/ipinfo?&ip=' + ip 
          + '&apiKey=4775308688d944d2b7893bb9e9be14cf', {}, null, 'json')
      .done(result => this.geolocation_save(result))
      .fail(error => console.log('error', error));
  }
  /**
   * @brief Check if IP is already registered
   */
  private geolocation_check() : void {
    $.post('/analytics', {
      check_geolocation : true,
      user_id : this.id_,
      token : this.token_
    }, null, 'json')
      .done(data => this.geolocate(data.result.found, data.result.ip))
      .fail(error => console.log('error', error));
  }
  /**
   * @brief Saves the Geolocation data of an IP
   * 
   * @param data Geolocation data
   */
  private geolocation_save(data : any) : void {
    const country   : string = data.country.name;
    const state     : string = data.state.name;
    const city      : string = data.city.name;
    const postcode  : string = data.postcode;
    const continent : string = data.continent.name;
    const latitude  : number = data.location.latitude;
    const longitude : number = data.location.longitude;

    $.post('/analytics', {
      new_geolocation : true,
      user_id : this.id_,
      token : this.token_,
      country : country,
      state : state,
      city : city,
      postcode : postcode,
      continent : continent,
      latitude : latitude,
      longitude : longitude
    }, null, 'json')
      //.done(result => console.log('save', result))
      .fail(error => console.log('error', error));
  }
  /**
   * @brief Inserting new user
   */
  private new_user() : void {
    const time : number = Date.now();
    const language : string = navigator.language;
    const timezone : string = Intl.DateTimeFormat().resolvedOptions().timeZone;

    $.post('/analytics', {
      new_user : true,
      user_id : this.id_,
      token : this.token_,
      time_in : time,
      timezone : timezone,
      language : language
    }, null, 'text')
      //.done(result => console.log('new_user', result))
      .fail(error => console.log('error', error));
  }
  /**
   * @brief Updates the time_out value from a user
   */
  private update_user() : void {
    $.post('/analytics', {
      update_user : true,
      user_id : this.id_,
      token : this.token_,
      time_out : Date.now()
    }, null, 'text')
      //.done(result => console.log('update_user', result))
      .fail(error => console.log('error', error));
  }
  /**
   * @brief Verifying if the token exist and obtaining the id
   * 
   * @return `false` if token was not found
   */
  private verify_token() : boolean {
    var token : string = t45_husz;
    const divider : number = 6;
    const parts : number = parseInt(t45_husz.substr(-1, 1));

    for(var i : number = 0; i < parts; ++i){
      this.id_ += token.substr(0, divider);
      this.token_ += token.substr(divider, divider);
      token = token.substr(divider * 2);
    }
    this.token_ += token.substr(0, token.length - 1);

    return true;
  }
  /**
   * @brief Makes sure only one call to resize is made each 500 milliseconds
   */
  private resize_call() : void {
    // Returning if the window size is the same
    if(this.inner_width_ === window.innerWidth 
    && this.inner_height_ === window.innerHeight) return;

    clearTimeout(this.resize_timer_);
    this.resize_timer_ = setTimeout(this.resize_event_, 500);
  }
};

var analytics_object : analytics | null = null;

window.onload = function(){
  analytics_object = new analytics;
}
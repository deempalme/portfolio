
import $ from 'jquery';


export class loader
{
  private static counter_       : number = 0;
  private static maximum_count_ : number = 0;

  private static hidden_ : boolean = false;
  private static loader_ : HTMLElement | null = null;
  private static loader_text_ : HTMLElement | null = null;
  private static callback_ : any = null;


  constructor(){}
  /**
   * @brief Increments the counter
   * 
   * It will also hide the HTMLElement established in set_loader() and execute
   * the callback function set in set_onload_callback() when is fully loaded,
   * and update the percentage value inside percentage_string's HTMLElement.
   * 
   * @returns `true` if the counter reached 100%
   */
  public static count() : boolean {
    if(++this.counter_ >= this.maximum_count_){
      this.hide();
      this.counter_ = 0;
      this.maximum_count_ = 0;
      this.callback_();
      return true;
    }
    this.update();
    return false;
  }
  /**
   * @brief Loads binary data asynchronously
   * 
   * It will call the `onload` function after the load is finished
   * 
   * @param data_url URL of the data that will be loaded
   * @param onload Callback function that will be executed when the load has finished
   */
  public static load_binary(data_url : string, onload : any) : void {
    ++this.maximum_count_;
    if(this.hidden_) this.show();

    var o_req = new XMLHttpRequest();
    o_req.open("GET", data_url, true);
    o_req.responseType = "arraybuffer";

    o_req.onload = function () {
      loader.count();
      onload(o_req.response);
    };

    o_req.onerror = function(){
      loader.count();
      console.warn('Binary failed to load:', data_url);
    }

    o_req.send(null);
  }
  /**
   * @brief Loads string data asynchronously
   * 
   * It will call the `onload` function after the load is finished
   * 
   * @param data_url URL of the data that will be loaded
   * @param onload Callback function that will be executed when the load has finished
   */
  public static load_data(data_url : string, onload : any) : void {
    ++this.maximum_count_;
    if(this.hidden_) this.show();

    $.ajax({
      url: data_url,
      beforeSend: function(xhr){ xhr.overrideMimeType( "text/plain; charset=utf-8" ); },
      dataType: 'text',
      error: function(ts){
        loader.count();
        console.warn("Data not loaded", ts.responseText, data_url);
      }
    }).done(function(data){
      loader.count();
      onload(data);
    });
  }
  /**
   * @brief Loads an image asynchronously
   * 
   * It will call the `onload` function after the load is finished
   * 
   * @param image_url URL of the image to load
   * @param image HTMLImageElement where the image should be loaded
   * @param onload Callback function that will be executed when the load has finished
   */
  public static load_image(image_url : string, image : HTMLImageElement,
                           onload : any) : void {
    ++this.maximum_count_;
    if(this.hidden_) this.show();

    // Loading error
    image.onerror = function(){
      loader.count();
      console.warn('Image failed to load:', image_url);
    }
    // Loading finished
    image.onload = function(){
      loader.count();
      onload();
    };
    image.src = image_url;
  }
  /**
   * @brief Loads JSON data asynchronously
   * 
   * It will call the `onload` function after the load is finished
   * 
   * @param json_url URL of the JSON file to load
   * @param data Data to be sent to the server
   * @param onload Callback function that will be executed when the load has finished
   */
  public static load_json(json_url : string, data : object | string | Array<any>,
                          onload : any) : void {
    ++this.maximum_count_;
    if(this.hidden_) this.show();

    $.ajax({
      url: json_url,
      data: data,
      method: 'POST',
      dataType: 'json',
      beforeSend: function(xhr){ xhr.overrideMimeType( "text/plain; charset=utf-8" ); },
      error: function(ts, ee){
        loader.count();
        console.warn('Json not loaded', ts.responseText, ee, json_url);
      }
    }).done(function(data){
      loader.count();
      onload(data);
    });
  }
  /**
   * @brief Getting the number of loaded elements
   * 
   * @returns Number of already loaded elements
   */
  public static loaded() : number {
    return this.counter_;
  }
  /**
   * @brief Getting the number of pending elements (data or images)
   * 
   * @returns Number of pending elements
   */
  public static pending() : number {
    return this.maximum_count_ - this.counter_;
  }
  /**
   * @brief Getting the total loaded percentage
   * 
   * @returns Total loaded percentage (rounded integer)
   */
  public static percentage() : number {
    return Math.floor(this.counter_ / this.maximum_count_ * 100);
  }
  /**
   * @brief Shows the loader HTMLElement in case there are pending elements
   * 
   * @returns `true` if there are pending elements to load, `false` otherwise
   */
  public static reset() : boolean {
    if(this.counter_ < this.maximum_count_){
      this.show();
      return true;
    }
    this.hide();
    return false;
  }
  /**
   * @brief Sets an HTMLElement that represents the loading indicator
   * 
   * This HTMLElement will be hidden when all elements selected using load_data()
   * and load_image() are fully loaded
   * 
   * @param object HTMLElement that represents the loading indicator
   * @param percentage_string HTMLElement where the percentage number will be writen
   */
  public static set_loader(object : HTMLElement, percentage_string : HTMLElement | null) : void {
    this.loader_ = object;
    this.loader_text_ = percentage_string;
  }
  /**
   * @brief Setting the function that will be called in the onload event (all data is loaded)
   * 
   * @param function_callback Function to execute
   * 
   * @returns `false` if function_callback is null
   */
  public static set_onload_callback(function_callback : any) : boolean {
    if(function_callback === null) return false;
    this.callback_ = function_callback;
    return true;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * @brief Hides the object set in set_loader() 
   */
  private static hide() : void {
    if(this.loader_ === null) return;
    this.loader_.style.display = 'none';
    $(this.loader_).addClass('ready');
    this.hidden_ = true;
  }
  /**
   * @brief Shows the object set in set_loader() 
   */
  private static show() : void {
    if(this.loader_ === null) return;
    this.loader_.style.display = 'block';
    $(this.loader_).removeClass('ready');
    this.hidden_ = false;
  }
  /**
   * @brief Changes the percentage text of the precentage_string set in set_loader()
   */
  private static update() : void {
    if(this.hidden_) this.show();
    if(this.loader_text_ === null) return;
    this.loader_text_.innerText = this.percentage().toString();
  }
}
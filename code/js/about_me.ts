
import { loader } from "./loader";

interface about_image {
  src    : string;
  width  : number;
  height : number;
  button : HTMLElement;
  loaded : boolean;
}


export class about_me
{
  private object_ : HTMLElement;
  private menu_   : HTMLElement;

  private images_ : Array<about_image>
  private last_   : number = 0;
  private timer_  : number = 0;

  /**
   * @brief Loads the background images that will be show in the About me's section
   * 
   * @param object Id of the about me's section
   */
  constructor(object : string){
    this.object_ = document.getElementById(object)!.children.item(0) as HTMLElement;
    this.menu_ = document.createElement('aside');
    this.object_.appendChild(this.menu_);
    this.images_ = new Array<about_image>(0);
  }
  /**
   * @brief Adding a new image to show in the background
   * 
   * @param image_url URL of the image to show
   */
  public add_image(image_url : string) : void {
    var image : HTMLImageElement = new Image();
    const i : number = this.images_.push({ 
      src: image_url, width: 0, height: 0, 
      button: document.createElement('div'), loaded: false
    }) - 1;
    loader.load_image(image_url, image, this.finished.bind(this, image, i));
  }
  /**
   * @brief Changes the background image for one of the added using add_image()
   * 
   * @param i Image's array position index
   * 
   * @returns `false` if the index doesn't exist
   */
  public change(i : number) : boolean {
    if(i >= this.images_.length) return false;
    clearInterval(this.timer_);

    this.images_[this.last_].button.className = '';
    this.images_[i].button.className = 'active';

    this.last_ = i;

    if(!this.images_[i].loaded) return false;
    this.object_.style.backgroundImage = 'url(' + this.images_[i].src + ')';

    this.timer_ = setInterval(this.update.bind(this), 5000);
    return true;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * @brief Changes to the next background image in the queue
   */
  private update() : void {
    this.images_[this.last_].button.className = '';

    ++this.last_;
    if(this.last_ >= this.images_.length) this.last_ = 0;

    this.images_[this.last_].button.className = 'active';
    if(!this.images_[this.last_].loaded){
      clearInterval(this.timer_);
      return;
    }

    this.object_.style.backgroundImage = 'url(' + this.images_[this.last_].src + ')';
  }
  /**
   * @brief Loading image's onload callback
   */
  private finished(image : HTMLImageElement, i : number) : void {
    //this.images_[i].src    = image.currentSrc;
    this.images_[i].width  = image.naturalWidth;
    this.images_[i].height = image.naturalHeight;
    this.images_[i].loaded = true;

    this.menu_.appendChild(this.images_[i].button);
    this.images_[i].button.addEventListener('mouseup', this.change.bind(this, i));
    if(this.last_ === i) this.change(i);
  }
};

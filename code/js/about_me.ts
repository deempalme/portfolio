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
  private object : HTMLElement;
  private menu : HTMLElement;

  private images : Array<about_image>
  private last   : number = 0;
  private timer  : number = 0;


  constructor(object : string){
    this.object = document.getElementById(object)!.children.item(0) as HTMLElement;
    this.menu = document.createElement('aside');
    this.object.appendChild(this.menu);
    this.images = new Array<about_image>(0);
  }
  /**
   * @brief Adding a new image to show in the background
   * 
   * @param image_url URL of the image to show
   */
  public add_image(image_url : string) : void {
    var image : HTMLImageElement = new Image();
    const i : number = this.images.push({ 
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
    if(i >= this.images.length) return false;
    clearInterval(this.timer);

    this.images[this.last].button.className = '';
    this.images[i].button.className = 'active';

    this.last = i;

    if(!this.images[i].loaded) return false;
    this.object.style.backgroundImage = 'url(' + this.images[i].src + ')';

    this.timer = setInterval(this.update.bind(this), 5000);
    return true;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * @brief Changes to the next background image in the queue
   */
  private update() : void {
    this.images[this.last].button.className = '';

    ++this.last;
    if(this.last >= this.images.length) this.last = 0;

    this.images[this.last].button.className = 'active';
    if(!this.images[this.last].loaded){
      clearInterval(this.timer);
      return;
    }

    this.object.style.backgroundImage = 'url(' + this.images[this.last].src + ')';
  }
  /**
   * @brief Loading image's onload callback
   */
  private finished(image : HTMLImageElement, i : number) : void {
    //this.images[i].src    = image.currentSrc;
    this.images[i].width  = image.naturalWidth;
    this.images[i].height = image.naturalHeight;
    this.images[i].loaded = true;

    this.menu.appendChild(this.images[i].button);
    this.images[i].button.addEventListener('mouseup', this.change.bind(this, i));
    if(this.last === i) this.change(i);
  }
};

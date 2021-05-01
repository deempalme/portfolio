
import { loader } from './loader';


export class contact_me
{
  private object_ : HTMLElement;
  private planet_ : HTMLElement;

  private text_object_1_ : Element;
  private text_object_2_ : Element;
  private text_object_3_ : Element;

  private e_  : string | null = 'f.j.r.r';
  private e3_ : string | null = 'tech';
  private e4_ : string | null = 'ramrod.';
  private e8_ : string | null = '@';

  private t_  : string | null = ' 3017';
  private t2_ : string | null = ' 622';
  private t6_ : string | null = ' 125';

  private s_  : string | null = ' 2331';
  private s5_ : string | null = ' 1762';
  private s8_ : string | null = ' 103';

  /**
   * @brief Shows the private information to the user
   * 
   * This avoids that robots steal such information for spamming
   * 
   * @param object Id of the contact me's section
   */
  constructor(object : string){
    this.object_ = document.getElementById(object)!;

    this.text_object_1_ = this.object_.children.item(1)!.children.item(1)!.children.item(0)!;
    this.text_object_2_ = this.object_.children.item(3)!.children.item(1)!.children.item(0)!;
    this.text_object_3_ = this.object_.children.item(4)!.children.item(1)!.children.item(0)!;

    this.text_object_1_.textContent = this.e_! + this.e8_ + this.e4_ + this.e3_;
    this.text_object_2_.textContent = '+52' + this.t2_! + this.t6_ + this.t_;
    this.text_object_3_.textContent = '+49' + this.s5_! + this.s8_ + this.s_;

    // Clearing data
    this.e_ = this.e3_ = this.e4_ = this.e8_ = null;
    this.t_ = this.t2_ = this.t6_ = null;
    this.s_ = this.s5_ = this.s8_ = null;

    let parent : Element = this.object_.parentElement!;
    this.planet_ = document.createElement('aside');
    parent.prepend(this.planet_);

    var moonshine : HTMLImageElement = new Image();
    loader.load_image('/resources/images/moonshine.jpg', moonshine, 
                      this.background.bind(this, moonshine));
  }
  /**
   * @brief Setting the background image to show as the moving planet
   * 
   * @param image_url URL of the planet's image
   */
  public set_background(image_url : string) : void {
    this.planet_.style.backgroundImage = 'url(' + image_url + ')';
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * @brief Setting the main backgroun image (moon and stars)
   * 
   * @param image URL of the background image
   */
  private background(image : HTMLImageElement) : void {
    this.object_.parentElement!.style.backgroundImage = 'url(' + image.src + ')';
  }
}
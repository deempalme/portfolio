
import $ from 'jquery';


export class contact_me
{
  private object_ : HTMLElement;
  private size_  : number = 0;
  private start_ : number = 0;
  private end_   : number = 0;

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

  private s_  : string | null = ' 6778';
  private s5_ : string | null = ' 575';
  private s8_ : string | null = ' 145';


  constructor(object : string){
    this.object_ = document.getElementById(object)!;

    this.text_object_1_ = this.object_.children.item(1)!.children.item(1)!.children.item(0)!;
    this.text_object_2_ = this.object_.children.item(2)!.children.item(1)!.children.item(0)!;
    this.text_object_3_ = this.object_.children.item(3)!.children.item(1)!.children.item(0)!;

    this.text_object_1_.textContent = this.e_! + this.e8_ + this.e4_ + this.e3_;
    this.text_object_2_.textContent = '+52' + this.t2_! + this.t6_ + this.t_;
    this.text_object_3_.textContent = '+49' + this.s5_! + this.s8_ + this.s_;

    // Clearing data
    this.e_ = this.e3_ = this.e4_ = this.e8_ = null;
    this.t_ = this.t2_ = this.t6_ = null;
    this.s_ = this.s5_ = this.s8_ = null;

    this.resize();
  }
  /**
   * @brief Changing the linked object's start and end position
   */
   public resize() : void {
    this.size_ = $(this.object_).outerHeight()!;
    this.start_ = $(this.object_).offset()!.top;
    this.end_ = this.start_ + this.size_;
  }

  public scroll(page_offset : number) : void {}
}
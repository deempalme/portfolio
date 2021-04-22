
import $ from 'jquery';
import { loader } from './loader';


interface menu_item {
  id : string;
  video : HTMLMediaElement;
}

interface article_item {
  id : string;
  object : HTMLElement;
  video : HTMLMediaElement;
  secondary_video : HTMLMediaElement | null;
  play : HTMLElement | null;
  playing : boolean;
  next : HTMLElement | null;
  nexted : boolean;
  close : HTMLElement;
}


export class portfolio
{
  private menu_ : Array<menu_item>;
  private articles_ : Array<article_item>;
  private active_ : boolean = false;


  constructor(portfolio_id : string){
    // Getting the #portfolio HTMLElement
    let menu_items : NodeList = 
      document.querySelectorAll('#' + portfolio_id + ' > section > figure')!;
    this.menu_ = new Array<menu_item>(0);

    // Adding events handlers to play, pause and show details
    for(var i = 0; i < menu_items.length; ++i){
      let item : HTMLElement = (menu_items[i] as HTMLElement);
      item.addEventListener('mouseover', this.play.bind(this, i));
      item.addEventListener('mouseout', this.pause.bind(this, i));
      item.addEventListener('mouseup', this.show.bind(this, i));
      this.menu_[i] = {
        id: item.id.substring(1), video: (item.children.item(0) as HTMLMediaElement)
      };
    }

    // Getting all the articles
    let articles : NodeList = document.querySelectorAll('#' + portfolio_id + ' > article')!;
    this.articles_ = new Array<article_item>(0);

    // Adding events handlers to close
    for(var i = 0; i < articles.length; ++i){
      let article : HTMLElement = (articles[i] as HTMLElement);
      let id : string = article.id.substring(1);
      const is_media : boolean = id !== '_autonomous';
      const is_drone : boolean = id === '_drone';

      this.articles_[i] = {
        object: article, id: id,
        video: (article.children.item(0) as HTMLMediaElement),
        secondary_video: is_drone ? (article.children.item(1) as HTMLMediaElement) : null,
        play: is_media ? (article.children.item(article.children.length - 2) as HTMLElement) : null,
        playing: true,
        next: is_drone ? (article.children.item(article.children.length - 3) as HTMLElement) : null,
        nexted: false,
        close: (article.children.item(article.children.length - 1) as HTMLElement)
      };

      if(is_media) this.articles_[i].play?.addEventListener('mouseup', this.toggle.bind(this, i));
      if(is_drone) this.articles_[i].next?.addEventListener('mouseup', this.next.bind(this, i));
      this.articles_[i].close.addEventListener('mouseup', this.hide.bind(this, i));

      // Loading posters
      const image_url : string = this.articles_[i].video.currentSrc;
      var image : HTMLImageElement = new Image();
      loader.load_image(image_url.substring(0, image_url.length - 3) + 'jpg', image,
                        this.show_poster.bind(this, i, image));
    }
  }
  /**
   * @brief Indicates if one of portfolio's articles is displayed
   * 
   * @returns `true` if a one article is visible
   */
  public active() : boolean {
    return this.active_;
  }
  /**
   * @brief Resizes the video (in the background)
   * 
   * @param width New video's width
   */
  public resize(width : number) : void {
    for(var i in this.articles_)
      this.articles_[i].video.style.width = width + 'px';
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * @brief Hides the portfolio's article
   * 
   * @param i Array index of the portfolio's articles that will be hidden
   */
  private hide(i : number) : void {
    this.articles_[i].object.style.display = 'none';
    this.articles_[i].video.pause();
    this.articles_[i].video.currentTime = 0;
    if(this.articles_[i].play !== null){
      this.articles_[i].playing = true;
      this.articles_[i].play!.className = 'play';
      this.articles_[i].play!.innerText = 'PAUSE';
    }
    if(this.articles_[i].next !== null){
      this.articles_[i].nexted = false;
      this.articles_[i].secondary_video!.pause();
      this.articles_[i].secondary_video!.currentTime = 0;
      this.articles_[i].secondary_video!.style.display = 'none';
    }
    $('html, body').removeClass('avoid_scroll');
    $('nav, #keys').show();
    this.active_ = false;
  }
  /**
   * @brief Pauses the portfolio's menu video
   * 
   * @param i Array index of the portfolio's menu
   */
  private pause(i : number) : void {
    this.menu_[i].video.pause();
  }
  /**
   * @brief Plays the portfolio's menu video
   * 
   * @param i Array index of the portfolio's menu
   */
  private play(i : number) : void {
    this.menu_[i].video.play();
  }
  /**
   * @brief Shows the portfolio's article
   * 
   * @param i Array index of the portfolio's articles that will be shown
   */
  private show(i : number) : void {
    this.menu_[i].video.pause();
    const id : string = this.menu_[i].id;
    $('html, body').stop(true, false).addClass('avoid_scroll');
    $('nav, #keys').hide();

    for(var ix in this.articles_)
      if(this.articles_[ix].id === id){
        this.articles_[ix].video.play();
        this.articles_[ix].object.style.display = 'block';
      }
    this.active_ = true;
  }
  /**
   * @brief Shows the poster image after is loaded
   * 
   * @param i Array index of the portfolio's menu
   * @param image Loaded image
   */
  private show_poster(i : number, image : HTMLImageElement) : void {
    let id : string = this.articles_[i].id;
    for(var e in this.menu_)
      if(this.menu_[e].id === id)
        this.menu_[e].video.setAttribute('poster', image.src);

    this.articles_[i].video.setAttribute('poster', image.src);
  }
  /**
   * @brief Toggles the video reporduction in the active video
   * 
   * @param i Array index of the portfolio's articles
   */
  private toggle(i : number) : void {
    if((this.articles_[i].playing = !this.articles_[i].playing)){
      this.articles_[i].play!.className = 'play';
      this.articles_[i].play!.innerText = 'PAUSE';
      if(this.articles_[i].nexted)
        this.articles_[i].secondary_video!.play();
      else
        this.articles_[i].video.play();
    }else{
      this.articles_[i].play!.className = 'play pause';
      this.articles_[i].play!.innerText = 'PLAY';
      if(this.articles_[i].nexted)
        this.articles_[i].secondary_video!.pause();
      else
        this.articles_[i].video.pause();
    }
  }
  /**
   * @brief Showing the next video (in case there are two in one portfolio's article)
   * 
   * @param i Array index of the portfolio's articles
   */
  private next(i : number) : void {
    // Restoring the play button state
    this.articles_[i].play!.className = 'play';
    this.articles_[i].play!.innerText = 'PAUSE';
    this.articles_[i].playing = true;
    // Changing the videos (stoping the hidden one)
    if((this.articles_[i].nexted = !this.articles_[i].nexted)){
      this.articles_[i].video.pause();
      this.articles_[i].video.currentTime = 0;
      this.articles_[i].secondary_video!.style.display = 'block';
      this.articles_[i].secondary_video!.play();
    }else{
      this.articles_[i].secondary_video!.pause();
      this.articles_[i].secondary_video!.currentTime = 0;
      this.articles_[i].secondary_video!.style.display = 'none';
      this.articles_[i].video.play();
    }
  }
}
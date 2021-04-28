
import $ from 'jquery';
import { droiddrive } from './droiddrive';
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
  play : HTMLElement;
  playing : boolean;
  hide : HTMLElement;
  hidden : boolean;
  next : HTMLElement | null;
  nexted : boolean;
  close : HTMLElement;
}


export class portfolio
{
  private menu_ : Array<menu_item>;
  private articles_ : Array<article_item>;
  private active_ : boolean = false;
  private canvas_ : droiddrive;
  private last_   : number = 0;
  private paused_ : boolean = true;


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
      const is_drone : boolean = id === '_drone';
      const is_auto : boolean = id === '_autonomous';

      this.articles_[i] = {
        object: article, id: id,
        video: (article.children.item(0) as HTMLMediaElement),
        secondary_video: is_drone ? (article.children.item(1) as HTMLMediaElement) : null,
        play: article.children.item(article.children.length - 2) as HTMLElement,
        playing: true,
        hide: (is_drone || is_auto ? article.children.item(article.children.length - 4) 
              : article.children.item(article.children.length - 3)) as HTMLElement,
        hidden: false,
        next: is_drone || is_auto ? (article.children.item(article.children.length - 3) as HTMLElement) : null,
        nexted: false,
        close: (article.children.item(article.children.length - 1) as HTMLElement)
      };

      this.articles_[i].play.addEventListener('mouseup', this.toggle.bind(this, i));
      if(is_drone || is_auto)
        this.articles_[i].next?.addEventListener('mouseup', this.next.bind(this, i));
      this.articles_[i].close.addEventListener('mouseup', this.hide.bind(this, i));
      this.articles_[i].hide.addEventListener('mouseup', this.toggle_text.bind(this, i));

      // Loading posters
      const image_url : string = this.articles_[i].video.currentSrc;
      var image : HTMLImageElement = new Image();
      loader.load_image(image_url.substring(0, image_url.length - 3) + 'jpg', image,
                        this.show_poster.bind(this, i, image));
    }

    this.canvas_ = new droiddrive('a_autonomous');
    this.canvas_.set_pause_callback(this.activate_pause.bind(this));

    window.addEventListener('keydown', this.key_down.bind(this));
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
   * @brief Activates the pause button in the portfolio's autonomous article
   */
  public activate_pause() : void {
    if(this.paused_) return;
    this.paused_ = true;

    for(var i in this.articles_){
      if(this.articles_[i].id !== '_autonomous') continue;
      this.articles_[i].play!.className = 'play pause';
      this.articles_[i].play!.innerText = 'PLAY';
      this.articles_[i].playing = false;
    }
  }
  /**
   * @brief Changes the video's property from preload="none" to preload=""
   */
  public preload() : void {
    // Preloading the videos inside the portfolio'Ss menu
    for(var i in this.menu_)
      this.menu_[i].video.preload = 'auto';

    // Preloading the videos inside the portfolio's articles
    for(var i in this.articles_){
      this.articles_[i].video.preload = 'auto;'
      if(this.articles_[i].secondary_video !== null)
        this.articles_[i].secondary_video!.preload = 'auto';
    }
  }
  /**
   * @brief Resizes the video (in the background)
   * 
   * @param width New video's width
   * @param scroll_width Width in pixels of the scrollbar
   */
  public resize(width : number, scroll_width : number) : void {
    for(var i in this.articles_){
      this.articles_[i].video.style.width = width + 'px';
      if(this.articles_[i].secondary_video !== null)
        this.articles_[i].secondary_video!.style.width = width + 'px';
    }
    this.canvas_.resize(width, scroll_width);
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

    this.articles_[i].playing = true;
    this.articles_[i].play.className = 'play';
    this.articles_[i].play.innerText = 'PAUSE';

    if(this.articles_[i].next !== null){
      this.articles_[i].nexted = false;
      if(this.articles_[i].secondary_video !== null){
        this.articles_[i].secondary_video!.pause();
        this.articles_[i].secondary_video!.currentTime = 0;
        this.articles_[i].secondary_video!.style.display = 'none';
      }else{
        if(this.articles_[i].id === '_autonomous'){
          this.articles_[i].video.style.display = 'none';
          this.canvas_.show();
        }
      }
    }
    this.canvas_.deactivate();
    $('html, body').removeClass('avoid_scroll');
    $('nav, #keys').show();
    this.active_ = false;
  }
  /**
   * @brief Closes the active portfolio article
   * 
   * @param event Keyboard event
   */
  private key_down(event : KeyboardEvent) : boolean {
    if(!this.active_) return true;

    if(event.code === 'Escape'){
      this.hide(this.last_);
      event.preventDefault();
      return false;
    }
    return true;
  }
  /**
   * @brief Showing the next video (in case there are two in one portfolio's article)
   * 
   * @param i Array index of the portfolio's articles
   */
  private next(i : number) : void {
    // Restoring the play button state
    this.articles_[i].play.className = 'play';
    this.articles_[i].play.innerText = 'PAUSE';
    this.articles_[i].playing = true;
    const is_auto : boolean = this.articles_[i].id === '_autonomous';

    // Changing the videos (stoping the hidden one)
    if((this.articles_[i].nexted = !this.articles_[i].nexted)){
      if(is_auto){
        this.canvas_.hide();
        this.paused_ = true;
        this.canvas_.deactivate();
        this.articles_[i].video.style.display = 'block';
        this.articles_[i].video.play();
      }else{
        this.articles_[i].video.pause();
        this.articles_[i].video.currentTime = 0;
        this.articles_[i].secondary_video!.style.display = 'block';
        this.articles_[i].secondary_video!.play();
      }
    }else{
      if(is_auto){
        this.canvas_.show();
        this.paused_ = false;
        this.canvas_.activate();
        this.articles_[i].video.style.display = 'none';
        this.articles_[i].video.pause();
        this.articles_[i].video.currentTime = 0;
      }else{
        this.articles_[i].secondary_video!.style.display = 'none';
        this.articles_[i].secondary_video!.pause();
        this.articles_[i].secondary_video!.currentTime = 0;
        this.articles_[i].video.play();
      }
    }
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

    for(var ix = 0; ix < this.articles_.length; ++ix)
      if(this.articles_[ix].id === id){
        if(id === '_autonomous'){
          this.canvas_.activate();
          this.paused_ = false;
        }else
          this.articles_[ix].video.play();
        this.articles_[ix].object.style.display = 'block';
        this.last_ = ix;
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
    const is_auto : boolean = this.articles_[i].id === '_autonomous';

    if((this.articles_[i].playing = !this.articles_[i].playing)){
      this.articles_[i].play.className = 'play';
      this.articles_[i].play.innerText = 'PAUSE';
      if(this.articles_[i].nexted){
        if(is_auto)
          this.articles_[i].video.play();
        else
          this.articles_[i].secondary_video!.play();
      }else{
        if(is_auto){
          this.canvas_.play();
          this.paused_ = false;
        }else
          this.articles_[i].video.play();
      }
    }else{
      this.articles_[i].play!.className = 'play pause';
      this.articles_[i].play!.innerText = 'PLAY';
      if(this.articles_[i].nexted){
        if(is_auto)
          this.articles_[i].video.pause();
        else
          this.articles_[i].secondary_video!.pause();
      }else{
        if(is_auto){
          this.canvas_.pause();
          this.paused_ = true;
        }else
          this.articles_[i].video.pause();
      }
    }
  }
  /**
   * @brief Toggles the visibility of the portfolio articles' text
   * 
   * @param i Array index of the portfolio's articles
   */
  private toggle_text(i : number) : void {
    if(this.articles_[i].hidden){
      $(this.articles_[i].object).children('div').css('display', 'inline-block');
      $(this.articles_[i].object).children('section').css('display', 'flex');
      $(this.articles_[i].hide).removeClass('show');
      this.articles_[i].hidden = false;
    }else{
      $(this.articles_[i].object).children('section, div').css('display', 'none');
      $(this.articles_[i].hide).addClass('show');
      this.articles_[i].hidden = true;
    }
  }
}
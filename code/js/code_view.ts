
import $ from 'jquery';
import { loader } from './loader';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import { universe } from './universe';


export class code_view
{
  private main_object_ : HTMLElement;
  private universe_    : universe;
  private menu_        : HTMLElement;
  private code_        : HTMLElement;
  private active_      : boolean = false;
  private last_active_ : HTMLElement | null = null;
  private active_path_ : string;

  /**
   * @brief Creates a section to view the TypeScript code
   * 
   * @param object Id of the container of the code viewer
   * @param button Id of the button that will trigger the show/hide event for the container
   * @param universe The universe's object
   */
  constructor(object : string, button : string, universe : universe){
    this.main_object_ = document.getElementById(object)!;
    this.universe_ = universe;

    var close_button : Element = this.main_object_.children.item(0)!;
    close_button.addEventListener('mouseup', this.hide.bind(this));

    // Creating the navigation menu
    this.menu_ = document.createElement('aside');
    this.main_object_.append(this.menu_);

    // Creating the code viewer
    let pre : HTMLElement = document.createElement('pre');
    this.code_ = document.createElement('code');
    this.code_.className = 'typescript';
    this.code_.style.fontFamily = "'source code pro', 'ubuntu mono', 'Courier New', Courier, monospace";
    this.code_.style.fontSize = '1rem';
    pre.append(this.code_);
    this.main_object_.append(pre);
    this.active_path_ = '/code/js/home.ts';
    
    // Initializing the code highlighter
    hljs.registerLanguage('typescript', typescript);

    // Loading the file list
    loader.load_json('/bio/code', { directory: 'code/js' }, this.create_list.bind(this));

    document.getElementById(button)!.addEventListener('mouseup', this.show.bind(this));
  }
  /**
   * @brief Hides the code viewer
   */
  public hide() : void {
    if(!this.active_) return;

    this.universe_.activate();
    this.main_object_.style.display = 'none';
    this.active_ = false;
    $('html, body').removeClass('avoid_scroll');
  }
  /**
   * @brief Loads code from an specific url path
   * 
   * @param path File's url path that will be loaded
   */
  public load_code(path : string, element : HTMLElement | null) : void {
    if(this.last_active_ !== null)
      this.last_active_.className = '';
    
    this.last_active_ = element;
    if(element !== null) element.className = 'active';

    loader.load_data(this.active_path_ = path, this.show_code.bind(this));
  }
  /**
   * @brief Shows the code viewer
   */
  public show() : void {
    if(this.active_) return;

    this.main_object_.style.display = 'block';
    this.universe_.deactivate();
    this.load_code(this.active_path_, this.last_active_);
    this.active_ = true;
    $('html, body').stop(true, false).addClass('avoid_scroll');
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * @brief Creates the file listing of the code viewer
   * 
   * @param data The file list in a JSON format
   */
  private create_list(data : any) : void {
    var uls : Array<HTMLElement> = new Array<HTMLElement>(0);
    let current_ul : HTMLElement;
    let last_id : number = -1;

    for(var entry in data){
      if(last_id != data[entry].id){
        last_id = data[entry].id;
        if(typeof uls[last_id] === 'undefined') uls[last_id] = document.createElement('ul');
        current_ul = uls[last_id];

        if(last_id != 0){
          let folder : HTMLElement = document.createElement('li');
          folder.textContent = data[entry].folder_path;
          folder.className = 'none';
          current_ul.append(folder);
          current_ul = document.createElement('ul');
          uls[uls.length - 1].append(current_ul);
        }
      }

      var list : HTMLElement = document.createElement('li');
      list.textContent = data[entry].filename;
      current_ul!.append(list);
      if(data[entry].filename === 'home.ts') this.last_active_ = list;
      list.addEventListener('mouseup', this.load_code.bind(this, '/' + data[entry].path, list));
    }

    for(var i in uls){
      if(parseInt(i) !== 0)
        this.menu_.append(uls[i]);
    }
    this.menu_.append(uls[0]);
  }
  /**
   * @brief Changes the <pre><code>'s highlighted content
   * 
   * @param data New typescript code that will be highlighted and shown
   */
  private show_code(data : string) : void {
    this.code_.innerHTML = hljs.highlight(data, { language: 'typescript' }).value;
  }
}
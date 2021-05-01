
import { circles } from './gl/circles';
import * as constants from './gl/constants';
import { lines_shader } from './shaders/lines_shader'
import { model } from './gl/model';
import { open_gl } from './gl/open_gl';
import { planet, planet_info } from './planet';
import { shader } from './gl/shader';
import { planets_shader } from './shaders/planets_shader_normal';
import { texture } from './gl/texture';
import $ from 'jquery';
import { v3 } from './math/v3';
import { loader } from './loader';
import { contact_me } from './contact_me';


export class universe
{
  private width_  : number = 0;
  private height_ : number = 0;

  private main_object_ : HTMLElement;
  private start_ : number = 0;
  private end_   : number = 0;
  private size_  : number = 0;
  private last_scroll_   : number = 0;
  private ignore_scroll_ : boolean = false;
  private initial_angle_ : number = 0;
  private contact_me_    : contact_me | null;

  private gl_ : open_gl;
  private sphere_ : model;
  private ring_ : model;
  private timer_ : number = 0;
  private active_ : boolean = false;

  private lines_shader_  : shader;
  private planet_shader_ : shader;

  private circles_ : circles;
  private planets_ : Array<planet>;
  private planet_ : HTMLElement;
  private moon_ : HTMLElement;
  private background_ : HTMLElement;
  private down_active_ : boolean = false;
  private last_angle_ : number = 0;

  // Function binders
  private interval_binder_ : any;
  private paint_binder_    : any;
  private last_timestamp_  : number = 0;
  private speed_binder_    : any;
  private scroll_timer_    : number = 0;

  /**
   * @brief This creates and controls the milky way simulation
   * 
   * @param object Id of the container for this canvas
   * @param contact_me contact_me class' object
   */
  constructor(object : string, contact_me : contact_me){
    this.main_object_ = document.getElementById(object)!;
    this.background_ = (this.main_object_.children.item(0) as HTMLElement);
    this.planet_ = document.createElement('figure');
    this.planet_.className = 'planet';
    this.main_object_.append(this.planet_);
    this.moon_ = document.createElement('figure');
    this.moon_.className = 'moon';
    this.main_object_.append(this.moon_);

    // Creating the canvas
    this.gl_ = new open_gl(this.main_object_);
    let context : WebGL2RenderingContext = this.gl_.context()!;

    // Loading the basic model for a planet or star
    this.sphere_ = new model(context, '../../resources/models/sphere/model.obj');

    // Loading the basic model for saturn's ring
    this.ring_ = new model(context, '../../resources/models/saturn/ring.obj');

    // Loading lines' shader
    this.lines_shader_ = new shader(context, lines_shader.vertex!, 
                                    lines_shader.fragment!);
    // Freing memory of unused variables
    lines_shader.vertex = null;
    lines_shader.fragment = null;

    // Loading planets' shader
    this.planet_shader_ = new shader(context, planets_shader.vertex!,
                                     planets_shader.fragment!);
    // Freing memory of unused variables
    planets_shader.vertex = null;
    planets_shader.fragment = null;

    // Waiting until they are charged
    this.gl_.add_shader(this.lines_shader_);
    this.gl_.add_shader(this.planet_shader_);

    var planets : Array<planet_info> = [
      {
        radius: 0.3, distance_to_star: 3, translation_position: Math.random() * 360, 
        translation_speed: 12, rotation_position: Math.random() * 360,
        rotation_speed: 150
      },
      {
        radius: 0.7, distance_to_star: 5, translation_position: Math.random() * 360, 
        translation_speed: 8, rotation_position: Math.random() * 360,
        rotation_speed: 120
      },
      {
        radius: 1, distance_to_star: 9, translation_position: Math.random() * 360, 
        translation_speed: 6, rotation_position: Math.random() * 360,
        rotation_speed: 90
      },
      {
        radius: 0.6, distance_to_star: 13, translation_position: Math.random() * 360, 
        translation_speed: 7, rotation_position: Math.random() * 360,
        rotation_speed: 90
      },
      {
        radius: 2.5, distance_to_star: 26, translation_position: Math.random() * 360, 
        translation_speed: 12, rotation_position: Math.random() * 360,
        rotation_speed: 30
      },
      {
        radius: 3.5, distance_to_star: 40, translation_position: Math.random() * 360, 
        translation_speed: 14, rotation_position: Math.random() * 360,
        rotation_speed: 40
      },
      {
        radius: 2, distance_to_star: 47, translation_position: Math.random() * 360, 
        translation_speed: 17, rotation_position: Math.random() * 360,
        rotation_speed: 50
      },
      {
        radius: 1.5, distance_to_star: 53, translation_position: Math.random() * 360, 
        translation_speed: 12, rotation_position: Math.random() * 360,
        rotation_speed: 30
      },
      {
        radius: 0.6, distance_to_star: 57, translation_position: Math.random() * 360, 
        translation_speed: 7, rotation_position: Math.random() * 360,
        rotation_speed: 20
      },
      {
        radius: 1, distance_to_star: 0, translation_position: 0, 
        translation_speed: 0, rotation_position: Math.random() * 360,
        rotation_speed: 5
      }
    ];

    this.lines_shader_.use();
    this.circles_ = new circles(context, this.lines_shader_, planets, 1);

    this.planet_shader_.use();
    this.planet_shader_.integer(this.planet_shader_.uniform_location('u_albedo'),
                               constants.texture_unit.albedo);
    this.planet_shader_.integer(this.planet_shader_.uniform_location('u_normal'),
                               constants.texture_unit.normal);
    this.planet_shader_.integer(this.planet_shader_.uniform_location('u_specular'),
                               constants.texture_unit.specular);
    this.planet_shader_.integer(this.planet_shader_.uniform_location('u_lights'),
                               constants.texture_unit.lights);

    var normal = new texture(context, '/resources/models/normal_2.jpg',
                             constants.texture_unit.normal);
    var normal_center = new texture(context, '/resources/models/normal_center.jpg',
                                    constants.texture_unit.normal);
    var earth_albedo = new texture(context, '/resources/models/earth/albedo.jpg',
                                   constants.texture_unit.albedo);
    var earth_normal = new texture(context, '/resources/models/earth/normal.jpg',
                                   constants.texture_unit.normal);
    var earth_specular = new texture(context, '/resources/models/earth/specular.jpg',
                                     constants.texture_unit.specular);
    var earth_lights = new texture(context, '/resources/models/earth/albedo_night.jpg',
                                   constants.texture_unit.lights);

    var albedoes = [
      new texture(context, '/resources/models/mercury/albedo.jpg', constants.texture_unit.albedo),
      new texture(context, '/resources/models/venus/albedo.jpg', constants.texture_unit.albedo),
      new texture(context, '/resources/models/mars/albedo.jpg', constants.texture_unit.albedo),
      new texture(context, '/resources/models/jupiter/albedo.jpg', constants.texture_unit.albedo),
      new texture(context, '/resources/models/saturn/albedo.jpg', constants.texture_unit.albedo),
      new texture(context, '/resources/models/uranus/albedo.jpg', constants.texture_unit.albedo),
      new texture(context, '/resources/models/neptune/albedo.jpg', constants.texture_unit.albedo),
      new texture(context, '/resources/models/pluto/albedo.jpg', constants.texture_unit.albedo),
      new texture(context, '/resources/models/sun/albedo.jpg', constants.texture_unit.albedo),
      new texture(context, '/resources/models/saturn/ring.png',
                  constants.texture_unit.albedo, true, 4)
    ];

    this.planets_ = [
      new planet(this.planet_shader_, this.sphere_, albedoes[0], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[0]),
      new planet(this.planet_shader_, this.sphere_, albedoes[1], normal, null, null,
                 v3.new(1, 0.274, 0.078), planets[1]),
      new planet(this.planet_shader_, this.sphere_, earth_albedo, earth_normal, earth_lights,
                 earth_specular, v3.new(0.0, 0.57, 0.79), planets[2]),
      new planet(this.planet_shader_, this.sphere_, albedoes[2], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[3]),
      new planet(this.planet_shader_, this.sphere_, albedoes[3], normal, null, null,
                 v3.new(0.878, 0.376, 0), planets[4]),
      new planet(this.planet_shader_, this.sphere_, albedoes[4], normal, null, null,
                 v3.new(0.878, 0.556, 0), planets[5]),
      new planet(this.planet_shader_, this.sphere_, albedoes[5], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[6]),
      new planet(this.planet_shader_, this.sphere_, albedoes[6], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[7]),
      new planet(this.planet_shader_, this.sphere_, albedoes[7], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[8]),
      new planet(this.planet_shader_, this.sphere_, albedoes[8], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[9], true),
      new planet(this.planet_shader_, this.ring_, albedoes[9], normal_center, null, null,
                 v3.new(0.878, 0.556, 0), planets[5], true)
    ];

    this.contact_me_ = contact_me;
    // Loading the big sized background images
    var half_planet : HTMLImageElement = new Image();
    loader.load_image('/resources/theme3.0/planet.webp', half_planet,
                      this.finished.bind(this, half_planet, 0));
    var milky_way : HTMLImageElement = new Image();
    loader.load_image('/resources/images/milky_way.jpg', milky_way,
                      this.finished.bind(this, milky_way, 1));
    var full_planet : HTMLImageElement = new Image();
    loader.load_image('/resources/theme3.0/planet.jpg', full_planet,
                      this.finished.bind(this, full_planet, 2));

    // Binding the paint to an interval event
    this.interval_binder_ = this.request_animation.bind(this);
    this.paint_binder_ = this.paint.bind(this);
    this.speed_binder_ = this.normal_speed.bind(this);

    this.last_scroll_ = window.pageYOffset;
    this.initial_angle_ = this.gl_.angle_x();
    this.move_background();

    this.main_object_.addEventListener('mousemove', this.mouse_move.bind(this));
    this.main_object_.addEventListener('mousedown', this.mouse_down.bind(this));
    this.main_object_.addEventListener('mouseup', this.mouse_up.bind(this));
    this.main_object_.addEventListener('mouseout', this.mouse_up.bind(this));

    this.resize();
    this.scroll(window.pageYOffset);
  }
  /**
   * @brief Resumes painting the universe gl context
   * 
   * Call this to save CPU usage
   */
  public activate() : void {
    if(!this.active_){
      this.timer_ = setInterval(this.interval_binder_, constants.frame_time);
      this.active_ = true;
      this.gl_.activate();
    }
  }
  /**
   * @brief Stops painting the universe gl context
   * 
   * Call this to save CPU usage
   */
  public deactivate() : void {
    if(this.active_){
      clearInterval(this.timer_);
      this.active_ = false;
      this.down_active_ = false;
      this.gl_.deactivate();
    }
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    this.deactivate();
  }
  /**
   * @brief Paints the OpenGL canvas
   * 
   * @param timestamp The timestamp when this function is requested
   */
  public paint(timestamp : number) : void {
    if(timestamp <= this.last_timestamp_) return;

    this.last_timestamp_ = timestamp;

    // Painting the plantes and sun
    this.planet_shader_.use();
    for(var i in this.planets_)
      this.planets_[i].paint();

    // Painting the translation lines
    this.lines_shader_.use();
    this.circles_.paint();

    //let error : GLenum = this.gl_.context()!.getError();
    //if(error != 0) console.log(error_gl.message(error));
  }
  /**
   * @brief To avoid CPU waste performance this function checks if the webpage
   * is visible and if so, then request that a new frame is painted.
   */
  public request_animation() : void {
    window.requestAnimationFrame(this.paint_binder_);
  }
  /**
   * @brief Resizing event handler
   */
  public resize() : void {
    this.width_ = this.main_object_.clientWidth;
    this.height_ = window.innerHeight;

    this.start_ = $(this.main_object_).offset()!.top;
    this.size_ = $(this.main_object_).height()!;
    this.end_ = this.start_ + this.size_;

    this.gl_.resize(this.width_, this.height_);
  }
  /**
   * @brief Scrolling event handler
   */
  public scroll(page_offset : number) : void {
    if(!this.active_){
      this.last_scroll_ = page_offset;
      return;
    }

    // Linear interpolation:
    // y = y0 + (x - x0) * ((y1 - y0) / (x1 - x0));
    // Knowing that x0 = 0 then
    // y = y0 + x * ((y1 - y0) / x1);
    let y : number, x : number;
    let y0 : number = this.initial_angle_;
    const y1 : number = constants.target_angle;
    const x1 : number = this.end_;

    // Recalculating initial angle
    if(this.gl_.moved() || this.ignore_scroll_){
      // Ignores the default event when a navigation's link is clicked
      // (which goes directly into the target pageYoffset)
      if(this.last_scroll_ === x1){
        this.ignore_scroll_ = true;
        this.last_scroll_ = page_offset;
        return;
      }
      this.ignore_scroll_ = false;

      y = this.gl_.angle_x();
      if(y > constants.target_angle) y -= constants.degree_180;
      x = this.last_scroll_;
      // Solving for y0
      // y0 = (y1 * x - y * x1) / (x - x1)
      y0 = (y1 * x - y * x1) / (x - x1);
      this.initial_angle_ = y0;
    }

    if(this.last_scroll_ < this.end_){
      // Getting the angle interpolation
      x = page_offset;
      y = y0 + x * ((y1 - y0) / x1);

      // Calculating the rotation differential in X axis respecting vertical page offset
      let current_angle : number = this.gl_.angle_x();
      if(current_angle > constants.target_angle) current_angle -= constants.degree_180;
      let delta_angle : number = y - current_angle;
      this.gl_.rotate_x(delta_angle);
    }

    // Changing the milky way background position to simulate rotation
    this.move_background();

    // Changing position of the last planet to simulate rotation too
    const relation : number = page_offset / this.end_;
    this.planet_.style.bottom = ((1 - relation * 1.65) * constants.background_height * 0.5) + 'px';

    // Changing the speed for rotation in the Z axis
    let direction : number = page_offset - this.last_scroll_;
    this.last_scroll_ = page_offset;
    planet.speed(1.0 * direction);

    clearTimeout(this.scroll_timer_);
    this.scroll_timer_ = setTimeout(this.speed_binder_, 100);
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * @brief Loading background's callback that sets the loaded image into css background
   * 
   * @param image HTMLImageElement to set as background
   * @param i Where should it be placed
   */
  private finished(image : HTMLImageElement, i : number) : void {
    switch(i){
      case 0:
        this.moon_.style.backgroundImage = 'url(' + image.src + ')';
        this.contact_me_!.set_background(image.src);
        this.contact_me_ = null;
      break;
      case 1:
        $('#universe > h1').css('background-image', 'url(' + image.src + ')');
      break;
      case 2:
        this.planet_.style.backgroundImage = 'url(' + image.src + ')';
      break;
      default: break;
    }
  }
  /**
   * @brief Restores the planet rotation and translation speed to normal
   */
  private normal_speed() : void {
    planet.speed(1.0);
  }
  /**
   * @brief Moves the background image (milky way) to simulate rotation ONLY if the
   *        open_gl object has been moved too.
   */
  private move_background() : void {
    if(this.last_angle_ !== this.gl_.angle_x()){
      this.last_angle_ = this.gl_.angle_x();

      // Changing the milky way background position to simulate rotation
      const relation : number = this.last_angle_ / constants.degree_360;
      this.background_.style.backgroundPositionY = 
        (relation * constants.background_height * 3) + 'px';
    }
  }
  /**
   * @brief Activates the mouse drag event that moves milky way background
   * 
   * @param event MouseEvent event information
   * 
   * @returns `false` to cancel default events
   */
  private mouse_down(event : MouseEvent) : boolean {
    if(!this.active_) return false;
    this.down_active_ = true;
    event.preventDefault();
    return false;
  }
  /**
   * @brief Moves milky way background
   * 
   * @param event MouseEvent event information
   * 
   * @returns `false` to cancel default events
   */
  private mouse_move(event : MouseEvent) : boolean {
    if(!this.active_ || !this.down_active_) return false;
    this.move_background();
    event.preventDefault();
    return false;
  }
  /**
   * @brief Deactivates the mouse drag event that moves milky way background
   * 
   * @param event MouseEvent event information
   * 
   * @returns `false` to cancel default events
   */
  private mouse_up(event : MouseEvent) : boolean {
    this.down_active_ = false;
    event.preventDefault();
    return false;
  }
};

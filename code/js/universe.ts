
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
  private width  : number = 0;
  private height : number = 0;

  private main_object : HTMLElement;
  private start : number = 0;
  private end   : number = 0;
  private size  : number = 0;
  private last_scroll : number = 0;
  private initial_angle : number = 0;
  private contact_me_ : contact_me | null;

  private gl : open_gl;
  private sphere : model;
  private ring : model;
  private timer : number = 0;
  private active : boolean = false;

  private lines_shader  : shader;
  private planet_shader : shader;

  private circles : circles;
  private planets : Array<planet>;
  private planet : HTMLElement;
  private moon : HTMLElement;
  private background : HTMLElement;
  private down_active : boolean = false;
  private last_angle : number = 0;

  // Function binders
  private interval_binder : any;
  private paint_binder : any;
  private last_timestamp : number = 0;
  private speed_binder : any;
  private scroll_timer : number = 0;


  constructor(object : string, contact_me : contact_me){
    this.main_object = document.getElementById(object)!;
    this.background = (this.main_object.children.item(0) as HTMLElement);
    this.planet = document.createElement('figure');
    this.planet.className = 'planet';
    this.main_object.append(this.planet);
    this.moon = document.createElement('figure');
    this.moon.className = 'moon';
    this.main_object.append(this.moon);

    // Creating the canvas
    this.gl = new open_gl(this.main_object);
    let context : WebGL2RenderingContext = this.gl.context()!;

    // Loading the basic model for a planet or star
    this.sphere = new model(context, '../../resources/models/sphere/model.obj');

    // Loading the basic model for saturn's ring
    this.ring = new model(context, '../../resources/models/saturn/ring.obj');

    // Loading lines' shader
    this.lines_shader = new shader(context, lines_shader.vertex!, 
                                   lines_shader.fragment!);
    // Freing memory of unused variables
    lines_shader.vertex = null;
    lines_shader.fragment = null;

    // Loading planets' shader
    this.planet_shader = new shader(context, planets_shader.vertex!,
                                    planets_shader.fragment!);
    // Freing memory of unused variables
    planets_shader.vertex = null;
    planets_shader.fragment = null;

    // Waiting until they are charged
    this.gl.add_shader(this.lines_shader);
    this.gl.add_shader(this.planet_shader);

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

    this.lines_shader.use();
    this.circles = new circles(context, this.lines_shader, planets, 1);

    this.planet_shader.use();
    this.planet_shader.integer(this.planet_shader.uniform_location('u_albedo'),
                               constants.texture_unit.albedo);
    this.planet_shader.integer(this.planet_shader.uniform_location('u_normal'),
                               constants.texture_unit.normal);
    this.planet_shader.integer(this.planet_shader.uniform_location('u_specular'),
                               constants.texture_unit.specular);
    this.planet_shader.integer(this.planet_shader.uniform_location('u_lights'),
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

    this.planets = [
      new planet(this.planet_shader, this.sphere, albedoes[0], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[0]),
      new planet(this.planet_shader, this.sphere, albedoes[1], normal, null, null,
                 v3.new(1, 0.274, 0.078), planets[1]),
      new planet(this.planet_shader, this.sphere, earth_albedo, earth_normal, earth_lights,
                 earth_specular, v3.new(0.0, 0.57, 0.79), planets[2]),
      new planet(this.planet_shader, this.sphere, albedoes[2], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[3]),
      new planet(this.planet_shader, this.sphere, albedoes[3], normal, null, null,
                 v3.new(0.878, 0.376, 0), planets[4]),
      new planet(this.planet_shader, this.sphere, albedoes[4], normal, null, null,
                 v3.new(0.878, 0.556, 0), planets[5]),
      new planet(this.planet_shader, this.sphere, albedoes[5], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[6]),
      new planet(this.planet_shader, this.sphere, albedoes[6], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[7]),
      new planet(this.planet_shader, this.sphere, albedoes[7], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[8]),
      new planet(this.planet_shader, this.sphere, albedoes[8], normal, null, null,
                 v3.new(0.0, 0.57, 0.79), planets[9], true),
      new planet(this.planet_shader, this.ring, albedoes[9], normal_center, null, null,
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
    this.interval_binder = this.request_animation.bind(this);
    this.paint_binder = this.paint.bind(this);
    this.speed_binder = this.normal_speed.bind(this);

    this.last_scroll = window.pageYOffset;
    this.initial_angle = this.gl.angle_x();
    this.move_background();

    this.main_object.addEventListener('mousemove', this.mouse_move.bind(this));
    this.main_object.addEventListener('mousedown', this.mouse_down.bind(this));
    this.main_object.addEventListener('mouseup', this.mouse_up.bind(this));
    this.main_object.addEventListener('mouseout', this.mouse_up.bind(this));

    this.resize();
    this.scroll(window.pageYOffset);
  }
  /**
   * @brief Resumes painting the universe gl context
   * 
   * Call this to save CPU usage
   */
  public activate() : void {
    if(!this.active){
      this.timer = setInterval(this.interval_binder, constants.frame_time);
      this.active = true;
      this.gl.activate();
    }
  }
  /**
   * @brief Stops painting the universe gl context
   * 
   * Call this to save CPU usage
   */
  public deactivate() : void {
    if(this.active){
      clearInterval(this.timer);
      this.active = false;
      this.gl.deactivate();
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
    if(timestamp <= this.last_timestamp) return;

    this.last_timestamp = timestamp;

    // Painting the plantes and sun
    this.planet_shader.use();
    for(var i in this.planets)
      this.planets[i].paint();

    // Painting the translation lines
    this.lines_shader.use();
    this.circles.paint();

    //let error : GLenum = this.gl.context()!.getError();
    //if(error != 0) console.log(error_gl.message(error));
  }
  /**
   * @brief To avoid CPU waste performance this function checks if the webpage
   * is visible and if so, then request that a new frame is painted.
   */
  public request_animation() : void {
    window.requestAnimationFrame(this.paint_binder);
  }
  /**
   * @brief Resizing event handler
   */
  public resize() : void {
    this.width = this.main_object.clientWidth;
    this.height = window.innerHeight;

    this.start = $(this.main_object).offset()!.top;
    this.size = $(this.main_object).height()!;
    this.end = this.start + this.size;

    this.gl.resize(this.width, this.height);
  }
  /**
   * @brief Scrolling event handler
   */
  public scroll(page_offset : number) : void {
    if(!this.active){
      this.last_scroll = page_offset;
      return;
    }

    // Linear interpolation:
    // y = y0 + (x - x0) * ((y1 - y0) / (x1 - x0));
    // Knowing that x0 = 0 then
    // y = y0 + x * ((y1 - y0) / x1);
    let y : number, x : number;
    let y0 : number = this.initial_angle;
    const y1 : number = constants.target_angle;
    const x1 : number = this.end;

    // Recalculating initial angle
    if(this.gl.moved()){
      y = this.gl.angle_x();
      if(y > constants.target_angle) y -= constants.degree_180;
      x = this.last_scroll;
      // Solving for y0
      // y0 = (y1 * x - y * x1) / (x - x1)
      y0 = (y1 * x - y * x1) / (x - x1);
      this.initial_angle = y0;
    }

    if(this.last_scroll < this.end){
      // Getting the angle interpolation
      x = page_offset;
      y = y0 + x * ((y1 - y0) / x1);

      // Calculating the rotation differential in X axis respecting vertical page offset
      let current_angle : number = this.gl.angle_x();
      if(current_angle > constants.target_angle) current_angle -= constants.degree_180;
      let delta_angle : number = y - current_angle;
      this.gl.rotate_x(delta_angle);
    }

    // Changing the milky way background position to simulate rotation
    this.move_background();

    // Changing position of the last planet to simulate rotation too
    const relation : number = page_offset / this.end;
    this.planet.style.bottom = ((1 - relation * 1.65) * constants.background_height * 0.5) + 'px';

    // Changing the speed for rotation in the Z axis
    let direction : number = page_offset - this.last_scroll;
    this.last_scroll = page_offset;
    planet.speed(1.0 * direction);

    clearTimeout(this.scroll_timer);
    this.scroll_timer = setTimeout(this.speed_binder, 100);
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
        this.moon.style.backgroundImage = 'url(' + image.src + ')';
        this.contact_me_!.set_background(image.src);
        this.contact_me_ = null;
      break;
      case 1:
        $('#universe > h1').css('background-image', 'url(' + image.src + ')');
      break;
      case 2:
        this.planet.style.backgroundImage = 'url(' + image.src + ')';
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
    if(this.last_angle !== this.gl.angle_x()){
      this.last_angle = this.gl.angle_x();

      // Changing the milky way background position to simulate rotation
      const relation : number = this.last_angle / constants.degree_360;
      this.background.style.backgroundPositionY = 
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
    if(!this.active) return false;
    this.down_active = true;
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
    if(!this.active || !this.down_active) return false;
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
    this.down_active = false;
    event.preventDefault();
    return false;
  }
};


import $ from 'jquery';
import * as constants from './gl/constants';
import { ground } from './gl/ground';
import { lidar } from "./gl/lidar";
import { model } from "./gl/model";
import { open_gl } from "./gl/open_gl";
import { shader } from "./gl/shader";
import { texture } from "./gl/texture";
import { m4 } from './math/m4';
import { v3 } from './math/v3';
import { ground_shader } from './shaders/ground_shader';
import { lidar_shader } from './shaders/lidar_shader';
import { model_shader } from './shaders/model_shader';


interface model_3d {
  model : model;
  albedo : texture;
  normal : texture;
  matrix : Float32Array;
}

export class droiddrive
{
  private object_ : HTMLElement;
  // WebGL class controller
  private gl_ : open_gl;

  // 3D models
  private models_ : Array<model_3d>;
  private lidar_ : lidar;
  private ground_ : ground;

  // Animation management
  private active_ : boolean = false;
  private timer_  : number = 0;
  private last_timestamp_ : number = 0;
  private animating_ : boolean = false;
  private update_ : boolean = false;

  // Menu
  private menu_     : HTMLElement;
  private zoom_in_  : Element;
  private iso_view_ : Element;
  private top_view_ : Element;
  private zoom_out_ : Element;

  // Shaders
  private lidar_shader_  : shader;
  private ground_shader_ : shader;
  private model_shader_  : shader;
  private u_model : WebGLUniformLocation | null;

  // Function binders
  private interval_binder_ : any;
  private paint_binder_    : any;
  private is_transparent_  : boolean = false;
  private pause_callback_  : any;


  constructor(object : string){
    this.object_ = document.getElementById(object)!;

    // Creating the canvas
    this.gl_ = new open_gl(this.object_, false, false);
    let gl : WebGL2RenderingContext = this.gl_.context()!;

    // Loading the models' shader
    this.model_shader_ = new shader(gl, model_shader.vertex!, model_shader.fragment!);
    // Freing memory of unused variables
    model_shader.vertex = null;
    model_shader.fragment = null;

    // Loading the 3D car model
    var car : model = new model(gl, '/resources/models/car/model.obj');
    var car_albedo : texture = new texture(gl, '/resources/models/car/albedo.jpg',
                                           constants.texture_unit.albedo);
    var car_normal : texture = new texture(gl, '/resources/models/car/normal.jpg',
                                           constants.texture_unit.normal);

    // Loading the 3D tire model
    var tire : model = new model(gl, '/resources/models/tire/model.obj');
    var tire_albedo : texture = new texture(gl, '/resources/models/tire/albedo.jpg',
                                            constants.texture_unit.albedo);
    var tire_normal : texture = new texture(gl, '/resources/models/tire/normal.jpg',
                                            constants.texture_unit.normal);

    // Loading the 3D ring model
    var ring : model = new model(gl, '/resources/models/ring/model.obj');
    var ring_albedo : texture = new texture(gl, '/resources/models/ring/albedo.jpg',
                                            constants.texture_unit.albedo);
    var ring_normal : texture = new texture(gl, '/resources/models/ring/normal.jpg',
                                            constants.texture_unit.normal);

    var identity : Float32Array = m4.identity();
    this.models_ = [
      { model: car, albedo: car_albedo, normal: car_normal, matrix: identity },
      { model: ring, albedo: ring_albedo, normal: ring_normal, matrix: identity },
      { model: tire, albedo: tire_albedo, normal: tire_normal,
        matrix: m4.translate(identity, v3.new(0, 1.34, 0.27)) },
      { model: tire, albedo: tire_albedo, normal: tire_normal,
        matrix: m4.translate(identity, v3.new(0, -0.95, 0.27)) }
    ];

    // Loading the lidar's shader
    this.lidar_shader_ = new shader(gl, lidar_shader.vertex!, lidar_shader.fragment!);
    // Freing memory of unused variables
    lidar_shader.vertex = null;
    lidar_shader.fragment = null;

    // Loading the LiDar points
    this.lidar_ = new lidar(gl, this.lidar_shader_, '/resources/lidar/binary.bin');

    // Loading the ground's shader
    this.ground_shader_ = new shader(gl, ground_shader.vertex!, ground_shader.fragment!);
    // Freing memory of unused variables
    ground_shader.vertex = null;
    ground_shader.fragment = null;

    // Creating the ground lines
    this.ground_ = new ground(gl, 20.0);

    this.gl_.add_shader(this.ground_shader_);
    this.gl_.add_shader(this.lidar_shader_);
    this.gl_.add_shader(this.model_shader_);

    this.model_shader_.use();
    this.model_shader_.integer(this.model_shader_.uniform_location('u_albedo'),
                               constants.texture_unit.albedo);
    this.model_shader_.integer(this.model_shader_.uniform_location('u_normal'),
                               constants.texture_unit.normal);
    this.u_model = this.model_shader_.uniform_location('u_model');

    // Binding the paint to an interval event
    this.interval_binder_ = this.request_animation.bind(this);
    this.paint_binder_ = this.paint.bind(this);

    this.gl_.zoom_to(3);
    this.gl_.light_position(2, -5, 5);

    // Creating the menu
    this.menu_ = document.createElement('ul');
    this.menu_.className = 'menu';
    this.object_.append(this.menu_);

    this.zoom_in_ = document.createElement('li');
    this.zoom_in_.addEventListener('mouseup', this.zoom.bind(this, true));
    this.menu_.append(this.zoom_in_);
    this.iso_view_ = document.createElement('li');
    this.iso_view_.addEventListener('mouseup', this.iso_view.bind(this));
    this.menu_.append(this.iso_view_);
    this.top_view_ = document.createElement('li');
    this.top_view_.addEventListener('mouseup', this.top_view.bind(this));
    this.menu_.append(this.top_view_);
    this.zoom_out_ = document.createElement('li');
    this.zoom_out_.addEventListener('mouseup', this.zoom.bind(this, false));
    this.menu_.append(this.zoom_out_);

    this.gl_.canvas().addEventListener('mouseover', this.transparent.bind(this, true));
    this.gl_.canvas().addEventListener('mouseout', this.transparent.bind(this, false));
    this.menu_.addEventListener('mouseover', this.transparent.bind(this, true));
    this.menu_.addEventListener('mouseout', this.transparent.bind(this, false));
  }
  /**
   * @brief Resumes painting the universe gl context
   * 
   * Call this to save CPU usage
   */
  public activate() : void {
    if(!this.active_){
      this.active_ = true;
      this.gl_.activate();
      this.iso_view();
      this.animating_ = true;
      this.timer_ = setInterval(this.interval_binder_, constants.frame_time);
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
   * @brief Hides the WebGL2 context container
   */
  public hide() : void {
    this.gl_.canvas().style.display = 'none';
  }
  /**
   * @brief Moves the camera view to simulate an isometric view
   */
  public iso_view() : void {
    this.update_ = true;
    this.pause_callback_();
    this.animating_ = false;
    this.gl_.zoom_to(3, false);
    this.gl_.rotate_z_to(0, false);
    this.gl_.rotate_x_to(2.58, true);
  }
  /**
   * @brief Paints the OpenGL canvas
   * 
   * @param timestamp The timestamp when this function is requested
   */
  public paint(timestamp : number) : void {
    if(timestamp <= this.last_timestamp_) return;

    this.last_timestamp_ = timestamp;

    const moved : boolean = this.gl_.moved();
    if(moved){
      this.animating_ = false;
      this.pause_callback_();
    }
    if(this.animating_) this.gl_.rotate_z(0.0085);

    // If there is no change then no painting
    if(!this.animating_ && !moved && !this.update_) return;

    // Painting the Ground lines
    this.ground_shader_.use();
    this.ground_.paint();

    // Painting the LiDar points
    this.lidar_shader_.use();
    this.lidar_.paint();

    // Painting the 3D models
    this.model_shader_.use();
    for(var i in this.models_){
      this.models_[i].albedo.activate();
      this.models_[i].albedo.bind();
      this.models_[i].normal.activate();
      this.models_[i].normal.bind();

      this.model_shader_.matrix4f(this.u_model, this.models_[i].matrix);
      this.models_[i].model.draw();
    }
  }
  /**
   * @brief Pauses the rotating animation
   */
  public pause() : void {
    this.animating_ = false;
  }
  /**
   * @brief Restarts animation
   */
  public play() : void {
    this.animating_ = true;
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
  public resize(width : number, scroll_width : number) : void {
    this.menu_.style.right = scroll_width + 'px';
    this.gl_.resize(width, window.innerHeight);
  }
  /**
   * @brief Setting the callback that will be executed when the camera is moved (once per frame)
   * 
   * @param callback_function Callback function to execute
   * 
   * @returns `false` if th callbac_function is null
   */
  public set_pause_callback(callback_function : any) : boolean {
    if(callback_function === null) return false;
    this.pause_callback_ = callback_function;
    return true;
  }
  /**
   * @brief Shows the WebGL2 context container
   */
  public show() : void {
    this.gl_.canvas().style.display = 'block';
  }
  /**
   * @brief Moves the camera view to simulate a top view
   */
  public top_view() : void {
    this.update_ = true;
    this.pause_callback_();
    this.animating_ = false;
    this.gl_.zoom_to(1.7, false);
    this.gl_.rotate_z_to(0, false);
    this.gl_.rotate_x_to(constants.degree_90, true);
  }
  /**
   * @brief Makes the text section transparent to visualize better the WebGL2 context
   * 
   * @param hide `true` to make it transparent
   */
  public transparent(hide : boolean) : void {
    if(hide){
      if(!this.is_transparent_){
        $('#a_autonomous > section, #a_autonomous figure.hide').addClass('transparent');
        this.is_transparent_ = true;
      }
    }else{
      if(this.is_transparent_){
        $('#a_autonomous > section, #a_autonomous figure.hide').removeClass('transparent');
        this.is_transparent_ = false;
      }
    }
  }
  /**
   * @brief Zooms in/out the camera view
   * 
   * @param zoom_in Indicates if it should zoom in
   */
  public zoom(zoom_in : boolean = true) : void {
    this.pause_callback_();
    this.gl_.zoom(zoom_in);
  }
}
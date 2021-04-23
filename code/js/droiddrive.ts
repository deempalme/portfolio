
import * as constants from './gl/constants';
import { ground } from './gl/ground';
import { lidar } from "./gl/lidar";
import { model } from "./gl/model";
import { open_gl } from "./gl/open_gl";
import { shader } from "./gl/shader";
import { texture } from "./gl/texture";
import { ground_shader } from './shaders/ground_shader';
import { lidar_shader } from './shaders/lidar_shader';
import { model_shader } from './shaders/model_shader';


interface model_3d {
  model : model;
  albedo : texture;
  normal : texture;
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

  private active_ : boolean = false;
  private timer_  : number = 0;
  private last_timestamp_ : number = 0;

  // Shaders
  private lidar_shader_  : shader;
  private ground_shader_ : shader;
  private model_shader_  : shader;

  // Function binders
  private interval_binder_ : any;
  private paint_binder_    : any;


  constructor(object : string){
    this.object_ = document.getElementById(object)!;

    // Creating the canvas
    this.gl_ = new open_gl(this.object_);
    let gl : WebGL2RenderingContext = this.gl_.context()!;

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

    this.models_ = [
      { model: car, albedo: car_albedo, normal: car_normal },
      { model: tire, albedo: tire_albedo, normal: tire_normal },
      { model: ring, albedo: ring_albedo, normal: ring_normal }
    ];

    // Loading the LiDar points
    this.lidar_ = new lidar(gl, '/resources/lidar/binary.bin');

    // Creating the ground lines
    this.ground_ = new ground(gl, 20.0);

    // Loading the ground's shader
    this.ground_shader_ = new shader(gl, ground_shader.vertex!, ground_shader.fragment!);
    // Freing memory of unused variables
    ground_shader.vertex = null;
    ground_shader.fragment = null;

    // Loading the lidar's shader
    this.lidar_shader_ = new shader(gl, lidar_shader.vertex!, lidar_shader.fragment!);
    // Freing memory of unused variables
    lidar_shader.vertex = null;
    lidar_shader.fragment = null;

    // Loading the models' shader
    this.model_shader_ = new shader(gl, model_shader.vertex!, model_shader.fragment!);
    // Freing memory of unused variables
    model_shader.vertex = null;
    model_shader.fragment = null;

    this.gl_.add_shader(this.ground_shader_);
    this.gl_.add_shader(this.lidar_shader_);
    this.gl_.add_shader(this.model_shader_);

    // Binding the paint to an interval event
    this.interval_binder_ = this.request_animation.bind(this);
    this.paint_binder_ = this.paint.bind(this);

    this.resize();
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

    // Painting the Ground lines
    this.ground_shader_.use();
    this.ground_.paint();

    // Painting the LiDar points
    this.lidar_shader_.use();
    this.lidar_.draw();

    // Painting the plantes and sun
    this.model_shader_.use();
    for(var i in this.models_){
      this.models_[i].albedo.activate();
      this.models_[i].albedo.bind();
      this.models_[i].normal.activate();
      this.models_[i].normal.bind();
      this.models_[i].model.draw();
    }
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
    this.gl_.resize(this.object_.clientWidth, window.innerHeight);
  }
}
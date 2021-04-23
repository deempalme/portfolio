
import * as constants from './constants';
import { v3 } from '../math/v3';
import { m4 } from '../math/m4';
import { shader } from './shader';


export interface shader_info {
  shader   : shader;
  u_pv     : WebGLUniformLocation | null;
  u_camera : WebGLUniformLocation | null;
  u_light  : WebGLUniformLocation | null;
  u_view   : WebGLUniformLocation | null;
}

export class open_gl
{
  private width_  : number = 0;
  private height_ : number = 0;

  private canvas_ : HTMLCanvasElement;

  private gl_ : WebGL2RenderingContext | null = null;
  private static anisotropic_ext_ : number = 0;
  private static max_text_anisotropy_ : number = 0;

  private ok_ : boolean = false;

  private projection_ : Float32Array = new Float32Array(0);
  private view_ : Float32Array = new Float32Array(0);
  private pv_ : Float32Array = new Float32Array(0);

  private camera_ = { 
    eye : new Float32Array(0), center : new Float32Array(0), up : new Float32Array(0) 
  };
  private zoom_  : number = 1;
  private light_ : Float32Array = new Float32Array(0);
  private initial_eye_ : Float32Array = new Float32Array(0);
  private initial_up_  : Float32Array = new Float32Array(0);

  private shaders_ : Array<shader_info>;

  private active_   : boolean = false;
  private dragging_ : boolean = false;
  private theta_ : number = 0;
  private phi_   : number = 0;
  private increase_w_ : number = 1;
  private increase_h_ : number = 1;
  private moved_ : boolean = false;

  private parent : HTMLElement;

  // Function binders
  private down_binder_ : any;
  private move_binder_ : any;
  private up_binder_   : any;

  /**
   * @brief Creating a new WebGL2 context (canvas) and prepend it inside the parent element
   * 
   * @param parent Parent HTMLElement where the HTMLCanvasElement will be prepend
   * @param alpha  Indicates if the WebGL2 context should have an alpha channel (transparency)
   */
  constructor(parent : HTMLElement, alpha : boolean = true){
    this.shaders_ = new Array<shader_info>(0);
    this.canvas_ = document.createElement('canvas');
    parent.prepend(this.canvas_);

    this.initialize(alpha);

    this.parent = parent;
    this.move_binder_ = this.mouse_move.bind(this);
    this.parent.addEventListener('mousemove', this.move_binder_);
    this.down_binder_ = this.mouse_down.bind(this);
    this.parent.addEventListener('mousedown', this.down_binder_);
    this.up_binder_ = this.mouse_up.bind(this);
    this.parent.addEventListener('mouseup', this.up_binder_);
    this.parent.addEventListener('mouseout', this.up_binder_);
  }
  /**
   * @brief Activating the camera's rotation
   */
  public activate() : void {
    this.active_ = true;
  }
  /**
   * @brief Adding a shader to update its projection and view matrices
   * 
   * @param shader Shader that will be added to the view's update list
   */
  public add_shader(shader : shader) : void {
    shader.use();
    this.shaders_[this.shaders_.length] = {
      shader: shader,
      u_pv: shader.uniform_location('u_pv'),
      u_camera: shader.uniform_location('u_camera_position'),
      u_light: shader.uniform_location('u_light_position'),
      u_view: shader.uniform_location('u_view')
    };
  }
  /**
   * @brief Getting the Camera's rotation angle in the X axis
   * 
   * @returns Current camera's rotation angle in the X axis
   */
  public angle_x() : number {
    return this.phi_;
  }
  /**
   * @brief Getting the Camera's rotation angle in the Z axis
   * 
   * @returns Current camera's rotation angle in the Z axis
   */
  public angle_z() : number {
    return this.theta_;
  }
  /**
   * @brief Getting the texture maximum anisotropy extension
   * 
   * @returns Texture maximum anisotropy extension
   */
  public static anisotropy() : number {
    return open_gl.anisotropic_ext_;
  }
  /**
   * @brief Clearing the OpenGL viewport
   */
  public clear() : void {
    this.gl_?.clear(this.gl_.COLOR_BUFFER_BIT | this.gl_.DEPTH_BUFFER_BIT);
  }
  /**
   * @brief Getting the WebGL context
   * 
   * @returns The current WebGL context or null if there was an error
   */
  public context() : WebGL2RenderingContext | null {
    return this.gl_;
  }
  /**
   * @brief Deactivating the camera's rotation
   */
  public deactivate() : void {
    this.active_ = false;
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    this.parent.removeEventListener('mousemove', this.move_binder_);
    this.parent.removeEventListener('mousedown', this.down_binder_);
    this.parent.removeEventListener('mouseup', this.up_binder_);
    this.parent.removeEventListener('mouseout', this.up_binder_);
  }
  /**
   * @brief Flushing OpenGL context
   */
  public flush() : void {
    this.gl_?.flush();
  }
  /**
   * @brief Initializes the WebGL context
   * 
   * @param alpha Indicates if the webGL context should have transparency
   * 
   * @returns `false` if WebGL failed to initialize correctly
   */
  public initialize(alpha : boolean) : boolean {
    // Checking if browser accepts WebGL
    try{
      this.gl_ = this.canvas_.getContext('webgl2', { alpha: alpha, antialias: true });
    }catch(e){
      console.error("Unable to initialize WebGL. Your browser may not support it.");
      console.error(e);
      return false;
    }

    if(!this.gl_) return false;

    this.gl_.clearColor(0.0, 0.0, 0.0, alpha ? 0.0 : 1.0); // Clear to black, fully opaque
    this.gl_.clearDepth(1.0);                // Clear everything
    this.gl_.enable(this.gl_.DEPTH_TEST);    // Enable depth testing
    this.gl_.depthFunc(this.gl_.LEQUAL);     // Near things obscure far things
    this.gl_.enable(this.gl_.CULL_FACE);     // Enables culling faces
    this.gl_.cullFace(this.gl_.BACK);        // Draws only frontal faces
    if(alpha){
      this.gl_.enable(this.gl_.BLEND);       // Enables alpha
      this.gl_.blendFunc(this.gl_.SRC_ALPHA, this.gl_.ONE_MINUS_SRC_ALPHA);
    }

    // Checking for anisotropic extensions
    let extensions : EXT_texture_filter_anisotropic | null = (
      this.gl_.getExtension("EXT_texture_filter_anisotropic") ||
      this.gl_.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
      this.gl_.getExtension("WEBKIT_EXT_texture_filter_anisotropic")
    );
    if(extensions){
      open_gl.anisotropic_ext_ = extensions.TEXTURE_MAX_ANISOTROPY_EXT;
      open_gl.max_text_anisotropy_ = this.gl_.getParameter(extensions.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    }

    // Camera position
    this.camera_.center = v3.new(0, 0, 0);
    this.initial_eye_ = v3.new(0, 30, 0);
    this.initial_up_ = v3.new(0, 0, -1);

    // Initial rotation
    this.phi_ = 2.58;

    // Light position
    this.light_ = v3.new(0, 0, 0);

    return this.ok_ = true;
  }
  /**
   * @brief Changes the light position for this context
   * 
   * @param x New coordinate in X axis
   * @param y New coordinate in Y axis
   * @param z New coordinate in Z axis
   */
  public light_position(x : number, y : number, z : number) : void {
    this.light_ = v3.new(x, y, z);
    // Updating the light position in all added shaders
    for(var i in this.shaders_){
      this.shaders_[i].shader.use();

      if(this.shaders_[i].u_light == null)
        this.shaders_[i].u_light = this.shaders_[i].shader.uniform_location('u_light_position');

      this.shaders_[i].shader.uniform3fv(this.shaders_[i].u_light, this.light_);
    }
  }
  /**
   * @brief Changes the camera view and updates the data into all registered 
   * shaders with add_shader()
   */
  public look_at() : void {
    if(!this.ok_) return;

    // Rotating the camera for both: Eye position vector
    this.camera_.eye = v3.rotate_x(v3.scalar(this.initial_eye_, this.zoom_), this.phi_);
    this.camera_.eye = v3.rotate_z(this.camera_.eye, this.theta_);
    // And Up vector
    this.camera_.up = v3.rotate_x(this.initial_up_, this.phi_);
    this.camera_.up = v3.rotate_z(this.camera_.up, this.theta_);

    this.view_ = m4.look_at(this.camera_.eye, this.camera_.center, this.camera_.up);
    this.pv_ = m4.multiply(this.projection_, this.view_);

    // Updating projection and view matrices in all added shaders
    for(var i in this.shaders_){
      this.shaders_[i].shader.use();

      // If the projection view matrix is not set then nor any
      if(this.shaders_[i].u_pv == null){
        this.shaders_[i].u_pv = this.shaders_[i].shader.uniform_location('u_pv');
        this.shaders_[i].u_view = this.shaders_[i].shader.uniform_location('u_view');
        this.shaders_[i].u_light = this.shaders_[i].shader.uniform_location('u_light_position');
        this.shaders_[i].u_camera = this.shaders_[i].shader.uniform_location('u_camera_position');
      }

      this.shaders_[i].shader.matrix4f(this.shaders_[i].u_pv, this.pv_);
      this.shaders_[i].shader.uniform3fv(this.shaders_[i].u_camera,
                                         v3.subtract(this.camera_.eye, this.camera_.center));
      this.shaders_[i].shader.uniform3fv(this.shaders_[i].u_light, this.light_);
      this.shaders_[i].shader.matrix4f(this.shaders_[i].u_view, this.view_);
    }
  }
  /**
   * @brief Getting the maximum texture maximum anisotropy
   * 
   * @returns Maximum texture maximum anisotropy
   */
  public static max_anisotropy() : number {
    return open_gl.max_text_anisotropy_;
  }
  /**
   * @brief Indicates if the camera view has been moved with the mouse
   *
   * @returns `true` if the camera has been rotated with the mouse events
   */
  public moved() : boolean {
    const moved : boolean = this.moved_;
    this.moved_ = false;
    return moved;
  }
  /**
   * @brief Resizing event handler
   */
  public resize(width : number, height : number) : boolean {
    if(!this.ok_) return false;

    this.height_ = height;
    this.width_  = width;
    this.canvas_.width = this.width_;
    this.canvas_.height = this.height_;
    this.increase_w_ = 1.3 * Math.PI / this.width_;
    this.increase_h_ = 1.3 * Math.PI / this.height_;
    this.gl_?.viewport(0, 0, this.width_, this.height_);

    this.projection_ = m4.perspective(constants.degree_45, this.width_ / this.height_, 0.1, 1000);
    this.look_at();

    return true;
  }
  /**
   * @brief Rotates the camera throught the X axis a certain angle
   * 
   * @param delta An angle that will be added to the current X angle (in radians)
   */
  public rotate_x(delta : number) : void {
    let angle : number = this.phi_ + delta;
    // Converting to relative angle
    angle /= constants.degree_360;
    // Normalizing
    if(angle >= 1.0) angle -= Math.floor(angle);
    else if(angle < 0) angle -= Math.ceil(angle);
    // Reconverting to radians
    angle *= constants.degree_360;

    this.phi_ = angle;
    this.look_at();
  }
  /**
   * @brief Rotates the camera throught the X axis UNTIL a target angle
   * 
   * @param target_angle The target angle to rotate the X axis
   */
  public rotate_x_to(target_angle : number) : void {
    // Converting to relative angle
    target_angle /= constants.degree_360;
    // Normalizing
    if(target_angle >= 1.0) target_angle -= Math.floor(target_angle);
    else if(target_angle < 0) target_angle -= Math.ceil(target_angle);
    // Reconverting to radians
    target_angle *= constants.degree_360;

    this.phi_ = target_angle;
    this.look_at();
  }
  /**
   * @brief Rotates the camera throught the Z axis
   * 
   * @param delta An angle that will be added to the current Z angle (in radians)
   */
  public rotate_z(delta : number) : void {
    let angle : number = this.theta_ + delta;
    // Converting to relative angle
    angle /= constants.degree_360;
    // Normalizing
    if(angle >= 1.0) angle -= Math.floor(angle);
    else if(angle < 0) angle -= Math.ceil(angle);
    // Reconverting to radians
    angle *= constants.degree_360;

    this.theta_ = angle;
    this.look_at();
  }
  /**
   * @brief Rotates the camera throught the Z axis UNTIL a target angle
   * 
   * @param target_angle The target angle to rotate the Z axis
   */
  public rotate_z_to(target_angle : number) : void {
    // Converting to relative angle
    target_angle /= constants.degree_360;
    // Normalizing
    if(target_angle >= 1.0) target_angle -= Math.floor(target_angle);
    else if(target_angle < 0) target_angle -= Math.ceil(target_angle);
    // Reconverting to radians
    target_angle *= constants.degree_360;

    this.theta_ = target_angle;
    this.look_at();
  }
  /**
   * @brief Changes the viewport size
   * 
   * @param width  New width value, or zero or negative to restore to original size
   * @param height New height value, or zero or negative to restore to original size
   */
  public viewport(width : number, height : number) : void {
    if(width <= 0 || height <= 0)
      this.gl_?.viewport(0, 0, this.width_, this.height_);
    else
      this.gl_?.viewport(0, 0, width, height);
  }
  /**
   * @brief Zooms in/out
   * 
   * @param zooming_in Indicates if it should zoom in, or `false` to zoom out
   */
  public zoom(zooming_in : boolean) : boolean {
    let new_zoom : number;

    if(zooming_in){
      new_zoom = this.zoom_ * 0.8;
      if(new_zoom == this.zoom_) return false;
    }else{
      new_zoom = this.zoom_ * 1.25;
      if(new_zoom == this.zoom_) return false;
    }

    this.zoom_ = new_zoom;
    this.look_at();

    return true;
  }
  /**
   * @brief Zooms to a target level
   * 
   * @param level New zooming level; minimum = 0.001, default = 1, maximum = 20
   */
  public zoom_to(level : number = 1) : boolean {
    let ok : boolean = true;
    if(level < 0.001){
      level = 0.001;
      ok = false;
    }else if(level > 20){
      level = 20;
      ok = false;
    }

    const new_zoom : number = 1.0 / level;
    if(this.zoom_ === new_zoom) return ok;

    this.zoom_ = new_zoom;
    this.look_at();

    return ok;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::

  /**
   * @brief Activates the mouse drag event that rotates the camera
   * 
   * @param event MouseEvent event information
   * 
   * @returns `false` to cancel default events
   */
  private mouse_down(event : MouseEvent) : boolean {
    if(!this.active_) return false;
    this.dragging_ = true;
    event.preventDefault();
    return false;
  }
  /**
   * @brief Rotates the camera using the mouse
   * 
   * @param event MouseEvent event information
   * 
   * @returns `false` to cancel default events
   */
  private mouse_move(event : MouseEvent) : boolean {
    if(!this.dragging_ || !this.active_) return false;

    let x = -event.movementX;
    let y = event.movementY;

    if(x === 0 && y === 0) return false;

    this.theta_ += x * this.increase_w_;
    this.phi_ += y * this.increase_h_;

    if (this.phi_ >= constants.degree_360)
      this.phi_ -= constants.degree_360;
    else if (this.phi_ < 0)
      this.phi_ += constants.degree_360;

    if (this.theta_ >= constants.degree_360)
      this.theta_ -= constants.degree_360;
    else if (this.theta_ < 0)
      this.theta_ += constants.degree_360;

    this.moved_ = true;
    this.look_at();

    event.preventDefault();
    return false;
  }
  /**
   * @brief Deactivates the mouse drag event that rotates the camera
   * 
   * @param event MouseEvent event information
   * 
   * @returns `false` to cancel default events
   */
  private mouse_up(event : MouseEvent) : boolean {
    if(!this.active_) return false;
    this.dragging_ = false;
    event.preventDefault();
   return false;
  }
}

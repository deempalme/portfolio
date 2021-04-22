
import * as constants from './constants';
import { v3 } from '../math/v3';
import { m4 } from '../math/m4';
import { shader } from './shader';


export interface shader_info {
  shader : shader;
  u_pv : WebGLUniformLocation | null;
  u_camera : WebGLUniformLocation | null;
}

export class open_gl
{
  private width  : number = 0;
  private height : number = 0;

  private canvas : HTMLCanvasElement;

  private gl : WebGL2RenderingContext | null = null;
  private static anisotropic_ext : number = 0;
  private static max_text_anisotropy : number = 0;

  public ok : boolean = false;

  public projection : Float32Array = new Float32Array(0);
  public view : Float32Array = new Float32Array(0);
  public pv : Float32Array = new Float32Array(0);

  public camera = { 
    eye : new Float32Array(0), center : new Float32Array(0), up : new Float32Array(0) 
  };
  private zoom  : number = 1;
  private light : Float32Array = new Float32Array(0);
  private initial_eye : Float32Array = new Float32Array(0);
  private initial_up  : Float32Array = new Float32Array(0);

  private shaders : Array<shader_info>;

  private active   : boolean = false;
  private dragging : boolean = false;
  private theta : number = 0;
  private phi   : number = 0;
  private increase_w : number = 1;
  private increase_h : number = 1;
  private moved_ : boolean = false;

  private parent : HTMLElement;

  // Function binders
  private down_binder : any;
  private move_binder : any;
  private up_binder   : any;


  constructor(parent : HTMLElement){
    this.shaders = new Array<shader_info>(0);
    this.canvas = document.createElement('canvas');
    parent.prepend(this.canvas);

    this.initialize();

    this.parent = parent;
    this.move_binder = this.mouse_move.bind(this);
    this.parent.addEventListener('mousemove', this.move_binder);
    this.down_binder = this.mouse_down.bind(this);
    this.parent.addEventListener('mousedown', this.down_binder);
    this.up_binder = this.mouse_up.bind(this);
    this.parent.addEventListener('mouseup', this.up_binder);
    this.parent.addEventListener('mouseout', this.up_binder);
  }
  /**
   * @brief Activating the camera's rotation
   */
  public activate() : void {
    this.active = true;
  }
  /**
   * @brief Adding a shader to update its projection and view matrices
   * 
   * @param shader Shader that will be added to the view's update list
   */
  public add_shader(shader : shader) : void {
    this.shaders[this.shaders.length] = {
      shader: shader,
      u_pv: shader.uniform_location('u_pv'),
      u_camera: shader.uniform_location('u_camera_position')
    };
  }
  /**
   * @brief Getting the Camera's rotation angle in the X axis
   * 
   * @returns Current camera's rotation angle in the X axis
   */
  public angle_x() : number {
    return this.phi;
  }
  /**
   * @brief Getting the Camera's rotation angle in the Z axis
   * 
   * @returns Current camera's rotation angle in the Z axis
   */
  public angle_z() : number {
    return this.theta;
  }
  /**
   * @brief Getting the texture maximum anisotropy extension
   * 
   * @returns Texture maximum anisotropy extension
   */
  public static anisotropy() : number {
    return open_gl.anisotropic_ext;
  }
  /**
   * @brief Clearing the OpenGL viewport
   */
  public clear() : void {
    this.gl?.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  /**
   * @brief Getting the WebGL context
   * 
   * @returns The current WebGL context or null if there was an error
   */
  public context() : WebGL2RenderingContext | null {
    return this.gl;
  }
  /**
   * @brief Deactivating the camera's rotation
   */
  public deactivate() : void {
    this.active = false;
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    this.parent.removeEventListener('mousemove', this.move_binder);
    this.parent.removeEventListener('mousedown', this.down_binder);
    this.parent.removeEventListener('mouseup', this.up_binder);
    this.parent.removeEventListener('mouseout', this.up_binder);
  }
  /**
   * @brief Flushing OpenGL context
   */
  public flush() : void {
    this.gl?.flush();
  }
  /**
   * @brief Initializes the WebGL context
   * 
   * @returns `false` if WebGL failed to initialize correctly
   */
  public initialize() : boolean {
    // Checking if browser accepts WebGL
    try{
      this.gl = this.canvas.getContext('webgl2', { alpha: true, antialias: true });
    }catch(e){
      console.error("Unable to initialize WebGL. Your browser may not support it.");
      console.error(e);
      return false;
    }

    if(!this.gl) return false;

    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);  // Clear to black, fully opaque
    this.gl.clearDepth(1.0);                 // Clear everything
    this.gl.enable(this.gl.DEPTH_TEST);      // Enable depth testing
    this.gl.depthFunc(this.gl.LEQUAL);       // Near things obscure far things
    this.gl.enable(this.gl.CULL_FACE);       // Enables culling faces
    this.gl.cullFace(this.gl.BACK);          // Draws only frontal faces
    this.gl.enable(this.gl.BLEND);           // Enables alpha
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    // Checking for anisotropic extensions
    let extensions : EXT_texture_filter_anisotropic | null = (
      this.gl.getExtension("EXT_texture_filter_anisotropic") ||
      this.gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
      this.gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic")
    );
    if(extensions){
      open_gl.anisotropic_ext = extensions.TEXTURE_MAX_ANISOTROPY_EXT;
      open_gl.max_text_anisotropy = this.gl.getParameter(extensions.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    }

    // Camera position
    this.camera.center = v3.new(0, 0, 0);
    this.initial_eye = v3.new(0, 30, 0);
    this.initial_up = v3.new(0, 0, -1);
    // Initial rotation
    this.phi = 2.58;

    // Light position
    this.light = v3.new(0, 0, 0);

    return this.ok = true;
  }
  /**
   * @brief Changes the camera view and updates the data into all registered 
   * shaders with add_shader()
   */
  public look_at() : void {
    if(!this.ok) return;

    // Rotating the camera for both: Eye position vector
    this.camera.eye = v3.rotate_x(this.initial_eye, this.phi);
    this.camera.eye = v3.rotate_z(this.camera.eye, this.theta);
    // And Up vector
    this.camera.up = v3.rotate_x(this.initial_up, this.phi);
    this.camera.up = v3.rotate_z(this.camera.up, this.theta);

    this.view = m4.look_at(this.camera.eye, this.camera.center, this.camera.up);
    this.pv = m4.multiply(this.projection, this.view);

    // Updating projection and view matrices in all added shaders
    for(var i in this.shaders){
      this.shaders[i].shader.use();

      if(this.shaders[i].u_pv == null)
        this.shaders[i].u_pv = this.shaders[i].shader.uniform_location('u_pv');
      if(this.shaders[i].u_camera == null)
        this.shaders[i].u_camera = this.shaders[i].shader.uniform_location('u_camera_position');

      this.shaders[i].shader.matrix4f(this.shaders[i].u_pv, this.pv);
      this.shaders[i].shader.uniform3fv(this.shaders[i].u_camera,
                                        v3.subtract(this.camera.eye, this.camera.center));
    }
  }
  /**
   * @brief Getting the maximum texture maximum anisotropy
   * 
   * @returns Maximum texture maximum anisotropy
   */
  public static max_anisotropy() : number {
    return open_gl.max_text_anisotropy;
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
    if(!this.ok) return false;

    this.height = height;
    this.width  = width;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.increase_w = 1.3 * Math.PI / this.width;
    this.increase_h = 1.3 * Math.PI / this.height;
    this.gl?.viewport(0, 0, this.width, this.height);

    this.projection = m4.perspective(constants.degree_45, this.width / this.height, 0.1, 1000);
    this.look_at();

    return true;
  }
  /**
   * @brief Rotates the camera throught the X axis
   * 
   * @param delta An angle that will be added to the current X angle (in radians)
   */
  public rotate_x(delta : number) : void {
    let angle : number = this.phi + delta;
    // Converting to relative angle
    angle /= constants.degree_360;
    // Normalizing
    if(angle >= 1.0) angle -= Math.floor(angle);
    else if(angle < 0) angle -= Math.ceil(angle);
    // Reconverting to radians
    angle *= constants.degree_360;

    this.phi = angle;
    this.look_at();
  }
  /**
   * @brief Rotates the camera throught the Z axis
   * 
   * @param delta An angle that will be added to the current Z angle (in radians)
   */
  public rotate_z(delta : number) : void {
    let angle : number = this.theta + delta;
    // Converting to relative angle
    angle /= constants.degree_360;
    // Normalizing
    if(angle >= 1.0) angle -= Math.floor(angle);
    else if(angle < 0) angle -= Math.ceil(angle);
    // Reconverting to radians
    angle *= constants.degree_360;

    this.theta = angle;
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
      this.gl?.viewport(0, 0, this.width, this.height);
    else
      this.gl?.viewport(0, 0, width, height);
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
    if(!this.active) return false;
    this.dragging = true;
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
    if(!this.dragging || !this.active) return false;

    let x = -event.movementX;
    let y = event.movementY;

    if(x === 0 && y === 0) return false;

    this.theta += x * this.increase_w;
    this.phi += y * this.increase_h;

    if (this.phi >= constants.degree_360)
      this.phi -= constants.degree_360;
    else if (this.phi < 0)
      this.phi += constants.degree_360;

    if (this.theta >= constants.degree_360)
      this.theta -= constants.degree_360;
    else if (this.theta < 0)
      this.theta += constants.degree_360;

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
    if(!this.active) return false;
    this.dragging = false;
    event.preventDefault();
   return false;
  }
}

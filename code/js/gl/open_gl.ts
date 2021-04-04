
import * as constants from './constants';
import { v3 } from '../math/v3';
import { m4 } from '../math/m4';
import { shader } from './shader';


export interface shader_info {
  shader : shader;
  u_pv : WebGLUniformLocation | null;
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
  public light : Float32Array = new Float32Array(0);

  private shaders : Array<shader_info>;

  constructor(parent : HTMLElement){
    this.shaders = new Array<shader_info>(0);
    this.canvas = document.createElement('canvas');
    parent.prepend(this.canvas);

    this.initialize();
  }
  /**
   * @brief Adding a shader to update its projection and view matrices
   * 
   * @param shader Shader that will be added to the view's update list
   */
  public add_shader(shader : shader) : void {
    this.shaders[this.shaders.length] = {
      shader: shader,
      u_pv: shader.uniform_location('u_pv')
    };
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

  public context() : WebGL2RenderingContext | null {
    return this.gl;
  }
  /**
   * @brief Flushing OpenGL context
   */
  public flush() : void {
    this.gl?.flush();
  }

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

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
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
    this.camera.eye = v3.new(0, -20, 20);
    this.camera.center = v3.new(0, 0, 0);
    this.camera.up = v3.new(0, 1, 0);

    // Light position
    this.light = v3.new(0, 0, 0);

    return this.ok = true;
  }

  public look_at() : void {
    if(!this.ok) return;

    this.view = m4.look_at(this.camera.eye, this.camera.center, this.camera.up);
    this.pv = m4.multiply(this.projection, this.view);

    // Updating projection and view matrices in all added shaders
    for(var i in this.shaders){
      this.shaders[i].shader.use();

      if(this.shaders[i].u_pv == null)
        this.shaders[i].u_pv = this.shaders[i].shader.uniform_location('u_pv');

      this.shaders[i].shader.matrix4f(this.shaders[i].u_pv, this.pv);
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
   * @brief Resizing event handler
   */
  public resize(width : number, height : number) : boolean {
    if(!this.ok) return false;

    this.height = height;
    this.width  = width;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.gl?.viewport(0, 0, this.width, this.height);

    this.projection = m4.perspective(constants.degree_45, this.width / this.height, 0.1, 1000);
    this.look_at();

    return true;
  }
}

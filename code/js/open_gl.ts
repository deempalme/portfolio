
import { v3 } from './v3';
import { m4 } from './m4';


export class open_gl
{
  public static degree_45 : number = Math.PI * 0.25;

  private width  : number = 0;
  private height : number = 0;

  private canvas : HTMLCanvasElement;
  private parent : HTMLElement;

  private gl : WebGL2RenderingContext | null = null;
  public static extensions : EXT_texture_filter_anisotropic | null = null;

  public ok : boolean = false;

  public projection : Float32Array = new Float32Array(0);
  public view : Float32Array = new Float32Array(0);
  public pv : Float32Array = new Float32Array(0);

  public camera = { 
    eye : new Float32Array(0), center : new Float32Array(0), up : new Float32Array(0) 
  };
  public light : Float32Array = new Float32Array(0);

  constructor(parent : HTMLElement){
    this.canvas = document.createElement('canvas');
    (this.parent = parent).prepend(this.canvas);

    this.initialize();
    this.resize();
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
    this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
    this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things
    this.gl.enable(this.gl.CULL_FACE);            // Draws only frontal faces
    this.gl.cullFace(this.gl.BACK);
    this.gl.enable(this.gl.BLEND);                // Enables alpha
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    open_gl.extensions = (
      this.gl.getExtension("EXT_texture_filter_anisotropic") ||
      this.gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
      this.gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic")
    );

    this.camera.eye = v3.new(0, 2, 10);
    this.camera.center = v3.new(0, 0, 0);
    this.camera.up = v3.new(0, 1, 0);

    this.light = v3.new(0, 0, 0);

    return this.ok = true;
  }

  look_at(){
    this.view = m4.look_at(this.camera.eye, this.camera.center, this.camera.up);
    this.pv = m4.multiply(this.projection, this.view);

    // TODO: update view matrices in all shaders
  }

  /**
   * @brief Resizing event handler
   */
  public resize() : boolean {
    if(!this.ok) return false;

    this.height = window.innerHeight;
    this.width  = this.canvas.clientWidth;
    this.canvas.height = this.height;
    this.gl?.viewport(0, 0, this.width, this.height);

    this.projection = m4.perspective(open_gl.degree_45, this.width / this.height, 0.1, 1000);
    this.look_at();

    return true;
  }
}

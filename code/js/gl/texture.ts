
import { open_gl } from './open_gl';

export class texture
{
  private id : WebGLTexture | null;
  private texture_number : number = 0;
  private image : HTMLImageElement | null;
  public finished : boolean = false; 

  private gl : WebGL2RenderingContext;

  constructor(context : WebGL2RenderingContext, image_url : string, texture_number : number){
    this.gl = context;
    this.texture_number = texture_number;

    this.id = this.gl.createTexture();

    var this_class = this;
    this.image = new Image();
    this.image.onload = function(){ this_class.initialize(); };
    this.image.src = image_url;
  }
  /**
   * @brief Loading the image data into an OpenGL texture
   * 
   * It should be called automatically after the image finishes loading
   * 
   * @returns `false` if image was not properly loaded
   */
  public initialize() : boolean {
    if(!this.image) return false;

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, 
                          this.gl.LINEAR_MIPMAP_LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB8, this.image.width, this.image.height, 
                       0, this.gl.RGB, this.gl.UNSIGNED_BYTE, this.image);

    let max = open_gl.max_anisotropy();
    max = (max > 8.0) ? 8.0 : max;
    this.gl.texParameterf(this.gl.TEXTURE_2D, open_gl.anisotropy(), max);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    this.finished = true;
    this.image = null;

    return true;
  }
  /**
   * @brief Activates this texture
   */
  public activate() : void {
    this.gl.activeTexture(this.gl.TEXTURE0 + this.texture_number);
  }
  /**
   * @brief Binds the texture to the current context
   */
  public bind() : void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
  }
  /**
   * @brief Indicates if the image has finished loading and that it was loaded into OpenGL
   * 
   * @returns `true` if it is loaded
   */
  public loaded() : boolean {
    return this.finished;
  }
}

import { open_gl } from './open_gl';
import { model_loader } from './model_loader';

export class texture
{
  private id : WebGLTexture | null;
  private texture_number : number = 0;
  private image : HTMLImageElement | null;
  public loaded : boolean = false; 

  private gl : WebGL2RenderingContext;

  constructor(context : WebGL2RenderingContext, image_url : string, texture_number : number){
    this.gl = context;
    this.texture_number = texture_number;

    this.id = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

    this.image = new HTMLImageElement();
    var this_class = this;
    this.image.onload = function(){ this_class.initialize(); };
    this.image.src = image_url;
  }

  public initialize() : boolean {
    if(!this.image) return false;

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, 
                          this.gl.LINEAR_MIPMAP_LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB8, this.image.width, this.image.height, 
                       0, this.gl.RGB, this.gl.UNSIGNED_BYTE, this.image);
    if(open_gl.extensions){
      let max = this.gl.getParameter(open_gl.extensions.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      max = (max > 8.0) ? 8.0 : max;
      this.gl.texParameterf(this.gl.TEXTURE_2D, open_gl.extensions.TEXTURE_MAX_ANISOTROPY_EXT, max);
    }
    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    this.loaded = true;
    this.image = null;

    model_loader.count();

    return true;
  }

  public activate() : void {
    this.gl.activeTexture(this.gl.TEXTURE0 + this.texture_number);
  }

  public bind() : void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
  }

  public release() : void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
}
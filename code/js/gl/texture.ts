
import { open_gl } from './open_gl';

export class texture
{
  private id : WebGLTexture | null;
  private texture_number : number = 0;
  private image : HTMLImageElement | null;
  public finished : boolean = false; 

  private gl : WebGL2RenderingContext;

  constructor(context : WebGL2RenderingContext, image_url : string | null,
              texture_number : number, flip_y : boolean = true, channels : number = 3){
    this.gl = context;
    this.texture_number = texture_number;

    this.id = this.gl.createTexture();

    if(image_url === null){
      this.image = null;
    }else{
      var this_class = this;
      this.image = new Image();
      this.image.onload = function(){ this_class.initialize(flip_y, channels); };
      this.image.src = image_url;
    }
  }
  /**
   * @brief Activates this texture
   */
  public activate() : void {
    this.gl.activeTexture(this.gl.TEXTURE0 + this.texture_number);
  }
  /**
   * @brief Allocates texture data
   * 
   * @param width Specifies the width of the texture image.
   * @param height Specifies the height of the texture image
   * @param texture_data Specifies a pointer to the image data in memory.
   * @param internal_format Specifies the number of color components in the texture.
   * @param format Specifies the format of the pixel data. The following symbolic
   *               values are accepted: RED, RG, RGB, BGR, RGBA,
   *               BGRA, RED_INTEGER, RG_INTEGER, RGB_INTEGER,
   *               BGR_INTEGER, RGBA_INTEGER, BGRA_INTEGER,
   *               STENCIL_INDEX, DEPTH_COMPONENT, DEPTH_STENCIL.
   * @param type Specifies the data type of the pixel data. The following
   *             symbolic values are accepted: UNSIGNED_BYTE, BYTE,
   *             UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT,
   *             HALF_FLOAT, FLOAT, UNSIGNED_BYTE_3_3_2,
   *             UNSIGNED_BYTE_2_3_3_REV, UNSIGNED_SHORT_5_6_5,
   *             UNSIGNED_SHORT_5_6_5_REV, UNSIGNED_SHORT_4_4_4_4,
   *             UNSIGNED_SHORT_4_4_4_4_REV, UNSIGNED_SHORT_5_5_5_1,
   *             UNSIGNED_SHORT_1_5_5_5_REV, UNSIGNED_INT_8_8_8_8,
   *             UNSIGNED_INT_8_8_8_8_REV, UNSIGNED_INT_10_10_10_2,
   *             and UNSIGNED_INT_2_10_10_10_REV.
   * @param level Specifies the level-of-detail number. Level 0 is the base image level.
   *              Level n is the nth mipmap reduction image.
   * @returns 
   */
  public allocate(width : number, height : number, texture_data : ArrayBufferView | null = null,
                  internal_format : number = this.gl.RGBA8, format : number = this.gl.RGBA,
                  type : number = this.gl.UNSIGNED_BYTE, level : number = 0) : boolean {
    if(this.image !== null || this.id === null) return false;

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.bind();
    this.parameteri(this.gl.REPEAT, this.gl.REPEAT, this.gl.LINEAR, this.gl.LINEAR);
    this.gl.texImage2D(this.gl.TEXTURE_2D, level, internal_format, width, height, 
                       0, format, type, texture_data);
    this.finished = true;
    return false;
  }
  /**
   * @brief Binds the texture to the current context
   */
  public bind() : void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
  }
  /**
   * @brief Flips the Y axis of all the image's data when is allocated
   * 
   * @param flip `true` to flip or `false` to not
   */
  public flip_y(flip : boolean = true) : void {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, flip);
  }
  /**
   * @brief Indicates if the image has finished loading and that it was loaded into OpenGL
   * 
   * @returns `true` if it is loaded
   */
  public loaded() : boolean {
    return this.finished;
  }
  /**
   * @brief Set texture parameters
   *
   * @param wrap_s     Sets the wrap parameter for texture coordinate s to either
   *                   CLAMP_TO_EDGE, CLAMP_TO_BORDER, MIRRORED_REPEAT,
   *                   REPEAT, or MIRROR_CLAMP_TO_EDGE.
   * @param wrap_t     Sets the wrap parameter for texture coordinate t to either
   *                   CLAMP_TO_EDGE, CLAMP_TO_BORDER, MIRRORED_REPEAT,
   *                   REPEAT, or MIRROR_CLAMP_TO_EDGE.
   * @param min_filter The texture minifying function is used whenever the
   *                   level-of-detail function used when sampling from the
   *                   texture determines that the texture should be minified.
   *                   NEAREST, LINEAR, NEAREST_MIPMAP_NEAREST,
   *                   LINEAR_MIPMAP_NEAREST, NEAREST_MIPMAP_LINEAR,
   *                   or LINEAR_MIPMAP_LINEAR
   * @param mag_filter The texture magnification function is used whenever the
   *                   level-of-detail function used when sampling from the texture
   *                   determines that the texture should be magified:
   *                   NEAREST, or LINEAR
   * 
   * @returns `false` if the WebGLTexture was not correctly loaded 
   */
  public parameteri(wrap_s : number, wrap_t : number, 
                    min_filter : number, mag_filter : number) : boolean {
    if(this.id === null) return false;

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, mag_filter);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, min_filter);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, wrap_s);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, wrap_t);
    return true;
  }
  /**
   * @brief Releases the texture from the current context
   */
  public release() : void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
  /**
   * @brief Getting the texture's name
   * 
   * @returns The current texture's name or null if there was an error or not loaded yet
   */
  public texture_id() : WebGLTexture | null {
    return this.id;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::

  /**
   * @brief Loading the image data into an OpenGL texture
   * 
   * It should be called automatically after the image finishes loading
   * 
   * @returns `false` if image was not properly loaded
   */
  private initialize(flip_y : boolean, channels : number) : boolean {
    if(this.image === null) return false;

    this.bind();
    this.flip_y(flip_y);
    this.parameteri(this.gl.REPEAT, this.gl.REPEAT, this.gl.LINEAR, this.gl.LINEAR);
    if(channels == 4)
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA8, this.image.width, this.image.height, 
                         0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
    else
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
}
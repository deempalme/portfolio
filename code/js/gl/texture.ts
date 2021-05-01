
import { loader } from '../loader';
import { open_gl } from './open_gl';


export class texture
{
  private id_    : WebGLTexture | null;
  private image_ : HTMLImageElement | null;
  private texture_number_ : number = 0;
  public finished : boolean = false; 

  private gl_ : WebGL2RenderingContext;

  /**
   * @brief Loads and uploads a texture into a WebGL texture
   * 
   * @param context Current WebGL context
   * @param image_url Image's URL path
   * @param texture_number Indicates this texture's active number
   * @param flip_y Indicates if the vertical axis should be fliped
   * @param channels Indicates the number of channels for this image (1, 2, 3, 4)
   */
  constructor(context : WebGL2RenderingContext, image_url : string | null,
              texture_number : number, flip_y : boolean = true, channels : number = 3){
    this.gl_ = context;
    this.texture_number_ = texture_number;

    this.id_ = this.gl_.createTexture();

    if(image_url === null){
      this.image_ = null;
    }else{
      this.image_ = new Image();
      loader.load_image(image_url, this.image_, this.initialize.bind(this, flip_y, channels));
    }
  }
  /**
   * @brief Activates this texture
   */
  public activate() : void {
    this.gl_.activeTexture(this.gl_.TEXTURE0 + this.texture_number_);
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
                  internal_format : number = this.gl_.RGBA8, format : number = this.gl_.RGBA,
                  type : number = this.gl_.UNSIGNED_BYTE, level : number = 0) : boolean {
    if(this.image_ !== null || this.id_ === null) return false;

    this.gl_.bindTexture(this.gl_.TEXTURE_2D, this.id_);
    this.bind();
    this.parameteri(this.gl_.REPEAT, this.gl_.REPEAT, this.gl_.LINEAR, this.gl_.LINEAR);
    this.gl_.texImage2D(this.gl_.TEXTURE_2D, level, internal_format, width, height, 
                       0, format, type, texture_data);
    this.finished = true;
    return false;
  }
  /**
   * @brief Binds the texture to the current context
   */
  public bind() : void {
    this.gl_.bindTexture(this.gl_.TEXTURE_2D, this.id_);
  }
  /**
   * @brief Flips the Y axis of all the image's data when is allocated
   * 
   * @param flip `true` to flip or `false` to not
   */
  public flip_y(flip : boolean = true) : void {
    this.gl_.pixelStorei(this.gl_.UNPACK_FLIP_Y_WEBGL, flip);
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
    if(this.id_ === null) return false;

    this.gl_.texParameteri(this.gl_.TEXTURE_2D, this.gl_.TEXTURE_MAG_FILTER, mag_filter);
    this.gl_.texParameteri(this.gl_.TEXTURE_2D, this.gl_.TEXTURE_MIN_FILTER, min_filter);
    this.gl_.texParameteri(this.gl_.TEXTURE_2D, this.gl_.TEXTURE_WRAP_S, wrap_s);
    this.gl_.texParameteri(this.gl_.TEXTURE_2D, this.gl_.TEXTURE_WRAP_T, wrap_t);
    return true;
  }
  /**
   * @brief Releases the texture from the current context
   */
  public release() : void {
    this.gl_.bindTexture(this.gl_.TEXTURE_2D, null);
  }
  /**
   * @brief Getting the texture's name
   * 
   * @returns The current texture's name or null if there was an error or not loaded yet
   */
  public texture_id() : WebGLTexture | null {
    return this.id_;
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
    if(this.image_ === null) return false;

    this.bind();
    this.flip_y(flip_y);
    this.parameteri(this.gl_.REPEAT, this.gl_.REPEAT, this.gl_.LINEAR, this.gl_.LINEAR);
    if(channels == 4)
      this.gl_.texImage2D(this.gl_.TEXTURE_2D, 0, this.gl_.RGBA8, this.image_.width,
                          this.image_.height, 0, this.gl_.RGBA, this.gl_.UNSIGNED_BYTE,
                          this.image_);
    else
      this.gl_.texImage2D(this.gl_.TEXTURE_2D, 0, this.gl_.RGB8, this.image_.width,
                          this.image_.height, 0, this.gl_.RGB, this.gl_.UNSIGNED_BYTE,
                          this.image_);

    let max = open_gl.max_anisotropy();
    max = (max > 8.0) ? 8.0 : max;
    this.gl_.texParameterf(this.gl_.TEXTURE_2D, open_gl.anisotropy(), max);
    this.gl_.generateMipmap(this.gl_.TEXTURE_2D);

    this.finished = true;
    this.image_ = null;

    return true;
  }
}
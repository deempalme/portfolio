
import { texture } from "./texture";


export class framebuffer
{
  private id_     : WebGLFramebuffer | null = null;
  private render_ : WebGLRenderbuffer | null = null;
  private ok_     : boolean = false;

  private gl_ : WebGL2RenderingContext;

  /**
   * @brief Creates a WebGL framebuffer to perform post-rendering effects
   * 
   * @param context Current WebGL context
   * @param generate Indicates if it should generate the framebuffers immediatelly
   * @param add_render_buffer Indicates if it should add a renderbuffer too
   */
  constructor(context : WebGL2RenderingContext, generate : boolean = false,
              add_render_buffer : boolean = false){
    this.gl_ = context;
    if(generate) this.generate_frame();
    if(add_render_buffer) this.generate_render();
  }
  /**
   * @brief Attaches a texture into the frame buffer
   * 
   * @param texture Texture that will be attached
   * @param attachment Defines to which color attachment will be linked
   * @param texture_target Defines the texture's target
   * @param level Defines texture's level
   * 
   * @return false if frame buffer was not generated
   */
  public attach_2D(texture : texture, attachment : number = this.gl_.COLOR_ATTACHMENT0, 
                   texture_target : number = this.gl_.TEXTURE_2D, level : number = 0) : boolean {
    if(this.id_ === null) return false;

    this.gl_.framebufferTexture2D(this.gl_.FRAMEBUFFER, attachment, texture_target,
                                 texture.texture_id(), level);
    return true;
  }
  /**
   * @brief Attaches the render buffer to the frame buffer
   * 
   * @param render_attachment Render's sttachment type
   * 
   * @return false if frame buffer or render buffer have not been generated
   */
  public attach_render(render_attachment : number = this.gl_.DEPTH_ATTACHMENT) : boolean {
    if(this.id_ === null || this.render_ === null) return false;

    this.gl_.framebufferRenderbuffer(this.gl_.FRAMEBUFFER, render_attachment,
                                     this.gl_.RENDERBUFFER, this.render_);
    return true;
  }
  /**
   * @brief Binds the frame buffer
   * 
   * @return false if frame buffer was not generated
   */
  public bind() : boolean {
    if(!this.ok_) return false;
    this.gl_.bindFramebuffer(this.gl_.FRAMEBUFFER, this.id_);
    return true;
  }
  /**
   * @brief Binds the render buffer
   * 
   * @return false if render was not generated
   */
  public bind_render() : boolean {
    if(!this.ok_) return false;
    this.gl_.bindRenderbuffer(this.gl_.RENDERBUFFER, this.render_);
    return true;
  }
  /**
   * @brief Getting the webgl2 rendering context
   * @returns the webgl2 rendering context
   */
  public context() : WebGL2RenderingContext {
    return this.gl_;
  }
  /**
   * @brief Deletes the frame buffer and render buffer (if created)
   * 
   * @return false if frame buffer does not exist
   */
  public delete() : boolean {
    if(this.id_ === null) return false;

    this.gl_.deleteFramebuffer(this.id_);
    this.id_ = null;

    this.delete_render();
    return !(this.ok_ = false);
  }
  /**
   * @brief Deletes the render buffer
   * 
   * @return false if render buffer does not exist
   */
  public delete_render() : boolean {
    if(this.render_ === null) return false;

    this.gl_.deleteRenderbuffer(this.render_);
    this.render_ = null;
    return true;
  }
  /**
   * @brief Specify which color buffers are to be drawn into
   *
   * @param buffers Points to an array of symbolic constants specifying the buffers
   *        into which fragment colors or data values will be written.
   */
  public draw_buffers(buffers : GLenum[]) : void {
    this.gl_.drawBuffers(buffers);
  }
  /**
   * @brief Generates a frame buffer and optionally a render buffer too
   * 
   * @return false if frame buffer was already created
   */
  public generate_frame(generate_renderbuffer : boolean = false) : boolean {
    if(this.id_ !== null) return this.ok_ = false;

    this.id_ = this.gl_.createFramebuffer();

    if(generate_renderbuffer)
      this.generate_render();

    return this.ok_ = this.id_ !== null;
  }
  /**
   * @brief Generates a render buffer
   * 
   * @return false if render buffer was already generated
   */
  public generate_render() : boolean {
    if(this.render_ !== null) return false;
    this.render_ = this.gl_.createRenderbuffer();
    return this.render_ !== null;
  }
  /**
   * @brief Select a color buffer source for pixels
   *
   * Specifies a color buffer as the source for subsequent `read_pixel`
   * 
   * @param buffer_source Color attachment that will be read
   *
   * @return false if frame buffer is not created yet
   */
  public read_buffer(buffer_source : number = this.gl_.COLOR_ATTACHMENT0) : void {
    this.gl_.readBuffer(buffer_source);
  }
  /**
   * @brief Releases the actual frame buffer
   * 
   * @return false if frame buffer is not created yet
   */
  public release() : void {
    this.gl_.bindFramebuffer(this.gl_.FRAMEBUFFER, null);
  }
  /**
   * @brief Releases the render buffer
   * 
   * @return false if render buffer is not created yet
   */
  public release_render() : void {
    this.gl_.bindRenderbuffer(this.gl_.RENDERBUFFER, null);
  }
  /**
   * @brief Defines Render Buffer properties
   * 
   * @param width Render's buffer width
   * @param height Render's buffer height
   * @param internal_format Render's internal format
   * 
   * @return false if render buffer is not created yet
   */
  public render_storage(width : number, height : number, 
                        internal_format : number = this.gl_.DEPTH_COMPONENT24) : boolean {
    if(this.render_ === null) return false;

    this.gl_.renderbufferStorage(this.gl_.RENDERBUFFER, internal_format, width, height);
    return true;
  }
  /**
   * @brief Returning the status of this frame buffer
   * 
   * @return for more info see
   *    https://khronos.org/registry/OpenGL-Refpages/gl4/html/glCheckFramebufferStatus.xhtml
   */
  public status() : number {
    return this.gl_.checkFramebufferStatus(this.gl_.FRAMEBUFFER);
  }
  /**
   * @brief Returning the datailed explanation of the current framebuffer's status
   * 
   * @return Detailed information about the current error
   */
  public status_msg() : string {
    const frame_status : number = this.status();

    if(frame_status != this.gl_.FRAMEBUFFER_COMPLETE){
      switch(frame_status){
        case this.gl_.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        return "The attachment types are mismatched or not all framebuffer attachment points are framebuffer attachment complete.";
        break;
        case this.gl_.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        return "There is no attachment.";
        break;
        case this.gl_.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        return "Height and width of the attachment are not the same.";
        break;
        case this.gl_.FRAMEBUFFER_UNSUPPORTED:
        return "The format of the attachment is not supported or if depth and stencil attachments are not the same renderbuffer.";
        break;
        case this.gl_.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
        return "The values of gl.RENDERBUFFER_SAMPLES are different among attached renderbuffers, or are non-zero if the attached images are a mix of renderbuffers and textures. ";
        break;
        default:
        return "Unknown error.";
        break;
      }
    }
    return "The framebuffer is ready to display.";
  }
}
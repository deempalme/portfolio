import { texture } from "./texture";


export class framebuffer
{
  private id : WebGLFramebuffer | null = null;
  private render : WebGLRenderbuffer | null = null;
  private ok : boolean = false;

  private gl : WebGL2RenderingContext;

  constructor(context : WebGL2RenderingContext, generate : boolean = false,
              add_render_buffer : boolean = false){
    this.gl = context;
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
  public attach_2D(texture : texture, attachment : number = this.gl.COLOR_ATTACHMENT0, 
                   texture_target : number = this.gl.TEXTURE_2D, level : number = 0) : boolean {
    if(this.id === null) return false;

    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachment, texture_target,
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
  public attach_render(render_attachment : number = this.gl.DEPTH_ATTACHMENT) : boolean {
    if(this.id === null || this.render === null) return false;

    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, render_attachment,
                                    this.gl.RENDERBUFFER, this.render);
    return true;
  }
  /**
   * @brief Binds the frame buffer
   * 
   * @return false if frame buffer was not generated
   */
  public bind() : boolean {
    if(!this.ok) return false;
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.id);
    return true;
  }
  /**
   * @brief Binds the render buffer
   * 
   * @return false if render was not generated
   */
  public bind_render() : boolean {
    if(!this.ok) return false;
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.render);
    return true;
  }
  /**
   * @brief Getting the webgl2 rendering context
   * @returns the webgl2 rendering context
   */
  public context() : WebGL2RenderingContext {
    return this.gl;
  }
  /**
   * @brief Deletes the frame buffer and render buffer (if created)
   * 
   * @return false if frame buffer does not exist
   */
  public delete() : boolean {
    if(this.id === null) return false;

    this.gl.deleteFramebuffer(this.id);
    this.id = null;

    this.delete_render();
    return !(this.ok = false);
  }
  /**
   * @brief Deletes the render buffer
   * 
   * @return false if render buffer does not exist
   */
  public delete_render() : boolean {
    if(this.render === null) return false;

    this.gl.deleteRenderbuffer(this.render);
    this.render = null;
    return true;
  }
  /**
   * @brief Specify which color buffers are to be drawn into
   *
   * @param buffers Points to an array of symbolic constants specifying the buffers
   *        into which fragment colors or data values will be written.
   */
  public draw_buffers(buffers : GLenum[]) : void {
    this.gl.drawBuffers(buffers);
  }
  /**
   * @brief Generates a frame buffer and optionally a render buffer too
   * 
   * @return false if frame buffer was already created
   */
  public generate_frame(generate_renderbuffer : boolean = false) : boolean {
    if(this.id !== null) return this.ok = false;

    this.id = this.gl.createFramebuffer();

    if(generate_renderbuffer)
      this.generate_render();

    return this.ok = this.id !== null;
  }
  /**
   * @brief Generates a render buffer
   * 
   * @return false if render buffer was already generated
   */
  public generate_render() : boolean {
    if(this.render !== null) return false;
    this.render = this.gl.createRenderbuffer();
    return this.render !== null;
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
  public read_buffer(buffer_source : number = this.gl.COLOR_ATTACHMENT0) : void {
    this.gl.readBuffer(buffer_source);
  }
  /**
   * @brief Releases the actual frame buffer
   * 
   * @return false if frame buffer is not created yet
   */
  public release() : void {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }
  /**
   * @brief Releases the render buffer
   * 
   * @return false if render buffer is not created yet
   */
  public release_render() : void {
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
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
                        internal_format : number = this.gl.DEPTH_COMPONENT24) : boolean {
    if(this.render === null) return false;

    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, internal_format, width, height);
    return true;
  }
  /**
   * @brief Returning the status of this frame buffer
   * 
   * @return for more info see
   *    https://khronos.org/registry/OpenGL-Refpages/gl4/html/glCheckFramebufferStatus.xhtml
   */
  public status() : number {
    return this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
  }
  /**
   * @brief Returning the datailed explanation of the current framebuffer's status
   * 
   * @return Detailed information about the current error
   */
  public status_msg() : string {
    const frame_status : number = this.status();

    if(frame_status != this.gl.FRAMEBUFFER_COMPLETE){
      switch(frame_status){
        case this.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        return "The attachment types are mismatched or not all framebuffer attachment points are framebuffer attachment complete.";
        break;
        case this.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        return "There is no attachment.";
        break;
        case this.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        return "Height and width of the attachment are not the same.";
        break;
        case this.gl.FRAMEBUFFER_UNSUPPORTED:
        return "The format of the attachment is not supported or if depth and stencil attachments are not the same renderbuffer.";
        break;
        case this.gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
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
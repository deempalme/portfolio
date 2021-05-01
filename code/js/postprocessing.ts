
import * as constants from './gl/constants';
import { framebuffer } from "./gl/framebuffer";
import { open_gl } from './gl/open_gl';
import { shader } from './gl/shader';
import { texture } from "./gl/texture";
import { frame_shader } from './shaders/frame_shader';
import { gauss_shader } from './shaders/gauss_shader';


export class postprocessing
{
  private frame_   : framebuffer;
  private frame_2_ : framebuffer;
  private frame_3_ : framebuffer;

  private color_   : texture;
  private bloom_   : texture;
  private gauss_1_ : texture;
  private gauss_2_ : texture;

  private shader_out_   : shader;
  private shader_gauss_ : shader;
  private u_horizontal_ : WebGLUniformLocation | null;

  private gl_ : open_gl;
  private unitary_buffer_ : WebGLVertexArrayObject;

  private half_x_ : number = 0;
  private half_y_ : number = 0;


  /**
   * @brief This controls the portprocessing event
   * 
   * @param open_gl Current WebGL context
   */
  constructor(open_gl : open_gl){
    this.gl_ = open_gl;
    let context : WebGL2RenderingContext = open_gl.context()!;

    // Creating the textures for the framebuffer
    this.color_ = new texture(context, null, constants.texture_unit.color);
    this.color_.bind();
    this.color_.parameteri(context.REPEAT, context.REPEAT, context.NEAREST, context.NEAREST);
    // Initial size doesn't matter because they will be resized when we call this.resize()
    this.color_.allocate(64, 64);
    this.color_.release();

    this.bloom_ = new texture(context, null, constants.texture_unit.bloom);
    this.bloom_.bind();
    this.bloom_.parameteri(context.REPEAT, context.REPEAT, context.NEAREST, context.NEAREST);
    this.bloom_.allocate(64, 64);
    this.bloom_.release();

    this.gauss_1_ = new texture(context, null, constants.texture_unit.bloom);
    this.gauss_1_.bind();
    this.gauss_1_.parameteri(context.REPEAT, context.REPEAT, context.LINEAR, context.LINEAR);
    this.gauss_1_.allocate(64, 64);
    this.gauss_1_.release();

    this.gauss_2_ = new texture(context, null, constants.texture_unit.bloom);
    this.gauss_2_.bind();
    this.gauss_2_.parameteri(context.REPEAT, context.REPEAT, context.LINEAR, context.LINEAR);
    this.gauss_2_.allocate(64, 64);
    this.gauss_2_.release();

    // Creating the framebuffer and attaching its textures for creating the color and bloom texture
    this.frame_ = new framebuffer(context, true);
    this.frame_.bind();
    this.frame_.attach_2D(this.color_, context.COLOR_ATTACHMENT0 + constants.framebuffer.color);
    this.frame_.attach_2D(this.bloom_, context.COLOR_ATTACHMENT0 + constants.framebuffer.bloom);
    this.frame_.draw_buffers([
      context.COLOR_ATTACHMENT0 + constants.framebuffer.color,
      context.COLOR_ATTACHMENT0 + constants.framebuffer.bloom
    ]);
    if(this.frame_.status() != context.FRAMEBUFFER_COMPLETE)
      console.error(this.frame_.status_msg());
    this.frame_.release();

    // Creating the framebuffer and attaching its textures for horizontal gauss blurr
    this.frame_2_ = new framebuffer(context, true);
    this.frame_2_.bind();
    this.frame_2_.attach_2D(this.gauss_1_, context.COLOR_ATTACHMENT0 + constants.framebuffer.gauss);
    this.frame_2_.draw_buffers([ context.COLOR_ATTACHMENT0 + constants.framebuffer.gauss ]);
    if(this.frame_2_.status() != context.FRAMEBUFFER_COMPLETE)
      console.error(this.frame_2_.status_msg());
    this.frame_2_.release();

    // Creating the framebuffer and attaching its textures for vertical gauss blurr
    this.frame_3_ = new framebuffer(context, true);
    this.frame_3_.bind();
    this.frame_3_.attach_2D(this.gauss_2_, context.COLOR_ATTACHMENT0 + constants.framebuffer.gauss);
    this.frame_3_.draw_buffers([ context.COLOR_ATTACHMENT0 + constants.framebuffer.gauss ]);
    if(this.frame_3_.status() != context.FRAMEBUFFER_COMPLETE)
      console.error(this.frame_3_.status_msg());
    this.frame_3_.release();

    // Vertex buffer data
    let data : Float32Array = new Float32Array([
      // Position  // Texture coordinates
      1.0, 1.0,    1.0, 0.0,
      1.0, 0.0,    1.0, 1.0,
      0.0, 1.0,    0.0, 0.0,
      1.0, 0.0,    1.0, 1.0,
      0.0, 0.0,    0.0, 1.0,
      0.0, 1.0,    0.0, 0.0
    ]);

    // Creating the vertex buffer to drwa the post processing effects into screen
    this.unitary_buffer_ = context.createVertexArray()!;
    context.bindVertexArray(this.unitary_buffer_);
    context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
    context.bufferData(context.ARRAY_BUFFER, data, context.STATIC_DRAW);

    context.vertexAttribPointer(constants.attributes.position, 2, context.FLOAT, false, 16, 0); 
    context.enableVertexAttribArray(constants.attributes.position);
    context.vertexAttribPointer(constants.attributes.uv, 2, context.FLOAT, false, 16, 8);
    context.enableVertexAttribArray(constants.attributes.uv);
    context.bindVertexArray(null);

    this.shader_out_ = new shader(context, frame_shader.vertex!, frame_shader.fragment!);
    frame_shader.vertex = null;
    frame_shader.fragment = null;

    this.shader_out_.use();
    this.shader_out_.integer(this.shader_out_.uniform_location('u_color'),
                             constants.texture_unit.color);
    this.shader_out_.integer(this.shader_out_.uniform_location('u_bloom'),
                             constants.texture_unit.bloom);

    this.shader_gauss_ = new shader(context, gauss_shader.vertex!, gauss_shader.fragment!);
    gauss_shader.vertex = null;
    gauss_shader.fragment = null;

    this.shader_gauss_.use();
    this.shader_gauss_.integer(this.shader_gauss_.uniform_location('u_image'),
                              constants.texture_unit.bloom);
    this.u_horizontal_ = this.shader_gauss_.uniform_location('u_horizontal');
  }
  /**
   * @brief Activates drawing into the framebuffer
   */
  public activate() : void {
    this.frame_.bind();
  }
  /**
   * @brief Deactivates drawing into the framebuffer
   */
  public deactivate() : void {
    this.frame_.release();
  }
  /**
   * @brief Paints the framebuffer results into the screen
   */
  public paint() : void {
    this.gl_.context()!.bindVertexArray(this.unitary_buffer_);
/*
    // Calculating the gauss blur
    this.shader_gauss_.use();

    this.bloom_.activate();
    this.bloom_.bind();

    // Horizontal blur
    this.gl_.viewport(this.half_x_, this.half_y_);
    this.frame_2_.bind();
    this.gl_.clear();
    this.shader_gauss_.integer(this.u_horizontal_, 1);
    this.gl_.context()!.drawArrays(WebGLRenderingContext.TRIANGLES, 0, 6);

    this.gauss_1_.activate();
    this.gauss_1_.bind();

    // Vertical blur
    this.frame_3_.bind();
    this.gl_.clear();
    this.shader_gauss_.integer(this.u_horizontal_, 0);
    this.gl_.context()!.drawArrays(WebGLRenderingContext.TRIANGLES, 0, 6);
    this.frame_3_.release();
*/
    // Painting the resulting image
    this.shader_out_.use();
    //this.gl_.viewport(-1, -1);

    this.color_.activate();
    this.color_.bind();
    this.gauss_2_.activate();
    this.gauss_2_.bind();

    this.gl_.context()!.drawArrays(WebGLRenderingContext.TRIANGLES, 0, 6);
    this.gl_.context()!.bindVertexArray(null);
  }

  public resize(width : number, height : number) : void {
    // Resizing the framebuffer and its attached textures
    this.color_.bind();
    this.color_.allocate(width, height);
    this.color_.release();

    this.bloom_.bind();
    this.bloom_.allocate(width, height);
    this.bloom_.release();

    this.gauss_1_.bind();
    this.gauss_1_.allocate(this.half_x_ = width/2, this.half_y_ = height/2);
    this.gauss_1_.release();

    this.gauss_2_.bind();
    this.gauss_2_.allocate(this.half_x_, this.half_y_);
    this.gauss_2_.release();

    this.frame_.bind();
    this.frame_.delete_render();
    this.frame_.generate_render();
    this.frame_.bind_render();
    this.frame_.render_storage(width, height, this.frame_.context().DEPTH_COMPONENT24);
    this.frame_.attach_render(this.frame_.context().DEPTH_ATTACHMENT);
    this.frame_.release();
  }
}
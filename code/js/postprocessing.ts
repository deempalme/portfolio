
import * as constants from './gl/constants';
import { framebuffer } from "./gl/framebuffer";
import { open_gl } from './gl/open_gl';
import { shader } from './gl/shader';
import { texture } from "./gl/texture";
import { frame_shader } from './shaders/frame_shader';
import { gauss_shader } from './shaders/gauss_shader';


export class postprocessing
{
  private frame   : framebuffer;
  private frame_2 : framebuffer;
  private frame_3 : framebuffer;

  private color   : texture;
  private bloom   : texture;
  private gauss_1 : texture;
  private gauss_2 : texture;

  private shader_out : shader;
  private shader_gauss : shader;
  private u_horizontal : WebGLUniformLocation | null;

  private gl : open_gl;
  private unitary_buffer : WebGLVertexArrayObject;

  private half_x : number = 0;
  private half_y : number = 0;


  constructor(open_gl : open_gl){
    this.gl = open_gl;
    let context : WebGL2RenderingContext = open_gl.context()!;

    // Creating the textures for the framebuffer
    this.color = new texture(context, null, constants.texture_unit.color);
    this.color.bind();
    this.color.parameteri(context.REPEAT, context.REPEAT, context.NEAREST, context.NEAREST);
    // Initial size doesn't matter because they will be resized when we call this.resize()
    this.color.allocate(64, 64);
    this.color.release();

    this.bloom = new texture(context, null, constants.texture_unit.bloom);
    this.bloom.bind();
    this.bloom.parameteri(context.REPEAT, context.REPEAT, context.NEAREST, context.NEAREST);
    this.bloom.allocate(64, 64);
    this.bloom.release();

    this.gauss_1 = new texture(context, null, constants.texture_unit.bloom);
    this.gauss_1.bind();
    this.gauss_1.parameteri(context.REPEAT, context.REPEAT, context.LINEAR, context.LINEAR);
    this.gauss_1.allocate(64, 64);
    this.gauss_1.release();

    this.gauss_2 = new texture(context, null, constants.texture_unit.bloom);
    this.gauss_2.bind();
    this.gauss_2.parameteri(context.REPEAT, context.REPEAT, context.LINEAR, context.LINEAR);
    this.gauss_2.allocate(64, 64);
    this.gauss_2.release();

    // Creating the framebuffer and attaching its textures for creating the color and bloom texture
    this.frame = new framebuffer(context, true);
    this.frame.bind();
    this.frame.attach_2D(this.color, context.COLOR_ATTACHMENT0 + constants.framebuffer.color);
    this.frame.attach_2D(this.bloom, context.COLOR_ATTACHMENT0 + constants.framebuffer.bloom);
    this.frame.draw_buffers([
      context.COLOR_ATTACHMENT0 + constants.framebuffer.color,
      context.COLOR_ATTACHMENT0 + constants.framebuffer.bloom
    ]);
    if(this.frame.status() != context.FRAMEBUFFER_COMPLETE)
      console.error(this.frame.status_msg());
    this.frame.release();

    // Creating the framebuffer and attaching its textures for horizontal gauss blurr
    this.frame_2 = new framebuffer(context, true);
    this.frame_2.bind();
    this.frame_2.attach_2D(this.gauss_1, context.COLOR_ATTACHMENT0 + constants.framebuffer.gauss);
    this.frame_2.draw_buffers([ context.COLOR_ATTACHMENT0 + constants.framebuffer.gauss ]);
    if(this.frame_2.status() != context.FRAMEBUFFER_COMPLETE)
      console.error(this.frame_2.status_msg());
    this.frame_2.release();

    // Creating the framebuffer and attaching its textures for vertical gauss blurr
    this.frame_3 = new framebuffer(context, true);
    this.frame_3.bind();
    this.frame_3.attach_2D(this.gauss_2, context.COLOR_ATTACHMENT0 + constants.framebuffer.gauss);
    this.frame_3.draw_buffers([ context.COLOR_ATTACHMENT0 + constants.framebuffer.gauss ]);
    if(this.frame_3.status() != context.FRAMEBUFFER_COMPLETE)
      console.error(this.frame_3.status_msg());
    this.frame_3.release();

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
    this.unitary_buffer = context.createVertexArray()!;
    context.bindVertexArray(this.unitary_buffer);
    context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
    context.bufferData(context.ARRAY_BUFFER, data, context.STATIC_DRAW);

    context.vertexAttribPointer(constants.attributes.position, 2, context.FLOAT, false, 16, 0); 
    context.enableVertexAttribArray(constants.attributes.position);
    context.vertexAttribPointer(constants.attributes.uv, 2, context.FLOAT, false, 16, 8);
    context.enableVertexAttribArray(constants.attributes.uv);
    context.bindVertexArray(null);

    this.shader_out = new shader(context, frame_shader.vertex!, frame_shader.fragment!);
    frame_shader.vertex = null;
    frame_shader.fragment = null;

    this.shader_out.use();
    this.shader_out.integer(this.shader_out.uniform_location('u_color'),
                            constants.texture_unit.color);
    this.shader_out.integer(this.shader_out.uniform_location('u_bloom'),
                            constants.texture_unit.bloom);

    this.shader_gauss = new shader(context, gauss_shader.vertex!, gauss_shader.fragment!);
    gauss_shader.vertex = null;
    gauss_shader.fragment = null;

    this.shader_gauss.use();
    this.shader_gauss.integer(this.shader_gauss.uniform_location('u_image'),
                              constants.texture_unit.bloom);
    this.u_horizontal = this.shader_gauss.uniform_location('u_horizontal');
  }
  /**
   * @brief Activates drawing into the framebuffer
   */
  public activate() : void {
    this.frame.bind();
  }
  /**
   * @brief Deactivates drawing into the framebuffer
   */
  public deactivate() : void {
    this.frame.release();
  }
  /**
   * @brief Paints the framebuffer results into the screen
   */
  public paint() : void {
    this.gl.context()!.bindVertexArray(this.unitary_buffer);
/*
    // Calculating the gauss blur
    this.shader_gauss.use();

    this.bloom.activate();
    this.bloom.bind();

    // Horizontal blur
    this.gl.viewport(this.half_x, this.half_y);
    this.frame_2.bind();
    this.gl.clear();
    this.shader_gauss.integer(this.u_horizontal, 1);
    this.gl.context()!.drawArrays(WebGLRenderingContext.TRIANGLES, 0, 6);

    this.gauss_1.activate();
    this.gauss_1.bind();

    // Vertical blur
    this.frame_3.bind();
    this.gl.clear();
    this.shader_gauss.integer(this.u_horizontal, 0);
    this.gl.context()!.drawArrays(WebGLRenderingContext.TRIANGLES, 0, 6);
    this.frame_3.release();
*/
    // Painting the resulting image
    this.shader_out.use();
    //this.gl.viewport(-1, -1);

    this.color.activate();
    this.color.bind();
    this.gauss_2.activate();
    this.gauss_2.bind();

    this.gl.context()!.drawArrays(WebGLRenderingContext.TRIANGLES, 0, 6);
    this.gl.context()!.bindVertexArray(null);
  }

  public resize(width : number, height : number) : void {
    // Resizing the framebuffer and its attached textures
    this.color.bind();
    this.color.allocate(width, height);
    this.color.release();

    this.bloom.bind();
    this.bloom.allocate(width, height);
    this.bloom.release();

    this.gauss_1.bind();
    this.gauss_1.allocate(this.half_x = width/2, this.half_y = height/2);
    this.gauss_1.release();

    this.gauss_2.bind();
    this.gauss_2.allocate(this.half_x, this.half_y);
    this.gauss_2.release();

    this.frame.bind();
    this.frame.delete_render();
    this.frame.generate_render();
    this.frame.bind_render();
    this.frame.render_storage(width, height, this.frame.context().DEPTH_COMPONENT24);
    this.frame.attach_render(this.frame.context().DEPTH_ATTACHMENT);
    this.frame.release();
  }
}
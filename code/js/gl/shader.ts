
import * as constants from './constants';
import $ from 'jquery';


export class shader
{
  private id : WebGLProgram | null = null;
  private gl : WebGL2RenderingContext;
  public finished : boolean = false;

  /**
   * @brief Creates the shader object
   * 
   * @param context  WebGL context that will contain this program
   * @param vertex   The vertex text data
   * @param fragment The fragment text data
   */
  constructor(context : WebGL2RenderingContext, vertex : string, fragment : string){
    this.gl = context;
    this.id = this.gl.createProgram();

    this.process_program(vertex, fragment);
  }
  /**
   * @brief Getting the attribute location of a named variable
   * 
   * @param name Name of the attribute to look for
   * 
   * @returns If found returns the ID number or -1 if program is not yet created
   */
  public attr_location(name : string) : number {
    if(this.id)
      return this.gl.getAttribLocation(this.id, name);
    return -1;
  }
  /**
   * @brief Getting the WebGL context used in this shading program
   * 
   * @returns The shader program's WebGL context
   */
  public context() : WebGL2RenderingContext {
    return this.gl;
  }
  /**
   * @brief Sets an uniform 1D integer value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param value Numeric integer data that will be uploaded
   */
  public integer(uniform_id : WebGLUniformLocation | null, value : number) : void {
    if(this.id)
      this.gl.uniform1i(uniform_id, value);
  }
  /**
   * @brief Indicates if the Shading program was loaded and compiled
   * 
   * @returns `true` whan vertex and fragment data have been loaded and properly compiled
   */
  public loaded() : boolean {
    return this.finished;
  }
  /**
   * @brief Sets an uniform 4D floating matrix value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param matrix Array of 16 floating values that will be uploaded
   */
  public matrix4f(uniform_id : WebGLUniformLocation | null, matrix : Float32List) : void {
    if(this.id)
      this.gl.uniformMatrix4fv(uniform_id, false, matrix);
  }
  /**
   * @brief Sets an uniform 1D floating value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param value Numeric floating data that will be uploaded
   */
  public uniform1f(uniform_id : WebGLUniformLocation | null, value : number) : void {
    if(this.id)
      this.gl.uniform1f(uniform_id, value);
  }
  /**
   * @brief Sets an uniform 2D floating vector value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param vector Array of 2 floating values that will be uploaded
   */
  public uniform2fv(uniform_id : WebGLUniformLocation | null, vector : Float32List) : void {
    if(this.id)
      this.gl.uniform2fv(uniform_id, vector);
  }
  /**
   * @brief Sets an uniform 3D floating vector value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param vector Array of 3 floating values that will be uploaded
   */
  public uniform3fv(uniform_id : WebGLUniformLocation | null, vector : Float32List) : void {
    if(this.id)
      this.gl.uniform3fv(uniform_id, vector);
  }
  /**
   * @brief Sets an uniform 4D floating vector value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param vector Array of 4 floating values that will be uploaded
   */
  public uniform4fv(uniform_id : WebGLUniformLocation | null, vector : Float32List) : void {
    if(this.id)
      this.gl.uniform4fv(uniform_id, vector);
  }
  /**
   * @brief Getting the uniform location of a named variable
   * 
   * @param name Name of the uniform to look for
   * 
   * @returns If found returns the WebGLUniformLocation
   */
  public uniform_location(name : string) : WebGLUniformLocation | null {
    if(this.id)
      return this.gl.getUniformLocation(this.id, name);
    return null;
  }
  /**
   * @brief Activates this shader program
   */
  public use() : void {
    if(this.id)
      this.gl.useProgram(this.id);
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * Frees unused memory
   */
  private destroy(){
    this.id = null;
  }

  private process_program(vertex : string | null, fragment : string | null) : void {
    // Creating the shding program only if the vertex and fragment data was loaded
    if(vertex != null && fragment != null){
      const vertex_id = this.gl.createShader(this.gl.VERTEX_SHADER);
      const fragment_id = this.gl.createShader(this.gl.FRAGMENT_SHADER);

      if(this.id && vertex_id && fragment_id){
        this.gl.shaderSource(vertex_id, vertex);
        this.gl.compileShader(vertex_id);

        if(!this.gl.getShaderParameter(vertex_id, this.gl.COMPILE_STATUS)){
          this.destroy();
          console.error("An error occurred compiling the vertex shader:\n" 
                        + this.gl.getShaderInfoLog(vertex_id) + " id:" + vertex_id);
          return;
        }

        this.gl.shaderSource(fragment_id, fragment);
        this.gl.compileShader(fragment_id);

        if(!this.gl.getShaderParameter(fragment_id, this.gl.COMPILE_STATUS)){
          this.destroy();
          console.error("An error occurred compiling the fragment shader:\n"
                        + this.gl.getShaderInfoLog(fragment_id) + " id:" + fragment_id);
          return;
        }

        this.gl.attachShader(this.id, vertex_id);
        this.gl.attachShader(this.id, fragment_id);

        this.gl.bindAttribLocation(this.id, constants.attributes.position, 'i_position');
        this.gl.bindAttribLocation(this.id, constants.attributes.uv, 'i_uv');
        this.gl.bindAttribLocation(this.id, constants.attributes.normal, 'i_normal');
        this.gl.bindAttribLocation(this.id, constants.attributes.tangent, 'i_tangent');

        this.gl.linkProgram(this.id);

        if(!this.gl.getProgramParameter(this.id, this.gl.LINK_STATUS)){
          this.destroy();
          console.error("Unable to initialize the shader program: \n"
                        + this.gl.getProgramInfoLog(this.id));
        }else
          this.finished = true;

      }else{
        this.destroy();
      }
    }
  }
}
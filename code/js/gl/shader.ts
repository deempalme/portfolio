
import * as constants from './constants';


export class shader
{
  private id_ : WebGLProgram | null = null;
  private gl_ : WebGL2RenderingContext;
  public finished_ : boolean = false;

  /**
   * @brief Creates the shader object
   * 
   * @param context  WebGL context that will contain this program
   * @param vertex   The vertex text data
   * @param fragment The fragment text data
   */
  constructor(context : WebGL2RenderingContext, vertex : string, fragment : string){
    this.gl_ = context;
    this.id_ = this.gl_.createProgram();

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
    if(this.id_)
      return this.gl_.getAttribLocation(this.id_, name);
    return -1;
  }
  /**
   * @brief Getting the WebGL context used in this shading program
   * 
   * @returns The shader program's WebGL context
   */
  public context() : WebGL2RenderingContext {
    return this.gl_;
  }
  /**
   * @brief Sets an uniform 1D integer value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param value Numeric integer data that will be uploaded
   */
  public integer(uniform_id : WebGLUniformLocation | null, value : number) : void {
    if(this.id_)
      this.gl_.uniform1i(uniform_id, value);
  }
  /**
   * @brief Indicates if the Shading program was loaded and compiled
   * 
   * @returns `true` whan vertex and fragment data have been loaded and properly compiled
   */
  public loaded() : boolean {
    return this.finished_;
  }
  /**
   * @brief Sets an uniform 3D floating matrix value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param matrix Array of 9 floating values that will be uploaded
   */
   public matrix3f(uniform_id : WebGLUniformLocation | null, matrix : Float32List) : void {
    if(this.id_)
      this.gl_.uniformMatrix3fv(uniform_id, false, matrix);
  }
  /**
   * @brief Sets an uniform 4D floating matrix value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param matrix Array of 16 floating values that will be uploaded
   */
   public matrix4f(uniform_id : WebGLUniformLocation | null, matrix : Float32List) : void {
    if(this.id_)
      this.gl_.uniformMatrix4fv(uniform_id, false, matrix);
  }
  /**
   * @brief Sets an uniform 1D floating value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param value Numeric floating data that will be uploaded
   */
  public uniform1f(uniform_id : WebGLUniformLocation | null, value : number) : void {
    if(this.id_)
      this.gl_.uniform1f(uniform_id, value);
  }
  /**
   * @brief Sets an uniform 2D floating vector value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param vector Array of 2 floating values that will be uploaded
   */
  public uniform2fv(uniform_id : WebGLUniformLocation | null, vector : Float32List) : void {
    if(this.id_)
      this.gl_.uniform2fv(uniform_id, vector);
  }
  /**
   * @brief Sets an uniform 3D floating vector value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param vector Array of 3 floating values that will be uploaded
   */
  public uniform3fv(uniform_id : WebGLUniformLocation | null, vector : Float32List) : void {
    if(this.id_)
      this.gl_.uniform3fv(uniform_id, vector);
  }
  /**
   * @brief Sets an uniform 4D floating vector value
   * 
   * @param uniform_id Uniform location where the data would be uploaded
   * @param vector Array of 4 floating values that will be uploaded
   */
  public uniform4fv(uniform_id : WebGLUniformLocation | null, vector : Float32List) : void {
    if(this.id_)
      this.gl_.uniform4fv(uniform_id, vector);
  }
  /**
   * @brief Getting the uniform location of a named variable
   * 
   * @param name Name of the uniform to look for
   * 
   * @returns If found returns the WebGLUniformLocation
   */
  public uniform_location(name : string) : WebGLUniformLocation | null {
    if(this.id_)
      return this.gl_.getUniformLocation(this.id_, name);
    return null;
  }
  /**
   * @brief Activates this shader program
   */
  public use() : void {
    if(this.id_)
      this.gl_.useProgram(this.id_);
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * Frees unused memory
   */
  private destroy(){
    this.id_ = null;
  }

  private process_program(vertex : string | null, fragment : string | null) : void {
    // Creating the shding program only if the vertex and fragment data was loaded
    if(vertex != null && fragment != null){
      const vertex_id = this.gl_.createShader(this.gl_.VERTEX_SHADER);
      const fragment_id = this.gl_.createShader(this.gl_.FRAGMENT_SHADER);

      if(this.id_ && vertex_id && fragment_id){
        this.gl_.shaderSource(vertex_id, vertex);
        this.gl_.compileShader(vertex_id);

        if(!this.gl_.getShaderParameter(vertex_id, this.gl_.COMPILE_STATUS)){
          this.destroy();
          console.error("An error occurred compiling the vertex shader:\n" 
                        + this.gl_.getShaderInfoLog(vertex_id) + " id:" + vertex_id);
          return;
        }

        this.gl_.shaderSource(fragment_id, fragment);
        this.gl_.compileShader(fragment_id);

        if(!this.gl_.getShaderParameter(fragment_id, this.gl_.COMPILE_STATUS)){
          this.destroy();
          console.error("An error occurred compiling the fragment shader:\n"
                        + this.gl_.getShaderInfoLog(fragment_id) + " id:" + fragment_id);
          return;
        }

        this.gl_.attachShader(this.id_, vertex_id);
        this.gl_.attachShader(this.id_, fragment_id);

        this.gl_.bindAttribLocation(this.id_, constants.attributes.position, 'i_position');
        this.gl_.bindAttribLocation(this.id_, constants.attributes.uv, 'i_uv');
        this.gl_.bindAttribLocation(this.id_, constants.attributes.normal, 'i_normal');
        this.gl_.bindAttribLocation(this.id_, constants.attributes.tangent, 'i_tangent');

        this.gl_.linkProgram(this.id_);

        if(!this.gl_.getProgramParameter(this.id_, this.gl_.LINK_STATUS)){
          this.destroy();
          console.error("Unable to initialize the shader program: \n"
                        + this.gl_.getProgramInfoLog(this.id_));
        }else
          this.finished_ = true;

      }else{
        this.destroy();
      }
    }
  }
}
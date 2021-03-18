

export class shader
{
  private id : WebGLProgram | null;
  private gl : WebGL2RenderingContext;
  public loaded : boolean = false;

  // Attribute locations
  public i_position : number = 0;

  // Uniform locations
  public u_view       : WebGLUniformLocation | null = null;
  public u_projection : WebGLUniformLocation | null = null;
  public u_pv         : WebGLUniformLocation | null = null;

  constructor(context : WebGL2RenderingContext, vertex : string, fragment : string){
    this.gl = context;
    this.id = this.gl.createProgram();

    const vertex_id = this.gl.createShader(this.gl.VERTEX_SHADER);
    const fragment_id = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    if(this.id && vertex_id && fragment_id){
      this.gl.shaderSource(vertex_id, vertex);
      this.gl.compileShader(vertex_id);
      if(!this.gl.getShaderParameter(vertex_id, this.gl.COMPILE_STATUS))
        console.error("An error occurred compiling the vertex shader:\n" 
                      + this.gl.getShaderInfoLog(vertex_id) + " id:" + vertex_id);

      this.gl.shaderSource(fragment_id, fragment);
      this.gl.compileShader(fragment_id);
      if(!this.gl.getShaderParameter(fragment_id, this.gl.COMPILE_STATUS))
        console.error("An error occurred compiling the fragment shader:\n"
                      + this.gl.getShaderInfoLog(fragment_id) + " id:" + fragment_id);

      this.gl.attachShader(this.id, vertex_id);
      this.gl.attachShader(this.id, fragment_id);

      this.gl.bindAttribLocation(this.id, attributes.position, 'i_position');
      this.gl.bindAttribLocation(this.id, attributes.uv, 'i_uv');
      this.gl.bindAttribLocation(this.id, attributes.normal, 'i_normal');
      this.gl.bindAttribLocation(this.id, attributes.tangent, 'i_tangent');

      this.gl.linkProgram(this.id);

      if(!this.gl.getProgramParameter(this.id, this.gl.LINK_STATUS))
        console.error("Unable to initialize the shader program: \n"
                      + this.gl.getProgramInfoLog(this.id));
      else{
        this.use();

        this.i_position = this.attr_location('i_position');
        this.u_view = this.uniform_location('u_view');
        this.u_projection = this.uniform_location('u_projection');
        this.u_pv = this.uniform_location('u_pv');

        this.loaded = true;
      }
    }
  }

  public attr_location(name : string) : number {
    if(this.id)
      return this.gl.getAttribLocation(this.id, name);
    return -1;
  }

  public integer(uniform_id : WebGLUniformLocation, value : number) : void {
    if(this.id)
      this.gl.uniform1i(uniform_id, value);
  }

  public matrix4f(uniform_id : WebGLUniformLocation, matrix : Float32List) : void {
    if(this.id)
      this.gl.uniformMatrix4fv(uniform_id, false, matrix);
  }

  public uniform1f(uniform_id : WebGLUniformLocation, value : number) : void {
    if(this.id)
      this.gl.uniform1f(uniform_id, value);
  }

  public uniform3fv(uniform_id : WebGLUniformLocation, vector : Float32List) : void {
    if(this.id)
      this.gl.uniform3fv(uniform_id, vector);
  }

  public uniform4fv(uniform_id : WebGLUniformLocation, vector : Float32List) : void {
    if(this.id)
      this.gl.uniform4fv(uniform_id, vector);
  }

  public uniform_location(name : string) : WebGLUniformLocation | null {
    if(this.id)
      return this.gl.getUniformLocation(this.id, name);
    return null;
  }

  public use() : void {
    if(this.id)
      this.gl.useProgram(this.id);
  }
}
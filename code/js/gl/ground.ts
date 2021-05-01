

export class ground
{
  private gl_  : WebGL2RenderingContext;
  private vao_ : WebGLVertexArrayObject | null = null;
  private data_size_ : number = 0;

  /**
   * @brief Creates white ground lines that will be painted in the WebGl2 conttext
   * 
   * @param context WebGl2 rendering contex where it will be painted
   * @param length Length of each line (in meters)
   */
  constructor(context : WebGL2RenderingContext, length : number){
    this.gl_ = context;

    this.create_ground(length);
  }
  /**
   * @brief Calculates the ground lines data and stores it into a vertex array object
   * 
   * @param length Physical length of each line (in meters)
   */
  public create_ground(length : number) : void {
    const half_length : number = length / 2.0;
    this.data_size_ = (length * 2 + 2) * 2;
    let line_points : Float32Array = new Float32Array(this.data_size_ * 2);

    let e : number = 0;

    for(let i = 0; i <= length; ++i){
      line_points[e++] = i - half_length;
      line_points[e++] = -half_length;
  
      line_points[e++] = i - half_length;
      line_points[e++] = length - half_length;
    }

    for(let i = 0; i <= length; ++i){
      line_points[e++] = -half_length;
      line_points[e++] = i - half_length;
  
      line_points[e++] = length - half_length;
      line_points[e++] = i - half_length;
    }

    if(this.vao_ === null)
      this.vao_ = this.gl_.createVertexArray();

    this.gl_.bindVertexArray(this.vao_);
    this.gl_.bindBuffer(this.gl_.ARRAY_BUFFER, this.gl_.createBuffer());
    this.gl_.bufferData(this.gl_.ARRAY_BUFFER, line_points, this.gl_.STATIC_DRAW);

    this.gl_.vertexAttribPointer(0, 2, this.gl_.FLOAT, false, 8, 0); 
    this.gl_.enableVertexAttribArray(0);
    this.gl_.bindVertexArray(null);
  }
  /**
   * @brief Paints the ground lines
   */
  public paint() : void {
    this.gl_.bindVertexArray(this.vao_);
    this.gl_.drawArrays(this.gl_.LINES, 0, this.data_size_);
  }
}
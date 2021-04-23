
import { planet_info } from '../planet';
import * as constants from './constants';
import { shader } from './shader';


export class circles
{
  private gl_ : WebGL2RenderingContext;
  private vao_ : WebGLVertexArrayObject | null = null;
  private u_radius_ : WebGLUniformLocation | null = null;

  private data_size_ : number = 0;
  private sizes_ : Array<planet_info>;

  /**
   * @brief Creates a new circles object
   * 
   * @param context WebGL rendering context in which the circles will be drawn
   * @param program WebGl shader used to draw these circles
   * @param properties Indicates the radius of each cirlcle that will be drawn
   * @param resolution Each circle is composed by small straight lines, resolution indicates
   *                   how big they are: size = circle_radius * Math.sin(resolution)
   */
  constructor(context : WebGL2RenderingContext, program : shader,
              properties : Array<planet_info>, resolution : number = 1){
    this.gl_ = context;
    this.sizes_ = properties;
    this.u_radius_ = program.uniform_location("u_radius");

    this.create_circle(resolution);
  }
  /**
   * @brief Creates a line loop's circle with 360° / resolution number of lines
   * 
   * @param resolution Size in angles of each line that composes the circle (made of straight lines)
   */
  public create_circle(resolution : number) : void {
    const increment = resolution * constants.to_radian;
    this.data_size_ = Math.ceil(constants.degree_360 / increment);

    var buffer_data = new Float32Array(this.data_size_-- * 2);

    for(var i = 0, angle = 0.0; angle < constants.degree_360; angle += increment, ++i){
      buffer_data[i] = Math.cos(angle);   // x coordinate
      buffer_data[++i] = Math.sin(angle); // y coordinate
    }

    if(this.vao_ === null)
      this.vao_ = this.gl_.createVertexArray();

    this.gl_.bindVertexArray(this.vao_);
    this.gl_.bindBuffer(this.gl_.ARRAY_BUFFER, this.gl_.createBuffer());
    this.gl_.bufferData(this.gl_.ARRAY_BUFFER, buffer_data, this.gl_.STATIC_DRAW);

    this.gl_.vertexAttribPointer(constants.attributes.position, 2, this.gl_.FLOAT, false, 8, 0); 
    this.gl_.enableVertexAttribArray(constants.attributes.position);
    this.gl_.bindVertexArray(null);
  }
  /**
   * @brief Paints all the circles
   */
  public paint() : void {
    this.gl_.bindVertexArray(this.vao_);
    for(var i = 0; i < this.sizes_.length; ++i){
      this.gl_.uniform1f(this.u_radius_, this.sizes_[i].distance_to_star);
      this.gl_.drawArrays(this.gl_.LINE_LOOP, 0, this.data_size_);
      //this.gl_.drawArrays(gl.POINTS, 0, this.data_size_);
    }
  }
}


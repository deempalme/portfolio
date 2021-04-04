
import { planet_info } from '../planet';
import * as constants from './constants';
import { shader } from './shader';


export class circles
{
  private data_size : number = 0;

  private gl : WebGL2RenderingContext;
  private vao : WebGLVertexArrayObject | null = null;
  private u_radius : WebGLUniformLocation | null = null;

  private sizes : Array<planet_info>;

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
    this.gl = context;
    this.sizes = properties;
    this.u_radius = program.uniform_location("u_radius");

    this.create_circle(resolution);
  }
  /**
   * @brief Creates a line loop's circle with 360° / resolution number of lines
   * 
   * @param resolution Size in angles of each line that composes the circle (made of straight lines)
   */
  public create_circle(resolution : number) : void {
    const increment = resolution * constants.to_radian;
    this.data_size = Math.ceil(constants.degree_360 / increment);

    var buffer_data = new Float32Array(this.data_size-- * 2);

    for(var i = 0, angle = 0.0; angle < constants.degree_360; angle += increment, ++i){
      buffer_data[i] = Math.cos(angle);   // x coordinate
      buffer_data[++i] = Math.sin(angle); // y coordinate
    }

    if(this.vao == null)
      this.vao = this.gl.createVertexArray();

    this.gl.bindVertexArray(this.vao);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer_data, this.gl.STATIC_DRAW);

    this.gl.vertexAttribPointer(constants.attributes.position, 2, this.gl.FLOAT, false, 8, 0); 
    this.gl.enableVertexAttribArray(constants.attributes.position);
    this.gl.bindVertexArray(null);
  }
  /**
   * @brief Paints all the circles
   */
  public paint() : void {
    this.gl.bindVertexArray(this.vao);
    for(var i = 0; i < this.sizes.length; ++i){
      this.gl.uniform1f(this.u_radius, this.sizes[i].distance_to_star);
      this.gl.drawArrays(this.gl.LINE_LOOP, 0, this.data_size);
      //this.gl.drawArrays(gl.POINTS, 0, this.data_size);
    }
  }
}


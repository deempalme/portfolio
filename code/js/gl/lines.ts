
import * as constants from './constants';

export class lines
{
  private data_size : number = 0;

  private gl : WebGL2RenderingContext;
  private vao : WebGLVertexArrayObject | null = null;

  constructor(context : WebGL2RenderingContext, resolution : number = 1){
    this.gl = context;

    this.create_circle(resolution);
  }

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

  public paint() : void {
    // TODO: create instanced objects
    this.gl.bindVertexArray(this.vao);
    //for(var i = 0; i < planet_distances.length; ++i){
    //  this.uniform1f(this.u_scale, planet_distances[i]);
    //  this.gl.drawArrays(gl.LINE_LOOP, 0, this.data_size);
      //this.gl.drawArrays(gl.POINTS, 0, this.data_size);
    //}
  }
}


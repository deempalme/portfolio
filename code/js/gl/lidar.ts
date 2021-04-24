
import { loader } from "../loader";
import { shader } from "./shader";


export class lidar
{
  private gl_ : WebGL2RenderingContext;

  private vao_ : WebGLVertexArrayObject | null;
  private finished_ : boolean = false;
  private data_size_ : number = 0;

  private shader_ : shader;
  private u_colorize : WebGLUniformLocation | null = null;

  /**
   * @brief Creating a new LiDar object to paint it into the WebGL context
   * 
   * @param context WebGL2 context where the LiDar point will be painted
   * @param shader  GLSL Shader that handles the painting
   * @param lidar_url URL of the binary file containing the XYZI LiDar data
   */
  constructor(context : WebGL2RenderingContext, shader : shader, lidar_url : string){
    this.gl_ = context;
    this.shader_ = shader;
    shader.use();
    this.u_colorize = this.shader_.uniform_location('u_colorize');
    // Setting the initial color palette
    let palette : Float32Array = new Float32Array([
      0.2, 0.5, 0.7, 1.0, // Blue
      0.0, 1.0, 0.0, 1.0, // Green
      1.0, 1.0, 0.0, 1.0, // Yellow
      1.0, 0.0, 0.0, 1.0  // Red
    ]);
    this.shader_.matrix4f(this.shader_.uniform_location('u_palette'), palette);

    this.vao_ = context.createVertexArray();

    if(this.vao_ !== null)
      // Loading the LiDar binary data
      loader.load_binary(lidar_url, this.process_data.bind(this));

    this.colorize();
  }
  /**
   * @brief Changes the color of the LiDar points to colored or graycale
   * 
   * @param grayscale Indicates if it should be grayscale, or `false` for color
   */
  public colorize(grayscale : boolean = false) : void {
    this.shader_.use();

    if(this.u_colorize === null)
      this.u_colorize = this.shader_.uniform_location('u_colorize');

    this.shader_.integer(this.u_colorize, grayscale ? 0 : 1);
  }
  /**
   * @brief Draws the LiDar points
   */
   public paint() : void {
    if(!this.finished_) return;

    this.gl_.bindVertexArray(this.vao_);
    this.gl_.drawArrays(this.gl_.POINTS, 0, this.data_size_);
    this.gl_.bindVertexArray(null);
  }
  /**
   * @brief Indicates if the binary file has been loaded and processed
   * 
   * @returns `true` when loaded and processed
   */
  public loaded() : boolean {
    return this.finished_;
  }
  /**
   * @brief Upload to the shader a new color palette for the LiDar point (intencity dependant)
   * 
   * @param matrix4x4 Color palette contained in a matrix 4x4, each row is a RGBA color
   *                  (one float value from 0.0 to 1.0 per color channel)
   * 
   * @returns `false` if the matrix does NOT have at least 16 elements
   */
  public color_palette(matrix4x4 : Float32Array) : boolean {
    if(matrix4x4.length < 16) return false;

    this.shader_.matrix4f(this.shader_.uniform_location('u_palette'), matrix4x4);
    return true;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * @brief Loads the binary data into the opengl vertex array
   * 
   * @param data Binary data
   */
  private process_data(data : any) : void {
    let binary : Float32Array = new Float32Array(data);
    this.data_size_ = binary.length / 4.0;

    this.gl_.bindVertexArray(this.vao_);
    this.gl_.bindBuffer(this.gl_.ARRAY_BUFFER, this.gl_.createBuffer());
    this.gl_.bufferData(this.gl_.ARRAY_BUFFER, binary, this.gl_.STATIC_DRAW);

    this.gl_.vertexAttribPointer(0, 4, this.gl_.FLOAT, false, 16, 0);
    this.gl_.enableVertexAttribArray(0);

    this.finished_ = true;
  }
}
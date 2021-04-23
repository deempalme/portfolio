import { loader } from "../loader";


export class lidar
{
  private gl_ : WebGL2RenderingContext;
  private vao_ : WebGLVertexArrayObject | null;
  private finished_ : boolean = false;
  private data_size_ : number = 0;


  constructor(context : WebGL2RenderingContext, lidar_url : string){
    this.gl_ = context;

    this.vao_ = context.createVertexArray();

    if(this.vao_ !== null)
    // Loading the LiDar binary data
    loader.load_binary(lidar_url, this.process_data.bind(this));
  }
  /**
   * @brief Draws the LiDar points
   */
   public draw() : void {
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
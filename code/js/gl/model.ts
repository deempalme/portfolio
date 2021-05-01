
import * as k from './constants';
import { loader } from '../loader';


export class model
{
  private gl_ : WebGL2RenderingContext;
  private vao_ : WebGLVertexArrayObject | null;
  private finished_ : boolean = false;
  private data_size_ : number = 0;

  /**
   * @brief Loads a 3D models into a WebGL vertex array object
   * 
   * @param context Current WebGL context
   * @param model_url 3D model's URL path where is located
   */
  constructor(context : WebGL2RenderingContext, model_url : string){
    this.gl_ = context;

    this.vao_ = this.gl_.createVertexArray();

    if(this.vao_ !== null)
      // Loading the 3D model object
      loader.load_data(model_url, this.process_data.bind(this));
  }
  /**
   * @brief Draws the 3D model
   */
  public draw() : void {
    if(!this.finished_) return;

    this.gl_.bindVertexArray(this.vao_);
    this.gl_.drawArrays(this.gl_.TRIANGLES, 0, this.data_size_);
    this.gl_.bindVertexArray(null);
  }
  /**
   * @brief Indicates if the .obj file has been loaded and processed
   * 
   * @returns `true` when loaded and processed
   */
  public loaded() : boolean {
    return this.finished_;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::
  /**
   * @brief Normalizes a 3D vector
   * 
   * @param vector 3D vector that will be normalized
   */
  private normalize(vector : Array<number>) : void {
    const inverse_length : number = 
      1 / Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
    vector[0] = vector[0] * inverse_length;
    vector[1] = vector[1] * inverse_length;
    vector[2] = vector[2] * inverse_length;
  }
  /**
   * @brief Processes an .obj file into a OpenGL's VAO
   * 
   * @param data All the .obj file's content
   */
  private process_data(data : string) : void {
    const lines : Array<string> = data.split("\n");
    var sections : Array<string>, face : Array<string>, index : number;
    var vertices = [], textures = [], normals = [];
    var vector : Array<number> = [0, 0, 0];
    var vertex_indices : Array<number> = [];
    var normal_indices : Array<number> = [];
    var texture_indices : Array<number> = [];
    var tangent = [], bitangent = [];
    const size : number = lines.length;

    var pos_index : number = 0, r : number = 0;
    var delta_pos_1 : Array<number> = [0, 0, 0], delta_pos_2 : Array<number> = [0, 0, 0];
    var delta_uv_1 : Array<number> = [0, 0], delta_uv_2  : Array<number>= [0, 0];

    for (var i = 0; i < size; ++i) {
      sections = lines[i].split(" ");
      if (sections[0] == "v") {
        index = vertices.push(new Array(3)) - 1;
        vertices[index][0] = parseFloat(sections[1]);
        vertices[index][1] = parseFloat(sections[2]);
        vertices[index][2] = parseFloat(sections[3]);
      } else if (sections[0] == "vt") {
        index = textures.push(new Array(2)) - 1;
        textures[index][0] = parseFloat(sections[1]);
        textures[index][1] = parseFloat(sections[2]);
      } else if (sections[0] == "vn") {
        index = normals.push(new Array(3)) - 1;
        normals[index][0] = parseFloat(sections[1]);
        normals[index][1] = parseFloat(sections[2]);
        normals[index][2] = parseFloat(sections[3]);
      } else if (sections[0] == "f") {
        for (var e = 1; e < 4; e++) {
          face = sections[e].split("/");
          vertex_indices.push(parseInt(face[0]));
          texture_indices.push(parseInt(face[1]));
          normal_indices.push(parseInt(face[2]));
        }
        pos_index = vertex_indices.length - 1;

        delta_pos_1[0] = vertices[vertex_indices[pos_index] - 1][0]
                       - vertices[vertex_indices[pos_index - 2] - 1][0];
        delta_pos_1[1] = vertices[vertex_indices[pos_index] - 1][1]
                       - vertices[vertex_indices[pos_index - 2] - 1][1];
        delta_pos_1[2] = vertices[vertex_indices[pos_index] - 1][2]
                       - vertices[vertex_indices[pos_index - 2] - 1][2];
  
        delta_pos_2[0] = vertices[vertex_indices[pos_index - 1] - 1][0]
                       - vertices[vertex_indices[pos_index - 2] - 1][0];
        delta_pos_2[1] = vertices[vertex_indices[pos_index - 1] - 1][1]
                       - vertices[vertex_indices[pos_index - 2] - 1][1];
        delta_pos_2[2] = vertices[vertex_indices[pos_index - 1] - 1][2]
                       - vertices[vertex_indices[pos_index - 2] - 1][2];

        if (texture_indices[pos_index] > 0 && texture_indices[pos_index - 2] > 0) {
          delta_uv_1[0] = textures[texture_indices[pos_index] - 1][0]
                        - textures[texture_indices[pos_index - 2] - 1][0];
          delta_uv_1[1] = textures[texture_indices[pos_index] - 1][1]
                        - textures[texture_indices[pos_index - 2] - 1][1];

          delta_uv_2[0] = textures[texture_indices[pos_index - 1] - 1][0]
                        - textures[texture_indices[pos_index - 2] - 1][0];
          delta_uv_2[1] = textures[texture_indices[pos_index - 1] - 1][1]
                        - textures[texture_indices[pos_index - 2] - 1][1];
        }

        r = 1 / (delta_uv_1[0] * delta_uv_2[1] - delta_uv_1[1] * delta_uv_2[0]);

        // Calculating the tangents
        vector[0] = (delta_pos_1[0] * delta_uv_2[1] - delta_pos_2[0] * delta_uv_1[1]) * r;
        vector[1] = (delta_pos_1[1] * delta_uv_2[1] - delta_pos_2[1] * delta_uv_1[1]) * r;
        vector[2] = (delta_pos_1[2] * delta_uv_2[1] - delta_pos_2[2] * delta_uv_1[1]) * r;
        this.normalize(vector);

        index = tangent.push(new Array(3)) - 1;
        tangent[index][0] = vector[0];
        tangent[index][1] = vector[1];
        tangent[index][2] = vector[2];

        // Calculating the bitangents
        vector[0] = (delta_pos_2[0] * delta_uv_1[0] - delta_pos_1[0] * delta_uv_2[0]) * r;
        vector[1] = (delta_pos_2[1] * delta_uv_1[0] - delta_pos_1[1] * delta_uv_2[0]) * r;
        vector[2] = (delta_pos_2[2] * delta_uv_1[0] - delta_pos_1[2] * delta_uv_2[0]) * r;
        this.normalize(vector);

        index = bitangent.push(new Array(3)) - 1;
        bitangent[index][0] = vector[0];
        bitangent[index][1] = vector[1];
        bitangent[index][2] = vector[2];
      }
    }

    const indices_size : number = vertex_indices.length;
    var i3 : number  = 0;
    var all_data : Float32Array = new Float32Array(indices_size * 14);

    for (var i = 0; i < indices_size; i++) {
      i3 = Math.floor(i / 3);
      index = i * 14;
      // position
      all_data[index] = vertices[vertex_indices[i] - 1][0];
      all_data[index + 1] = vertices[vertex_indices[i] - 1][1];
      all_data[index + 2] = vertices[vertex_indices[i] - 1][2];
      // texture
      if (texture_indices[i] > 0) {
        all_data[index + 3] = textures[texture_indices[i] - 1][0];
        all_data[index + 4] = textures[texture_indices[i] - 1][1];
      } else {
        all_data[index + 3] = 0;
        all_data[index + 4] = 0;
      }
      // normal
      all_data[index + 5] = normals[normal_indices[i] - 1][0];
      all_data[index + 6] = normals[normal_indices[i] - 1][1];
      all_data[index + 7] = normals[normal_indices[i] - 1][2];
      // tangent
      all_data[index + 8] = tangent[i3][0];
      all_data[index + 9] = tangent[i3][1];
      all_data[index + 10] = tangent[i3][2];
      // bitangent
      all_data[index + 11] = bitangent[i3][0];
      all_data[index + 12] = bitangent[i3][1];
      all_data[index + 13] = bitangent[i3][2];
    }

    //this.gl_.useProgram(program.id);
    this.data_size_ = indices_size;

    this.gl_.bindVertexArray(this.vao_);
    this.gl_.bindBuffer(this.gl_.ARRAY_BUFFER, this.gl_.createBuffer());
    this.gl_.bufferData(this.gl_.ARRAY_BUFFER, all_data, this.gl_.STATIC_DRAW);

    var offset : number = 0;
    this.gl_.vertexAttribPointer(k.attributes.position, 3, this.gl_.FLOAT, false, 56, offset); 
    this.gl_.enableVertexAttribArray(k.attributes.position);
    offset += 12;
    this.gl_.vertexAttribPointer(k.attributes.uv, 2, this.gl_.FLOAT, false, 56, offset);
    this.gl_.enableVertexAttribArray(k.attributes.uv);
    offset += 8;
    this.gl_.vertexAttribPointer(k.attributes.normal, 3, this.gl_.FLOAT, false, 56, offset);
    this.gl_.enableVertexAttribArray(k.attributes.normal);
    offset += 12;
    this.gl_.vertexAttribPointer(k.attributes.tangent, 3, this.gl_.FLOAT, false, 56, offset);
    this.gl_.enableVertexAttribArray(k.attributes.tangent);
    offset += 12;
    this.gl_.vertexAttribPointer(k.attributes.bitangent, 3, this.gl_.FLOAT, false, 56, offset);
    this.gl_.enableVertexAttribArray(k.attributes.bitangent);

    this.finished_ = true;
  }
}
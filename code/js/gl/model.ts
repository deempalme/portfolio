
import * as constants from './constants';
import $ from 'jquery';


export class model
{
  private static counter : number = 0;
  private static maximum_count : number = 0;
  private static loader : HTMLElement;

  private gl : WebGL2RenderingContext;
  private vao : WebGLVertexArrayObject | null;
  private finished : boolean = false;
  private data_size : number = 0;

  constructor(context : WebGL2RenderingContext, model_url : string){
    this.gl = context;

    this.vao = this.gl.createVertexArray();

    if(this.vao){
      // Loading the 3D model object
      var this_object = this;
      $.ajax({
        url: model_url,
        beforeSend: function(xhr){ xhr.overrideMimeType( "text/plain; charset=utf-8" ); },
        dataType: 'text'
      }).done(function(data){ this_object.process_data(data); });
    }
  }
  /**
   * @brief Increments the counter and hides the HTMLElement stablished in set_loader()
   * 
   * @returns `true` if the counter reached the max_count() value
   */
  public static count() : boolean {
    if(++model.counter >= model.maximum_count){
      $(model.loader).hide();
      return true;
    }
    return false;
  }
  /**
   * @brief Draws the arrays inside the model VAO
   */
  public draw() : void {
    if(!this.finished) return;

    this.gl.bindVertexArray(this.vao);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.data_size);
    this.gl.bindVertexArray(null);
  }
  /**
   * @brief Indicates if the .obj file has been loaded and processed
   * 
   * @returns `true` when loaded and processed
   */
  public loaded() : boolean {
    return this.finished;
  }
  /**
   * @brief Indicates the maximum value that the counter could reach
   * 
   * The HTMLElement selected in set_loader() will be hidden when the count reaches
   * this value
   * 
   * @param new_maximum New maximum counter value
   * 
   * @returns `true` if the counter value was already reached
   */
  public static max_count(new_maximum : number) : boolean {
    model.maximum_count = new_maximum;
    if(model.counter >= model.maximum_count){
      $(model.loader).hide();
      return true;
    }
    return false;
  }
  /**
   * @brief Resets the counter value
   * 
   * It will also show the HTMLElement selected in set_loader()
   */
  public static reset_count() : void {
    model.maximum_count = 0;
    $(model.loader).show();
  }
  /**
   * @brief Sets an HTMLElement that represents the loading indicator
   * 
   * This HTMLElement will be hidden when the count reaches the max_count() value
   * 
   * @param object HTMLElement that represents the loading indicator
   */
  public static set_loader(object : HTMLElement) : void {
    model.loader = object;
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
    var vertices = [], textures = [], normals = [], vector : Array<number> = [0, 0, 0];
    var vertex_indices : Array<number> = [], normal_indices : Array<number> = [];
    var texture_indices : Array<number> = [];
    var tangent = [];
    const size : number = lines.length;

    var posIndex : number = 0, r : number = 0;
    var deltaPos1 : Array<number> = [0, 0, 0], deltaPos2 : Array<number> = [0, 0, 0];
    var deltaUV1 : Array<number> = [0, 0], deltaUV2  : Array<number>= [0, 0];

    for (var i = 0; i < size; i++) {
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
        posIndex = vertex_indices.length - 1;

        deltaPos1[0] = vertices[vertex_indices[posIndex] - 1][0] - vertices[vertex_indices[posIndex - 2] - 1][0];
        deltaPos1[1] = vertices[vertex_indices[posIndex] - 1][1] - vertices[vertex_indices[posIndex - 2] - 1][1];
        deltaPos1[2] = vertices[vertex_indices[posIndex] - 1][2] - vertices[vertex_indices[posIndex - 2] - 1][2];
  
        deltaPos2[0] = vertices[vertex_indices[posIndex - 1] - 1][0] - vertices[vertex_indices[posIndex - 2] - 1][0];
        deltaPos2[1] = vertices[vertex_indices[posIndex - 1] - 1][1] - vertices[vertex_indices[posIndex - 2] - 1][1];
        deltaPos2[2] = vertices[vertex_indices[posIndex - 1] - 1][2] - vertices[vertex_indices[posIndex - 2] - 1][2];

        if (texture_indices[posIndex] > 0 && texture_indices[posIndex - 2] > 0) {
          deltaUV1[0] = textures[texture_indices[posIndex] - 1][0] - textures[texture_indices[posIndex - 2] - 1][0];
          deltaUV1[1] = textures[texture_indices[posIndex] - 1][1] - textures[texture_indices[posIndex - 2] - 1][1];

          deltaUV2[0] = textures[texture_indices[posIndex - 1] - 1][0] - textures[texture_indices[posIndex - 2] - 1][0];
          deltaUV2[1] = textures[texture_indices[posIndex - 1] - 1][1] - textures[texture_indices[posIndex - 2] - 1][1];
        }

        r = 1 / (deltaUV1[0] * deltaUV2[1] - deltaUV1[1] * deltaUV2[0]);

        vector[0] = (deltaPos1[0] * deltaUV2[1] - deltaPos2[0] * deltaUV1[1]) * r;
        vector[1] = (deltaPos1[1] * deltaUV2[1] - deltaPos2[1] * deltaUV1[1]) * r;
        vector[2] = (deltaPos1[2] * deltaUV2[1] - deltaPos2[2] * deltaUV1[1]) * r;
        this.normalize(vector);

        index = tangent.push(new Array(3)) - 1;
        tangent[index][0] = vector[0];
        tangent[index][1] = vector[1];
        tangent[index][2] = vector[2];
      }
    }

    const indices_size : number = vertex_indices.length;
    var i3 : number  = 0;
    var all_data : Float32Array = new Float32Array(indices_size * 14);

    for (var i = 0; i < indices_size; i++) {
      i3 = Math.floor(i / 3);
      index = i * 11;
      //position
      all_data[index] = vertices[vertex_indices[i] - 1][0];
      all_data[index + 1] = vertices[vertex_indices[i] - 1][1];
      all_data[index + 2] = vertices[vertex_indices[i] - 1][2];
      //texture
      if (texture_indices[i] > 0) {
        all_data[index + 3] = textures[texture_indices[i] - 1][0];
        all_data[index + 4] = textures[texture_indices[i] - 1][1];
      } else {
        all_data[index + 3] = 0;
        all_data[index + 4] = 0;
      }
      //normal
      all_data[index + 5] = normals[normal_indices[i] - 1][0];
      all_data[index + 6] = normals[normal_indices[i] - 1][1];
      all_data[index + 7] = normals[normal_indices[i] - 1][2];
      //tangent
      all_data[index + 8] = tangent[i3][0];
      all_data[index + 9] = tangent[i3][1];
      all_data[index + 10] = tangent[i3][2];
    }

    //this.gl.useProgram(program.id);
    this.data_size = indices_size;

    this.gl.bindVertexArray(this.vao);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(this.gl.ARRAY_BUFFER, all_data, this.gl.STATIC_DRAW);

    var offset : number = 0;
    this.gl.vertexAttribPointer(constants.attributes.position, 3, this.gl.FLOAT, false, 44, offset); 
    this.gl.enableVertexAttribArray(constants.attributes.position);
    offset += 12;
    this.gl.vertexAttribPointer(constants.attributes.uv, 2, this.gl.FLOAT, false, 44, offset);
    this.gl.enableVertexAttribArray(constants.attributes.uv);
    offset += 8;
    this.gl.vertexAttribPointer(constants.attributes.normal, 3, this.gl.FLOAT, false, 44, offset);
    this.gl.enableVertexAttribArray(constants.attributes.normal);
    offset += 12;
    this.gl.vertexAttribPointer(constants.attributes.tangent, 3, this.gl.FLOAT, false, 44, offset);
    this.gl.enableVertexAttribArray(constants.attributes.tangent);

    this.finished = true;
  }
}
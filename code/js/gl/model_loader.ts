
import * as constants from './constants';
import $ from 'jquery';


export class model_loader
{
  private static counter : number = 0;
  private static max_count : number = 0;
  private static loader : HTMLElement;

  private gl : WebGL2RenderingContext;

  constructor(context : WebGL2RenderingContext, object_loader : HTMLElement, max_count : number = 1){
    this.gl = context;
    model_loader.max_count = max_count;
    model_loader.loader = object_loader;
  }

  public static count() : boolean {
    if(++model_loader.counter >= model_loader.max_count){
      model_loader.loader.parentElement?.removeChild(model_loader.loader);
      return true;
    }
    return false;
  }

  public load_model(model_url : string, object : any) : void {
    object.data_loaded = false;
    var this_object = this;
    $.get(model_url, function(data : string){ this_object.process_data(data, object); }, 'text');
  }

  private normalize(vector : Array<number>) : void {
    const inverse_length : number = 
      1 / Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
    vector[0] = vector[0] * inverse_length;
    vector[1] = vector[1] * inverse_length;
    vector[2] = vector[2] * inverse_length;
  }

  private process_data(data : string, object : any) : void {
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
    object.data_size = indices_size;
    object.vao = this.gl.createVertexArray();

    this.gl.bindVertexArray(object.vao);
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

    model_loader.count();
    object.data_loaded = true;
  }
}
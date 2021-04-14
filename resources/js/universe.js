/*
© Copyleft following GNU GPL statement and:

  Any person has the right to freely distribute copies and modified versions of this code with
  the accompanying requirement that any resulting copies or adaptations are also bound by the same
  licensing agreement and they shall have the name and link of the original author.
  
  Original author: F. J. Ramirez Rodriguez - http://bio.ramrod.tech
*/

var w = 0, h = 0, w2 = 0, h2 = 0, text_size = 16 /* pixels */;

const t1 = '+49 176', e1 = 'f', e2 = 'j', e3 = 'ramirez', e4 = 'rodriguez', t2 = ' 210 32 331';
const m1 = 'gm', m2 = 'ail';

const degree_360 = Math.PI * 2.0, degree_270 = Math.PI * 1.5, degree_180 = Math.PI;
const degree_90 = Math.PI * 0.5, degree_45 = Math.PI * 0.25, degree_70 = Math.PI * 0.3888889;
const degree_225 = Math.PI * 1.25, to_radian = Math.PI / 180.0;

// OpenGL variables
var gl = null, open_gl = null, shader_sun = null, shader_planet = null, shader_earth = null;
var loader = null, animation = null, frame_time_step = 500;
var camera_position = { x: 0, y: 0, z: 10}
// Attibute input IDs
const attributes = { position: 0, uv: 1, normal: 2, tangent: 3 };

var sol, earth, planets = [], planet_count = 9, trajectories;
const planet_radius = [1, 1, 0.7, 1, 1, 1, 1, 1, 1];
const planet_distances = [2, 3.5, 5];

// Home objects
var $home, $home_fig, $home_code_button, $home_canvas;

var $loading;

// ::::::::::::::::::::::::::::::::::::::: GENERIC FUNCITONS ::::::::::::::::::::::::::::::::::::::

// For window resizing
function resize(){
  w = $(window).width();
  h = $(window).height();
  w2 = Math.round(w * 0.5);
  h2 = Math.round(h * 0.5);

  open_gl.resize();
}

// General initialization
function initialization(){
  w = $(window).width();
  h = $(window).height();
  w2 = Math.round(w * 0.5);
  h2 = Math.round(h * 0.5);

  $home = $('#home');
  $home_fig = $('#home > figure');
  $home_code_button = $('#home > aside > button');

  $loading = $('#loading');
}

// ::::::::::::::::::::::::::::::::::::::::::: CLASSES ::::::::::::::::::::::::::::::::::::::::::::

class OpenGL {
  ok         = false;
  canvas     = null;
  extensions = null;

  projection = null;
  view       = null;
  pv         = null;

  camera = { eye: null, center: null, up: null };
  light  = null;

  constructor($parent){
    this.canvas = document.createElement('canvas');
    $parent.prepend(this.canvas);

    try {
      gl = this.canvas.getContext('webgl2', { alpha: true, antialias: true });
    } catch (e) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      return null;
    }

    this.canvas.width = w;
    this.canvas.height = h;
    gl.viewport(0, 0, w, h);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.enable(gl.CULL_FACE);            // Draws only frontal faces
    gl.cullFace(gl.BACK);
    gl.enable(gl.BLEND);                // Enables alpha
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.extensions = (
      gl.getExtension("EXT_texture_filter_anisotropic") ||
      gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
      gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic")
    );

    this.camera.eye = v3.new(0, 2, 10);
    this.camera.center = v3.new(0, 0, 0);
    this.camera.up = v3.new(0, 1, 0);

    this.light = v3.new(0, 0, 0);

    this.projection = m4.perspective(degree_45, w / h, 0.1, 1000);
    this.view = m4.lookAt(this.camera.eye, this.camera.center, this.camera.up);
    this.pv = m4.multiply(this.projection, this.view);

    this.ok = true;
  }

  resize(){
    if(!this.ok) return false;

    this.canvas.width = w;
    this.canvas.height = h;
    gl.viewport(0, 0, w, h);

    this.projection = m4.perspective(degree_45, w / h, 0.1, 1000);
    this.look_at();
  }

  look_at(){
    this.view = m4.lookAt(this.camera.eye, this.camera.center, this.camera.up);
    this.pv = m4.multiply(this.projection, this.view);

    shader_sun.use();
    shader_sun.matrix4f(shader_sun.u_pv, this.pv);
  
    shader_earth.use();
    shader_earth.matrix4f(shader_earth.u_pv, this.pv);

    trajectories.use();
    trajectories.matrix4f(trajectories.u_pv, this.pv);
  }

  animate(){
    OpenGL.clear();
  
    sol.rotate();
    sol.paint();

    earth.rotate();
    earth.translate();
    earth.paint();

    trajectories.paint();
  
    OpenGL.flush();
  }

  static clear(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  static flush(){
    gl.flush();
  }
}

class Texture {
  id             = 0;
  texture_number = 0;
  image          = null;
  loaded         = false;

  constructor(image_url, texture_number){
    this.texture_number = texture_number;

    this.image = new Image();
    this.image.webglTexture = false;
    var this_class = this;
    this.image.onload = function(){ this_class.initialize(); };
    this.image.src = image_url;
  }

  initialize(){
    gl.activeTexture(gl.TEXTURE0 + this.texture_number);

    this.id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.id);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, this.image.width, this.image.height, 0, 
                  gl.RGB, gl.UNSIGNED_BYTE, this.image);
    //this.image.webglTexture = this.id;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    if(open_gl.extensions){
      var max = gl.getParameter(open_gl.extensions.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      max = (max > 8.0) ? 8.0 : max;
      gl.texParameterf(gl.TEXTURE_2D, open_gl.extensions.TEXTURE_MAX_ANISOTROPY_EXT, max);
    }
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.loaded = true;
    this.image = null;

    ++Loader.load_count;
    Loader.all_loaded();
  }

  activate(){
    gl.activeTexture(gl.TEXTURE0 + this.texture_number);
  }

  bind(){
    gl.bindTexture(gl.TEXTURE_2D, this.id);
  }

  release(){
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}

class Shader {
  id     = 0;
  loaded = false;

  i_position = 0;

  u_view       = 0;
  u_projection = 0;

  u_pv = 0;

  constructor(vertex_shader, fragment_shader){
    this.id = gl.createProgram();

    const vertex_id = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex_id, vertex_shader);
    gl.compileShader(vertex_id);
    if(!gl.getShaderParameter(vertex_id, gl.COMPILE_STATUS)){
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(vertex_id) 
            + " id:" + vertex_id);
      return false;
    }

    const fragment_id = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment_id, fragment_shader);
    gl.compileShader(fragment_id);
    if(!gl.getShaderParameter(fragment_id, gl.COMPILE_STATUS)){
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(fragment_id) 
            + " id:" + fragment_id);
      return false;
    }

    gl.attachShader(this.id, vertex_id);
    gl.attachShader(this.id, fragment_id);

    gl.bindAttribLocation(this.id, attributes.position, 'i_position');
    gl.bindAttribLocation(this.id, attributes.uv, 'i_uv');
    gl.bindAttribLocation(this.id, attributes.normal, 'i_normal');
    gl.bindAttribLocation(this.id, attributes.tangent, 'i_tangent');

    gl.linkProgram(this.id);

    if(!gl.getProgramParameter(this.id, gl.LINK_STATUS)){
      alert("Unable to initialize the shader program: \n" + gl.getProgramInfoLog(this.id));
      return false;
    }

    this.use();

    this.i_position = this.attr_location('i_position');
    this.u_view = this.uniform_location('u_view');
    this.u_projection = this.uniform_location('u_projection');
    this.u_pv = this.uniform_location('u_pv');

    this.loaded = true;
  }

  use(){
    gl.useProgram(this.id);
  }

  attr_location(name){
    return gl.getAttribLocation(this.id, name);
  }

  uniform_location(name){
    return gl.getUniformLocation(this.id, name);
  }

  matrix4f(uniform_id, matrix){
    gl.uniformMatrix4fv(uniform_id, false, matrix);
  }

  integer(uniform_id, value){
    gl.uniform1i(uniform_id, value);
  }

  uniform1f(uniform_id, value){
    gl.uniform1f(uniform_id, value);
  }

  uniform3fv(uniform_id, vector){
    gl.uniform3fv(uniform_id, vector);
  }

  uniform4fv(uniform_id, vector){
    gl.uniform4fv(uniform_id, vector);
  }
}

class ShaderSun extends Shader {
  i_uv      = 0;
  i_normal  = 0;
  i_tangent = 0;

  u_camera   = 0;
  u_scale    = 0;
  u_rotation = 0;

  // Sampler ids
  u_diffuse  = 0;

  constructor(vertex_shader, fragment_shader){
    super(vertex_shader, fragment_shader);

    this.i_uv = this.attr_location('i_uv');
    this.i_normal = this.attr_location('i_normal');
    this.i_tangent = this.attr_location('i_tangent');

    this.u_scale = this.uniform_location('u_scale');
    this.u_rotation = this.uniform_location('u_rotation');

    gl.uniform1i(this.uniform_location('u_diffuse'), this.u_diffuse);
  }
}

class ShaderEarth extends Shader {
  i_uv      = 0;
  i_normal  = 0;
  i_tangent = 0;

  u_light          = 0;
  u_camera         = 0;
  u_scale          = 0;
  u_rotation       = 0;
  u_cloud_rotation = 0;
  u_translation    = 0;
  u_distance       = 0;

  // Sampler ids
  u_diffuse  = 0;
  u_normal   = 1;
  u_combined = 2;

  constructor(vertex_shader, fragment_shader){
    super(vertex_shader, fragment_shader);

    this.i_uv = this.attr_location('i_uv');
    this.i_normal = this.attr_location('i_normal');
    this.i_tangent = this.attr_location('i_tangent');

    this.u_light = this.uniform_location('u_light_position');
    this.u_camera = this.uniform_location('u_camera_position');
    this.u_scale = this.uniform_location('u_scale');
    this.u_rotation = this.uniform_location('u_rotation');
    this.u_cloud_rotation = this.uniform_location('u_cloud_rotation');
    this.u_translation = this.uniform_location('u_translation');
    this.u_distance = this.uniform_location('u_distance');

    gl.uniform1i(this.uniform_location('u_diffuse'), this.u_diffuse);
    gl.uniform1i(this.uniform_location('u_normal'), this.u_normal);
    gl.uniform1i(this.uniform_location('u_lights_clouds_specular'), this.u_combined);

    this.uniform3fv(this.u_light, open_gl.light);
    this.uniform3fv(this.u_camera, open_gl.camera.eye);
  }
}

class Loader {
  static all_loaded(){
    if(Loader.load_count >= 1)
      $loading.remove();
  }

  normalize(vector){
    const inverse_length = 
      1 / Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
    vector[0] = vector[0] * inverse_length;
    vector[1] = vector[1] * inverse_length;
    vector[2] = vector[2] * inverse_length;
  }

  load_model(model_url, object){
    object.data_loaded = false;
    var this_class = this;
    $.get(model_url, function (data) { this_class.load_model_data(data, object); }, "text");
  }

  load_model_data(data, object){
    const lines = data.split("\n");
    var sections, face, index;
    var vertices = [], textures = [], normals = [], vector = [0, 0, 0];
    var vertex_indices = [], normal_indices = [], texture_indices = [];
    var tangent = [];
    const size = lines.length;

    var posIndex = 0, r = 0;
    var deltaPos1 = [0, 0, 0], deltaPos2 = [0, 0, 0];
    var deltaUV1 = [0, 0], deltaUV2 = [0, 0];

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

    const indices_size = vertex_indices.length;
    var i3 = 0;
    var all_data = new Float32Array(indices_size * 14);

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

    //gl.useProgram(program.id);
    object.data_size = indices_size;
    object.vao = gl.createVertexArray();

    gl.bindVertexArray(object.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, all_data, gl.STATIC_DRAW);

    var offset = 0;
    gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, 44, offset); 
    gl.enableVertexAttribArray(attributes.position);
    offset += 12;
    gl.vertexAttribPointer(attributes.uv, 2, gl.FLOAT, false, 44, offset);
    gl.enableVertexAttribArray(attributes.uv);
    offset += 8;
    gl.vertexAttribPointer(attributes.normal, 3, gl.FLOAT, false, 44, offset);
    gl.enableVertexAttribArray(attributes.normal);
    offset += 12;
    gl.vertexAttribPointer(attributes.tangent, 3, gl.FLOAT, false, 44, offset);
    gl.enableVertexAttribArray(attributes.tangent);

    ++Loader.load_count;
    object.data_loaded = true;
  }
}
Loader.load_count = 0;

class Sun {
  model_3d = null

  // Texture
  albedo = null;

  // Sun physical proterties
  size           = 1;
  rotation_speed = 0.01;
  rotation       = 0;

  constructor(model_3d, size = 1.0, speed = 0.01, angle = Math.random() * degree_360){
    this.model_3d = model_3d;

    // Sun 3D model
    this.albedo = new Texture("/resources/models/sun/albedo.jpg", 0);

    this.size = size;
    this.rotation_speed = speed / (1000 / frame_time_step);
    this.rotation = angle / degree_360;

    shader_sun.use();
    shader_sun.uniform1f(shader_sun.u_scale, this.size);
  }

  rotate(){
    this.rotation -= this.rotation_speed;
    if(this.rotation < 0.0) this.rotation += 1.0;
  }

  paint(){
    if(this.albedo.loaded && this.model_3d.data_loaded){
      shader_sun.use();

      this.albedo.activate();
      this.albedo.bind();

      gl.bindVertexArray(this.model_3d.vao);
      shader_sun.uniform1f(shader_sun.u_rotation, this.rotation);
      gl.drawArrays(gl.TRIANGLES, 0, this.model_3d.data_size);
    }
  }
}

class Planet {
  id       = 0;
  model_3d = null;

  // Textures
  albedo  = null;
  normal  = null;
  specular = null;

  // Planet physical proterties
  size           = 1;
  rotation_speed = 0.0001;
  rotation       = 0;

  constructor(index, model_3d, size = 1.0, speed = 0.0001, angle = Math.random() * degree_360){
    this.id = index;
    this.model_3d = model_3d;

    this.texturize();

    this.size = size;
    this.rotation_speed = speed;
    this.rotation = angle;
  }

  texturize(){
    switch(this.id){
      case 0:
        this.albedo = new Texture("/resources/models/mercury/albedo.jpg", 0);
        this.normal = new Texture("/resources/models/mercury/normal.jpg", 1);
        this.specular = new Texture("/resources/models/mercury/specular.jpg", 2);
      break;
      case 1:
        this.albedo = new Texture("/resources/models/venus/albedo.jpg", 0);
        this.normal = new Texture("/resources/models/venus/normal.jpg", 1);
        this.specular = new Texture("/resources/models/venus/specular.jpg", 2);
      break;
      case 2:
        this.albedo = new Texture("/resources/models/earth/albedo.jpg", 0);
        this.normal = new Texture("/resources/models/earth/normal.jpg", 1);
        this.specular = new Texture("/resources/models/earth/specular.jpg", 2);
      break;
      case 3:
        this.albedo = new Texture("/resources/models/mars/albedo.jpg", 0);
        this.normal = new Texture("/resources/models/mars/normal.jpg", 1);
        this.specular = new Texture("/resources/models/mars/specular.jpg", 2);
      break;
      case 4:
        this.albedo = new Texture("/resources/models/jupiter/albedo.jpg", 0);
        this.normal = new Texture("/resources/models/jupiter/normal.jpg", 1);
        this.specular = new Texture("/resources/models/jupiter/specular.jpg", 2);
      break;
      case 5:
        this.albedo = new Texture("/resources/models/saturn/albedo.jpg", 0);
        this.normal = new Texture("/resources/models/saturn/normal.jpg", 1);
        this.specular = new Texture("/resources/models/saturn/specular.jpg", 2);
      break;
      case 6:
        this.albedo = new Texture("/resources/models/uranus/albedo.jpg", 0);
        this.normal = new Texture("/resources/models/uranus/normal.jpg", 1);
        this.specular = new Texture("/resources/models/uranus/specular.jpg", 2);
      break;
      case 7:
        this.albedo = new Texture("/resources/models/neptune/albedo.jpg", 0);
        this.normal = new Texture("/resources/models/neptune/normal.jpg", 1);
        this.specular = new Texture("/resources/models/neptune/specular.jpg", 2);
      break;
      case 8:
        this.albedo = new Texture("/resources/models/pluto/albedo.jpg", 0);
        this.normal = new Texture("/resources/models/pluto/normal.jpg", 1);
        this.specular = new Texture("/resources/models/pluto/specular.jpg", 2);
      break;
    }
  }

  rotate(){
    this.rotation += this.rotation_speed * degree_360;
    if(this.rotation > degree_360) this.rotation -= degree_360;
  }

  paint(){
    if(this.albedo.loaded && this.normal.loaded
    && this.specular.loaded && this.model_3d.data_loaded){
      shader_planet.use();

      this.albedo.activate();
      this.albedo.bind();
      this.normal.activate();
      this.normal.bind();
      this.specular.activate();
      this.specular.bind();

      gl.bindVertexArray(this.model_3d.vao);
      shader_planet.uniform1f(shader_planet.u_scale, this.size);
      shader_planet.uniform1f(shader_planet.u_rotation, this.rotation);
      gl.drawArrays(gl.TRIANGLES, 0, this.model_3d.data_size);
    }
  }

}

class Earth {
  model_3d = null

  // Textures
  albedo   = null;
  normal   = null;
  combined = null;

  // Sun physical proterties
  size           = 1;
  rotation_speed = 0.01;
  rotation       = 0;
  cloud_rotation = 0;

  distance_to_sun   = 2.0;
  translation_speed = 0.005;
  translation       = 0;

  constructor(model_3d, size = 1.0, distance_to_sun = 2.0,
              rotation_speed = 0.01, rotation_angle = Math.random() * degree_360,
              translation_speed = 0.005, translation_angle = Math.random() * degree_360){
    this.model_3d = model_3d;

    // Sun 3D model
    this.albedo   = new Texture("/resources/models/earth/albedo.jpg", 0);
    this.normal   = new Texture("/resources/models/earth/normals.jpg", 1);
    this.combined = new Texture("/resources/models/earth/lights_clouds_specular.jpg", 2);

    this.size = size;
    this.distance_to_sun = distance_to_sun;

    this.rotation_speed = rotation_speed / (1000 / frame_time_step);
    this.rotation = rotation_angle / degree_360;
    this.rotation = this.rotation * 0.3;
    this.translation_speed = translation_speed / (1000 / frame_time_step);
    this.translation = translation_angle * to_radian;

    shader_earth.use();
    shader_earth.uniform1f(shader_earth.u_scale, this.size);
    shader_earth.uniform1f(shader_earth.u_distance, this.distance_to_sun);
  }

  rotate(){
    this.rotation -= this.rotation_speed;
    if(this.rotation < 0.0) this.rotation += 1.0;
    this.cloud_rotation -= this.rotation_speed * 0.7;
    if(this.cloud_rotation < 0.0) this.cloud_rotation += 1.0;
  }

  translate(){
    this.translation += this.translation_speed * degree_360;
    if(this.translation > degree_360) this.translation -= degree_360;
  }

  paint(){
    if(this.albedo.loaded && this.normal.loaded && this.combined.loaded 
      && this.model_3d.data_loaded){
      shader_earth.use();

      this.albedo.activate();
      this.albedo.bind();
      this.normal.activate();
      this.normal.bind();
      this.combined.activate();
      this.combined.bind();

      gl.bindVertexArray(this.model_3d.vao);
      shader_earth.uniform1f(shader_earth.u_rotation, this.rotation);
      shader_earth.uniform1f(shader_earth.u_cloud_rotation, this.cloud_rotation);
      shader_earth.uniform1f(shader_earth.u_translation, this.translation);
      gl.drawArrays(gl.TRIANGLES, 0, this.model_3d.data_size);
    }
  }
}

class Lines extends Shader {
  u_scale = 0;
  u_color = 0;

  color = null;

  data_size = 0;
  vao       = 0;

  constructor(vertex_shader, fragment_shader, resolution_degrees = 1,
              color = v4.new(1.0, 1.0, 1.0, 0.3)){
    super(vertex_shader, fragment_shader);

    this.u_scale = this.uniform_location('u_scale');
    this.u_color = this.uniform_location('u_color');
    this.color = color;

    this.uniform4fv(this.u_color, this.color);

    this.create_circle(resolution_degrees);
  }

  create_circle(resolution){
    const increment = resolution * to_radian;
    this.data_size = Math.ceil(degree_360 / increment);

    var buffer_data = new Float32Array(this.data_size-- * 2);

    for(var i = 0, angle = 0.0; angle < degree_360; angle += increment, ++i){
      buffer_data[i] = Math.cos(angle);   // x coordinate
      buffer_data[++i] = Math.sin(angle); // y coordinate
    }

    if(this.vao <= 0)
      this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, buffer_data, gl.STATIC_DRAW);

    gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, 8, 0); 
    gl.enableVertexAttribArray(attributes.position);
  }

  paint(){
    this.use();

    gl.bindVertexArray(this.vao);
    for(var i = 0; i < planet_distances.length; ++i){
      this.uniform1f(this.u_scale, planet_distances[i]);
      gl.drawArrays(gl.LINE_LOOP, 0, this.data_size);
      //gl.drawArrays(gl.POINTS, 0, this.data_size);
    }
  }
}

// :::::::::::::::::::::::::::::::::::::::: INITIALIZATION ::::::::::::::::::::::::::::::::::::::::

$(document).ready(function(){
  initialization();

  frame_time_step = 30;

  open_gl = new OpenGL($home);
  loader = new Loader;

  var sphere_3d = { vao: 0, data_size: 0, data_loaded: false };
  loader.load_model("/resources/models/sphere/model.obj", sphere_3d);

  shader_sun = new ShaderSun(sun_vertex_program, sun_fragment_program);

  sol = new Sun(sphere_3d);

  shader_earth = new ShaderEarth(earth_vertex_program, earth_fragment_program);
  earth = new Earth(sphere_3d, planet_radius[2], planet_distances[2], 0.05, 90, 0.005, 60);

  trajectories = new Lines(lines_vertex_program, lines_fragment_program);

  resize();
  open_gl.animate();

  // Resizing ::::::::::::::::::::::::::::::::::::::::::::::::::::
  $(window).on('resize', function(){ resize(); });

  animation = setInterval(function(){ open_gl.animate(); }, frame_time_step);
});






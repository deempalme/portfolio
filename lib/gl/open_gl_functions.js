//global variable definition
var w = w_a = window.innerWidth, h = window.innerHeight, w2 = w / 2, h2 = h / 2, h12 = h * 1.2;
var canvas, zoom_in, zoom_out, home_position, top_position, gl = null, extensions;
var number_loaded = 0;
var mayor_fingers = false;
var mover, hammertime;

const degree90 = Math.PI / 2, degree270 = Math.PI * 1.5, degree360 = Math.PI * 2, 
degree45 = degree90/2;

var normals_program;
var n_i_position, n_i_uv, n_i_normal, n_i_tangent, n_i_bitangent, n_u_model, n_u_view, 
n_u_light_position, n_u_camera_position;

var model = m4.identity(), model_2 = m4.rotateY(model, 1.0472), vehicle_loaded = false;
var vehicle_vao, vehicle_normal, vehicle_diffuse, vehicle_data_size;
var vehicle_diffuse_loaded = false, vehicle_normal_loaded = false;

var ring_size, ring_vao, ring_loaded = false, ring_diffuse, 
ring_diffuse_loaded = false, ring_normal, ring_normal_loaded = false;

const empty_matrix = m4.identity();
var model = m4.identity(), model_2 = m4.rotateY(model, 1.0472);
var pvm, projection, view, master_matrix;

var tire_size, tire_vao, tire_diffuse, tire_normal,
tire_diffuse_loaded = false, tire_normal_loaded = false, tire_loaded = false;
//rear right tire
var tire_model_1 = m4.rotateY(m4.translate(empty_matrix, v3.new(0.76, 0.28, 0.95)), degree90);
//frontal right tire
var tire_model_2 = m4.rotateY(m4.translate(empty_matrix, v3.new(0.76, 0.28, -1.35)), degree90);
//rear left tire
var tire_model_3 = m4.rotateY(m4.translate(empty_matrix, v3.new(-0.76, 0.28, 0.95)), -degree90);
//frontal left tire
var tire_model_4 = m4.rotateY(m4.translate(empty_matrix, v3.new(-0.76, 0.28, -1.35)), -degree90);

var n_u_specular;

var laser_vao, laser_size, laser_loaded = false;

var ground_vao, simple_program, ground_size;
var g_i_position, g_i_intensity, g_u_pvm, g_u_view, g_u_proj, g_u_model, g_u_palette, g_u_laser;

var initial_camera_eye = v3.new(0, 0, 5), initial_camera_center = v3.new(0, 0, 0);
var camera_eye = initial_camera_eye, camera_center = initial_camera_center, 
camera_up = v3.new(0, 1, 0);
var camera_translation = initial_camera_center, camera_rotation_matrix = m4.identity(), zoom = 1;
var light_position = v3.new(-30, 30, -15);

var normals_vertex_shader_string =
  "#version 300 es\n"+

  "precision mediump float;"+

  // attributes
  "in vec3 i_position;"+
  "in vec2 i_uv;"+
  "in vec3 i_normal;"+
  "in vec3 i_tangent;"+
  "in vec3 i_bitangent;"+

  // uniforms
  "uniform mat4 u_model;"+
  "uniform mat4 u_view;"+
  "uniform vec3 u_light_position;"+
  "uniform vec3 u_camera_position;"+

  // data for fragment shader
  "out vec2 o_uv;"+
  "out vec3 o_position;"+
  "out vec3 o_tangent_view;"+
  "out vec3 o_tangent_light;"+
  "out vec3 o_tangent_position;"+

  ///////////////////////////////////////////////////////////////////
  "void main(void){"+
  "  gl_Position = u_model * vec4(i_position, 1.0);"+
  "  o_position = vec3(gl_Position);"+
  "  o_uv = i_uv;"+

  "  vec3 T = normalize(vec3(u_model * vec4(i_tangent, 0.0)));"+
  "  vec3 N = normalize(vec3(u_model * vec4(i_normal, 0.0)));"+
  "  T = normalize(T - dot(T, N) * N);"+
  "  vec3 B = cross(N, T);"+

  "  mat3 TBN = mat3(T, B, N);"+
  "  TBN = transpose(TBN);"+

  "  o_tangent_light = TBN * u_light_position;"+
  "  o_tangent_view = TBN * u_camera_position;"+
  "  o_tangent_position = TBN * o_position;"+

  "  gl_Position = u_view * gl_Position;"+
  "}";

var normals_fragment_shader_string =
  "#version 300 es\n"+

  "precision mediump float;"+

  // data from vertex shader
  "in vec2 o_uv;"+
  "in vec3 o_position;"+
  "in vec3 o_tangent_view;"+
  "in vec3 o_tangent_light;"+
  "in vec3 o_tangent_position;"+

  // textures
  "uniform sampler2D u_diffuse;"+
  "uniform sampler2D u_normal;"+
  "uniform float u_specular_intensity;"+

  "out vec4 frag_color;"+

  //////////////////////////////////////////////////////
  "void main(void){"+
    // Obtain normal from normal map in range [0,1]
  "  vec3 normal = texture(u_normal, o_uv).rgb;"+
  "  normal = normalize(normal * 2.0 - 1.0);"+

    // Get diffuse color
  "  vec3 color = texture(u_diffuse, o_uv).rgb;"+

    // Ambient
  "  vec3 ambient = 0.9 * color;"+
    // Diffuse
  "  vec3 light_direction = normalize(o_tangent_light - o_tangent_position);"+
  "  float diff = max(dot(light_direction, normal), 0.0);"+
  "  vec3 diffuse = diff * color * 0.2;"+
    // Specular
  "  vec3 view_direction = normalize(o_tangent_view - o_tangent_position);"+
  "  vec3 reflect_direction = reflect(-light_direction, normal);"+
  "  vec3 halfway_direction = normalize(light_direction + view_direction);"+
  "  float spec = pow(max(dot(normal, halfway_direction), 0.0), 32.0);"+

  "  vec3 specular = vec3(u_specular_intensity) * spec;"+
  "  frag_color = vec4(ambient + diffuse + specular, 1.0);"+
  "}";

var simple_vertex_shader_string =
  "#version 300 es\n"+

  "precision mediump float;"+

  "in vec3 i_position;"+
  "in float i_intensity;"+

  "out vec4 o_color;"+
  "out vec3 o_position;"+
  "out float o_fog;"+

  "uniform mat4 u_pvm;"+
  "uniform mat4 u_view;"+
  "uniform mat4 u_proj;"+
  "uniform mat4 u_model;"+
  "uniform mat4 u_palette;"+   //this is the color palette
  "uniform float u_laser;"+

  "void main(){"+

  "  gl_PointSize = 2.5;"+

  "  if(u_laser < 0.5){"+
  "    vec4 world_position = u_view * u_model * vec4(i_position, 1.0);"+
  "    o_position = world_position.rgb;"+
  "    gl_Position = u_proj * world_position;"+
  "    o_fog = 1.0;"+
  "  }else{"+
       // Notice the -0.2 in the Y axis to lower the point cloud
  "    gl_Position = u_pvm * vec4(vec3(-i_position.y, i_position.z - 0.2, -i_position.x), 1.0);"+
  "    o_fog = 0.0;"+
  "  }"+

    //the next section will calculate the color depending in the intensity
  "  float intensity = i_intensity;"+

  "  vec3 temp_col = vec3(0.4);"+

  "  if(u_laser > 0.5){"+
  "    int idx1 = 0;"+// Our desired color will be between these two indexes in 'color'.
  "    int idx2 = 0;"+
  "    float fraction_between = 0.0;"+// Fraction between 'idx1' and 'idx2' where our value is.

  "    if(intensity <= 0.0){"+
  "      idx1 = idx2 = 0;"+
  "    }else if(intensity >= 1.0){"+
  "      idx1 = idx2 = 3;"+
  "    }else{"+
  "      intensity *= 3.0;"+
  "      idx1 = int(floor(intensity));"+// Our desired color will be after this index.
  "      idx2 = idx1 + 1;"+// ... and before this index (inclusive).
  "      fraction_between = intensity - float(idx1);"+// Distance between the two indexes (0-1).
  "    }"+

  "    vec3 palette1 = vec3(u_palette[idx1].xyz);"+
  "    vec3 palette2 = vec3(u_palette[idx2].xyz);"+
  "    temp_col = (palette2 - palette1) * fraction_between + palette1;"+
  "  }"+
  "  o_color = vec4(temp_col, 1.0);"+
  "}";

var simple_fragment_shader_string =
  "#version 300 es\n"+

  "precision mediump float;"+

  "in vec4 o_color;"+
  "in vec3 o_position;"+
  "in float o_fog;"+

  "out vec4 frag_color;"+

  "float fog_factor(vec3 position){"+
  "  float dist = 0.0;"+
  "  float foggy_factor = 1.0;"+
     //range based
  "  dist = length(position) - 15.0;"+
  "  dist = (dist < 0.0)? 0.0 : dist;"+
      
     //exponential fog
  "  foggy_factor = 1.0 /exp(dist * 0.1);"+
  "  foggy_factor = clamp(foggy_factor, 0.0, 1.0);"+
  "  return foggy_factor;"+
  "}"+

  "void main(){"+
  "  vec3 oe_color = o_fog > 0.5 ? o_color.rgb * fog_factor(o_position) : o_color.rgb;"+
  "  frag_color = vec4(oe_color, 1.0);"+
  "}";

// ------------------------------------------------------------------------------------ //
// ------------------------------- canvas mouse events -------------------------------- //
// ------------------------------------------------------------------------------------ //

var drag = false, middle = false;
var old_x, old_y, THETA = 0, PHI = 0, rx = 0, ry = 0, tx = 0, ty = 0;
var increasingW = 1.3 * Math.PI / w, increasingH = 1.3 * Math.PI / h;
var increasingW2 = 4 * Math.PI / w, increasingH2 = 4 * Math.PI / h;

function mouseMove(e) {
  if (!drag) return false;

  if (!middle) {
    rX = e.pageX - old_x;
    rY = e.pageY - old_y;

    THETA += rX * increasingW;
    PHI += rY * increasingH;

    if (PHI >= degree360)
      PHI -= degree360;
    else if (PHI < 0)
      PHI += degree360;

    if (THETA >= degree360)
      THETA -= degree360;
    else if (THETA < 0)
      THETA += degree360;

    camera_rotation_matrix = empty_matrix;
    camera_rotation_matrix = m4.rotateY(camera_rotation_matrix, THETA);
    camera_rotation_matrix = m4.rotateX(camera_rotation_matrix, PHI);

    if (PHI >= degree90 && PHI < degree270)
      camera_up[1] = -1;
    else
      camera_up[1] = 1;

    setLookAt();

    old_x = e.pageX;
    old_y = e.pageY;
  } else {
    rX = e.pageX - old_x;
    rY = e.pageY - old_y;

    camera_translation = v3.transform(camera_rotation_matrix, v3.new(-rX * 0.02 * zoom, rY * 0.02 * zoom, 0));
    camera_center = v3.add(camera_center, camera_translation);

    setLookAt();

    old_x = e.pageX;
    old_y = e.pageY;
  }
  e.preventDefault();
};

function setInitialRotation(angle) {
  PHI = angle;
  THETA = 0;
  camera_rotation_matrix = m4.rotateX(empty_matrix, PHI);
  setLookAt();
}

function handleStart(e){
  var touches = e.touches;

  if(touches.length >= 1)
    drag = true;
  else
    return false;

  old_x = touches[0].pageX, old_y = touches[0].pageY;

  if (touches.length >= 2)
    middle = true;
  else
    middle = false;

  clearInterval(mover);
  $(d_logo).fadeOut(500);

  e.preventDefault();
  return false;
}

function handleEnd(e){
  drag = false;
}

function handleMove(e){
  if (!drag) return false;

  e.preventDefault();
  var touches = e.touches;

  if (!middle) {
    rX = touches[0].pageX - old_x;
    rY = touches[0].pageY - old_y;

    THETA += rX * increasingW;
    PHI += rY * increasingH;

    if (PHI >= degree360)
      PHI -= degree360;
    else if (PHI < 0)
      PHI += degree360;

    if (THETA >= degree360)
      THETA -= degree360;
    else if (THETA < 0)
      THETA += degree360;

    var rotation = empty_matrix;
    rotation = m4.rotateY(rotation, THETA);
    rotation = m4.rotateX(rotation, PHI);

    camera_rotation_matrix = rotation;

    if (PHI >= degree90 && PHI < degree270)
      camera_up[1] = -1;
    else
      camera_up[1] = 1;

    setLookAt();

    old_x = touches[0].pageX;
    old_y = touches[0].pageY;
  } else {
    rX = touches[0].pageX - old_x;
    rY = touches[0].pageY - old_y;

    camera_translation = v3.transform(camera_rotation_matrix, v3.new(-rX * 0.04 * zoom, rY * 0.04 * zoom, 0));
    camera_center = v3.add(camera_center, camera_translation);

    setLookAt();

    old_x = touches[0].pageX;
    old_y = touches[0].pageY;
  }
}
// ------------------------------------------------------------------------------------ //
// ----------------------------- loading model functions ------------------------------ //
// ------------------------------------------------------------------------------------ //

function normalize(vector) {
  var length = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
  vector[0] = vector[0] / length;
  vector[1] = vector[1] / length;
  vector[2] = vector[2] / length;
}

function loadModel(data, id) {
  if (!gl) {
    //console.log("No webGL context is created");
    return null;
  }

  var lines = data.split("\n");
  var sections, face, index;
  var vertices = [], textures = [], normals = [], vector = [0, 0, 0];
  var vertex_indices = [], normal_indices = [], texture_indices = [];
  var tangent = [], bitangent = [];
  var size = lines.length;

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
      for (e = 1; e < 4; e++) {
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
      normalize(vector);

      index = tangent.push(new Array(3)) - 1;
      tangent[index][0] = vector[0];
      tangent[index][1] = vector[1];
      tangent[index][2] = vector[2];
    }
  }

  var indices_size = vertex_indices.length, i3 = 0;
  var all_data = new Float32Array(indices_size * 14);

  for (var i = 0; i < indices_size; i++) {
    i3 = Math.floor(i / 3);
    index = i * 11;
    //position
    all_data[index] = vertices[vertex_indices[i] - 1][0];
    all_data[index + 1] = vertices[vertex_indices[i] - 1][1];
    all_data[index + 2] = vertices[vertex_indices[i] - 1][2];
    //console.log(vertex_indices[i] - 1);
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
    //bitangent
  }

  gl.useProgram(normals_program);
  switch (id) {
    case 0:
      vehicle_data_size = indices_size;
      vehicle_vao = gl.createVertexArray();
      gl.bindVertexArray(vehicle_vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, all_data, gl.STATIC_DRAW);
      vehicle_loaded = true;
      //console.log('vehicle loaded');
      break;
    case 1:
      ring_size = indices_size;
      ring_vao = gl.createVertexArray();
      gl.bindVertexArray(ring_vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, all_data, gl.STATIC_DRAW);
      ring_loaded = true;
      //console.log('ring loaded');
      break;
    case 2:
      tire_size = indices_size;
      tire_vao = gl.createVertexArray();
      gl.bindVertexArray(tire_vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, all_data, gl.STATIC_DRAW);
      tire_loaded = true;
      //console.log('tire loaded');
      break;
  }

  var offset = 0;
  gl.vertexAttribPointer(n_i_position, 3, gl.FLOAT, false, 44, offset); // 14 * 4 = 56 bytes
  gl.enableVertexAttribArray(n_i_position);
  offset += 12;
  gl.vertexAttribPointer(n_i_uv, 2, gl.FLOAT, false, 44, offset);
  gl.enableVertexAttribArray(n_i_uv);
  offset += 8;
  gl.vertexAttribPointer(n_i_normal, 3, gl.FLOAT, false, 44, offset);
  gl.enableVertexAttribArray(n_i_normal);
  offset += 12;
  gl.vertexAttribPointer(n_i_tangent, 3, gl.FLOAT, false, 44, offset);
  gl.enableVertexAttribArray(n_i_tangent);
  number_loaded++;
  all_loaded();

  paintGL();
}

function initTexture(id) {
  if(id == 0 || id == 2 || id == 4)
    gl.activeTexture(gl.TEXTURE0);
  else
    gl.activeTexture(gl.TEXTURE1);

  var id_texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, id_texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  switch (id) {
    case 0:
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, 2048, 2048, 0, gl.RGB, gl.UNSIGNED_BYTE, vehicle_normal);
      vehicle_normal.webglTexture = id_texture;
      vehicle_normal_loaded = true;
      break;
    case 1:
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, 2048, 2048, 0, gl.RGB, gl.UNSIGNED_BYTE, vehicle_diffuse);
      vehicle_diffuse.webglTexture = id_texture;
      vehicle_diffuse_loaded = true;
      break;
    case 2:
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, 1024, 1024, 0, gl.RGB, gl.UNSIGNED_BYTE, ring_normal);
      ring_normal.webglTexture = id_texture;
      ring_normal_loaded = true;
      break;
    case 3:
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, 1024, 1024, 0, gl.RGB, gl.UNSIGNED_BYTE, ring_diffuse);
      ring_diffuse.webglTexture = id_texture;
      ring_diffuse_loaded = true;
      break;
    case 4:
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, 512, 512, 0, gl.RGB, gl.UNSIGNED_BYTE, tire_normal);
      tire_normal.webglTexture = id_texture;
      tire_normal_loaded = true;
      break;
    case 5:
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, 512, 512, 0, gl.RGB, gl.UNSIGNED_BYTE, tire_diffuse);
      tire_diffuse.webglTexture = id_texture;
      tire_diffuse_loaded = true;
      break;
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  if (extensions) {
    var max = gl.getParameter(extensions.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    max = (max > 8.0) ? 8.0 : max;
    gl.texParameterf(gl.TEXTURE_2D, extensions.TEXTURE_MAX_ANISOTROPY_EXT, max);
  }
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);

  number_loaded++;
  all_loaded();

  paintGL();
}

function setLaser(data) {
  var content = new Float32Array(data.target.response);
  laser_size = content.length / 4;

  laser_vao = gl.createVertexArray();
  gl.bindVertexArray(laser_vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, content, gl.STATIC_DRAW);

  gl.vertexAttribPointer(g_i_position, 3, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(g_i_position);
  gl.vertexAttribPointer(g_i_intensity, 1, gl.FLOAT, false, 16, 12);
  gl.enableVertexAttribArray(g_i_intensity);

  laser_loaded = true;
  //console.log("Laser loaded, size:" + laser_size);

  number_loaded++;
  all_loaded();

  paintGL();
}

// ------------------------------------------------------------------------------------ //
// --------------------------- creating the ground lines ------------------------------ //
// ------------------------------------------------------------------------------------ //

function createGround() {
  var iframeWidth = 80;
  var iframeLength = 80;
  var halfWidth = iframeWidth / 2.0;
  var halfLength = iframeLength / 2.0;
  ground_size = (iframeWidth + iframeLength + 2) * 2;
  var size = ground_size * 3;
  var line_points = new Float32Array(size);

  var e = 0;
  for (i = 0; i <= iframeWidth; i++) {
    line_points[e++] = i - halfWidth;
    line_points[e++] = -0.3;
    line_points[e++] = -halfLength;

    line_points[e++] = i - halfWidth;
    line_points[e++] = -0.3;
    line_points[e++] = iframeWidth - halfLength;
  }

  for (i = 0; i <= iframeLength; i++) {
    line_points[e++] = -halfWidth;
    line_points[e++] = -0.3;
    line_points[e++] = i - halfLength;

    line_points[e++] = iframeLength - halfWidth;
    line_points[e++] = -0.3;
    line_points[e++] = i - halfLength;
  }

  ground_vao = gl.createVertexArray();
  gl.bindVertexArray(ground_vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, line_points, gl.STATIC_DRAW);
  gl.vertexAttribPointer(g_i_position, 3, gl.FLOAT, false, 12, 0);
  gl.enableVertexAttribArray(g_i_position);
}

// ------------------------------------------------------------------------------------ //
// --------------------------- painting function for WebGL ----------------------------- //
// ------------------------------------------------------------------------------------ //

function clear() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function paintGround() {
  gl.useProgram(simple_program);

  gl.uniform1f(g_u_laser, 0.0);

  gl.bindVertexArray(ground_vao);
  gl.drawArrays(gl.LINES, 0, ground_size);
}

function paintModels(id) {
  switch (id) {
    case 1:
      if (!tire_loaded || !tire_diffuse_loaded || !tire_normal_loaded)
        return null;
      gl.uniform1f(n_u_specular, 0.4);
      break;
    default:
      if (!ring_loaded || !ring_diffuse_loaded || !ring_normal_loaded)
        return null;
      break;
  }

  gl.useProgram(normals_program);

  switch (id) {
    case 1:
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tire_normal.webglTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tire_diffuse.webglTexture);

      gl.bindVertexArray(tire_vao);
      break;
    default:
      gl.uniformMatrix4fv(n_u_model_mat, false, model);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, ring_normal.webglTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, ring_diffuse.webglTexture);

      gl.bindVertexArray(ring_vao);
      break;
  }

  switch (id) {
    case 1:
      //rear right tire
      gl.uniformMatrix4fv(n_u_model_mat, false, tire_model_1);
      gl.drawArrays(gl.TRIANGLES, 0, tire_size);
      //frontal right tire
      gl.uniformMatrix4fv(n_u_model_mat, false, tire_model_2);
      gl.drawArrays(gl.TRIANGLES, 0, tire_size);
      //rear left tire
      gl.uniformMatrix4fv(n_u_model_mat, false, tire_model_3);
      gl.drawArrays(gl.TRIANGLES, 0, tire_size);
      //frontal left tire
      gl.uniformMatrix4fv(n_u_model_mat, false, tire_model_4);
      gl.drawArrays(gl.TRIANGLES, 0, tire_size);
      break;
    default:
      gl.drawArrays(gl.TRIANGLES, 0, ring_size);
      break;
  }
}

function paintVehicle() {
  if (!vehicle_loaded || !vehicle_normal_loaded || !vehicle_diffuse_loaded)
    return null;

  gl.useProgram(normals_program);

  gl.uniformMatrix4fv(n_u_model_mat, false, model);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, vehicle_normal.webglTexture);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, vehicle_diffuse.webglTexture);

  gl.bindVertexArray(vehicle_vao);

  gl.drawArrays(gl.TRIANGLES, 0, vehicle_data_size);
}

function paintLaser() {
  if (!laser_loaded)
    return null;

  gl.useProgram(simple_program);
  gl.uniform1f(g_u_laser, 1.0);
  gl.bindVertexArray(laser_vao);
  gl.drawArrays(gl.POINTS, 0, laser_size);
}

function paintGL() {
  clear();

  paintModels(1); // Tires
  paintVehicle();
  paintModels(0); // Ring
  paintLaser();
  paintGround();

  gl.flush();
}

// ------------------------------------------------------------------------------------ //
// ------------------------------ initializing WebGL ---------------------------------- //
// ------------------------------------------------------------------------------------ //

function initGL() {
  set_new_events();

  gl = null;
  canvas = document.getElementById('visualization');

  try {
    gl = canvas.getContext('webgl2', { alpha: false, antialias: true });
  } catch (e) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    return null;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  gl.enable(gl.CULL_FACE);            // Draws only frontal faces
  gl.cullFace(gl.BACK);
  gl.viewport(0, 0, w, h);

  extensions = (
    gl.getExtension("EXT_texture_filter_anisotropic") ||
    gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
    gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic")
  );

  // ----------------------------- loading shaders for vehicle --------------------------------
  var normals_fragment_shader = getShader(1);
  var normals_vertex_shader = getShader(0);

  // Create the shader program

  normals_program = gl.createProgram();
  gl.attachShader(normals_program, normals_vertex_shader);
  gl.attachShader(normals_program, normals_fragment_shader);
  gl.linkProgram(normals_program);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(normals_program, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(normals_program));
  }

  gl.useProgram(normals_program);

  // getting attribute locations
  n_i_position = gl.getAttribLocation(normals_program, "i_position");
  n_i_uv = gl.getAttribLocation(normals_program, "i_uv");
  n_i_normal = gl.getAttribLocation(normals_program, "i_normal");
  n_i_tangent = gl.getAttribLocation(normals_program, "i_tangent");
  n_i_bitangent = gl.getAttribLocation(normals_program, "i_bitangent");
  // getting uniform locations
  n_u_model_mat = gl.getUniformLocation(normals_program, "u_model");
  n_u_view = gl.getUniformLocation(normals_program, "u_view");
  n_u_light_position = gl.getUniformLocation(normals_program, "u_light_position");
  n_u_camera_position = gl.getUniformLocation(normals_program, "u_camera_position");

  n_u_normal = gl.getUniformLocation(normals_program, "u_normal");
  n_u_diffuse = gl.getUniformLocation(normals_program, "u_diffuse");
  n_u_specular = gl.getUniformLocation(normals_program, "u_specular_intensity");

  gl.uniform1i(n_u_normal, 0);
  gl.uniform1i(n_u_diffuse, 1);

  vehicle_normal = new Image();
  vehicle_normal.src = "/resources/models/car/normal.jpg";
  vehicle_normal.webglTexture = false;
  vehicle_normal.onload = function (e) { initTexture(0); }

  vehicle_diffuse = new Image();
  vehicle_diffuse.src = "/resources/models/car/albedo.jpg";
  vehicle_diffuse.webglTexture = false;
  vehicle_diffuse.onload = function (e) { initTexture(1); }

  ring_normal = new Image();
  ring_normal.src = "/resources/models/ring/normal.jpg";
  ring_normal.webglTexture = false;
  ring_normal.onload = function (e) { initTexture(2); }

  ring_diffuse = new Image();
  ring_diffuse.src = "/resources/models/ring/albedo.jpg";
  ring_diffuse.webglTexture = false;
  ring_diffuse.onload = function (e) { initTexture(3); }

  tire_normal = new Image();
  tire_normal.src = "/resources/models/tire/normal.jpg";
  tire_normal.webglTexture = false;
  tire_normal.onload = function (e) { initTexture(4); }

  tire_diffuse = new Image();
  tire_diffuse.src = "/resources/models/tire/albedo.jpg";
  tire_diffuse.webglTexture = false;
  tire_diffuse.onload = function (e) { initTexture(5); }

  projection = m4.perspective(1.0471975512, w / h, 0.1, 1000); // 60° = 1.0471975512
  gl.uniform3fv(n_u_light_position, light_position);

  // ----------------------------- loading shaders for vehicle --------------------------------
  var simple_fragment_shader = getShader(3);
  var simple_vertex_shader = getShader(2);

  // Create the shader program

  simple_program = gl.createProgram();
  gl.attachShader(simple_program, simple_vertex_shader);
  gl.attachShader(simple_program, simple_fragment_shader);
  gl.linkProgram(simple_program);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(simple_program, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(simple_program));
  }

  gl.useProgram(simple_program);

  // getting attribute locations
  g_i_position = gl.getAttribLocation(simple_program, "i_position");
  g_i_intensity = gl.getAttribLocation(simple_program, "i_intensity");
  // getting uniform locations
  g_u_model = gl.getUniformLocation(simple_program, "u_model");
  g_u_pvm = gl.getUniformLocation(simple_program, "u_pvm");
  g_u_view = gl.getUniformLocation(simple_program, "u_view");
  g_u_proj = gl.getUniformLocation(simple_program, "u_proj");
  g_u_palette = gl.getUniformLocation(simple_program, "u_palette");
  g_u_laser = gl.getUniformLocation(simple_program, "u_laser");

  gl.uniformMatrix4fv(g_u_proj, false, projection);

  var color_palette = new Float32Array(16);
  color_palette[0] = 0.2;
  color_palette[1] = 0.5;
  color_palette[2] = 0.7;
  color_palette[3] = 0;

  color_palette[4] = 0;
  color_palette[5] = 1;
  color_palette[6] = 0;
  color_palette[7] = 0;

  color_palette[8] = 1;
  color_palette[9] = 1;
  color_palette[10] = 0;
  color_palette[11] = 0;

  color_palette[12] = 1;
  color_palette[13] = 0;
  color_palette[14] = 0;
  color_palette[15] = 0;

  gl.uniformMatrix4fv(g_u_palette, false, color_palette);

  createGround();

  setInitialRotation(-0.436332313);

  load_models();

  mover = setInterval(function(){ rotateScene(); }, 60);
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(id) {
  var shader;

  // Send the source to the shader object
  switch(id){
    case 1:
      shader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(shader, normals_fragment_shader_string);
    break;
    case 2:
      shader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(shader, simple_vertex_shader_string);
    break;
    case 3:
      shader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(shader, simple_fragment_shader_string);
    break;
    default:
      shader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(shader, normals_vertex_shader_string);
    break;
  }
  // Compile the shader program
  gl.compileShader(shader);
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader) + " id:" + id);
    return null;
  }
  return shader;
}

function setLookAt() {

  camera_eye = v3.transform(camera_rotation_matrix, v3.scalar(initial_camera_eye, zoom));
  camera_eye = v3.add(camera_eye, camera_center);

  view = m4.lookAt(camera_eye, camera_center, camera_up);
  pvm = m4.multiply(projection, m4.multiply(view, model_2));
  master_matrix = m4.multiply(projection, view);

  gl.useProgram(simple_program);
  gl.uniformMatrix4fv(g_u_model, false, model);
  gl.uniformMatrix4fv(g_u_pvm, false, pvm);
  gl.uniformMatrix4fv(g_u_view, false, view);

  gl.useProgram(normals_program);
  gl.uniformMatrix4fv(n_u_model_mat, false, model);
  gl.uniformMatrix4fv(n_u_view, false, master_matrix);
  gl.uniform3fv(n_u_camera_position, camera_eye);

  paintGL();
}

function rotateScene(){
  THETA -= 2 * increasingW;

  if (THETA >= degree360)
    THETA -= degree360;
  else if (THETA < 0)
    THETA += degree360;

  camera_rotation_matrix = empty_matrix;
  camera_rotation_matrix = m4.rotateY(camera_rotation_matrix, THETA);
  camera_rotation_matrix = m4.rotateX(camera_rotation_matrix, PHI);

  setLookAt();
}

function load_models(){
  $.get("/resources/models/car/model.obj", function (data) {
    loadModel(data, 0);
  }, "text");

  $.get("/resources/models/ring/model.obj", function (data) {
    loadModel(data, 1);
  }, "text");

  $.get("/resources/models/tire/model.obj", function (data) {
    loadModel(data, 2);
  }, "text");

  // loading the laser cloud data
  var lsr = new XMLHttpRequest();
  lsr.open('GET', '/resources/raw_data/binary.bin', true);
  lsr.responseType = 'arraybuffer';
  lsr.onload = function (data) { setLaser(data); };
  lsr.send();
}

function zooming(id) {
  switch (id) {
    case 1:
      var previousZoom = zoom;
      zoom *= 0.9;
      zoom = (zoom < 0.05) ? 0.05 : zoom;
      if (previousZoom != zoom) setLookAt();
      break;
    case 2:
      camera_center = initial_camera_center;
      camera_up = v3.new(0, 1, 0);
      zoom = 3.75;
      setInitialRotation(-1.569051);
      break;
    case -1:
      var previousZoom = zoom;
      zoom *= 1.1;
      zoom = (zoom > 15) ? 15 : zoom;
      if (previousZoom != zoom) setLookAt();
      break;
    default:
      camera_center = initial_camera_center;
      camera_up = v3.new(0, 1, 0);
      zoom = 1;
      setInitialRotation(-0.436332313);
      break;
  }
  clearInterval(mover);
  $(d_logo).fadeOut(500);
}

function all_loaded(){
  if(number_loaded >= 11)
    $('div#loading').remove();
}

var previous_angle = 0;

function touch_rotation_start(event){
  clearInterval(mover);
  $(d_logo).fadeOut(500);

  previous_angle = event.rotation;
}

function touch_rotation_move(event){
  event.preventDefault();
  
  THETA += (event.rotation - previous_angle) * increasingW2;

  if (THETA >= degree360)
    THETA -= degree360;
  else if (THETA < 0)
    THETA += degree360;

  var rotation = empty_matrix;
  rotation = m4.rotateY(rotation, THETA);
  rotation = m4.rotateX(rotation, PHI);
  
  camera_rotation_matrix = rotation;

  setLookAt();
  previous_angle = event.rotation;
}

var previous_zoom = 1;

function touch_zoom_start(event){
  clearInterval(mover);
  $(d_logo).fadeOut(500);

  previous_zoom = event.scale;

  old_x = event.deltaX;
  old_y = event.deltaY;
}

function touch_zoom_move(event){
  event.preventDefault();
  
  zoom *= 1 - event.scale + previous_zoom;

  zoom = (zoom < 0.05) ? 0.05 : zoom;
  zoom = (zoom > 15) ? 15 : zoom;
  
  rX = event.deltaX - old_x;
  rY = event.deltaY - old_y;

  camera_translation = v3.transform(camera_rotation_matrix, v3.new(-rX * increasingW2 * zoom, rY * increasingH2 * zoom, 0));
  camera_center = v3.add(camera_center, camera_translation);

  setLookAt();

  previous_zoom = event.scale;
  old_x = event.deltaX;
  old_y = event.deltaY;
}

var old_scroll = 0;
var actual_scroll = 0;

function touch_pan_start(event){
  if(event.pointerType === 'touch'){
    old_scroll = event.deltaY;
    actual_scroll = $('html, body').scrollTop();
  }
}

function touch_pan_move(event){
  if(event.pointerType === 'touch'){
    actual_scroll -= event.deltaY - old_scroll;
    $('html, body').scrollTop(actual_scroll);
    old_scroll = event.deltaY;
  }
}
// ------------------------------------------------------------------------------------ //
// ------------------------------ resize window function ------------------------------ //
// ------------------------------------------------------------------------------------ //

function resize_gl(){
  w = w_a = window.innerWidth;
  h = window.innerHeight;
  w2 = w * 0.5;
  h2 = h * 0.5;

  canvas.width = w;
  canvas.height = h;

  increasingW = 1.3 * Math.PI / w;
  increasingH = 1.3 * Math.PI / h;

  if(gl){
    gl.viewport(0, 0, w, h);
    projection = empty_matrix;
    projection = m4.perspective(1.0471975512, w / h, 0.1, 1000); // 60° = 1.0471975512

    gl.useProgram(simple_program);
    gl.uniformMatrix4fv(g_u_proj, false, projection);

    setLookAt();
  }
}


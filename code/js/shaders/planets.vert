precision mediump float;

// attributes
attribute vec3 i_position;
attribute vec2 i_uv;
attribute vec3 i_normal;
attribute vec3 i_tangent;
attribute vec3 i_bitangent;

// uniforms
uniform mat4 u_pv; // Projection and view matrix
uniform vec3 u_camera_position;

// u_position componets:
//    x = planet radius
//    y = distance to star (center)
//    z = translation angle
//    w = rotation angle
uniform vec4 u_position;

// data for fragment shader
varying vec2 f_uv;
varying vec3 f_tangent_position;
varying vec3 f_tangent_camera;

///////////////////////////////////////////////////////////////////

void main(void){
  // Scaling planet to correct radius
  vec4 world_position = vec4(i_position * u_position.x, 1);

  const float degrees360 = 6.283185307;
  vec4 translation = vec4(u_position.y, u_position.y, 0.0, 0.0);
  translation.x *= cos(u_position.z * degrees360);
  translation.y *= sin(u_position.z * degrees360);

  // Translating the planet
  world_position += translation;

  // re-orthogonalize T with respect to N
  vec3 T = normalize(i_tangent - dot(i_tangent, i_normal) * i_normal);
  // then retrieve perpendicular vector B with the cross product of T and N
  vec3 B = cross(i_normal, T);

  mat3 TBN = mat3(T, B, i_normal);

  f_tangent_camera   = TBN * u_camera_position;
  f_tangent_position = TBN * world_position;

  // Moving the texture's x coordinates simulates planet's rotation
  f_uv = vec2(i_uv.x + u_position.w, i_uv.y);

  // calculate screen space position of the vertex
  gl_Position	= u_pv * world_position;
};

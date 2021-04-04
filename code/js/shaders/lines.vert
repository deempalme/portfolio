precision mediump float;

// attributes
attribute vec2 i_position;

// uniforms
uniform mat4 u_pv; // Projection and view matrix
uniform float u_radius;

///////////////////////////////////////////////////////////////////

void main(void){
  // scaling the position
  gl_Position	= u_pv * vec4(i_position * u_radius, 0.0, 1.0);
};

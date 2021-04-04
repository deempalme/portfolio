precision mediump float;

// data from vertex shader
varying vec2 f_uv;
varying vec3 f_tangent_position;
varying vec3 f_tangent_camera;

// textures
uniform sampler2D u_diffuse;
uniform sampler2D u_normal;
uniform sampler2D u_lights;

uniform float u_use_lights;

//////////////////////////////////////////////////////

void main(void){
  // obtain normal from normal map in range [0,1]
  vec3 normal = texture(u_normal, f_uv).rgb;
  // transform normal vector to range [-1,1]
  normal = normalize(normal * 2.0 - 1.0);  // this normal is in tangent space
  
  // get diffuse color
  vec3 color = texture(u_diffuse, f_uv).rgb;
  // ambient
  vec3 ambient = 0.1 * color;
  // diffuse
  float diff = max(dot(-f_tangent_position, normal), 0.0);
  vec3 diffuse = diff * color;
  // specular
  vec3 view_dir = normalize(f_tangent_camera - f_tangent_position);
  vec3 halfway_dir = normalize(-f_tangent_position + view_dir);  
  float spec = pow(max(dot(normal, halfway_dir), 0.0), 32.0);

  vec3 final = ambient + diffuse + vec3(0.2) * spec;
  gl_FragColor = vec4(final + mix(0.0, 0.5, u_use_lights), 1.0);
};

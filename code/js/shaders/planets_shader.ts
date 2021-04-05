
export class planets_shader {
  public static vertex : string | null = 
    "precision mediump float;"+

    // attributes
    "attribute vec3 i_position;"+
    "attribute vec2 i_uv;"+
    "attribute vec3 i_normal;"+
    "attribute vec3 i_tangent;"+
    "attribute vec3 i_bitangent;"+

    // uniforms
    "uniform mat4 u_pv;"+ // Projection and view matrix
    "uniform mat4 u_model;"+ // model matrix
    "uniform vec3 u_camera_position;"+

    // data for fragment shader
    "varying vec2 f_uv;"+
    "varying vec3 f_tangent_light;"+
    "varying vec3 f_tangent_view;"+
    "varying vec3 f_tangent_position;"+

    ///////////////////////////////////////////////////////////////////

    "void main(void){"+
      // Translating the planet
    "  vec4 frag_position = u_model * vec4(i_position, 1.0);"+        

    "  vec3 T = normalize(vec3(u_model * vec4(i_tangent, 0.0)));"+
    "  vec3 N = normalize(vec3(u_model * vec4(i_normal, 0.0)));"+
      // re-orthogonalize T with respect to N
    "  T = normalize(T - dot(T, N) * N);"+
      // then retrieve perpendicular vector B with the cross product of T and N
    "  vec3 B = cross(N, T);"+

    "  mat3 TBN = mat3(T, B, N);"+
    "  f_tangent_light    = TBN * vec3(0.0);"+
    "  f_tangent_view     = TBN * u_camera_position;"+
    "  f_tangent_position = TBN * frag_position.xyz;"+

    "  f_uv = i_uv;"+

      // calculate screen space position of the vertex
    "  gl_Position	= u_pv * frag_position;"+
    "}";

  public static fragment : string | null = 
    "precision mediump float;"+

    // data from vertex shader
    "varying vec2 f_uv;"+
    "varying vec3 f_tangent_light;"+
    "varying vec3 f_tangent_view;"+
    "varying vec3 f_tangent_position;"+

    // textures
    "uniform sampler2D u_diffuse;"+
    "uniform sampler2D u_normal;"+
    "uniform sampler2D u_lights;"+

    "uniform float u_use_lights;"+

    //////////////////////////////////////////////////////

    "void main(void){"+
      // obtain normal from normal map in range [0,1]
    "  vec3 normal = texture2D(u_normal, f_uv).rgb;"+
      // transform normal vector to range [-1,1]
    "  normal = normalize(normal * 2.0 - 1.0);"+  // this normal is in tangent space

      // get diffuse color
    "  vec3 color = texture2D(u_diffuse, f_uv).rgb;"+
      // ambient
    "  vec3 ambient = 0.1 * color;"+
      // diffuse
    "  vec3 light_dir = normalize(f_tangent_light - f_tangent_position);"+
    "  float diff = max(dot(light_dir, normal), 0.0);"+
    "  vec3 diffuse = diff * color;"+
      // specular
    "  vec3 view_dir = normalize(f_tangent_view - f_tangent_position);"+
    "  vec3 reflect_dir = reflect(-light_dir, normal);"+
    "  vec3 halfway_dir = normalize(light_dir + view_dir);"+  
    "  float spec = pow(max(dot(normal, halfway_dir), 0.0), 32.0);"+
    
    "  vec3 final = ambient + diffuse + vec3(0.2) * spec;"+
    "  gl_FragColor = vec4(final + mix(0.0, 0.5, u_use_lights), 1.0);"+
    "}";
};
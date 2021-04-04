
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
    "uniform vec3 u_camera_position;"+
    
    // u_position componets:
    //    x = planet radius
    //    y = distance to star (center)
    //    z = translation angle
    //    w = rotation angle
    "uniform vec4 u_position;"+
    
    // data for fragment shader
    "varying vec2 f_uv;"+
    "varying vec3 f_tangent_position;"+
    "varying vec3 f_tangent_camera;"+
    
    ///////////////////////////////////////////////////////////////////
    
    "void main(void){"+
      // Scaling planet to correct radius
    "  vec3 world_position = i_position * u_position.x;"+
    
    "  const float degrees360 = 6.283185307;"+
    "  vec3 translation = vec3(u_position.y, u_position.y, 0.0);"+
    "  translation.x *= cos(u_position.z * degrees360);"+
    "  translation.y *= sin(u_position.z * degrees360);"+
    
      // Translating the planet
    "  world_position += translation;"+
    
      // re-orthogonalize T with respect to N
    "  vec3 T = normalize(i_tangent - dot(i_tangent, i_normal) * i_normal);"+
      // then retrieve perpendicular vector B with the cross product of T and N
    "  vec3 B = cross(i_normal, T);"+
    
    "  mat3 TBN = mat3(T, B, i_normal);"+
    
    "  f_tangent_camera   = TBN * u_camera_position;"+
    "  f_tangent_position = TBN * world_position;"+
    
      // Moving the texture's x coordinates simulates planet's rotation
    "  f_uv = vec2(i_uv.x + u_position.w, i_uv.y);"+
    
      // calculate screen space position of the vertex
    "  gl_Position	= u_pv * vec4(world_position, 1.0);"+
    "}";

  public static fragment : string | null = 
    "precision mediump float;"+

    // data from vertex shader
    "varying vec2 f_uv;"+
    "varying vec3 f_tangent_position;"+
    "varying vec3 f_tangent_camera;"+
    
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
    "  float diff = max(dot(-f_tangent_position, normal), 0.0);"+
    "  vec3 diffuse = diff * color;"+
      // specular
    "  vec3 view_dir = normalize(f_tangent_camera - f_tangent_position);"+
    "  vec3 halfway_dir = normalize(-f_tangent_position + view_dir);"+  
    "  float spec = pow(max(dot(normal, halfway_dir), 0.0), 32.0);"+
    
    "  vec3 final = ambient + diffuse + vec3(0.2) * spec;"+
    "  gl_FragColor = vec4(final + mix(0.0, 0.5, u_use_lights), 1.0);"+
    "}";
};
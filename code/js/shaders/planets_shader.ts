
export class planets_shader {
  public static vertex : string | null = 
    "#version 300 es\n"+

    "precision mediump float;\n"+

    // attributes
    "layout (location = 0) in vec3 i_position;\n"+
    "layout (location = 1) in vec2 i_uv;\n"+
    "layout (location = 2) in vec3 i_normal;\n"+
    "layout (location = 3) in vec3 i_tangent;\n"+
    "layout (location = 4) in vec3 i_bitangent;\n"+

    // uniforms
    "uniform mat4 u_pv;\n"+ // Projection and view matrix
    "uniform mat4 u_model;\n"+ // model matrix
    "uniform vec3 u_camera_position;\n"+

    // data for fragment shader
    "out vec2 f_uv;\n"+
    "out vec3 f_tangent_normal;\n"+
    "out vec3 f_tangent_light;\n"+
    "out vec3 f_tangent_view;\n"+
    "out vec3 f_tangent_position;\n"+

    ///////////////////////////////////////////////////////////////////

    "void main(void){\n"+
      // Translating the planet
    "  vec4 frag_position = u_model * vec4(i_position, 1.0);\n"+
    "  f_uv = i_uv;\n"+

    "  mat3 rotation = mat3(u_model);\n"+
    "  vec3 T = normalize(rotation * i_tangent);\n"+
    "  vec3 B = normalize(rotation * i_bitangent);\n"+
    "  vec3 N = normalize(rotation * i_normal);\n"+
    "  mat3 TBN = transpose(mat3(T, B, N));\n"+

    "  f_tangent_normal   = TBN * i_normal;\n"+
    "  f_tangent_light    = TBN * vec3(0.0);\n"+
    "  f_tangent_view     = TBN * u_camera_position;\n"+
    "  f_tangent_position = TBN * frag_position.xyz;\n"+

      // calculate screen space position of the vertex
    "  gl_Position	= u_pv * frag_position;\n"+
    "}";

  public static fragment : string | null = 
    "#version 300 es\n"+

    "precision mediump float;\n"+

    // data from vertex shader
    "in vec2 f_uv;\n"+
    "in vec3 f_tangent_normal;\n"+
    "in vec3 f_tangent_light;\n"+
    "in vec3 f_tangent_view;\n"+
    "in vec3 f_tangent_position;\n"+

    // textures
    "uniform sampler2D u_albedo;\n"+
    "uniform sampler2D u_normal;\n"+
    "uniform sampler2D u_specular;\n"+
    "uniform sampler2D u_lights;\n"+

    "uniform float u_use_specular;\n"+
    "uniform float u_use_lights;\n"+

    "layout (location = 0) out vec4 o_color;\n"+
    "layout (location = 1) out vec4 o_bloom;\n"+
    "layout (location = 2) out float o_shadow;\n"+

    //////////////////////////////////////////////////////

    "void main(void){\n"+
      // Normals
    "  vec3 normal = normalize(f_tangent_normal);\n"+
      // get diffuse color
    "  vec3 color = texture(u_albedo, f_uv).rgb;\n"+
      // ambient
    "  vec3 ambient = 0.05 * color;\n"+
      // diffuse
    "  vec3 light_dir = normalize(f_tangent_light - f_tangent_position);\n"+
    "  float diff = max(dot(light_dir, normal), 0.0);\n"+
    "  vec3 diffuse = diff * color;\n"+
      // specular
    "  vec3 view_dir = normalize(f_tangent_view - f_tangent_position);\n"+
    "  vec3 reflect_dir = reflect(-light_dir, normal);\n"+
    "  vec3 halfway_dir = normalize(light_dir + view_dir);\n"+  
    "  float spec = pow(max(dot(normal, halfway_dir), 0.0), 32.0);\n"+

    "  vec3 final = ambient + diffuse + vec3(0.3) * spec;\n"+
      // Paints the output colors
    "  o_color = vec4(final, 1.0);\n"+
    //"  o_color = vec4(color, 1.0);\n"+
      // Paints the bloom lights to create the effect
    "  float brightness = o_color.r * 0.2126 + o_color.g * 0.7152 + o_color.b * 0.0722;\n"+
      // Multiply a few times for brightness to get a steper color
    "  o_bloom = o_color * brightness;\n"+
      // Paints the planet as a solid white
    "  o_shadow = 1.0;\n"+
    "}";
};

export class model_shader {
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
    "uniform vec3 u_camera_position;\n"+ // Camera position
    "uniform vec3 u_light_position;\n"+ // Light position

    "uniform mat4 u_model;\n"+ // model matrix

    // data for fragment shader
    "out vec2 f_uv;\n"+
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

    "  f_tangent_light    = TBN * u_light_position;\n"+
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
    "in vec3 f_tangent_light;\n"+
    "in vec3 f_tangent_view;\n"+
    "in vec3 f_tangent_position;\n"+

    // textures
    "uniform sampler2D u_albedo;\n"+
    "uniform sampler2D u_normal;\n"+

    "layout (location = 0) out vec4 o_color;\n"+

    //////////////////////////////////////////////////////

    "void main(void){\n"+
       // get diffuse color
    "  vec4 color = texture(u_albedo, f_uv);\n"+

       // obtain normal from normal map in range [0,1]
    "  vec3 normal = normalize(texture(u_normal, f_uv).rgb * 2.0 - 1.0);\n"+

       // ambient
    "  vec3 ambient = 0.05 * color.rgb;\n"+
       // diffuse
    "  vec3 light_dir = normalize(f_tangent_light - f_tangent_position);\n"+
    "  float diff = max(dot(light_dir, normal), 0.0);\n"+
    "  vec3 diffuse = diff * color.rgb;\n"+
       // specular
    "  vec3 view_dir = normalize(f_tangent_view - f_tangent_position);\n"+
    "  vec3 halfway_dir = normalize(light_dir + view_dir);\n"+  
    "  float spec = pow(max(dot(normal, halfway_dir), 0.0), 32.0);\n"+

    "  vec3 final = ambient + diffuse + spec * 0.1;\n"+

       // Paints the output colors
    "  o_color = vec4(final, 1.0);\n"+
       // Calculates the fresnel light
    "  float fresnel = pow(1.0 - dot(view_dir, normal), 3.0);\n"+
    "  o_color.rgb += vec3(1.0) * fresnel * smoothstep(0.0, 0.3, diff);\n"+
    "}";
};
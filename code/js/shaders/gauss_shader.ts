
export class gauss_shader {
  public static vertex : string | null = 
    "#version 300 es\n"+

    "precision mediump float;\n"+

    // attributes
    "layout (location = 0) in vec2 i_position;\n"+
    "layout (location = 1) in vec2 i_uv;\n"+

    // data for fragment shader
    "out vec2 f_uv;\n"+

    ///////////////////////////////////////////////////////////////////

    "void main(void){\n"+
    "  gl_Position = vec4(i_position.x * 2.0 - 1.0, i_position.y * -2.0 + 1.0, 0.0, 1.0);\n"+
    "  f_uv = i_uv;\n"+
    "}";

  public static fragment : string | null = 
    "#version 300 es\n"+

    "precision mediump float;\n"+

    // data from vertex shader
    "in vec2 f_uv;\n"+

    // textures
    "uniform sampler2D u_image;\n"+

    "uniform bool u_horizontal;\n"+
    "const float weight[6] = float[] (0.4, 0.35, 0.25, 0.15, 0.08, 0.016216);\n"+

    "layout (location = 0) out vec4 o_color;\n"+

    //////////////////////////////////////////////////////

    "void main(){\n"+
       // gets size of single texel
    "  ivec2 tex_size = textureSize(u_image, 0);\n"+
    "  vec2 tex_offset = vec2(1.0) / vec2(float(tex_size.x), float(tex_size.y));\n"+
    "  vec4 result = texture(u_image, f_uv) * weight[0];\n"+

    "  if(u_horizontal)\n"+
    "    for(int i = 1; i < 6; ++i){\n"+
    "      result += texture(u_image, f_uv + vec2(tex_offset.x * float(i), 0.0)) * weight[i];\n"+
    "      result += texture(u_image, f_uv - vec2(tex_offset.x * float(i), 0.0)) * weight[i];\n"+
    "    }\n"+
    "  else\n"+
    "    for(int i = 1; i < 6; ++i){\n"+
    "      result += texture(u_image, f_uv + vec2(0.0, tex_offset.y * float(i))) * weight[i];\n"+
    "      result += texture(u_image, f_uv - vec2(0.0, tex_offset.y * float(i))) * weight[i];\n"+
    "    }\n"+

    "  o_color = result;\n"+
    "}";
};
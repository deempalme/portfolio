
export class frame_shader {
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
    "uniform sampler2D u_color;\n"+
    "uniform sampler2D u_bloom;\n"+

    "layout (location = 0) out vec4 o_color;\n"+

    //////////////////////////////////////////////////////

    "void main(void){\n"+
       // get diffuse color
    "  vec4 bloom = texture(u_bloom, f_uv);\n"+
    "  vec4 color = texture(u_color, f_uv);\n"+

    "  o_color = mix(bloom, color, color.a);\n"+
    "  o_color = color;\n"+
    "}";
};

export class lines_shader {
  public static vertex : string | null = 
    "#version 300 es\n"+

    "precision mediump float;\n"+

    // attributes
    "layout (location = 0) in vec2 i_position;\n"+

    // uniforms
    "uniform mat4 u_pv;\n"+ // Projection and view matrix
    "uniform float u_radius;\n"+

    ///////////////////////////////////////////////////////////////////

    "void main(void){\n"+
      // scaling the position
    "  gl_Position	= u_pv * vec4(i_position * u_radius, 0.0, 1.0);\n"+
    "}\n";

  public static fragment : string | null = 
    "#version 300 es\n"+

    "precision mediump float;\n"+

    "layout (location = 0) out vec4 o_color;\n"+
    "layout (location = 1) out vec4 o_bloom;\n"+

    //////////////////////////////////////////////////////
    
    "void main(void){\n"+
    "  o_color = vec4(1.0, 1.0, 1.0, 0.65);\n"+
      // Paints the bloom lights to create the effect
    "  float brightness = o_color.r * 0.2126 + o_color.g * 0.7152 + o_color.b * 0.0722;\n"+
      // Multiply a few times for brightness to get a steper color
    "  o_bloom = o_color * brightness;\n"+
    //"  o_bloom = vec4(0.0);\n"+
    "}\n";
};
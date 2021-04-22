
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

    //////////////////////////////////////////////////////
    
    "void main(void){\n"+
    "  o_color = vec4(1.0, 1.0, 1.0, 0.4);\n"+
    "}\n";
};
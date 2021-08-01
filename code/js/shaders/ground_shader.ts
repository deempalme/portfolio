
export class ground_shader {
  public static vertex : string | null = 
    "#version 300 es\n"+
    "// Ground shader\n"+

    "precision mediump float;\n"+

    // attributes
    "layout (location = 0) in vec2 i_position;\n"+

    // data for fragment shader
    "out vec3 f_position;\n"+

    // uniforms
    "uniform mat4 u_pv;\n"+ // Projection and view matrix
    "uniform mat4 u_view;\n"+ // View matrix

    ///////////////////////////////////////////////////////////////////

    "void main(void){\n"+
    "  vec4 position = vec4(i_position, -0.3, 1.0);\n"+
    "  f_position = vec3(u_view * position);\n"+
    "  gl_Position = u_pv * position;\n"+
    "}\n";

  public static fragment : string | null = 
    "#version 300 es\n"+

    "precision mediump float;\n"+

    "in vec3 f_position;\n"+

    "layout (location = 0) out vec4 o_color;\n"+

    "const float fog_density = 0.3;\n"+

    "float fog_factor(vec3 position){\n"+
    "  float dist = 0.0;\n"+
    "  float fogFactor = 1.0;\n"+
       //range based
    "  dist = length(position) - 15.0;\n"+
    "  dist = (dist < 0.0)? 0.0 : dist;\n"+
        
       //exponential fog
    "  fogFactor = 1.0 / exp(dist * fog_density);\n"+
    "  fogFactor = clamp(fogFactor, 0.0, 1.0);\n"+
    "  return 1.0 - fogFactor;\n"+
    "}"+

    //////////////////////////////////////////////////////
    
    "void main(void){\n"+
    "  o_color.rgb = mix(vec3(1.0), vec3(0.0), fog_factor(f_position));\n"+
    "  o_color.a = 0.4;\n"+
    "}\n";
};
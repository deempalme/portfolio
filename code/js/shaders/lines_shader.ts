
export class lines_shader {
  public static vertex : string | null = 
    "precision mediump float;"+

    // attributes
    "attribute vec2 i_position;"+

    // uniforms
    "uniform mat4 u_pv;"+ // Projection and view matrix
    "uniform float u_radius;"+

    ///////////////////////////////////////////////////////////////////

    "void main(void){"+
      // scaling the position
    "  gl_Position	= u_pv * vec4(i_position * u_radius, 0.0, 1.0);"+
    "}";

  public static fragment : string | null = 
    "precision mediump float;"+

    //////////////////////////////////////////////////////
    
    "void main(void){"+
    "  gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);"+
    "}";
};
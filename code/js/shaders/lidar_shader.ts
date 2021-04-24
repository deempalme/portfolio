
export class lidar_shader {
  public static vertex : string | null = 
    "#version 300 es\n"+

    "precision mediump float;\n"+

    // attributes
    "layout (location = 0) in vec4 i_position;\n"+

    // data for fragment shader
    "out vec4 f_color;\n"+

    // uniforms
    "uniform mat4 u_pv;\n"+ // Projection and view matrix

    "uniform mat4 u_palette;\n"+ //this is the color palette
    "uniform bool u_colorize;\n"+ //if false it will be grayscale colored

    ///////////////////////////////////////////////////////////////////

    "void main(void){\n"+
    "  float alpha = 1.0;"+
       //the next section will calculate the color depending in the intensity
    "  float intensity = i_position.a;"+

    "  vec3 tmp_color;"+

       // Calculating the point color
    "  if(u_colorize == true){"+
    "    int idx1 = 0;"+// Our desired color will be between these two indexes in 'color'.
    "    int idx2 = 0;"+
    "    float fract_between = 0.0;"+// Fraction between 'idx1' and 'idx2' where our value is.

    "    if(intensity <= 0.0){"+
    "      idx1 = idx2 = 0;"+
    "    }else if(intensity >= 1.0){"+
    "      idx1 = idx2 = 3;"+
    "    }else{"+
    "      intensity *= 3.0;"+
    "      idx1 = int(floor(intensity));"+// Our desired color will be after this index.
    "      idx2 = idx1 + 1;"+// ... and before this index (inclusive).
    "      fract_between = intensity - float(idx1);"+// Distance between the two indexes (0-1).
    "    }"+

    "    vec3 palette1 = vec3(u_palette[idx1].xyz);"+
    "    vec3 palette2 = vec3(u_palette[idx2].xyz);"+
    "    tmp_color = (palette2 - palette1) * fract_between + palette1;"+
    "    alpha = 1.0;"+
    "  }else{"+
    "    alpha = intensity * 0.9 + 0.1;"+
    "    tmp_color = vec3(1.0);"+
    "  }"+

    "  f_color = vec4(tmp_color, alpha);"+

    //"  gl_PointSize(2.5);\n"+
    "  gl_Position = u_pv * vec4(vec3(-i_position.y, i_position.x, i_position.z - 0.2), 1.0);\n"+
    "}\n";

  public static fragment : string | null = 
    "#version 300 es\n"+

    "precision mediump float;\n"+

    "in vec4 f_color;\n"+

    "layout (location = 0) out vec4 o_color;\n"+

    //////////////////////////////////////////////////////
    
    "void main(void){\n"+
    "  o_color = f_color;\n"+
    "}\n";
};
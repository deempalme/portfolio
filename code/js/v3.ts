

export class v3
{
  public static zero() : Float32Array {
    var out = new Float32Array(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }

  /**
   * Creates a new vec3 initialized with values from an existing vector
   *
   * @param {vec3} a vector to clone
   * @returns {vec3} a new 3D vector
   */
  public static clone(a : Float32Array) : Float32Array {
    var out = v3.zero();
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }

  /**
   * Creates a new vec3 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} a new 3D vector
   */
  public static new(x : number, y : number, z : number) : Float32Array {
    var out = v3.zero();
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }

  /**
   * Adds two vec3's
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */
  public static add(a : Float32Array, b : Float32Array) : Float32Array {
    var out = v3.zero();
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }

  /**
   * Subtracts vector b from vector a
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */
  public static subtract(a : Float32Array, b : Float32Array) : Float32Array {
    var out = v3.zero();
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }

  /**
   * Multiplies two vec3's
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */
  public static multiply(a : Float32Array, b : Float32Array) : Float32Array {
    var out = v3.zero();
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }

  /**
   * Multiplies one vec3 and one scalar
   *
   * @param {vec3} v the first operand
   * @param {number} n the second operand
   * @returns {vec3} out
   */
  public static scalar(v : Float32Array, n : number) : Float32Array {
    var out = v3.zero();
    out[0] = v[0] * n;
    out[1] = v[1] * n;
    out[2] = v[2] * n;
    return out;
  }

  /**
   * Divides two vec3's
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */
  public static divide(a : Float32Array, b : Float32Array) : Float32Array {
    var out = v3.zero();
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  }

  /**
   * Normalize a vec3
   *
   * @param {vec3} a vector to normalize
   * @returns {vec3} out
   */
  public static normalize(a : Float32Array) : Float32Array {
    var out = v3.zero();
    var x = a[0],
      y = a[1],
      z = a[2];
    var len = x * x + y * y + z * z;
    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
      out[0] = a[0] * len;
      out[1] = a[1] * len;
      out[2] = a[2] * len;
    }
    return out;
  }

  /**
   * Transforms the vec3 with a mat4.
   * 4th vector component is implicitly '1'
   *
   * @param {mat4} m matrix to transform with
   * @param {vec3} a the vector to transform
   * @returns {vec3} out
   */
  public static transform(m : Float32Array, a : Float32Array) : Float32Array {
    var out = v3.zero();
    var x = a[0], y = a[1], z = a[2],
      w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }

  /**
   * Rotate a 3D vector around the x-axis
   * @param {vec3} a The vec3 point to rotate
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */
  public static rotate_x(a : Float32Array, c : number) : Float32Array {
    var out = v3.zero();

    //perform rotation
    out[0] = a[0];
    out[1] = a[1] * Math.cos(c) - a[2] * Math.sin(c);
    out[2] = a[1] * Math.sin(c) + a[2] * Math.cos(c);

    return out;
  }

  /**
   * Rotate a 3D vector around the y-axis
   * @param {vec3} a The vec3 point to rotate
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */
  public static rotate_y(a : Float32Array, c : number) : Float32Array {
    var out = v3.zero();

    //perform rotation
    out[0] = a[2] * Math.sin(c) + a[0] * Math.cos(c);
    out[1] = a[1];
    out[2] = a[2] * Math.cos(c) - a[0] * Math.sin(c);
    return out;
  }

  /**
   * Rotate a 3D vector around the z-axis
   * @param {vec3} a The vec3 point to rotate
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */
  public static rotate_z(a : Float32Array, c : number) : Float32Array {
    var out = v3.zero();

    //perform rotation
    out[0] = a[0] * Math.cos(c) - a[1] * Math.sin(c);
    out[1] = a[0] * Math.sin(c) + a[1] * Math.cos(c);
    out[2] = a[2];

    return out;
  }
}
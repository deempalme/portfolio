

export class v4
{
  public static zero() : Float32Array {
    var out = new Float32Array(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
  }

  /**
   * Creates a new vec4 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {vec4} a new 4D vector
   */
  public static new(x : number, y : number, z : number, w : number) : Float32Array {
    var out = v4.zero();
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }

  /**
   * Adds two vec4's
   *
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */
  public static add(a : Float32Array, b : Float32Array) : Float32Array {
    var out = v4.zero();
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
  }

  /**
   * Subtracts vector b from vector a
   *
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */
  public static subtract(a : Float32Array, b : Float32Array) : Float32Array {
    var out = v4.zero();
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
  }

  /**
   * Calculates the euclidian distance between two vec4's
   *
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {Number} distance between a and b
   */
  public static distance(a : Float32Array, b : Float32Array) : number {
    var x = b[0] - a[0],
      y = b[1] - a[1],
      z = b[2] - a[2],
      w = b[3] - a[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }

  /**
   * Calculates the length of a vec4
   *
   * @param {vec4} a vector to calculate length of
   * @returns {Number} length of a
   */
  public static dimension(a : Float32Array) : number {
    var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }

  /**
   * Normalize a vec4
   *
   * @param {vec4} a vector to normalize
   * @returns {vec4} out
   */
  public static normalize(a : Float32Array) : Float32Array {
    var out = v4.zero();
    var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
    var len = x * x + y * y + z * z + w * w;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out[0] = x * len;
      out[1] = y * len;
      out[2] = z * len;
      out[3] = w * len;
    }
    return out;
  }

  /**
   * Transforms the vec4 with a mat4.
   *
   * @param {mat4} m matrix to transform with
   * @param {vec4} a the vector to transform
   * @returns {vec4} out
   */
  public static transform(m : Float32Array, a : Float32Array) : Float32Array {
    var out = v4.zero();
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
  }
}
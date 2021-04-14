
  // Degree's values in radians
  export const degree_45  : number = Math.PI * 0.25;
  export const degree_70  : number = Math.PI * 0.3888889;
  export const degree_90  : number = Math.PI * 0.5;
  export const degree_180 : number = Math.PI;
  export const degree_225 : number = Math.PI * 1.25;
  export const degree_270 : number = Math.PI * 1.5;
  export const degree_360 : number = Math.PI * 2.0;

  // Degrees to radians
  export const to_radian : number = Math.PI / 180.0;
  export const to_degree : number = 180.0 / Math.PI;

  // Attibute input IDs
  export const attributes = { position: 0, uv: 1, normal: 2, tangent: 3, bitangent: 4 };

  // Texture active IDs
  export const texture_unit = {
    albedo:   0,
    normal:   1,
    specular: 2,
    lights:   3,
    color:    4,
    bloom:    5
  };

  // Texture active IDs
  export const framebuffer = {
    color:  0,
    bloom:  1,
    gauss:  0
  };
  
  // Time between frames in milliseconds
  export const frame_time : number = 40;


import * as constants from "./gl/constants";
import { model } from "./gl/model";
import { shader } from "./gl/shader";
import { texture } from "./gl/texture";
import { m4 } from "./math/m4";
import { v3 } from "./math/v3";


export interface planet_info {
  // Radius of the planet
  radius : number;
  // Distance to star
  distance_to_star : number;
  // Initial translation angle in degrees from 0 to 360
  translation_position : number;
  // Translation speed in degrees per second
  translation_speed : number;
  // Initial rotation angle in degrees from 0 to 360
  rotation_position : number;
  // Rotation speed in degrees per second
  rotation_speed : number;
}


export class planet
{
  private albedo   : texture;
  private normal   : texture;
  private lights   : texture | null;
  private specular : texture | null;
  private sphere   : model;
  private is_sun   : boolean;

  private shader : shader;
  private u_position     : WebGLUniformLocation | null;
  private u_model        : WebGLUniformLocation | null;
  private u_is_sun       : WebGLUniformLocation | null;
  private u_use_lights   : WebGLUniformLocation | null;
  private u_use_specular : WebGLUniformLocation | null;
  private u_fresnel      : WebGLUniformLocation | null;

  // Indicates the how much change in angles should happend every paint() call
  private rotation_change : number;
  private translation_change : number;
  // This multiplies the before mentioned changes
  private static movement_speed : number = 1.0;
  private fresnel_color : Float32Array;

  // Planet properties: radius, distance to star, translation, and rotation
  private properties : Float32List;
  private model : Float32Array = new Float32Array(0);


  constructor(shader : shader, model : model, albedo : texture,
              normal : texture, lights : texture | null, specular : texture | null,
              fresnel_color : Float32Array, planet_properties : planet_info,
              sun : boolean = false){
    this.sphere = model;

    this.albedo = albedo;
    this.normal = normal;
    this.lights = lights;
    this.specular = specular;
    this.is_sun = sun;
    this.fresnel_color = fresnel_color;

    this.properties = new Float32Array(4);
    // Planet's radius
    this.properties[0] = planet_properties.radius;
    // Planet's distance to star
    this.properties[1] = planet_properties.distance_to_star;
    // Normalized translation
    this.properties[2] = 
      planet_properties.translation_position * constants.to_radian / constants.degree_360;
    // Normalized rotation
    this.properties[3] = 
      planet_properties.rotation_position * constants.to_radian / constants.degree_360;

    this.translation_change = 
      planet_properties.translation_speed / 25.0 * constants.to_radian / constants.degree_360;
    this.rotation_change = 
      planet_properties.rotation_speed / 25.0 * constants.to_radian / constants.degree_360;

    this.u_position     = shader.uniform_location('u_position');
    this.u_model        = shader.uniform_location('u_model');
    this.u_is_sun       = shader.uniform_location('u_is_sun');
    this.u_fresnel      = shader.uniform_location('u_fresnel_color');
    this.u_use_lights   = shader.uniform_location('u_use_lights');
    this.u_use_specular = shader.uniform_location('u_use_specular');
    this.shader = shader;
  }
  /**
   * @brief Moves and paints the planet into the WbeGL context
   */
  public paint() : void {
    // Moving the planet
    this.move();
    // Setting the planet's position
    this.shader.uniform4fv(this.u_position, this.properties);
    this.shader.matrix4f(this.u_model, this.model);

    this.albedo.activate();
    this.albedo.bind();
    this.normal.activate();
    this.normal.bind();

    this.shader.uniform1f(this.u_is_sun, this.is_sun ? 1.0 : 0.0);
    this.shader.uniform3fv(this.u_fresnel, this.fresnel_color);

    if(this.specular !== null){
      this.specular.activate();
      this.specular.bind();
      this.shader.uniform1f(this.u_use_specular, 1.0);
    }else
      this.shader.uniform1f(this.u_use_specular, 0.0);

    if(this.lights !== null){
      this.lights.activate();
      this.lights.bind();
      this.shader.uniform1f(this.u_use_lights, 1.0);
    }else
      this.shader.uniform1f(this.u_use_lights, 0.0);
  
    this.sphere.draw();
  }
  /**
   * @brief Modifies the translation and rotation speed of the planet
   * 
   * @param new_speed New movement speed, default is 1.0
   */
  public static speed(new_speed : number) : void {
    planet.movement_speed = new_speed;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::

  private move(){
    // Translating planet
    this.properties[2] += this.translation_change * planet.movement_speed;
    // Rotating planet
    this.properties[3] += this.rotation_change * planet.movement_speed;

    // Normalizing
    if(this.properties[2] > 1.0) this.properties[2] -= Math.floor(this.properties[2]);
    if(this.properties[3] > 1.0) this.properties[3] -= Math.floor(this.properties[3]);

    this.model = m4.translate(
      m4.identity(), 
      v3.new(
        this.properties[1] * Math.cos(this.properties[2] * constants.degree_360),
        this.properties[1] * Math.sin(this.properties[2] * constants.degree_360),
        0.0
      )
    );
    this.model = m4.rotate_z(this.model, this.properties[3] * constants.degree_360);
    this.model = m4.scale_all(this.model, this.properties[0]);
  }
};
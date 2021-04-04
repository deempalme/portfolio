
import * as constants from "./gl/constants";
import { model } from "./gl/model";
import { shader } from "./gl/shader";
import { texture } from "./gl/texture";


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
  private albedo : texture;
  private normal : texture;
  private lights : texture | null;
  private sphere : model;

  private shader : shader;
  private u_position : WebGLUniformLocation | null;
  private u_use_lights : WebGLUniformLocation | null;

  // Indicates the how much change in angles should happend every paint() call
  private rotation_change : number;
  private translation_change : number;
  // This multiplies the before mentioned changes
  private static movement_speed : number = 1.0;

  // Planet properties: radius, distance to star, translation, and rotation
  private properties : Float32List;

  constructor(shader : shader, model : model, 
              albedo_url : string, normal_url : string, lights_url : string | null,
              planet_properties : planet_info){
    this.sphere = model;

    this.albedo = new texture(shader.context(), albedo_url, constants.texture_unit.albedo);
    this.normal = new texture(shader.context(), normal_url, constants.texture_unit.normal);
    if(lights_url == null)
      this.lights = null;
    else
      this.lights = new texture(shader.context(), lights_url, constants.texture_unit.lights);

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

    this.u_position   = shader.uniform_location('u_position');
    this.u_use_lights = shader.uniform_location('u_use_lights');
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

    this.albedo.activate();
    this.albedo.bind();
    this.normal.activate();
    this.normal.bind();
    if(this.lights != null){
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
  }
};
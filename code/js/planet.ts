
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
  private albedo_   : texture;
  private normal_   : texture;
  private lights_   : texture | null;
  private specular_ : texture | null;
  private sphere_   : model;
  private is_sun_   : boolean;

  private shader_         : shader;
  private u_position_     : WebGLUniformLocation | null;
  private u_model_        : WebGLUniformLocation | null;
  private u_is_sun_       : WebGLUniformLocation | null;
  private u_use_lights_   : WebGLUniformLocation | null;
  private u_use_specular_ : WebGLUniformLocation | null;
  private u_fresnel_      : WebGLUniformLocation | null;

  // Indicates the how much change in angles should happend every paint() call
  private rotation_change_    : number;
  private translation_change_ : number;
  // This multiplies the before mentioned changes
  private static movement_speed_ : number = 1.0;
  private fresnel_color_ : Float32Array;

  // Planet properties: radius, distance to star, translation, and rotation
  private properties_ : Float32List;
  private model_      : Float32Array = new Float32Array(0);

  /**
   * @brief This creates and controls a single planet inside the milky way
   * 
   * @param shader Shader used to draw this planet
   * @param model 3D model of the planet
   * @param albedo Texture that indicates the main color
   * @param normal Texture that contains the normal information
   * @param lights Texture that contains the night color (for earth)
   * @param specular Texture that contains the specular information
   * @param fresnel_color Indicates the color of the fresnel effect
   * @param planet_properties Indicates the planet's properties
   * @param sun Indicates if is a star and not a planet
   */
  constructor(shader : shader, model : model, albedo : texture,
              normal : texture, lights : texture | null, specular : texture | null,
              fresnel_color : Float32Array, planet_properties : planet_info,
              sun : boolean = false){
    this.sphere_ = model;

    this.albedo_ = albedo;
    this.normal_ = normal;
    this.lights_ = lights;
    this.specular_ = specular;
    this.is_sun_ = sun;
    this.fresnel_color_ = fresnel_color;

    this.properties_ = new Float32Array(4);
    // Planet's radius
    this.properties_[0] = planet_properties.radius;
    // Planet's distance to star
    this.properties_[1] = planet_properties.distance_to_star;
    // Normalized translation
    this.properties_[2] = 
      planet_properties.translation_position * constants.to_radian / constants.degree_360;
    // Normalized rotation
    this.properties_[3] = 
      planet_properties.rotation_position * constants.to_radian / constants.degree_360;

    this.translation_change_ = 
      planet_properties.translation_speed / 25.0 * constants.to_radian / constants.degree_360;
    this.rotation_change_ = 
      planet_properties.rotation_speed / 25.0 * constants.to_radian / constants.degree_360;

    this.u_position_     = shader.uniform_location('u_position');
    this.u_model_        = shader.uniform_location('u_model');
    this.u_is_sun_       = shader.uniform_location('u_is_sun');
    this.u_fresnel_      = shader.uniform_location('u_fresnel_color');
    this.u_use_lights_   = shader.uniform_location('u_use_lights');
    this.u_use_specular_ = shader.uniform_location('u_use_specular');
    this.shader_ = shader;
  }
  /**
   * @brief Moves and paints the planet into the WbeGL context
   */
  public paint() : void {
    // Moving the planet
    this.move();
    // Setting the planet's position
    this.shader_.uniform4fv(this.u_position_, this.properties_);
    this.shader_.matrix4f(this.u_model_, this.model_);

    this.albedo_.activate();
    this.albedo_.bind();
    this.normal_.activate();
    this.normal_.bind();

    this.shader_.uniform1f(this.u_is_sun_, this.is_sun_ ? 1.0 : 0.0);
    this.shader_.uniform3fv(this.u_fresnel_, this.fresnel_color_);

    if(this.specular_ !== null){
      this.specular_.activate();
      this.specular_.bind();
      this.shader_.uniform1f(this.u_use_specular_, 1.0);
    }else
      this.shader_.uniform1f(this.u_use_specular_, 0.0);

    if(this.lights_ !== null){
      this.lights_.activate();
      this.lights_.bind();
      this.shader_.uniform1f(this.u_use_lights_, 1.0);
    }else
      this.shader_.uniform1f(this.u_use_lights_, 0.0);
  
    this.sphere_.draw();
  }
  /**
   * @brief Modifies the translation and rotation speed of the planet
   * 
   * @param new_speed New movement speed, default is 1.0
   */
  public static speed(new_speed : number) : void {
    planet.movement_speed_ = new_speed;
  }

  // ::::::::::::::::::::::::::::::::::::: PRIVATE FUNCTIONS ::::::::::::::::::::::::::::::::::::::

  private move(){
    // Translating planet
    this.properties_[2] += this.translation_change_ * planet.movement_speed_;
    // Rotating planet
    this.properties_[3] += this.rotation_change_ * planet.movement_speed_;

    // Normalizing
    if(this.properties_[2] > 1.0) this.properties_[2] -= Math.floor(this.properties_[2]);
    if(this.properties_[3] > 1.0) this.properties_[3] -= Math.floor(this.properties_[3]);

    this.model_ = m4.translate(
      m4.identity(), 
      v3.new(
        this.properties_[1] * Math.cos(this.properties_[2] * constants.degree_360),
        this.properties_[1] * Math.sin(this.properties_[2] * constants.degree_360),
        0.0
      )
    );
    this.model_ = m4.rotate_z(this.model_, this.properties_[3] * constants.degree_360);
    this.model_ = m4.scale_all(this.model_, this.properties_[0]);
  }
};
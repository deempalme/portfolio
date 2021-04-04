
import { circles } from './gl/circles';
import * as constants from './gl/constants';
import { lines_shader } from './shaders/lines_shader'
import { model } from './gl/model';
import { open_gl } from './gl/open_gl';
import { planet, planet_info } from './planet';
import { shader } from './gl/shader';
import { planets_shader } from './shaders/planets_shader';

export class universe
{
  private width  : number = 0;
  private height : number = 0;

  private main_object : HTMLElement;
  private gl : open_gl;
  private sphere : model;
  private timer : number = 0;

  private lines_shader  : shader;
  private planet_shader : shader;

  private circles : circles;
  private planets : Array<planet>;

  private interval_event : any;


  constructor(object : string){
    this.main_object = document.getElementById(object)!;

    // Creating the canvas
    this.gl = new open_gl(this.main_object);

    // Loading the basic model for a planet or star
    this.sphere = new model(this.gl.context()!, '../../resources/models/sphere/model.obj');

    // Loading lines' shader
    this.lines_shader = new shader(this.gl.context()!, lines_shader.vertex!, 
                                   lines_shader.fragment!);
    // Freing memory of unused variables
    lines_shader.vertex = null;
    lines_shader.fragment = null;

    // Loading planets' shader
    this.planet_shader = new shader(this.gl.context()!, planets_shader.vertex!,
                                    planets_shader.fragment!);
    // Freing memory of unused variables
    planets_shader.vertex = null;
    planets_shader.fragment = null;

    // Waiting until they are charged
    this.gl.add_shader(this.lines_shader);
    this.gl.add_shader(this.planet_shader);

    this.lines_shader.use();

    var planets : Array<planet_info> = [
      {
        radius: 0.5, distance_to_star: 3, translation_position: Math.random() * 360, 
        translation_speed: 1, rotation_position: Math.random() * 360,
        rotation_speed: 2
      },
      {
        radius: 0.5, distance_to_star: 5, translation_position: Math.random() * 360, 
        translation_speed: 1, rotation_position: Math.random() * 360,
        rotation_speed: 1
      },
      {
        radius: 0.5, distance_to_star: 8, translation_position: Math.random() * 360, 
        translation_speed: 1, rotation_position: Math.random() * 360,
        rotation_speed: 2
      },
      {
        radius: 0.5, distance_to_star: 11, translation_position: Math.random() * 360, 
        translation_speed: 1, rotation_position: Math.random() * 360,
        rotation_speed: 2
      }
    ];

    this.circles = new circles(this.gl.context()!, this.lines_shader, planets, 1);

    this.planet_shader.use();

    this.planets = new Array<planet>(1);
    this.planets[0] = new planet(this.planet_shader, this.sphere, 'd', 'f', null,
                                 planets[0]);


    // Binding the paint to an interval event
    this.interval_event = this.paint.bind(this);

    this.resize();
  }
  /**
   * @brief Resumes painting the universe gl context
   * 
   * Call this to save CPU usage
   */
  public activate() : void {
    this.timer = setInterval(this.interval_event, constants.frame_time);
  }
  /**
   * @brief Stops painting the universe gl context
   * 
   * Call this to save CPU usage
   */
  public deactivate() : void {
    clearInterval(this.timer);
  }
  /**
   * @brief Destroying all event listeners
   */
  public destroy() : void {
    this.deactivate();
  }

  public paint() : void {
    this.lines_shader.use();
    this.circles.paint();

    this.planet_shader.use();
  }
  /**
   * @brief Resizing event handler
   */
  public resize() : void {
    this.width = this.main_object.clientWidth;
    this.height = window.innerHeight;

    this.gl.resize(this.width, this.height);
  }
  /**
   * @brief Scrolling event handler
   */
  public scroll(page_offset : number) : void {
  }
};

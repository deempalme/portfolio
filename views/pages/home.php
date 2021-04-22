<!DOCTYPE html>
<html lang="en-GB">

<head>
<meta charset="UTF-8">
<title><?= $controller->page_title(); ?></title>
<link rel="icon" type="image/png" href="/resources/theme/icon.png" />
<link href="/resources/css/home.css" rel="stylesheet" />
<script language="javascript" src="/script/js/home.js" type="text/javascript"></script>
</head>

<body>
  <nav id="navigation">
    <ul>
      <li><a href="#universe">Top</a></li>
      <li><a href="#portfolio">Portfolio</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#about_me">About me</a></li>
      <li><a href="#knowledge">Knowledge</a></li>
      <li><a href="#studies">Studies</a></li>
      <li><a href="#contact_me">Contact me</a></li>
    </ul>
  </nav>
  <main>
    <section id="universe" name="universe">
      <h1 id="uni_back"><img src="/resources/theme3.0/ramirez_rodriguez.svg" alt="RAMIREZ RODRIGUEZ"></h1>
      <aside><a href="https://github.com/deempalme/portfolio">See &lt;the code&gt;</a></aside>
    </section>
    <section id="portfolio" name="portfolio">
      <div><h1><img src="/resources/theme3.0/the_portfolio.svg" alt="The PORTFOLIO"></h1></div>
      <section>
        <figure id="f_autonomous">
          <video src="/resources/movies/highres/autonomous.mp4" width="1280" height="720" preload="none" loop muted disablePictureInPicture="true"></video>
          <figcaption><b>2020 - 2016</b><br><i>Autonomous driving vehicle</i></figcaption>
        </figure>
        <figure id="f_drone">
          <video src="/resources/movies/highres/nabucodonosor_2.mp4" width="1280" height="720" preload="none" loop muted disablePictureInPicture="true"></video>
          <figcaption><b>Project proposal</b><br><i>Fully electric autonomous drone</i></figcaption>
        </figure>
        <figure id="f_mixing_chamber">
          <video src="/resources/movies/highres/project.mp4" width="1280" height="720" preload="none" loop muted disablePictureInPicture="true"></video>
          <figcaption><b>University project</b><br><i>Mixing chamber for electric generator's turbines</i></figcaption>
        </figure>
        <figure id="f_printing_3d">
          <video src="/resources/movies/highres/illusion.mp4" width="1280" height="720" preload="none" loop muted disablePictureInPicture="true"></video>
          <figcaption><b>University competition</b><br><i>Fachhochschule's design competition for 3D printing</i></figcaption>
        </figure>
        <figure id="f_eolic">
          <video src="/resources/movies/highres/cad.mp4" width="1280" height="720" preload="none" loop muted disablePictureInPicture="true"></video>
          <figcaption><b>University project</b><br><i>Eolic tubines' pitch controller</i></figcaption>
        </figure>
        <figure id="f_cad_cam">
          <video src="/resources/movies/highres/cam.mp4" width="1280" height="720" preload="none" loop muted disablePictureInPicture="true">Your browser doesn't support HTML5 video.</video>
          <figcaption><b>2013 - 2011</b><br><i>CAM | CAD Design</i></figcaption>
        </figure>
      </section>
      <article id="a_autonomous">
        <video src="/resources/movies/highres/autonomous.mp4" loop muted disablePictureInPicture="true" preload="none"></video>
        <section>
          <h1>Autonomous driving vehicle</h1>
          <div>
            <h1>Thesis dissertation and Hilfswissenschaftler</h1>
            <h2>Time worked: <b>1 years</b> <i>06.2016 - 06.2017</i></h2>
            <p>I started working for this company / research institution with my Master's degree thesis dissertation. It was about replacing the current (and very slow) programming code which is executed in the CPU, with a much more powerful and faster parallel programming computed in the GPU (graphic card).</p>
            <p>The autonomous driving vehicle that they were developing already had a decision making algorithm which was awfully slow because it worked with quite complex mathematical formulas and hence, it was not possible to implement it on real life and therefore, parallel programming was the only available option. Exchanging it was certainly arduous and long but the final results were impressive, the concluded code was in average 96 times faster than the original.</p>
            <p>While I was completing my thesis I did work as <i>Hilfwissenschaftler</i> (sciences' assistant student) with them where I performed several kinds of programming projects that were also related to autonomous driving.</p>
          </div>
          <div>
            <h1>Wissenschaftlicher Mitarbeiter</h1>
            <h2>Time worked: <b>3 years</b> <i>07.2017 - 05.2020</i></h2>
            <p>After finishing my master's degree I was contracted by PEM der RWTH (the same place were I made my thesis dissertation) as a <i>Wissenschaftlicher Mitarbeiter</i> (research associate) in the Autonomous driving vehicle's department.</p>
            <p>I worked in several sections suchlike, virtual visualization of results, sensors data processing, ground detection, map reading and decoding, vehicle's navigation system, path finding, and I was the responsible to improve performance by detecting slow code and update or convert it into a parallel program if it was possible.</p>
            <p>My programming skills allowed me to work in different areas too; in <i>Buchhaltung</i> (accounting) and <i>Werkzeugmaschinenlabor</i> (Machine tools laboratory). Coding an automated system to input the employees' worked hours, expenses, holidays, and days off with administrative management, complex statistics and legal documents generator.</p>
            <p>For <i>Werkzeugmaschinenlabor</i> we were researching and developing a Virtual Reality system with VR headsets (HoloLens) to help employees from manufacturing segments. The HoloLens displayed information like, steps to follow to complete the tasks, identified assembly parts, best possible path to go after in case it needed to move from one section to another, and tutorials for beginners.</p>
          </div>
          <div>
            <ul>
              <li>Company:
                <ul>
                  <li><img src="/resources/theme3.0/pem.svg" alt="PEM der RWTH" title="PEM der RWTH" height="48"></li>
                  <li><img src="/resources/theme3.0/wzl.svg" alt="Werkzeugmaschinenlabor RWTH" title="Werkzeugmaschinenlabor RWTH" height="48"></li>
                </ul>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>Technologies:
                <ul>
                  <li><b>Programming languages:</b> C++, CUDA, Python, Typescript, PHP, etc.</li>
                  <li><b>Software:</b> Solidworks, Blender, Qt, VisualStudio Code, ROS, carmaker, etc.</li>
                  <li><b>Hardware:</b> LiDar sensors, Camera processing, GPS sensors, Infrared sensors, RaspberryPI, Arduino</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>
        <aside>CLOSE</aside>
      </article>
      <article id="a_mixing_chamber">
        <video src="/resources/movies/highres/project.mp4" loop muted disablePictureInPicture="true" preload="none"></video>
        <div>
          <h1>Designing a fuel mixing chamber for gas generators</h1>
          <h2>University project, <i>Combustible:</i> Hydrogen &amp; Methane</h2>
          <p>Most of the gas turbines created for the energy industry were designed to be fed with only one fuel  simultaneously, they use mostly methane but the new technology developed in the FH Aachen utilizes hydrogen in combination with methane to create a more sustainable turbine obtaining the hydrogen from renewables energies, hence, it was necessary to create a fuel mixer chamber to uniformly combine these two different fuels and avoid problems such as shockwaves and variances in pressure, heat and speed inside the combustion chamber and create a more efficient thrust.</p>
          <ul>
            <li>University:
              <ul>
                <li><img src="/resources/theme3.0/fh_aachen.svg" alt="FH Aachen" height="64"></li>
              </ul>
            </li>
            <li>Technologies:
              <ul>
                <li><b>Hardware:</b> CNC 3-axis, 3D printer</li>
                <li><b>Software:</b> SolidWorks, Ansys</li>
              </ul>
            </li>
          </ul>
        </div>
        <aside class="play">PAUSE</aside>
        <aside>CLOSE</aside>
      </article>
      <article id="a_printing_3d">
        <video src="/resources/movies/highres/illusion.mp4" loop muted disablePictureInPicture="true" preload="none"></video>
        <div>
          <h1>3D printing design competition</h1>
          <h2><b>First place</b> in Fachhochschule Aachen University's competition</h2>
          <p>The design is an optical paradox composed by several <i>“Penrose Triangles”</i>, together they create a complex shape which plays as an illusion itself.</p>
          <p>The piece was designed to seem to have several basic 3D pieces, such as cubes and tringles but the interconnection among them is what defies the reality, the illusion of surrealism is only true when is observed directly at the front, if the spectator changes the angle of view it is possible to see the high complexity and curves of the object.</p>
          <p>The piece is now in a permanent exhibition in the FH Aachen university.</p>
          <ul>
            <li>University:
              <ul>
                <li><img src="/resources/theme3.0/fh_aachen.svg" alt="FH Aachen" height="64"></li>
              </ul>
            </li>
            <li>Technologies:
              <ul>
                <li><b>3D Printer:</b> Powder Binder-Bonding</li>
                <li><b>Software:</b> SolidWorks</li>
              </ul>
            </li>
          </ul>
        </div>
        <aside class="play">PAUSE</aside>
        <aside>CLOSE</aside>
      </article>
      <article id="a_eolic">
        <video src="/resources/movies/highres/cad.mp4" loop muted disablePictureInPicture="true" preload="none"></video>
        <div>
          <h1>Blade pitch control mechanism for wind turbines</h1>
          <h2>University project</h2>
          <p>As we know the pitch control in a wind turbine is very important to avoid that winds with excessive speeds generate large amounts of stress and causing the blades to break.</p>
          <p>The design system is very special, because it is controlled passively, no energy is consumed. It isn’t driven by electric motors or hydraulic cylinder with pumps, but with differential pressure.</p>
          <p>The pitch angle depends of the force of the wind; between more velocity has the wind more angle the blades will have.</p>
          <ul>
            <li>University:
              <ul>
                <li><img src="/resources/theme3.0/cidesi.png" alt="CIDESI" width="119" height="33"></li>
              </ul>
            </li>
            <li>Technologies:
              <ul>
                <li><b>Software:</b> SolidWorks</li>
              </ul>
            </li>
          </ul>
        </div>
        <aside class="play">PAUSE</aside>
        <aside>CLOSE</aside>
      </article>
      <article id="a_cad_cam">
        <video src="/resources/movies/highres/cam.mp4" loop muted disablePictureInPicture="true" preload="none"></video>
        <section>
          <div>
            <h1>Fixture designer</h1>
            <h2>Time worked: <b>1 year</b> <i>03.2012 to 03.2013</i></h2>
            <p>The work consisted of the elaboration of pieces from the concept, precise measurement, designing, programming and finally to machining, of course, I had a very capable and experienced team to machine the pieces. I was the lead designer in the fixture department and CNC machining trainer for new team members.</p>
            <p>For the design and creation of pieces I utilized design programs such as Autocad, Solidworks and MasterCAM. I gathered one year of experience at Tyco Electronics Company, it is an enterprise with a very extensive variety of products, covering areas from automotive to aeronautics.</p>
            <ul>
              <li>Company:
                <ul>
                  <li><img src="/resources/theme3.0/te2.png" alt="TE Electronics" width="93" height="50"></li>
                </ul>
              </li>
              <li>Technologies:
                <ul>
                  <li><b>CNC:</b> HAAS, centroid</li>
                  <li><b>Software:</b> AutoCAD, Inventor, SolidWorks, MasterCAM, WinUnisof</li>
                </ul>
              </li>
            </ul>
          </div>
          <div>
            <h1>Design engineer</h1>
            <h2>Time worked: <b>1 year</b> <i>01.2011 to 01.2012</i></h2>
            <p>In this period was performed an intership with an aeronautical parts manufacturer and design engineer was my last position. I started as an assistant and in only one year I grew up in responsabilities, I passed through CNC operator, Quality inspector until Design Engineer in which I was able to design the pieces for manufacturing in CNC.</p>
            <p>In this company I won great experiences, they educate me in CNC design, tools and materials. They were very qualified tutors and persons.</p>
            <p>The pieces fabricated are used in electronic medical instruments, trains and aeronautics.</p>
            <ul>
              <li>Company:
                <ul>
                  <li><img src="/resources/theme3.0/oviso.png" alt="Oviso Manufacturing" width="128" height="40"></li>
                </ul>
              </li>
              <li>Technologies:
                <ul>
                  <li><b>CNC:</b> HAAS</li>
                  <li><b>Software:</b> SolidWorks, MasterCAM</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>
        <aside class="play">PAUSE</aside>
        <aside>CLOSE</aside>
      </article>
      <article id="a_drone">
        <video src="/resources/movies/highres/nabucodonosor_2.mp4" loop muted disablePictureInPicture="true" preload="none"></video>
        <video src="/resources/movies/highres/nabucodonosor.mp4" loop muted disablePictureInPicture="true" preload="none"></video>
        <div>
          <h1>Fully electric autonomous drone</h1>
          <h2>Project proposal to design and develop an autonomous drone</h2>
          <p>Currently there are already several drones but most of them have quite few disadvantages; they rely on fuel and a person that is remotely controlling them. The former contrains how long reamins flying and how far distances it will reach, the latest forces to always have a competenly trained person in good physical and mental state to properly operate it.</p>
          <p>I wanted to design an improved drone to remove such limitations, with a body made of carbon fiber that will give it a super strong and light material, so it will require less strength and therefore it will last flying for longer. Such replacement was good but not enough to consider it a proper advancement, and for this reason solar cells, batteries, and low power electric motor were implemented.</p>
          <p>The solar cells will be giving power to the motor to keep flying during the day and also charging a battery station to store energy that will be used during the night.</p>
          <p>The drone will have a powerfull computer to process the sensors' data (LiDar and camera), precise GPS for geolocalization, and programs to fully operate autonomously.</p>
          <ul>
            <li>Company:
              <ul>
              <li><img src="/resources/theme3.0/pem.svg" alt="PEM der RWTH" title="PEM der RWTH" height="48"></li>
                <li><img src="/resources/theme3.0/wzl.svg" alt="Werkzeugmaschinenlabor RWTH" title="Werkzeugmaschinenlabor RWTH" height="48"></li>
              </ul>
            </li>
            <li>Technologies:
              <ul>
                <li><b>Software to create the video:</b> Solidworks and Blender (for animation)</li>
                <li><b>Hardware for autonomous drive:</b> LiDar, several cameras, GPS, radio communication and a central computer for processing</li>
                <li><b>Specialized hardware:</b> Industrial oven to curate the carbon fibers</li>
              </ul>
            </li>
          </ul>
        </div>
        <aside class="next">NEXT</aside>
        <aside class="play">PAUSE</aside>
        <aside>CLOSE</aside>
      </article>
    </section>
    <section id="projects" name="projects">
      <h1><img src="/resources/theme3.0/projects.svg" alt="PROJECTS"></h1>
      <ol>
        <li class="in_progress">
          <a href="https://github.com/deempalme/arduino_serial">
            <h1>Arduino serial communication</h1>
            <p>Library created to communicate between your C++ projects and arduino devices using the same functions' names and code structure.</p>
            <ul>
              <li>Tags:</li>
              <li>arduino</li>
              <li>serial-communication</li>
              <li>UART</li>
              <li>USB</li>
              <li>IO</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li>
          <a href="https://github.com/deempalme/GPS_coordinate_converter">
            <h1>GPS coordinate converter</h1>
            <p>GPS Coordinates converter using Azimuthal equidistant projection (Way better than Flat / Mercartor Projection).</p>
            <ul>
              <li>Tags:</li>
              <li>GPS-coordinates</li>
              <li>latitude-and-longitude</li>
              <li>azimuthal-equidistant-projection</li>
              <li>GPS-converter</li>
              <li>ramrod</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li>
          <a href="https://github.com/deempalme/visualisierung">
            <h1>Visualisierung</h1>
            <p>First version to visualize the Autonomous driving vehicle sensor's data and its the calculated results, featuring a 2D graphic user interface and fast calculations performed in the GPU.</p>
            <ul>
              <li>Tags:</li>
              <li>autonomous-driving-vehicle</li>
              <li>LiDar</li>
              <li>grid-map</li>
              <li>objects</li>
              <li>trajectories</li>
              <li>streets-and-signaling</li>
              <li>camera-views</li>
              <li>GUI</li>
              <li>GPU-calculations</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>GLSL</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li class="in_progress">
          <a href="https://github.com/deempalme/torero">
            <h1>Torero</h1>
            <p>Second improved version of the visualization of the Autonomous driving vehicle sensor's data and its the calculated results, featuring a 3D graphic user interface and photo-realistic rendering, with boosted GPU calculations.</p>
            <ul>
              <li>Tags:</li>
              <li>autonomous-driving-vehicle</li>
              <li>LiDar</li>
              <li>grid-map</li>
              <li>objects</li>
              <li>trajectories</li>
              <li>streets-and-signaling</li>
              <li>camera-views</li>
              <li>GUI</li>
              <li>GPU-calculations</li>
              <li>PBR</li>
            </ul>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>GLSL</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li class="in_progress">
          <a href="https://github.com/deempalme/network_communication">
            <h1>Network communication</h1>
            <p>Library for easy communication between server and client using TCP and UDP in synchronous or asynchronous modes.</p>
            <ul>      
              <li>Tags:</li>
              <li>server-client-communication</li>
              <li>socket</li>
              <li>TCP-socket</li>
              <li>UDP-socket</li>
              <li>asynchronous</li>
              <li>synchronous</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>GLSL</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li class="in_progress">
          <a href="https://github.com/deempalme/gui">
            <h1>GUI</h1>
            <p>Graphic User Interface library with OpenGL and SDL2 as window manager.</p>
            <ul>
              <li>Tags:</li>
              <li>GUI</li>
              <li>openGL</li>
              <li>SDL2</li>
              <li>windows-manager</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>GLSL</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li>
          <a href="https://github.com/deempalme/console_printer">
            <h1>Console printer</h1>
            <p>C++ library to create stylized console printing (with color, weight, and backgrounds)</p>
            <ul>
              <li>Tags:</li>
              <li>iostream</li>
              <li>color-format</li>
              <li>terminal-colorized</li>
              <li>colorized-ostream</li>
              <li>terminal-output</li>
              <li>colorized-terminal</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li class="in_progress">
          <a href="https://github.com/deempalme/multithreading">
            <h1>Multithreading</h1>
            <p>Simple C++ multithreading library to run functions in different CPU threads, check and perform callbacks when they are finished.</p>
            <ul>
              <li>Tags:</li>
              <li>multithreading</li>
              <li>callback</li>
              <li>asynchronous-callbacks</li>
              <li>multithreading-callback</li>
              <li>function-binding</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li>
          <a href="https://github.com/deempalme/gamepad_reader">
            <h1>Gamepad reader</h1>
            <p>Gamepad reader for joysticks in windows and linux (if joystick driver is supported) </p>
            <ul>
              <li>Tags:</li>
              <li>gamepad</li>
              <li>joystick</li>
              <li>SDL2</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li class="in_progress">
          <a href="https://github.com/deempalme/eye_of_the_tiger">
            <h1>Eye of the tiger</h1>
            <p>Ultra fast calculation of empty space from LiDar data for autonomous driving using image proccesing with CUDA.</p>
            <ul>
              <li>Tags:</li>
              <li>LiDar</li>
              <li>image-proccesing</li>
              <li>parallel-programming</li>
              <li>CUDA</li>
              <li>GPU-calculations</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>Cuda</dt>
              <dt>GLSL</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li>
          <a href="https://github.com/deempalme/qt_ros_debugging">
            <h1>Qt ROS debugging</h1>
            <p>How to debug ROS programs with Qt (and how to compile CarMaker projects using catkin).</p>
            <ul>
              <li>Tags:</li>
              <li>QT</li>
              <li>ROS</li>
              <li>debugging</li>
              <li>carmaker</li>
              <li>catkin-workspace</li>
              <li>qtcreator</li>
              <li>catkin-ws</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>Markdown</dt>
              <dt>C++</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li>
          <a href="https://github.com/deempalme/rocinante">
            <h1>Rocinante</h1>
            <p>ROS Message reader for C++</p>
            <ul>
              <li>Tags:</li>
              <li>ROS</li>
              <li>ROS-messages</li>
              <li>torero</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>ROS</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li>
          <a href="https://github.com/deempalme/kitti_reader">
            <h1>KITTI reader</h1>
            <p>C++ library to read kitti data </p>
            <ul>
              <li>Tags:</li>
              <li>kitti</li>
              <li>torero</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>ROS</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li>
          <a href="https://github.com/deempalme/algebraica">
            <h1>Algebraica</h1>
            <p>Light mathematical libray for OpenGL and C++</p>
            <ul>
              <li>Tags:</li>
              <li>mathematics</li>
              <li>linear-algebra</li>
              <li>openGL</li>
              <li>torero</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li>
          <a href="https://github.com/deempalme/open_gl">
            <h1>OpenGL wrapper</h1>
            <p>OpenGL wrapper library.</p>
            <ul>
              <li>Tags:</li>
              <li>openGL</li>
              <li>GLAD</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>C++</dt>
              <dt>CMake</dt>
            </dl>
          </a>
        </li>
        <li>
          <a href="https://github.com/deempalme/portfolio">
            <h1>Portfolio</h1>
            <p>Francisco's online portfolio source code.</p>
            <ul>
              <li>Tags:</li>
              <li>curriculum-vitae</li>
              <li>portfolio</li>
              <li>webGL2</li>
            </ul>
            <dl>
              <dt>Languages:</dt>
              <dt>Typescript</dt>
              <dt>Javascript</dt>
              <dt>jQuery</dt>
              <dt>Css3</dt>
              <dt>HTML5</dt>
            </dl>
          </a>
        </li>
      </ol>
    </section>
    <section id="about_me" name="about_me">
      <section>
        <h1><img src="/resources/theme3.0/about_me.svg" alt="ABOUT ME"></h1>
        <article>
          <p><i>H</i>ello, I am a Meechatronic engineer with experience in programming, CAD &amp; CAM design and manufacturing, electronics, PLCs, pneumatics and hydraulics, and an expert in OpenGL, Computer Graphics, and Parallel programming; I make things go faster using the powerful capabilities of GPUs and convert complex and slow algorithms into real-time processing programs.</p>
          <p>With degrees from Mexican and top German Universities that gave me the opportunity to work for several years in German companies and Reseach institutions developing pioneer techniques for Autonomous driving vehicles, and innovative approaches to improve the design of manufacturing processes such as, virtual reality and programming to automate the calculation of factories' layouts.</p>
          <p>I am passionate of programming, deeply creative, brimful of ideas and a big enthusiast for electronics and robotics. I care about every tiny detail; perfectionism is my custom.</p>
          <p>Plentiful hobbies suchlike building arduino and microcontroller projects, graphic design, web programming, 3D modeling (like the images displayed in this page), carpentry, sports such mountain biking, badminton, among others.</p>
        </article>
      </section>
    </section>
    <section id="knowledge" name="knowledge">
      <h1><img src="/resources/theme3.0/knowledge.svg" alt="KNOWLEDGE"></h1>
      <article>
        <ol>
          <li><b>3D Design & Construction:</b></li>
          <ol>
            <li>CAD desing</li>
            <ol>
              <li>Autocad</li>
              <li>Solidworks</li>
              <li>Inventor</li>
              <li>Blender</li>
            </ol>
            <li>CAM programming</li>
            <ol>
              <li>MasterCAM</li>
            </ol>
            <li>CNC machining</li>
            <ol>
              <li>HAAS</li>
              <li>Centroid</li>
              <li>Yamaha</li>
            </ol>
            <li>Finite element analysis</li>
            <ol>
              <li>ANSYS</li>
              <li>Solidworks</li>
            </ol>
            <li>3D printing methods & processes</li>
          </ol>
          <li><b>Automation:</b></li>
          <ol>
            <li>Hydraulics</li>
            <li>Neumatics</li>
            <li>PLC design</li>
            <li>Robotic inclusion</li>
            <li>Microcontrollers</li>
            <ol>
              <li>Microchip</li>
              <li>Raspberry PI</li>
              <li>Arduino</li>
            </ol>
          </ol>
        </ol>
        <ol>
          <li><b>Programming:</b></li>
          <ol>
            <li>C++</li>
            <li>Python</li>
            <li>ROS (Robot Operating System)</li>
            <li>OpenGL</li>
            <li>Matlab C++</li>
            <li>Network programming & serial communications</li>
            <li>SQL</li>
            <li>Php</li>
            <li>Typescript</li>
            <li>Javascript</li>
            <li>CSS 2</li>
            <li>XML</li>
            <li>HTML 5</li>
            <li>Parallel programming:</li>
            <ol>
              <li>GLSL (OpenGL Shading Language)</li>
              <li>CPU's multi-thread programming</li>
              <li>CUDA (Compute Unified Device Architecture)</li>
            </ol>
          </ol>
          <li><b>Electronics:</b></li>
          <ol>
            <li>Digital electronics</li>
            <li>Power electronics</li>
            <li>Electronic circuits' design & construction</li>
            <li>Microcontrollers</li>
          </ol>
        </ol>
        <ol>
          <li><b>Mathematics:</b></li>
          <ol>
            <li>Linear algebra</li>
            <li>Trigonometry</li>
            <li>Arithmetics</li>
            <li>Computed linear equations</li>
          </ol>
          <li><b>Autonomous driving:</b></li>
          <ol>
            <li>Image processing</li>
            <li>LiDAR's data reading & processing</li>
            <li>Grid mapping calculation</li>
            <li>Map's information processing</li>
            <li>Navigation</li>
            <li>Trajectory calculation</li>
            <li>Virtual reality & game engines</li>
            <li>Real-time rendering</li>
          </ol>
        </ol>
      </article>
    </section>
    <section id="studies" name="studies">
      <h1><img src="/resources/theme3.0/studies.svg" alt="STUDIES"></h1>
      <ul>
        <li>
          <figure><img src="/resources/theme3.0/ith.jpg"></figure>
          <small><i>Graduated at</i></small>
          <h1>Hermosillo Institute <i>of</i> Technology</h1>
          <p><b>2006 - 2011</b>, B. Eng. In Mechatronic Engineering</p>
        </li>
        <li>
          <figure><img src="/resources/theme3.0/fh.svg"></figure>
          <small><i>Graduated at</i></small>
          <h1>Fachhochschule <i>of</i> Aachen</h1>
          <p><b>2014 - 2017</b>, M. Sc. In Mechatronics</p>
        </li>
        <li>
          <figure><img src="/resources/theme3.0/rwth_logo.svg"></figure>
          <small><i>Studied at</i></small>
          <h1>Rheinisch-Westfälische Technische<br><b>Hochschule Aachen</b></h1>
          <p><b>2017-2020</b>, Ph. D. in Production engineering</p>
        </li>
      </ul>
    </section>
  </main>
  <footer id="contact_me" name="contact_me">
    <h1><img src="/resources/theme3.0/contact_me.svg" alt="CONTACT ME"></h1>
    <section>
      <small>Email</small>
      <p><b>f.j.r.r@ramrod.tech</b></p>
    </section>
    <section>
      <small>Whatsapp</small>
      <p><b>+52 622 125 3017</b></p>
    </section>
    <section>
      <small>Signal</small>
      <p><b>+49 575 145 6778</b></p>
    </section>
    <ul>
      <li><a href="#top">Top</a></li>
      <li><a href="#portfolio">Portfolio</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#about_me">About me</a></li>
      <li><a href="#knowledge">Knowledge</a></li>
      <li><a href="#studies">Studies</a></li>
      <li><a href="#contact_me">Contact me</a></li>
    </ul>
  </footer>
  <aside id="keys">
    <h1>←↑→↓</h1>
    <h2>Use keys to navigate</h2>
  </aside>
  <aside id="loader">
    Loading: <b>0</b><i>%</i>
  </aside>
</body>

</html>
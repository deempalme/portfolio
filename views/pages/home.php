<!DOCTYPE html>
<html lang="en-GB">

<head>
<meta charset="UTF-8">
<title><?= $controller->page_title(); ?></title>
<link rel="icon" type="image/png" href="/resources/theme/icon.png" />
<link href="/resources/css/home.css" rel="stylesheet" />
<script language="javascript" src="/resources/js/home.js" type="text/javascript"></script>
</head>

<body>
  <nav>
    <ul>
      <li><a href="#universe">Top</a></li>
      <li><a href="#portfolio">Portfolio</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#knowledge">Knowledge</a></li>
      <li><a href="#about_me">About me</a></li>
      <li><a href="#studies">Studies</a></li>
      <li><a href="#contact_me">Contact me</a></li>
    </ul>
  </nav>
  <main>
    <section id="universe" name="universe">
    </section>
    <section id="knowledge" name="knowledge">
      <ul>
        <li>3D design & construction:</li>
        <ul>
          <li>CAD desing</li>
          <ul>
            <li>Autocad</li>
            <li>Solidworks</li>
            <li>Inventor</li>
            <li>Blender</li>
          </ul>
          <li>CAM programming</li>
          <ul>
            <li>MasterCAM</li>
          </ul>
          <li>CNC machining</li>
          <ul>
            <li>HAAS</li>
            <li>Centroid</li>
            <li>Yamaha</li>
          </ul>
          <li>Finite element analysis</li>
          <ul>
            <li>ANSYS</li>
            <li>Solidworks</li>
          </ul>
          <li>3D printing methods & processes</li>
        </ul>
        <li>Automation:</li>
        <ul>
          <li>Hydraulics</li>
          <li>Neumatics</li>
          <li>PLC design</li>
          <li>Robotic inclusion</li>
          <li>Microcontrollers</li>
          <ul>
            <li>Microchip</li>
            <li>Raspberry PI</li>
            <li>Arduino</li>
          </ul>
        </ul>
        <li>Programming:</li>
        <ul>
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
          <ul>
            <li>GLSL (OpenGL Shading Language)</li>
            <li>CPU's multi-thread programming</li>
            <li>CUDA (Nvidia's Compute Unified Device Architecture)</li>
          </ul>
        </ul>
        <li>Electronics:</li>
        <ul>
          <li>Digital electronics</li>
          <li>Power electronics</li>
          <li>Electronic circuits' design & construction</li>
          <li>Microcontrollers</li>
        </ul>
        <li>Mathematics:</li>
        <ul>
          <li>Linear algebra</li>
          <li>Trigonometry</li>
          <li>Arithmetics</li>
          <li>Computed linear equations</li>
        </ul>
        <li>Autonomous driving:</li>
        <ul>
          <li>Image processing</li>
          <li>LiDAR's data reading & processing</li>
          <li>Grid mapping calculation</li>
          <li>Map's information processing</li>
          <li>Navigation</li>
          <li>Trajectory calculation</li>
          <li>Virtual reality & game engines</li>
          <li>Real-time rendering</li>
        </ul>
      </ul>
    </section>
    <section id="studies" name="studies">
      <ul>
        <li>
          <h1><img src="/resources/theme/ith.jpg"></h1>
          <small>Graduated at</small>
          <h2>Hermosillo Institute <i>of</i> Technology</h2>
          <p><b>2006 - 2011</b>, Mechatronics engineer</p>
        </li>
        <li>
          <h1><img src="/resources/theme/fh.jpg"></h1>
          <small>Graduated at</small>
          <h2>Fachhochschule <i>of</i> Aachen</h2>
          <p><b>2014 - 2017</b>, Master degree in Mechatronics</p>
        </li>
      </ul>
    </section>
  </main>
  <footer id="contact_me" name="contact_me">
    <h1>Contact me</h1>
    <form action="/contact_me" method="post">
      <label for="name_field">What's your name:</label>
      <input type="text" id="name_field" name="name_field" value="" placeholder="Name & last name" required>
      <label for="email_field">What's your email:</label>
      <input type="email" id="email_field" name="email_field" value="deempalme@gmail.com" required>
      <label for="phone_field">What's your cellphone:</label>
      <input type="text" id="phone_field" name="phone_field" value="743574985">
      <label for="comment_field">What would you like to say to me:</label>
      <textarea name="comment_field" id="comment_field" cols="30" rows="10" placeholder="Put your comment" required></textarea>
      <button type="submit" value="gone">Send</button>
    </form>
  </footer>
</body>

</html>
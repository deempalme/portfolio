<!DOCTYPE html>
<html lang="en-GB">

<head>
  <meta charset="UTF-8">
  <title><?= $controller->page_title(); ?></title>
  <link rel="icon" type="image/png" href="/resources/theme/icon.png" />
  <link href="/resources/css/detail.css" rel="stylesheet" />
  <script language="javascript" type="text/javascript">
    var media = {
      is_image : <?= $controller->is_image() ? 'true' : 'false'; ?>,
      zoom : <?= $controller->zoom(); ?>,
      width : <?= $controller->width(); ?>,
      height : <?= $controller->height(); ?>,
      position_x : <?= $controller->position_x(); ?>,
      position_y : <?= $controller->position_y(); ?>,
      crop_width : <?= $controller->crop_width(); ?>,
      crop_height : <?= $controller->crop_height(); ?>,
      time_position : <?= $controller->start(); ?>,
      speed : <?= $controller->speed(); ?>,
      muted : <?= $controller->muted(); ?>,
      autoplay : <?= $controller->autoplay(); ?>,
      looping : <?= $controller->looping(); ?>,
      adult : <?= $controller->adult() ? 'true' : 'false'; ?> 
    };
  </script>
  <script language="javascript" src="/resources/js/view.js" type="text/javascript"></script>
</head>

<body>
  <nav>
    <h1><?= $controller->name(); ?></h1>
    <ul>
      <li id="crop">Crop (c)</li>
      <li id="zoom_in">Zoom in (+)</li>
      <li id="zoom_holder"><input type="text" id="zoom_input" value="<?= \number_format($controller->zoom() * 100.0, 0); ?>%"></li>
      <li id="zoom_out">Zoom out (-)</li>
      <li id="delete">Delete (d)</li>
      <li id="views">Views: <b><?= $controller->views(); ?></b></li>
      <li id="size">Size: <b><?= $controller->size(); ?></b></li>
    </ul>
    <ul>
      <li id="parent"><?= $controller->parent(); ?></li>
      <li id="folder"><?= $controller->folder(); ?></li>
      <li id="resolution">Resolution: <b><?= $controller->width(); ?>x<?= $controller->height(); ?></b></li>
      <li id="modified">Modified: <b><?= $controller->file_modified(); ?></b></li>
      <li id="created">Created: <b><?= $controller->file_created(); ?></b></li>
    </ul>
  </nav>
  <main>
    <figure><?php if($controller->is_image()){ ?> 
      <img id="media_handler" src="/<?= $controller->path(); ?>" width="<?= $controller->width(); ?>" height="<?= $controller->height(); ?>" alt="<?= $controller->name(); ?>">
    <?php }else{ ?>
      <video id="media_handler" src="<?= $controller->path(); ?>" autoplay="<?= $controller->autoplay(); ?>" controls="true" loop="<?= $controller->looping(); ?>" muted="<?= $controller->muted(); ?>" currentTime="<?= $controller->start(); ?>" controlsList="nodownload" width="<?= $controller->width(); ?>" height="<?= $controller->height(); ?>" disablePictureInPicture="true" preload="auto"></video>
    <?php } ?></figure>
  </main>
  <footer>
    <ul>
      <li>Tags:</li>
      <?php foreach($controller->tags() as $id => $tag){ ?>
      <li data-id="<?= $id; ?>"><?= $tag; ?></li>
      <?php } ?> 
      <li id="tag_input_li"><input id="tag_input" type="text" value="testing"></li>
      <li id="tag_add">+</li>
    </ul>
  </footer>
</body>

</html>
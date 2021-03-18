<?php
namespace code\controller;

require_once 'code/app/connection.php';
require_once 'code/app/error_handler.php';
require_once 'code/app/media.php';
require_once 'code/app/router.php';
require_once 'code/app/strings.php';
//require_once 'code/security/authorization.php';

use code\app\connection;
use code\app\error_handler;
use code\app\media;
use code\app\router;
use code\app\strings;

class view
{
  private const GUEST = 'Z3Vlc3Q=';

  private $adult         = false;
  private $autoplay      = 'false';
  private $created       = '';
  private $crop_height   = 0;
  private $crop_width    = 0;
  private $file_created  = '';
  private $file_modified = '';
  private $duration      = 0;
  private $height        = 0;
  private $id            = 0;
  private $is_image      = true;
  private $looping       = 'false';
  private $muted         = 'false';
  private $name          = '';
  private $path          = '';
  private $position_x    = 0;
  private $position_y    = 0;
  private $size          = 0;
  private $speed         = 0.0;
  private $start         = 0;
  private $type          = '';
  private $updated       = '';
  private $views         = 0;
  private $width         = 0;
  private $zoom          = 0.0;

  private $bad = false;
  private $tags = array();
  private $tag_count = 0;

  private $error = false;

  public function __construct(){
    $url = router::get_url_sections();
    // Checking if url is correct
    if(empty($url[1]) || !\is_numeric($url[1])){
      $this->bad = true;
      return;
    }

    if(($media_id = strings::clean_integer($url[1])) <= 0){
      $this->bad = true;
      return;
    }
    $connection = connection::connect(self::GUEST);

    if(($media_stmt = $connection->prepare('SELECT m.id, m.name, m.folder, m.parent, m.path, m.type,
    m.width, m.height, m.crop_width, m.crop_height, m.position_x, m.position_y, m.duration,
    m.time_position, m.looping, m.autoplay, m.muted, m.speed, m.size, m.zoom, m.adult, m.views,
    m.file_created, m.file_modified, m.updated, m.created FROM media m WHERE m.id = ?')) === false
    ||
    ($tags_stmt = $connection->prepare('SELECT a.tag_id, t.name FROM tags_assign a LEFT JOIN tags t
    ON t.id = a.tag_id WHERE a.media_id = ?')) === false){
      error_handler::set_message(error_handler::ERROR, $connection->error);
      return !($this->error = true);
    }

    $media_stmt->bind_param('i', $media_id);

    if($media_stmt->execute() === false){
      error_handler::set_message(error_handler::ERROR, $connection->error);
      return !($this->error = true);
    }

    $media_stmt->bind_result($this->id, $name, $folder, $parent, $path, $type, $this->width, 
                             $this->height, $this->crop_width, $this->crop_height, $this->position_x,
                             $this->position_y, $this->duration, $this->time_position, $looping,
                             $autoplay, $muted, $this->speed, $size, $this->zoom, $adult, $this->views,
                             $file_created, $file_modified, $updated, $created);

    if($media_stmt->fetch() !== true){
      error_handler::set_message(error_handler::ERROR, 'Image\'s id was not found.');
      return !($this->error = true);
    }

    $media_stmt->free_result();
    $media_stmt->close();

    // Filling tags now ::::::::::::::::::::::::::::::

    $tags_stmt->bind_param('i', $media_id);

    if($tags_stmt->execute() === false){
      error_handler::set_message(error_handler::ERROR, $connection->error);
      return !($this->error = true);
    }

    $tags_stmt->bind_result($tag_id, $tag_name);

    while($tags_stmt->fetch())
      $this->tags[$tag_id] = strings::html_encode($tag_name);

    $this->tag_count = count($this->tags);

    $tags_stmt->free_result();
    $tags_stmt->close();
    $connection->close();

    $this->name = strings::html_encode($name);
    $this->folder = strings::html_encode($folder);
    $this->parent = media::folder_name($parent);
    $this->path = strings::clean_path($path);
    $this->looping = $looping > 0 ? 'true' : 'false';
    $this->autoplay = $autoplay > 0 ? 'true' : 'false';
    $this->muted = $muted > 0 ? 'true' : 'false';
    $this->size = $size > strings::MEGABYTE ? strings::number($size / strings::MEGABYTE, 3).' MB' 
                                            : strings::number($size / strings::KILOBYTE, 3).' KB';
    $this->adult = $adult > 0;
    $this->is_image = media::video_extension($type) == 'Unknown';
    $this->type = media::return_mime($type);

    $date = \DateTime::createFromFormat('Y-m-d H:i:s', $file_created);
    $this->file_created = $date->format('d.m.Y H:i:s');
    $date = \DateTime::createFromFormat('Y-m-d H:i:s', $file_modified);
    $this->file_modified = $date->format('d.m.Y H:i:s');
    $date = \DateTime::createFromFormat('Y-m-d H:i:s', $created);
    $this->created = $date->format('d.m.Y H:i:s');
    $date = \DateTime::createFromFormat('Y-m-d H:i:s', $updated);
    $this->updated = $date->format('d.m.Y H:i:s');
  }
  /**
   * Indicates if the content is for adults only
   * @return bool 'true' for adults only
   */
  public function adult() : bool {
    return $this->adult;
  }
  /**
   * Getting if video shoul start automatically
   * @return string Boolean string, 'true' if it should play automatically
   */
  public function autoplay() : string {
    return $this->autoplay;
  }
  /**
   * Indicates if the media was not found
   * @return `true` if not found
   */
  public function bad() : bool {
    return $this->bad;
  }
  /**
   * Getting the cropping's height
   * @return int Cropping's height in pixels
   */
  public function crop_height() : int {
    return $this->crop_height;
  }
  /**
   * Getting the cropping's width
   * @return int Cropping's width in pixels
   */
  public function crop_width() : int {
    return $this->crop_width;
  }
  /**
   * Indicates if there was an error retrieving the media's data
   * @return bool 'true' if there is a media error
   */
  public function error() : bool {
    return $this->error;
  }
  /**
   * Getting the date when the file was created
   * @return string Date in format: d.m.Y H:i:s
   */
  public function file_created() : string {
    return $this->file_created;
  }
  /**
   * Getting the date when the file was modified
   * @return string Date in format: d.m.Y H:i:s
   */
  public function file_modified() : string {
    return $this->file_modified;
  }
  /**
   * Getting the media's folder name
   * @return string Folder's name containing this media
   */
  public function folder() : string {
    return $this->folder;
  }
  /**
   * Getting the media's height
   * @return int Media's height in pixels
   */
  public function height() : int {
    return $this->height;
  }
  /**
   * Indicates if this media is an image or not
   * @return bool 'true' for image, 'false' for video
   */
  public function is_image() : bool {
    return $this->is_image;
  }
  /**
   * Getting if the media should loop forever
   * @return string Boolean string, 'true' indicates that is looped
   */
  public function looping() : string {
    return $this->looping;
  }
  /**
   * Getting if the media should be muted
   * @return string Boolean string, 'true' indicates that is muted
   */
  public function muted() : string {
    return $this->muted;
  }
  /**
   * Getting the media's name
   * @return string media's name
   */
  public function name() : string {
    return $this->name;
  }
  /**
   * Getting the page's title 
   * @return string page's title
   */
  public function page_title() : string {
    return $this->name;
  }
  /**
   * Getting the media's parent folder name
   * @return string Parent folder's name containing the folder that contains this media
   */
  public function parent() : string {
    return $this->parent;
  }
  /**
   * Getting the full media's path
   * @return string Full media's path
   */
  public function path() : string {
    return $this->path;
  }
  /**
   * Getting the media's horizontal position
   * @return int Horizontal position in pixels
   */
  public function position_x() : int {
    return $this->position_x;
  }
  /**
   * Getting the media's vertical position
   * @return int Vertical position in pixels
   */
  public function position_y() : int {
    return $this->position_y;
  }
  /**
   * Gettint the file size
   * @return string File's size in KB or MB
   */
  public function size() : string {
    return $this->size;
  }
  /**
   * Getting the current video's speed
   * @return float Video's speed 1 = normal speed
   */
  public function speed() : float {
    return $this->speed;
  }
  /**
   * Getting the media's start position
   * @return int Start position in seconds
   */
  public function start() : int {
    return $this->start;
  }
  /**
   * Getting all the media tags
   * @return array Array containing the tag's id as key and its name as value
   */
  public function tags() : array {
    return $this->tags;
  }
  /**
   * Getting the total number of tags that this media has
   * @return int Total tags
   */
  public function tag_count() : int {
    return $this->tag_count;
  }
  /**
   * Getting the number of times this file has been seen
   * @return int Number of this media's views
   */
  public function views() : int {
    return $this->views;
  }
  /**
   * Getting the media's width
   * @return int Media's width in pixels
   */
  public function width() : int {
    return $this->width;
  }
  /**
   * Getting the media's zoom value
   * @return float Zoom's numeric value as normalized: 1 = 100
   */
  public function zoom() : float {
    return $this->zoom;
  }
}

$controller = new view;

// Loading HTML content
//if($controller->adult())
//  require 'views/pages/blocked.php';
//else
if($controller->bad())
  require 'views/pages/not_found.php';
else
  require 'views/pages/view.php';
?>
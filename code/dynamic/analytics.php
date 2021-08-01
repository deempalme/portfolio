<?php

namespace code\dynamic;

require_once 'code/app/analytics.php';
require_once 'code/app/connection.php';
require_once 'code/app/error_handler.php';
require_once 'code/app/strings.php';
require_once 'code/security/CSRF_tokenizer.php';
require_once 'code/security/encryptor.php';

use code\app\connection;
use code\app\error_handler;
use code\app\strings;
use code\security\CSRF_tokenizer;
use code\security\encryptor;


class analytics
{
  private $id_ = null;
  private $ip_ = null;

  private const GUEST = 'Z3Vlc3Q=';

  public function __construct(){
    if(empty($_POST['user_id']) || empty($_POST['token'])
    || !$this->parse() || !CSRF_tokenizer::verify_token($_POST['token']))
      self::error('Token not authorized');

    if(!$this->get_ip()) self::error('No ip found');

    // Inserting new user
    if(isset($_POST['new_user'])){
      $this->user_new();
    // Updating a user
    }elseif(isset($_POST['update_user'])){
      $this->user_update();
    // Updating screen resolution
    }elseif(isset($_POST['update_screen'])){
      $this->screen_update();
    // Checking if IP has already registered geolocation
    }elseif(isset($_POST['check_geolocation'])){
      $this->geolocation_check();
    // Saves IP's geolocation
    }elseif(isset($_POST['new_geolocation'])){
      $this->geolocation_save();
    }
  }
  /**
   * @brief Returning the error message as a json string
   */
  private static function error(string $error_string){
    error_handler::set_message(error_handler::ERROR, $error_string);
    error_handler::print_messages(true);
    die();
  }
  /**
   * @brief Check if IP is already registered
   */
  private function geolocation_check(){
    if(empty($_POST['check_geolocation'])) self::error('Not conforming form');

    $database = new connection;
    $connection = $database->connect(self::GUEST);
    $search_stmt = $connection->stmt_init();

    $result = array('found' => false, 'ip' => $this->ip_);

    // Looking if an ip's geologation already exist

    if(!$search_stmt->prepare("SELECT id FROM geolocations WHERE ip = ?"))
      self::error($connection->error);

    $search_stmt->bind_param('s', $this->ip_);

    if(!$search_stmt->execute()) self::error($connection->error);

    $search_stmt->bind_result($result['ip']);

    if(empty($search_stmt->fetch())){
      error_handler::unite_data_and_message($result, true);
      return false;
    }

    $search_stmt->close();

    // Updating user's geolocations link

    $this->geolocation_update($connection, $result['ip']);

    $connection->close();

    $result['found'] = true;
    error_handler::unite_data_and_message($result, true);
  }
  /**
   * @brief Saves an IP's geolocation data
   */
  private function geolocation_save(){
    if(empty($_POST['new_geolocation']) || empty($_POST['country']) || empty($_POST['state'])
    || empty($_POST['city']) || empty($_POST['postcode']) || empty($_POST['continent'])
    || empty($_POST['latitude']) || empty($_POST['longitude'])) 
      self::error('Not conforming form to save geolocation');

    $database = new connection;
    $connection = $database->connect(self::GUEST);
    $insert_stmt = $connection->stmt_init();

    $country = strings::sanitize_string($_POST['country']);
    $state = strings::sanitize_string($_POST['state']);
    $city = strings::sanitize_string($_POST['city']);
    $postcode = strings::sanitize_string($_POST['postcode']);
    $continent = strings::sanitize_string($_POST['continent']);
    $latitude = strings::clean_float($_POST['latitude']);
    $longitude = strings::clean_float($_POST['longitude']);

    // Inserting the new geolocation data

    if(!$insert_stmt->prepare("INSERT INTO geolocations (ip, country, `state`, city,
    postcode, continent, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"))
      self::error($connection->error);

    $insert_stmt->bind_param('ssssssdd', $this->ip_, $country, $state, $city, $postcode,
                             $continent, $latitude, $longitude);

    if(!$insert_stmt->execute()) self::error($connection->error);

    $inserted_geo = $insert_stmt->insert_id;

    $insert_stmt->close();

    // Updating user's geolocations link

    $this->geolocation_update($connection, $inserted_geo);

    $connection->close();

    error_handler::print_messages(true);
  }
  /**
   * @brief Updates the ip_link on the registry table
   */
  private function geolocation_update(&$connection, string $ip_link){
    $update_stmt = $connection->stmt_init();

    if(!$update_stmt->prepare("UPDATE registry SET ip_link = ? WHERE id = ?"))
      self::error($connection->error);

    $update_stmt->bind_param('ii', $ip_link, $this->id_);
    if(!$update_stmt->execute()) self::error($connection->error);
    $update_stmt->close();
  }
  /**
   * @brief Getting the user IP address
   * 
   * @return string Ip address as a string
   */
  private function get_ip(){
    if(empty($this->id_)) return false;

    $database = new connection;
    $connection = $database->connect(self::GUEST);
    $search_stmt = $connection->stmt_init();

    // Inserting the new geolocation data

    if(!$search_stmt->prepare("SELECT ip FROM registry WHERE id = ?"))
      self::error($connection->error);

    $search_stmt->bind_param('i', $this->id_);

    if(!$search_stmt->execute()) self::error($connection->error);

    $search_stmt->bind_result($this->ip_);

    if(empty($search_stmt->fetch())) self::error('User not found');

    $search_stmt->close();
    $connection->close();

    return true;
  }
  /**
   * @brief Obtaining the decrypted user's id
   * 
   * @return bool `false` if there is an error while getting the binary values
   */
  private function parse(){
    $info_data = \parse_ini_file($_SERVER['DOCUMENT_ROOT'].'/php_config.ini');
    if($info_data === false) return false;

    $key    = \hex2bin($info_data['enc_key']);
    $vector = \hex2bin($info_data['enc_vector']);

    if($key === false || $vector === false) return false;

    $result = encryptor::decrypt(\hex2bin($_POST['user_id']), $key, $vector);

    $this->id_ = $result->text;

    return !$result->error;
  }
  /**
   * @brief Updating current user information
   */
  private function screen_update(){
    if(empty($_POST['update_screen']) || empty($_POST['color_depth'])
    || empty($_POST['inner_width']) || empty($_POST['inner_height']) 
    || empty($_POST['height']) || empty($_POST['width']))
      self::error('Non conformant form to update screen');

    // Obtaining screen values
    $color_depth = strings::clean_integer($_POST['color_depth']);
    $inner_height = strings::clean_integer($_POST['inner_height']);
    $inner_width = strings::clean_integer($_POST['inner_width']);
    $height = strings::clean_integer($_POST['height']);
    $width = strings::clean_integer($_POST['width']);

    // Creates a new connection
    $database = new Connection;
    // Describes the type of connection
    $connection = $database->connect(self::GUEST);
    // Creates a MySQLi statement
    $user_stmt = $connection->stmt_init();

    // Updating user's screen properties

    if(!$user_stmt->prepare("INSERT INTO screen (`user_id`, height, width, inner_height,
    inner_width, color_depth) VALUES (?, ?, ?, ?, ?, ?)"))
      self::error($connection->error);

    $user_stmt->bind_param('iiiiii', $this->id_, $height, $width, $inner_height,
                            $inner_width, $color_depth);
    if(!$user_stmt->execute()) self::error($connection->error);
    $user_stmt->close();

    error_handler::print_messages(true);
  }
  /**
   * @brief Inserting new user
   */
  private function user_new(){
    if(empty($_POST['new_user']) || empty($_POST['language'])
    || empty($_POST['time_in']) || empty($_POST['timezone'])){
      self::error('Non conforming form for new user');
    }

    // Obatining time values
    $time_in = strings::clean_integer(\substr($_POST['time_in'], 0, 10));
    $timezone = strings::sanitize_string($_POST['timezone']);
    $language = strings::sanitize_string($_POST['language']);

    // Creates a new connection
    $database = new Connection;
    // Describes the type of connection
    $connection = $database->connect(self::GUEST);
    // Creates a MySQLi statement
    $user_stmt = $connection->stmt_init();

    // Updating missing value of current user

    if(!$user_stmt->prepare("UPDATE registry SET time_in = ?, time_out = ?, timezone = ?,
    `language` = ? WHERE id = ?"))
      self::error($connection->error);

    $user_stmt->bind_param('iissi', $time_in, $time_in, $timezone, $language, $this->id_);
    if(!$user_stmt->execute()) self::error($connection->error);
    $user_stmt->close();

    error_handler::print_messages(true);
  }
  /**
   * @brief Updating current user information
   */
  private function user_update(){
    if(empty($_POST['update_user']) || empty($_POST['time_out']))
      self::error('Non conformant form to update user');

    // Cleaning time value
    $time_out = strings::clean_integer(\substr($_POST['time_out'], 0, 10));

    // Creates a new connection
    $database = new Connection;
    // Describes the type of connection
    $connection = $database->connect(self::GUEST);
    // Creates a MySQLi statement
    $user_stmt = $connection->stmt_init();

    // Updating user's time out

    if(!$user_stmt->prepare("UPDATE registry SET time_out = ? WHERE id = ?"))
      self::error($connection->error);

    $user_stmt->bind_param('ii', $time_out, $this->id_);
    if(!$user_stmt->execute()) self::error($connection->error);
    $user_stmt->close();

    error_handler::print_messages(true);
  }
}

$dynamic = new analytics;

?>
<?php

namespace code\app;

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
  private static $id_ = 0;
  private static $encrypted_id_ = null;

  private const GUEST = 'Z3Vlc3Q=';

  /**
   * @brief Finds which browser is the client using
   * 
   * @param string $user_agent User agent string
   * 
   * @return string Name and version of the browser
   */
  public static function find_browser(string &$user_agent){
    if(\preg_match_all('/(Firefox\/([0-9\.]+))|(Seamonkey\/([0-9\.]+))|(Chrome\/([0-9\.]+))|(Chromium\/([0-9\.]+))|(Safari\/([0-9\.]+))|(Opera\/([0-9\.]+)|OPR\/([0-9\.]+))|(Trident\/([0-9\.]+)|MSIE\s([0-9\.]+)|rv:([0-9\.]+))|(Edge\/([0-9\.]+))/', $user_agent, $browsers, PREG_SET_ORDER) == 0)
      self::error('No browsers found in user agent: '.strings::sanitize_string($user_agent));

    $browser_string = null;

    $browser = array_fill(0, 20, null);

    // Filling the $browser array with all found browsers
    foreach($browsers as &$bwr){
      $index = -1;
      foreach($bwr as &$element){
        if($index++ == -1) continue;
        if(empty($element)) continue;
        $browser[$index] = $element;
      }
    }

    //Firefox:
    if(!empty($browser[2]) && empty($browser[4])){
      $browser_string = "Firefox $browser[2]";
    // Seamonkey:
    }elseif(!empty($browser[4])){
      $browser_string = "Seamonkey $browser[4]";
    // Edge
    }elseif(!empty($browser[19])){
      $browser_string = "Edge $browser[19]";
    // Chrome
    }elseif(!empty($browser[6]) && empty($browser[8])){
      $browser_string = "Chrome $browser[6]";
    // Chromium
    }elseif(!empty($browser[8])){
      $browser_string = "Chromium $browser[8]";
    // Safari
    }elseif(!empty($browser[10])){
      $browser_string = "Safari $browser[10]";
    // Opera
    }elseif(!empty($browser[12])){
      $browser_string = "Opera $browser[12]";
    // Opera OPR
    }elseif(!empty($browser[13])){
      $browser_string = "Opera $browser[13]";
    // Internet explorer MSIE
    }elseif(!empty($browser[16])){
      $browser_string = "Internet explorer $browser[16]";
    // Internet explorer Trident
    }elseif(!empty($browser[14]) && !empty($browser[17])){
      $browser_string = "Internet explorer $browser[17]";
    }

    return $browser_string;

    /* Test string:
    Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/13.0 Firefox/13.0

    Mozilla/5.0 (Linux; U; Android 4.0.3; de-ch; HTC Sensation Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30

    Mozilla/5.0 (Linux; Android 4.4.2; Nexus 5 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.117 Mobile Safari/537.36 OPR/20.0.1396.72047

    Opera/9.80 (Android 2.3.3; Linux; Opera Mobi/ADR-1111101157; U; es-ES) Presto/2.9.201 Version/11.50

    Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)

    Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Mobile Safari/537.36 Edge/16.16299 
     */
  }
  /**
   * @brief Finds out if the user agent is a mobile
   * 
   * @param string $user_agent User agent string
   * 
   * @return bool `true` if is mobile
   */
  public static function find_mobile(string &$user_agent){
    return \preg_match('/(Mobi)/i', $user_agent, $browsers) > 0;
  }
  /**
   * @brief Finds out the platform used by the client
   * 
   * @param string $user_agent User agent string
   * 
   * @return string Platform name
   */
  public static function find_os(string &$user_agent){
    if(\preg_match_all('/\(([^,]+?)\)/', $user_agent, $platforms, PREG_SET_ORDER) == 0)
      self::error('No platforms found in user agent: '.strings::sanitize_string($user_agent));

    $platform_array = array();

    foreach($platforms as &$platform){
      // Removes everything that is not a platform specific keyword
      if(empty($result = \preg_replace('/(Trident\/([0-9.;\s]+))|(IEMobile\/([0-9.;\s]+))|(MSIE\s([0-9.;\s]+))|(rv:([0-9.;\s]+))|(U\;\s)|(\ben\b[;\s]*)|(\b\D{2}[-]\D{2}\b[;\s]*)/', '', $platform[1]))) continue;
      // Removing spaces and semicolons at begining and end
      $platform_array[] = \trim($result, '; \n\r\t\v\0');
    }

    return \implode('; ', $platform_array);
    /*
    Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0
    Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0
    Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36
    Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41
    Opera/9.80 (Macintosh; Intel Mac OS X; U; en) Presto/2.2.15 Version/10.00
    Opera/9.60 (Windows NT 6.0; U; en) Presto/2.1.1
    Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59
    Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1
    Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)
    Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
    Mozilla/5.0 (compatible; YandexAccessibilityBot/3.0; +http://yandex.com/bots)
     */
  }
  /**
   * @brief Finds out the renderers inside the user agent
   * 
   * @param string $user_agent User agent string
   * 
   * @return string Renderers within user agent
   */
  public static function find_renderer(string &$user_agent){
    if(\preg_match_all('/(Gecko\/([0-9\.]+))|(AppleWebKit\/([0-9\.]+))|(Opera\/([0-9\.]+)|Presto\/([0-9\.]+))|(Trident\/([0-9\.]+))|(Edge\/([0-9\.]+))|(Chrome\/([0-9\.]+))|(rv:([0-9\.]+))|(Gecko)/', $user_agent, $renderers, PREG_SET_ORDER) == 0)
      self::error('No renderers found in user agent: '.strings::sanitize_string($user_agent));

    $renderer_array = array();

    $renderer = array_fill(0, 17, null);

    // Filling the $renderer array with all found browsers
    foreach($renderers as &$bwr){
      $index = -1;
      foreach($bwr as &$element){
        if($index++ == -1) continue;
        if(empty($element)) continue;
        $renderer[$index] = $element;
      }
    }

    //Gecko:
    if(!empty($renderer[15]) && (!empty($renderer[16]) || !empty($renderer[2]))){
      $renderer_array[] = "Gecko $renderer[15]";
    }elseif(!empty($renderer[2])){
      $renderer_array[] = "Gecko $renderer[2]";
    }
    // Webkit:
    if(!empty($renderer[4])){
      $renderer_array[] = "WebKit $renderer[4]";
    }
    // Presto or blink:
    if(!empty($renderer[7])){
      $renderer_array[] = "Presto $renderer[7]";
    }elseif(!empty($renderer[6])){
      $version = \explode('.', $renderer[6]);
      if((int)$version[0] >= 15)
        $renderer_array[] = "Blink $renderer[6]";
      else
        $renderer_array[] = "Presto $renderer[6]";
    }
    // Trident:
    if(!empty($renderer[9])){
      $renderer_array[] = "Trident $renderer[9]";
    }
    // EdgeHTML or blink:
    if(!empty($renderer[11])){
      $version = \explode('.', $renderer[11]);
      if((int)$version[0] >= 79)
        $renderer_array[] = "Blink $renderer[11]";
      else
        $renderer_array[] = "EdgeHTML $renderer[11]";
    }
    // Blink:
    if(!empty($renderer[13])){
      $renderer_array[] = "Blink $renderer[13]";
    }

    return \implode(' ', $renderer_array);
  }
  /**
   * @brief Obtaining the encrypted id
   */
  public static function id(){
    return self::$encrypted_id_;
  }

  public static function registry(string $token){
    // Checking if CSRF token exist to continue
    if(!CSRF_tokenizer::verify_token($token)) return false;

    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    $referrer = isset($_SERVER['HTTP_REFERER']) 
                ? strings::clean_url($_SERVER['HTTP_REFERER']) : null;
    $language = strings::sanitize_string($_SERVER['HTTP_ACCEPT_LANGUAGE']);
    $ip_addr = self::get_ip();
    $time_in = strings::clean_integer($_SERVER['REQUEST_TIME']);

    // Creates a new connection
    $database = new connection;
    // Describes the type of connection
    $connection = $database->connect(self::GUEST);
    // Creates a MySQLi statement to insert
    $insert_stmt = $connection->stmt_init();

    // Inserting new user

    if($insert_stmt->prepare("INSERT INTO registry (ip, time_in, time_out, `language`) 
    VALUES (?, ?, ?, ?)")){

      $insert_stmt->bind_param('siis', $ip_addr, $time_in, $time_in, $language);

      if(!$insert_stmt->execute()) self::error($connection->error);

      self::$id_ = $insert_stmt->insert_id;

      $insert_stmt->reset();
    }else
      self::error($connection->error);

    // Inserting user's referrer

    if(!empty($referrer)){
      if($insert_stmt->prepare("INSERT INTO referrer (`user_id`, referrer) VALUES (?, ?)")){

        $insert_stmt->bind_param('is', self::$id_, $referrer);

        if(!$insert_stmt->execute()) self::error($connection->error);

        $insert_stmt->reset();
      }else
        self::error($connection->error);
    }

    if(!self::parse()) self::error("Unable to encrypt id");

    // Getting browser, renderer, platform and mobile values
    $browser    = self::find_browser($user_agent);
    $renderer   = self::find_renderer($user_agent);
    $mobile     = self::find_mobile($user_agent);
    $platform   = self::find_os($user_agent);
    $user_agent = strings::sanitize_string($user_agent);

    // Saving the browser, renderer, platform and mobile values
    $browser_id  = self::check_and_insert($connection, $browser, 'browsers');
    $renderer_id = self::check_and_insert($connection, $renderer, 'renderers');
    $platform_id = self::check_and_insert($connection, $platform, 'operative_systems');

    // Inserting new user_agent row
    if($insert_stmt->prepare("INSERT INTO user_agent (`user_id`, browser, renderer, os,
    mobile, details) VALUES (?, ?, ?, ?, ?, ?)")){

      $insert_stmt->bind_param('iiiiis', self::$id_, $browser_id, $renderer_id,
                               $platform_id, $mobile, $user_agent);

      if(!$insert_stmt->execute()) self::error($connection->error);

      $insert_stmt->close();
    }else
      self::error($connection->error);
  }
  /**
   * @brief Check if $description exist inside the $table
   * 
   * @param connection $connection MySQLi connection
   * @param string $description String that will be searched inside the $table
   * @param string $table Table name where $description will be looked in
   * 
   * @return integer Found or inserted ID of the table's row
   */
  private static function check_and_insert(&$connection, &$description, $table){
    // Sanitizing strings for insertion in SQL
    $table = strings::sanitize_string($table);
    $description = strings::sanitize_string($description);

    $result_id = -1;

    $statement = $connection->stmt_init();

    // Checking if exist and returns its id
    if($statement->prepare("SELECT id FROM $table WHERE `description` = ?")){
      $statement->bind_param('s', $description);

      if(!$statement->execute()) self::error($connection->error);

      $statement->bind_result($result_id);

      // If not found then it will remain a negative value
      if(empty($statement->fetch())) $result_id = -1;

      $statement->reset();
    }else
      self::error($connection->error);

    // Inserting new one if it does not exist
    if($result_id < 0){
      if($statement->prepare("INSERT INTO $table (`description`) VALUES (?)")){

        $statement->bind_param('s', $description);

        if(!$statement->execute()) self::error($connection->error);

        $result_id = $statement->insert_id;

        $statement->close();
      }else
        self::error($connection->error);
    }

    return $result_id;
  }
  /**
   * @brief Returning the error message as a json string
   */
  private static function error(string $error_string){
    error_handler::set_message(error_handler::ERROR, $error_string);
  }
  /**
   * @brief Getting the user IP address
   * 
   * @return string Ip address as a string
   */
  private static function get_ip(){
    if(!empty($_SERVER['HTTP_CLIENT_IP'])){
      //ip from shared internet
      $ip = $_SERVER['HTTP_CLIENT_IP'];
    }elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
      //ip passes from proxy
      $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    }else{
      $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
  }
  /**
   * @brief Obtaining the decrypted user's id
   * 
   * @return bool `false` if there is an error while getting the binary values
   */
  private static function parse(){
    $info_data = \parse_ini_file($_SERVER['DOCUMENT_ROOT'].'/php_config.ini');
    if($info_data === false) return false;

    $key    = \hex2bin($info_data['enc_key']);
    $vector = \hex2bin($info_data['enc_vector']);

    if($key === false || $vector === false) return false;

    $result = encryptor::encrypt(self::$id_, $key, $vector);

    self::$encrypted_id_ = \bin2hex($result->text);

    return !$result->error;
  }
}

?>

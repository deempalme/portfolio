<?php
namespace code\app;

require_once 'code/app/connection.php';
require_once 'code/app/error_handler.php';
require_once 'code/app/strings.php';
require_once 'code/security/encryptor.php';

use code\security\encryptor;

class cookies
{
  // Database connection type
  private const SECURITY = 'c2VjdXJl';
  // Contain the connection class to MySQL
  private static $connector  = null;
  // Encryption data
  private const MAX_KEYS     = 2;
  private const KEY_NAME     = 0;
  private const KEY_CONTENT  = 1;
  private static $key        = array();
  private static $ini_vector = array();

  /*
   * Creates an encrypted cookie
   * 
   * @param string $name     : cookie name
   * @param string $content  : cookie content
   * @param float $life_time : life time in days (after is elapsed this cookie will expire)
   * @param string $path     : The path on the server in which the cookie will be available on
   * @param bool $http_only  : When TRUE the cookie won't be accessible by scripting languages,
   *                           such as JavaScript
   * 
   * @return bool : TRUE if created successfully
   * 
   */
  public static function create_cookie(string $name, string $content, float $life_time,
                                       string $path = '/', bool $http_only = true){
    // Getting encryption keys
    if(is_null(self::$connector))
      if(!self::get_encryption_data())
        return false;

    // Cleaning the name of strange characters
    $cleaned_name = strings::clean_name($name);

    // Encrypting the content
    $encrypted_content = encryptor::encrypt($content, self::$key[self::KEY_CONTENT],
                                            self::$ini_vector[self::KEY_CONTENT])->result;
    // Setting the expiration time in seconds; 86400 seconds is one day;
    $expiration_time = time() + $life_time * 86400;

    // Verifying if server is using HTTPS
    $https = array_key_exists('HTTPS', $_SERVER) && $_SERVER["HTTPS"] == "on";

    // Setting the cookie
    $result = setcookie($cleaned_name, $encrypted_content, $expiration_time,
                        $path, $_SERVER['HTTP_HOST'], $https, $http_only);
    // Saving the cookie for inmediate use
    if($result) $_COOKIE[$cleaned_name] = $encrypted_content;
    // Returning the cookie status
    return $result;
  }

  /*
   * Reads an encrypted cookie
   * 
   * @param string $name  : cookie name
   * 
   * @return mixed : returns cookie content or FALSE if cookie does not exist
   * 
   */
  public static function read_cookie(string $name){
    // Getting encryption keys
    if(is_null(self::$connector))
      if(!self::get_encryption_data())
        return false;
  
    // Cleaning the name of strange characters
    $cleaned_name = strings::clean_name($name);

    if(isset($_COOKIE[$cleaned_name])){
      $encrypted_content = $_COOKIE[$cleaned_name];
      $content = encryptor::decrypt($encrypted_content, self::$key[self::KEY_CONTENT],
                                    self::$ini_vector[self::KEY_CONTENT])->result;
      return $content;
    }
    return false;
  }

  /*
   * Deletes a cookie
   * 
   * @param string $name  : cookie name
   * 
   * @return bool : FALSE if cookie does not exist
   * 
   */
  public static function delete_cookie(string $name){
    // Cleaning the name of strange characters
    $cleaned_name = strings::clean_name($name);

    // Checking if cookie exists
    if(isset($_COOKIE[$cleaned_name])){
      // Deleting the value inmediately
      unset($_COOKIE[$cleaned_name]);
      // Setting the cookie to expire in the past to delete it
      return setcookie($cleaned_name, '', time() - 3600, '/',
                       $_SERVER['HTTP_HOST'], $_SERVER['HTTPS'], true);
    }

    return false;
  }

  /*
   * Gets the encryption keys
   * 
   * @return bool : FALSE if data was NOT found or connection FAILED
   * 
   */
  private static function get_encryption_data(){
    // Connection and Query to database
    self::$connector = new connection;
    $connection = self::$connector->connect(self::SECURITY);
    $result = $connection->query("SELECT encryption_key, encryption_iv FROM cookies;");

    // Checks if there are rows returned by the query
    if($result->num_rows > 0){
      // Obtaining all the keys
      for($i = 0; $i < self::MAX_KEYS; $i++){
        // Fetches the data
        $row = $result->fetch_row();

        // Save the data into our arrays
        self::$key[$i]        = $row[0];
        self::$ini_vector[$i] = $row[1];
      }
      // Clears all stored data in SERVER memory
      $result->free();
    }else{
      // Closes the database connection
      $connection->close();
      return false;
    }
    // Closes the database connection
    $connection->close();
    return true;
  }
}
?>
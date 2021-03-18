<?php
namespace code\app;

/*
 * Visit these websites for more information:
 * 
 * MySQL conneciton: http://us3.php.net/manual/en/class.mysqli.php
 * Query preparation: http://us3.php.net/manual/en/mysqli.prepare.php
 * Parameter binding: http://us3.php.net/manual/en/mysqli-stmt.bind-param.php
 * 
 */

class connection
{
  private static $dtb_database_host   = null;
  private static $dtb_database_name   = null;
  // Read permissions
  private static $dtb_username_guest  = null;
  private static $dtb_password_guest  = null;
  // Medium permissions
  private static $dtb_username_normal = null;
  private static $dtb_password_normal = null;

  private const GUEST = 'Z3Vlc3Q=';
  private const USER  = 'dXNlcg==';

  /*
   * Database connection
   * 
   */
  public static function connect(string $type) {
    if(empty(self::$dtb_database_host))
      if(!self::parse()) return false;

    switch($type){
      case self::GUEST:
        // Connects to database with low permission settings
        $connection = new \mysqli(self::$dtb_database_host, self::$dtb_username_guest,
                                  self::$dtb_password_guest, self::$dtb_database_name);
      break;
      case self::USER:
        // Connects to database with medium permission settings
        $connection = new \mysqli(self::$dtb_database_host, self::$dtb_username_normal,
                                  self::$dtb_password_normal, self::$dtb_database_name);
      break;
      default:
        exit();
      break;
    }
    $connection->set_charset('utf8');

    return $connection;
  }

  /*
   * Cleans a SQL query string, use it if you want to insert a variable 
   * directly into the SQL query string.
   * 
   * @param string $variable : SQL query to be cleaned
   * 
   * @return string : Cleaned SQL query
   * 
   */
  public static function clean_sql(string $variable){
    // Celaning to avoid CRLF injection
    $variable = str_replace('\n', '', $variable);
    // Cleaning for XSS attacks
    $variable = htmlspecialchars($variable);
    // Cleaning for Command injection
    $variable = escapeshellarg($variable);
    // Cleaning for SQL injection
    $variable = $connection->real_escape_string($variable);

    return $variable;
  }
  /**
   * @brief Parses the php configuration file into mysql accounts
   * @return bool False if parsing is impossible
   */
  private static function parse() : bool {
    $db_info = \parse_ini_file($_SERVER['DOCUMENT_ROOT'].'/php_config.ini');
    if($db_info === false) return false;

    self::$dtb_database_host   = $db_info['server'];
    self::$dtb_database_name   = $db_info['database'];
    // Read permissions
    self::$dtb_username_guest  = $db_info['username_guest'];
    self::$dtb_password_guest  = $db_info['password_guest'];
    // Medium permissions
    self::$dtb_username_normal = $db_info['username_normal'];
    self::$dtb_password_normal = $db_info['password_normal'];
    return true;
  }
}
?>

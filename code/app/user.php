<?php
namespace code\app;

class user
{
  private const GUEST = 'Z3Vlc3Q=';

  // User types
  public const NORMAL    = 1;
  public const BLACK_OPS = 2;
  public const ALL       = 0;

  private static $type_black_ops = 'Black ops';
  private static $type_all       = 'All users';

  // disabled user
  public const ACTIVE   = 0;
  public const DISABLED = 1;
  
  public const DEFAULT_FONT_SIZE  = 16; // Pixels

  // User data
  protected static $user_id          = null;
  protected static $user_name        = null;
  protected static $user_type        = null;
  protected static $is_adult         = null;
  protected static $pausing_videos   = null;
  protected static $muting_videos    = null;
  protected static $columns          = null;
  protected static $results_per_page = null;
  protected static $last_access      = null;
  protected static $last_page        = null;
  protected static $user_font_size   = self::DEFAULT_FONT_SIZE;

  /*
   * Returns the user's ID
   * 
   * @return int : user's ID
   * 
   */
  public static function get_user_id(){
    return self::$user_id;
  }

  /*
   * Gets the user's name
   * 
   * @return string : User's name
   * 
   */
  public static function get_name(){
    return self::$user_name;
  }

  /*
   * Gets the user's saved font size in pixels
   * 
   * @return int : User's font size
   * 
   */
  public static function get_font_size(){
    return self::$user_font_size;
  }

  /*
  * Gets the user type
  * 
  * @return string : User type
  * 
  */
  public static function get_user_type(){
    return self::$user_type;
  }

  public static function get_user_type_string(){
    return self::get_type(self::$user_type);
  }

  /*
   * Gets the user type
   * 
   * @param int $user_type : user type
   *
   * @return string : User type
   * 
   */
  public static function get_type(int $user_type){
    switch($user_type){
      case self::NORMAL:
        return 'NORMAL';
      break;
      case self::BLACK_OPS:
        return strtoupper(self::$type_black_ops);
      break;
      case self::ALL:
        return strtoupper(self::$type_all);
      break;
      default:
        return null;
      break;
    }
  }

  /*
   * Verify if user type exists
   * 
   * @param int $user_type : compared user type
   *
   * @return int : cleaned User type of self::NORMAL as default
   * 
   */
  public static function verify(int $user_type){
    switch($user_type){
      case self::BLACK_OPS:
        return self::BLACK_OPS;
      break;
      case self::ALL:
        return self::ALL;
      break;
      default:
        return self::NORMAL;
      break;
    }
  }

  /*
   * Verifies if user is active
   * 
   * @return int : returns ACTIVE if active else DISABLED
   * 
   */
  public static function verify_active(int $state){
    switch($state){
      case self::DISABLED:
        return self::DISABLED;
      break;
      default:
        return self::ACTIVE;
      break;
    }
  }

  /*
  * Gets the user CSS style
  * 
  * @return html : CSS style
  * 
  */
  public static function get_style(int $user_type){
    switch($user_type){
      case self::NORMAL:
        return 'type-div green-div';
      break;
      case self::BLACK_OPS:
        return 'type-div black-div';
      break;
    }
  }

  /*
   * Use this function to check if user has permission to access certain sections
   * 
   * @param string $level : Minimum security access: 'high', 'medium', 'low'
   * 
   * @return bool : TRUE if user has permission
   * 
   */
  public static function permission_level(string $level){
    if($level == 'high'){
      if(self::$user_type == user::BLACK_OPS)
        return true;
    }elseif($level == 'medium'){
      if(self::$user_type == user::BLACK_OPS)
        return true;
    }elseif($level == 'low'){
      if(self::$user_type == user::BLACK_OPS || self::$user_type == user::NORMAL)
        return true;
    }
    return false;
  }

  /*
   * Use this function to check if user has permission to access certain $minimum_level
   * 
   * @param int $minimum_level : Minimum security access (see User types)
   * 
   * @return bool : TRUE if user has permission
   * 
   */
  public static function below_pay_grade(int $minimum_level){
    switch($minimum_level){
      case user::BLACK_OPS:
        if(self::$user_type == user::BLACK_OPS)
          return true;
        return false;
      break;
      case user::NORMAL:
        if(self::$user_type == user::NORMAL || self::$user_type == user::BLACK_OPS)
          return true;
        return false;
      break;
      default:
        return false;
      break;
    }
  }
  
  public static function certain_user_level(int $level_type){
    switch($level_type){
      case User::BLACK_OPS:
        if(self::$user_type == User::BLACK_OPS)
          return true;
        return false;
      break;
      case User::NORMAL:
        if(self::$user_type == User::NORMAL || self::$user_type == User::BLACK_OPS)
          return true;
        return false;
      break;
      default:
        return false;
      break;
    }
  }

  /*
   * Use this function to load the Home page if user has no permission to enter page
   * 
   * @param int $minimum_level : Minimum security access (see User types)
   * 
   */
  public static function home_if_not_allowed(int $minimum_level){
    if(!self::below_pay_grade($minimum_level)){
      include 'code/controller/home.php';
      exit;
    }
  }
  
  public static function only_certain_allowed(int $level_type){
    if(!self::certain_user_level($level_type)){
      include 'code/controller/home.php';
      exit;
    }
  }

  public static function go_home(){
    include 'code/controller/home.php';
    exit;
  }

  public static function go_404(){
    include 'code/controller/not_found.php';
    exit;
  }
}

?>
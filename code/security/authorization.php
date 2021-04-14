<?php
namespace code\security;

require_once 'code/app/connection.php';
require_once 'code/app/error_handler.php';
require_once 'code/app/router.php';
require_once 'code/app/strings.php';
require_once 'code/app/user.php';
require_once 'code/security/encryptor.php';
require_once 'code/security/hashing.php';

use code\app\connection;
use code\app\error_handler;
use code\app\router;
use code\app\strings;
use code\app\user;
use code\security\encryptor;
use code\security\hashing;

/*
 * Visit these websites for more information:
 * 
 * Security management: http://us3.php.net/manual/en/features.session.security.management.php
 * Init properties: http://us3.php.net/manual/en/session.configuration.php#ini.session.use-strict-mode
 * cookie parameters: http://us3.php.net/manual/en/function.session-set-cookie-params.php
 * bullet-proof sessions: http://blog.teamtreehouse.com/how-to-create-bulletproof-sessions
 * 
 */

class authorization extends user
{
  // Connection type keys
  private const GUEST    = 'Z3Vlc3Q=';
  private const USER     = 'dXNlcg==';
  private const SECURITY = 'c2VjdXJl';
  private const SUPER    = 'c3VwZXI=';
  
  private static $authorized   = false;
  private static $mistery_key  = null;
  private static $login_loaded = false;
  public static $reset_form    = false;
  public static $change_form   = false;

  // Session lifetime in seconds
  private static $time_limit = 1800;

  // Security data
  private const MAX_KEYS     = 5;
  private const KEY_ID       = 0;
  private const KEY_TYPE     = 1;
  private const KEY_NAME     = 2;
  private const KEY_IP       = 3;
  private const KEY_AGENT    = 4;
  private static $key        = array();
  private static $ini_vector = array();
  
  /*
   * Sets the initial session configurations
   * 
   */
  private static function set_initial_properties(){
    if(!session_id()){
      ini_set('session.use_only_cookies', 1);
      ini_set('session.use_strict_mode', 1);
      ini_set('session.gc_maxlifetime', self::$time_limit);
    }
  }
  /*
   * Regenerates the actual session
   * 
   */
  private static function regenerate_session(){
    // If this session is obsolete it means there already is a new id
    if(isset($_SESSION['c2VyaW91c2x5IHN0b3Ag']) && $_SESSION['c2VyaW91c2x5IHN0b3Ag'] == true)
      return;

    // Set current session to expire in 10 seconds
    $_SESSION['c2VyaW91c2x5IHN0b3Ag'] = true;
    $_SESSION['bXVhaGFoYWhhaGFoYWhh'] = time() + 10;

    // Create new session without destroying the old one
    session_regenerate_id(false);

    // Grab current session ID and close both sessions to allow other scripts to use them
    $new_session = session_id();
    session_write_close();

    // Set session ID to the new one, and start it back up again
    session_id($new_session);
    // This is to expand the session lifetime
    // Defining the server name
    $domain = $_SERVER['HTTP_HOST'];
    // Defining if there is a secure connection
    $secure = isset($_SERVER['HTTPS']);
    // Setting the session
    session_set_cookie_params(self::$time_limit, '/', $domain, $secure, true);
    // Starting the session
    session_start();

    // Now we unset the obsolete and expiration values for the session we want to keep
    unset($_SESSION['c2VyaW91c2x5IHN0b3Ag']);
    unset($_SESSION['bXVhaGFoYWhhaGFoYWhh']);
  }

  /*
   * Ćhecks if the sesssion has not expired yet
   * 
   */
  private static function validate_session(){
    if(isset($_SESSION['c2VyaW91c2x5IHN0b3Ag']) && !isset($_SESSION['bXVhaGFoYWhhaGFoYWhh']))
      return false;

    if(isset($_SESSION['bXVhaGFoYWhhaGFoYWhh']) && $_SESSION['bXVhaGFoYWhhaGFoYWhh'] < time())
      return false;

    return true;
  }

  /*
   * Obtains the first two sections of the user's IP address
   * 
   */
  private static function obtain_ip(){
    // Obtaining the user ip address
    $ip_address = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ?
                        $_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR'];
    // Separating all sections
    $imploded_ip = explode('.', $ip_address);
    // Getting only the country and internet service provider
    return $imploded_ip[0].'.'.$imploded_ip[1];
  }

  /*
   * Prevent hackers to duplicate this session
   * 
   */
  private static function prevent_hijacking(){
    if(!isset($_SESSION['bm93IEkgZGlkIHR3aWNl'])
    || !isset($_SESSION['eW91IHNob3VsZCBzdG9w'])
    || !isset($_SESSION['SSBnb3QgeW91IGJpdGNo'])
    || !isset($_SESSION['bm90IHlvdSBhZ2FpbiAg'])
    || !isset($_SESSION['Z290IG1pbGsuLi4gICAg']))
      return false;
    // Getting the IP address
    $ip_address = self::obtain_ip();
    // Decrypting the IP address stored in the session
    $session_ip = encryptor::decrypt($_SESSION['bm93IEkgZGlkIHR3aWNl'],
                                     self::$key[self::KEY_IP],
                                     self::$ini_vector[self::KEY_IP]);
    // Decrypting the USER AGENT stored in the session
    $session_agent = encryptor::decrypt($_SESSION['eW91IHNob3VsZCBzdG9w'],
                                        self::$key[self::KEY_AGENT],
                                        self::$ini_vector[self::KEY_AGENT]);
    // Comparing if both IPs are identical
    if($session_ip != $ip_address)
      return false;
    // Comparing if both User Agent match
    if($session_agent != $_SERVER['HTTP_USER_AGENT']
       && !(strpos($session_agent, 'Trident') !== false
            && strpos($_SERVER['HTTP_USER_AGENT'], 'Trident') !== false))
      return false;

    return true;
  }

  /*
   * Collects the encryption keys for Sessions
   * 
   */
  private static function colect_secure_data(){
    // Connection and Query to database
    $secure_data = connection::connect(self::SECURITY);
    $result = $secure_data->query("SELECT encryption_key, encryption_iv FROM sessions");

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
    }
    // Closes the database connection
    $secure_data->close();
  }

  /*
   * Loads the login page
   * 
   */
  private static function load_login(){
    if(!self::$login_loaded){
      self::$login_loaded = true;
      require_once router::find('/login');
    }
  }

  /*
   * Returns if is an authorized access
   * 
   * @return bool : TRUE if access was granted
   *
   */
  public static function authorized(){
    return self::$authorized;
  }

  /**
   * Checks if username and passwords coincide with a database's registry
   * 
   * @param string $user_name : user's mail
   * @param string $password : user's password
   * 
   * @returns bool : TRUE if user's mail and passwordd exist in user_login database
   * 
   */
  private static function validate_user(string $user_name, string $password){
    $user_name = strings::clean_email($user_name);

    // Obtains the user login data
    $connection = connection::connect(self::GUEST);

    if(!($statement = $connection->prepare("SELECT ul.user_id, ul.password_hash 
    FROM user_login ul LEFT JOIN users u ON ul.user_id = u.id WHERE ul.user_name = ? 
    AND ul.disabled != 1"))){
      error_handler::set_message(error_handler::ERROR, 'Error creating user founding ST');
      return false;
    }

    $statement->bind_param("s", $user_name);

    if(!$statement->execute()){
      error_handler::set_message(error_handler::ERROR, 'Error executing user founding ST');
      return false;
    }

    $statement->bind_result($user_id, $returned_password);

    // Checks if the user was found
    if(!($fetching = $statement->fetch())){
      error_handler::set_message(error_handler::ERROR, 'user not found');
      return false;
    }

    $returned_password = is_null($returned_password) ? '' : $returned_password;
    // Checks if the passwords are equeal
    if(!hashing::verify($password, $returned_password)){
      error_handler::set_message(error_handler::ERROR, 'Wrong password or user name. Please try again.');
      return false;
    }
    // Gets extra user info
    $statement->reset();

    if(!($statement->prepare("SELECT type, adult, pause_videos, mute_videos, columns, 
    results_per_page, last_access, last_page FROM users WHERE id = ? AND disabled != 1"))){
      error_handler::set_message(error_handler::ERROR, 'Error in SQL statements');
      return false;
    }

    $statement->bind_param("i", $user_id);

    if(!$statement->execute()){
      error_handler::set_message(error_handler::ERROR, 'Error executing first statement');
      return false;
    }

    $statement->bind_result($user_type, $user_adult, $user_pause_videos, $user_muted_videos,
                            $user_columns, $user_results_per_page, $user_last_access,
                            $user_last_page);

    // Checks if the user was found
    if(!($fetching = $statement->fetch())){
      $statement->close();
      $connection->close();
      error_handler::set_message(error_handler::ERROR, 'user not found');
      return false;
    }

    // Cleaning database resources
    $statement->close();
    $connection->close();

    // User data
    self::$user_id = $user_id;
    self::$user_name = $user_name;
    self::$user_type = $user_type;
    self::$is_adult = $user_adult;
    self::$pausing_videos = $user_pause_videos;
    self::$muting_videos = $user_muted_videos;
    self::$columns = $user_columns;
    self::$results_per_page = $user_results_per_page;
    self::$last_access = $user_last_access;
    self::$last_page = $user_last_page;

    return true;
  }

  /*
   * Validates that the session is correct
   * 
   * @param string $user_name : user email
   * @param int $user_type : user type
   * @param int $user_id : user_id
   * 
   * @return bool : TRUE if the arguments exists users database
   *
   */
  private static function validate_data(string $user_name, int $user_type, int $user_id){
    // Cleannig the user name
    $user_name = strings::clean_email($user_name);

    if(is_numeric($user_type) && is_numeric($user_id)){
      // Obtains the user data
      $connection = connection::connect(self::GUEST);

      if(!($statement = $connection->prepare("SELECT type, adult, pause_videos, mute_videos, 
      columns, results_per_page, last_access, last_page FROM users 
      WHERE id = ? AND disabled != 1"))){
        error_handler::set_message(error_handler::ERROR, 'Error in SQL statements');
        return false;
      }

      $statement->bind_param('i', $user_id);

      if(!$statement->execute()){
        error_handler::set_message(error_handler::ERROR, 'Error executing first statement');
        $connection->close();
        return false;
      }

      $statement->bind_result($user_type_2, $user_adult, $user_pause_videos, $user_muted_videos,
                              $user_columns, $user_results_per_page, $user_last_access,
                              $user_last_page);

      // Fetches the found data
      $fetching = $statement->fetch();
      // Checks if the user was found
      if(!$fetching || empty($fetching)){
        $connection->close();
        return false;
      }

      // Cleaning database resources
      $statement->close();
      $connection->close();
  
      // Checking if info in SESSION variables is equal to stored in database
      if($user_name == $user_mail && $user_type == $user_type_2){        
        // User data
        self::$user_id = $user_id;
        self::$user_name = $user_name;
        self::$user_type = $user_type_2;
        self::$is_adult = $user_adult;
        self::$pausing_videos = $user_pause_videos;
        self::$muting_videos = $user_muted_videos;
        self::$columns = $user_columns;
        self::$results_per_page = $user_results_per_page;
        self::$last_access = $user_last_access;
        self::$last_page = $user_last_page;
        return true;
      }
    }else
      return false;

    return false;
  }

  /*
   * Authorizing session
   * 
   * @param bool $redirect : indicates if the page should load the "Login" page if the
   *                         authorization fails.
   * 
   * @return bool : TRUE if authorization is granted
   * 
   */
  public static function authorize(bool $redirect = true){
    if(!self::$authorized){
      self::set_initial_properties();
      // Setting the session name
      session_name('visualizer-session');
      session_start();

      if(!isset($_SESSION['SSBnb3QgeW91IGJpdGNo']) || empty($_SESSION['SSBnb3QgeW91IGJpdGNo']) ||
        !isset($_SESSION['bm90IHlvdSBhZ2FpbiAg']) || empty($_SESSION['bm90IHlvdSBhZ2FpbiAg']) ||
        !isset($_SESSION['Z290IG1pbGsuLi4gICAg']) || empty($_SESSION['Z290IG1pbGsuLi4gICAg']) ){
        self::$authorized = false;
    
        if($redirect) self::load_login();
        return false;
      }

      // Sets the connection for the Language Class
      Language::set_connection();

      // Obtaining the encryption keys
      self::colect_secure_data();

      $user_name = encryptor::decrypt($_SESSION['Z290IG1pbGsuLi4gICAg'],
                                      self::$key[self::KEY_NAME],
                                      self::$ini_vector[self::KEY_NAME])
                                      ->result;
      $user_type = encryptor::decrypt($_SESSION['bm90IHlvdSBhZ2FpbiAg'],
                                      self::$key[self::KEY_TYPE],
                                      self::$ini_vector[self::KEY_TYPE])
                                      ->result;
      $user_id   = encryptor::decrypt($_SESSION['SSBnb3QgeW91IGJpdGNo'],
                                      self::$key[self::KEY_ID],
                                      self::$ini_vector[self::KEY_ID])
                                      ->result;

      // Make sure the session hasn't expired, and destroy it if it has
      if(self::validate_session() && self::validate_data($user_name, $user_type, $user_id)){
        // Check to see if the session is new or a hijacking attempt
        if(!self::prevent_hijacking()){
          self::regenerate_session();
          self::$authorized = true;
          return true;
        // Give a 5% chance of the session id changing on any request
        }elseif(rand(1, 100) <= 5){
          self::regenerate_session();
          self::$authorized = true;
          return true;
        }
      }else{
        $_SESSION = array();
        session_destroy();
        session_start();
      }
      self::$authorized = false;
      if($redirect) self::load_login();
      return false;
    }
    return true;
  }

  /*
   * Login system
   * 
   */
  public static function log_in(){
    if(self::validate_user($_POST['username'], $_POST['password'])){
      // Setting session's cookie security
      self::set_initial_properties();
      // Setting the session name
      session_name('visualizer-session');
      // Defining the server name
      $domain = $_SERVER['HTTP_HOST'];
      // Defining if there is a secure connection
      $secure = isset($_SERVER['HTTPS']);
      // Setting the session
      session_set_cookie_params(self::$time_limit, '/', $domain, $secure, true);
      // Starting the php session system
      session_start();

      // Getting the ip address data
      $ip_address = self::obtain_ip();

      // Obtaining the encryption keys
      self::colect_secure_data();

      // Erases any previous stored data in the session
      $_SESSION = array();
      // Session user id:
      $_SESSION['SSBnb3QgeW91IGJpdGNo'] = encryptor::encrypt(self::$user_id,
                                                             self::$key[self::KEY_ID],
                                                             self::$ini_vector[self::KEY_ID])
                                                             ->result;
      // Session user type
      $_SESSION['bm90IHlvdSBhZ2FpbiAg'] = encryptor::encrypt(self::$user_type,
                                                             self::$key[self::KEY_TYPE],
                                                             self::$ini_vector[self::KEY_TYPE])
                                                             ->result;
      // Session user name
      $_SESSION['Z290IG1pbGsuLi4gICAg'] = encryptor::encrypt(self::$user_mail,
                                                             self::$key[self::KEY_NAME],
                                                             self::$ini_vector[self::KEY_NAME])
                                                             ->result;
      // User IP address
      $_SESSION['bm93IEkgZGlkIHR3aWNl'] = encryptor::encrypt($ip_address,
                                                             self::$key[self::KEY_IP],
                                                             self::$ini_vector[self::KEY_IP])
                                                             ->result;
      // User browser info
      $_SESSION['eW91IHNob3VsZCBzdG9w'] = encryptor::encrypt($_SERVER['HTTP_USER_AGENT'],
                                                             self::$key[self::KEY_AGENT],
                                                             self::$ini_vector[self::KEY_AGENT])
                                                             ->result;
      // Verifying if the previous page was 'Login'
      $return_path = router::find($_POST['page']);
      $prefix = $secure ? 'https://' : 'http://';
      // If is then it will redirect to 'Home'
      $return_path = ($return_path == 'code/controller/login.php') ?
        $prefix.$_SERVER['HTTP_HOST'] : 
        $prefix.$_SERVER['HTTP_HOST'].$_POST['page'];
      // Redirecting
      header('Location: '.$return_path);
      exit;

    }else{
      return strings::clean_string($_POST['username']);
    }
  }

  /*
   * Logout system
   * 
   */
  public static function log_out(){
    if(!session_id()){
      self::set_initial_properties();
      // Setting the session name
      session_name('visualizer-session');
      // Starts the session manager
      session_start();
    }
    if(session_status() == PHP_SESSION_ACTIVE){
      // Erases any previous stored data in the session
      $_SESSION = array();
      // Getting the session params
      $params = session_get_cookie_params();
      // Setting the session cookie to live -42000 seconds
      setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'], $params['secure'], $params['httponly']);
      // Destroying session and session data
      session_destroy();
    }
  }

  /*
   * Returns the mistery key to reset password
   * 
   * @return string : mistery key
   * 
   */
  public static function mistery_key(){
    return self::$mistery_key;
  }
  
  /*
   * Returns the mistery key to reset password
   * 
   * @return string : mistery key
   * 
   */
  public static function set_mistery_key(){
    $sections = router::get_url_sections();

    if(count($sections) >= 3){
      self::$mistery_key = strings::clean_string($sections[2]);
    }

    self::$change_form = true;
    self::$reset_form = false;
  }
  
  /*
   * Update user's password by their own
   * 
   * @return bool : TRUE if old password correct, and new passwords identical
   *
   */
  public static function update_my_password(){
    // Verifying if all form's field were filled
    if(isset($_POST['old_password']) && isset($_POST['password'])
    && isset($_POST['new_password'])){

      $connection = connection::connect(self::GUEST);

      if(!($statement = $connection->prepare("SELECT ul.password_hash FROM user_login ul 
      LEFT JOIN users u ON ul.user_id = u.id WHERE ul.user_id = ? ul.disabled != 1"))){
        error_handler::set_message(error_handler::ERROR, $connection->error);
        return false;
      }

      $statement->bind_param("i", self::$user_id);

      if(!$statement->execute()){
        error_handler::set_message(error_handler::ERROR, $connection->error);
        return false;
      }

      $statement->bind_result($user_password);

      // Checks if the user was found
      if(!$statement->fetch()){
        // This is to show the reset password's form
        error_handler::set_message(error_handler::ERROR, 'user not found');
        return false;
      }

      // Cleaning database resources
      $statement->close();
      $connection->close();
      unset($connection);
      unset($statement);

      $user_password = is_null($user_password) ? '' : $user_password;

      // Verifies if current password correct and passwords are equal
      $old_password = $_POST['old_password'];
      $verified = hashing::verify($old_password, $user_password);

      if(!$verified || $_POST['password'] == '' || $_POST['password'] != $_POST['new_password']){
        // This is to show the reset password's form
        if(!$verified){
          error_handler::set_message(error_handler::ERROR, 'password is incorrect');
        }else{
          error_handler::set_message(error_handler::ERROR, 'passwords not identical');
        }
        return false;
      }

      // Hashing the new password
      $new_password = hashing::hash($_POST['password']);

      //changes and stores old password, and changes updating date
      $connection = connection::connect(self::USER);
      if(!($statement = $connection->prepare("UPDATE user_login ul SET ul.password_hash = ?, ul.old_password_hash = ? WHERE ul.user_id = ? AND ul.disabled != 1"))){
        error_handler::set_message(error_handler::ERROR, $connection->error);
        return false;
      }

      $statement->bind_param("ssi", $new_password, $user_password, self::$user_id);

      if(!$statement->execute()){
        // This is to show the reset password's form
        error_handler::set_message(error_handler::ERROR, 'user not found');
        return false;
      }

      // Cleaning database resources
      $statement->close();
      $connection->close();
      return true;
    }
    return false;
  }
}

// Autorizing user
authorization::authorize();
?>
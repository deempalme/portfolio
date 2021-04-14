<?php
namespace code\security;

/*
 * Visit these websites for more information:
 * 
 * Hashing: http://php.net/manual/en/function.password-hash.php
 * Verifying: http://php.net/manual/en/function.password-verify.php
 * 
 */

class hashing
{
  private static $options = array(
    'memory_cost' => PASSWORD_ARGON2_DEFAULT_MEMORY_COST,
    'time_cost' => 6 /*PASSWORD_ARGON2_DEFAULT_TIME_COST*/,
    'threads' => PASSWORD_ARGON2_DEFAULT_THREADS
  );
  /*
   * Hashes the input $text using salt
   * 
   * @param string $text Input text to hash
   * 
   * @return The hashed $text or FALSE in case of failure
   * 
   */
  public static function hash(string $text){
    return password_hash($text, PASSWORD_ARGON2I, self::$options);
  }

  /*
   * Compares if an unhashed $text coincides with the $hashed string
   * 
   * @param string $text   Input text to compare
   * @param string $hashed Hashed text to compare with
   * 
   * @return TRUE if both strings are equal or FALSE if not
   * 
   */
  public static function verify(string $text, string $hashed){
    return password_verify($text, $hashed);
  }
}
?>
<?php
namespace code\security;

require_once 'code/app/definitions.php';
require_once 'code/security/encryptor.php';

class CSRF_tokenizer
{
  // folder where the tokens will be saved (relative to root folder)
  private const CSFR_FOLDER = 'storage/tokens/';
  private const SECONDS_IN_DAY = 86400;
  /*
   * Creates a random CSRF token and saves it in the filesystem
   * 
   * @returns string : returns the random token or false if error
   * 
   */
  public static function write_token(){
    // Creates a random encrypted string
    $random = encryptor::random();
    $random = urlencode($random);

    // Starts the file writer using $random as name
    if(($file = fopen(filesystem(self::CSFR_FOLDER.$random), 'w')) === false) return false;

    // Writes the actual time inside the file
    if(fwrite($file, time()) === false) return false;

    // Closes the opened file
    fclose($file);
    return $random;
  }

  /*
   * Verifies if the CSRF token is valid
   * 
   * @returns bool : returns TRUE if is valid or FALSE if is not, or an error happened
   * 
   */
  public static function verify_token(string $token){
    $path = filesystem(self::CSFR_FOLDER.$token);
    // Cheking if file exists
    if(!file_exists($path)) return false;

    // Opening the file
    if(($file = fopen($path, 'r')) === false) return false;
    
    // Reads the content (time when the file was created)
    if(($time = fread($file, filesize($path))) === false) return false;

    // Gets the current time in seconds
    $current_time = time();
    // Calculates the difference betwwen current and creation time
    $time_differential = $current_time - $time;
    // Checks if the file creation time is bigger than a day
    if($time_differential >= self::SECONDS_IN_DAY) return false;
    // Closes the opened file
    fclose($file);
    return true;
  }

  /*
   * Deletes the file containing the CSFR token (use this to free storage memory)
   * 
   * @param string $token : string containing the CSFR token
   * 
   * @returns bool : returns TRUE if file was found and deleted.
   * 
   */
  public static function destroy_token(string $token){
    $path = filesystem(self::CSFR_FOLDER.$token);
    // Cheking if file exists
    if(!file_exists($path)) return false;

    if(!unlink($path)) return false;

    return true;
  }
}
?>
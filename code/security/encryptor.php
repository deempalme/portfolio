<?php
namespace code\security;

/*
 * Visit these websites for more information:
 * 
 * Encrypt: https://secure.php.net/manual/en/function.openssl-encrypt.php
 * Decrypt: https://secure.php.net/openssl_decrypt
 * 
 */

class encryptor_data{
  public $text       = null;
  public $key        = null;
  public $ini_vector = null;
  public $error      = false;
}

class encryptor
{
  private static $cipher     = 'AES-256-CBC';
  private static $key_length = 32;
  private static $encrypted  = false;

  public static $text        = null;
  public static $key         = null;
  public static $ini_vector  = null;
  public static $error       = false;

  /**
   * @brief Encrypts the data contained in $text using the $key and $initialization_vector
   * 
   * @param string $text Input text to encrypt
   * @param string $key  Encryption key
   * @param string $initialization_vector Initialization vector
   * 
   * @return encryptor_data Encrypted $text, used $key, $initialization_vector, and $error
   * 
   * @error return->error would be true if $key or $initialization_vector have not the
   *        appropiated length
   */
  public static function encrypt($text, string $key = null,
                                 string $initialization_vector = null){
    $result = new encryptor_data;
    if(empty((string)$text))
      return $result;

    // Calculating the initialization vector length:
    $iv_length = openssl_cipher_iv_length(self::$cipher);

    // Cheking if $initialization_vector is empty
    if(empty($initialization_vector)){
      // Generating the initilaization vector:
      $result->ini_vector = self::$ini_vector = openssl_random_pseudo_bytes($iv_length);
    }else{
      // Cheking if length of key is bigger than the allowed
      if(strlen($initialization_vector) > $iv_length)
        // Converting key from hexadecimal to binary
        $initialization_vector = hex2bin($initialization_vector);
      // Copying the value of initialization vector:
      $result->ini_vector = self::$ini_vector = $initialization_vector;
    }

    // Cheking if the $initialization_vector differs from the correct length
    self::$error = strlen(self::$ini_vector) != $iv_length;
    if(self::$error)
      // Generating the initialization vector again because the length was not right:
      $result->ini_vector = self::$ini_vector = openssl_random_pseudo_bytes($iv_length);

    // Checking  if $key is empty
    if(empty($key)){
      // Generating the key:
      $result->key = self::$key = openssl_random_pseudo_bytes(self::$key_length);
    }else{
      // Cheking if length of key is bigger than the allowed
      if(strlen($key) > self::$key_length)
      // Converting key from hexadecimal to binary
      $key = hex2bin($key);
      // Copying the key value:
      $result->key = self::$key = $key;
    }

    // Cheking if $key differs from the correct length
    $key_differs = strlen(self::$key) != self::$key_length;
    self::$error = self::$error || $key_differs;
    if($key_differs)
      // Generating the key again because the length was not right:
      $result->key = self::$key = openssl_random_pseudo_bytes(self::$key_length);
    
    // Encrypting:
    $result->text = self::$text = openssl_encrypt($text, self::$cipher, self::$key,
                                                  0, self::$ini_vector);

    self::$encrypted = true;
    return $result;
  }

  /**
   * @brief Decrypts the data contained in $text using the $key and $initialization_vector
   * 
   * @param string $text Encrypted $text to decrypt
   * @param string $key  Encryption key used to encrypt
   * @param string $initialization_vector Initialization vector used to encrypt
   * 
   * @return encryptor_data Decrypted $text, used $key, $initialization_vector, and $error
   * 
   * @error return->error would be true if $key or $initialization_vector have not the
   *        appropiated length
   */
  public static function decrypt($encrypted_text, string $key,
                                 string $initialization_vector){
    $result = new encryptor_data;
    if(empty((string)$encrypted_text))
      return $result;

    // Cheking if length of key is bigger than the allowed
    if(strlen($key) > self::$key_length)
      // Converting key from hexadecimal to binary
      $key = hex2bin($key);
    // Calculating the initialization vector length:
    $iv_length = openssl_cipher_iv_length(self::$cipher);
    // Cheking if length of initialization vector is bigger than the allowed
    if(strlen($initialization_vector) > $iv_length)
      // Converting IV from hexadecimal to binary
      $initialization_vector = hex2bin($initialization_vector);
    // Cheking if the $initialization_vector differs from the correct length
    self::$error = strlen($initialization_vector) != $iv_length;

    // Copying the value of initialization vector:
    $result->ini_vector = self::$ini_vector = $initialization_vector;

    // Cheking if $key differs from the correct length
    $key_differs = strlen($key) != self::$key_length;
    self::$error = self::$error || $key_differs;

    // Copying the key value:
    $result->key = self::$key = $key;
    // Encrypting:
    $result->text = self::$text = openssl_decrypt($encrypted_text, self::$cipher,
                                                  $key, 0, self::$ini_vector);
    self::$encrypted = false;
    return $result;
  }

  /**
   * @brief Generates a random encrypted binary string
   * 
   * @return binary string : Random encrypted text
   */
  public static function random(){
    // Calculating the initialization vector length:
    $iv_length = openssl_cipher_iv_length(self::$cipher);
    // Generating the initilaization vector:
    $ini_vector = openssl_random_pseudo_bytes($iv_length);

    // Generating the key:
    $key = openssl_random_pseudo_bytes(self::$key_length);
    // Generating a random value:
    $random = openssl_random_pseudo_bytes(self::$key_length);
    // Encrypting:
    return openssl_encrypt($random, self::$cipher, $key, 0, $ini_vector);
  }

  /**
   * @brief Generates a random encrypted string
   * 
   * @return string : Random encrypted text
   */
  public static function random_string(){
    // Encrypting:
    return bin2hex(self::random());
  }

  /**
   * @brief Generates a random encrypted binary string
   * 
   * @return binary string Random encrypted text (you must convert it to string)
   */
  public static function random_key(int $length){
    // Generating random base64 encoded string of length = $length:
    return openssl_random_pseudo_bytes($length);
  }

  /**
   * @brief Generates a random encrypted string
   * 
   * @return string Random encrypted text
   */
  public static function random_string_key(int $length){
    // Generating random base64 encoded string of length = $length:
    return bin2hex(openssl_random_pseudo_bytes($length/2));
  }

  /*
   * Prints all the values of the returned values
   * 
   */
  public static function print(){
    echo '<b>Initialization vector:</b> '.bin2hex(self::$ini_vector).' <b> - bytes:</b> '
          .strlen(self::$ini_vector).'<br/>';;
    echo '<b>Key:</b> '.bin2hex(self::$key).' <b> - bytes:</b> '
          .strlen(self::$key).'<br/>';
    echo '<b>Result:</b> ';
    if(self::$encrypted) echo bin2hex(self::$text); else echo self::$text;
    echo ' <b> - bytes:</b> '.strlen(self::$text).'<br/>';
    echo ' <b>Key\'s or Initialization vector\'s length does not correspont:</b> ';
    echo (self::$error ? 'true' : 'false').'<br/>';
  }
}
?>
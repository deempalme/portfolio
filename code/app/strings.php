<?php
namespace code\app;

require_once 'code/app/error_handler.php';

class YearMonths {
  public $year      = null;
  public $january   = null;
  public $february  = null;
  public $march     = null;
  public $april     = null;
  public $may       = null;
  public $june      = null;
  public $july      = null;
  public $august    = null;
  public $september = null;
  public $october   = null;
  public $november  = null;
  public $december  = null;
}

class strings
{
  public const KILOBYTE = 1024.0;
  public const MEGABYTE = 1048576.0;
  public const MAX_TIME_ACTIVE   = 1;
  public const MAX_TIME_DISABLED = 2;
  // Short list to replace recognizable characters
  private static $strange_chars = 'ßäöüÄÖÜáéíóúÁÉÍÓÚ';
  private static $substitutes   = 'ssaouAOUaeiouAEIOU';
  /*
   * Clears the name of non-allowed characters; Allowed characters list:
   * 
   *    ABCDEFGHIJKLMNOPQRSTUVWXYZ
   *    abcdefghijklmnopqrstuvwxyz
   *    0123456789_.-
   *
   * @return string : clean string with only allowed characters
   * 
   */
  public static function clean_name(string $name){
    $clean_name = '';
    // Splitting the $name into characters considering the string is 
    // multibyte (UTF-8 [2 bytes] or similar)
    $string_array = preg_split('//u', $name, null, PREG_SPLIT_NO_EMPTY);
    // Going through all the $name's characters
    foreach($string_array as $character){
      // Converting to ASCII number
      $char_number = ord($character);
      // Checking if the number is inside the list of allowed characters
      if($char_number >= 65 && $char_number <= 90){
        $clean_name .= $character;
      }elseif($char_number >= 97 && $char_number <= 122){
        $clean_name .= $character;
      }elseif($char_number >= 48 && $char_number <= 57){
        $clean_name .= $character;
      }elseif($char_number >= 45 && $char_number <= 46){
        $clean_name .= $character;
      }elseif($char_number == 95){
        $clean_name .= $character;
      }else{
        // Looks if character is inside the self::$strange_chars string
        if(($position = mb_strpos(self::$strange_chars, $character)) !== false){
          // if $character is ß then it will take two letters
          if($position == 0)
            $clean_name .= self::$substitutes[$position].self::$substitutes[$position + 1];
          else{
            $position /= 2;
            $clean_name .= self::$substitutes[$position + 1];
          }
        }else
          $clean_name .= '_';
      }
    }
    return $clean_name;
  }
  /*
   * Converts a Mexican date into a compatible date format for SQL
   * 
   * @return string : Formatted date; [format : YYYY-MM-DD]
   * 
   */
  public static function get_date(string $date){
    // Cheking if date has mexican format
    $date_array = explode('/', $date);
    if(count($date_array) == 3){
      if(checkdate($date_array[1], $date_array[0], $date_array[2]))
        // Returning date in this format YYYY-MM-DD
        return $date_array[2].'-'.$date_array[1].'-'.$date_array[0];
    }else{
      // Checking if date has US format
      unset($date_array);
      $date_array = explode('-', $date);
      if(count($date_array) == 3){
        if(checkdate($date_array[1], $date_array[2], $date_array[0]))
          // Returning date in this format YYYY-MM-DD
          return $date;
      }
    }
    error_handler::set_message(error_handler::ERROR, 'get_date: not a valid date: '.$date);
    return date('Y-m-d');
  }
  /**
   * @brief Converts from unix timestamp into a MySQL readable string date
   * @param timestamp UNIX timestamp
   * @return string Formated date: YYYY-MM-DD HH:MM:SS
   */
  public static function get_unix_date(int $timestamp) : string {
    return date('Y-m-d H:i:s', $timestamp);
  }

  /*
   * Converts a date into mexican format
   * 
   * @return string : Formatted date; [format : DD.MM.AAAA]
   * 
   */
  public static function get_mex_date(string $date){
    // Cheking if date has mexican format
    $date_array = explode('/', $date);
    if(count($date_array) == 3){
      if(checkdate($date_array[1], $date_array[0], $date_array[2]))
        // Returning date in this format DD.MM.AAAA
        return $date;
    }else{
      // Checking if date has US format
      unset($date_array);
      $date_array = explode('-', $date);
      if(count($date_array) == 3){
        if(checkdate($date_array[1], $date_array[2], $date_array[0]))
          // Returning date in this format DD.MM.AAAA
          return $date_array[2].'/'.$date_array[1].'/'.$date_array[0];
      }
    }
    error_handler::set_message(error_handler::ERROR, 'get_date: not a valid date: '.$date);
    return date('d/m/Y');
  }

  /*
   * Converts mexican symbols into programming readable float
   * 
   * @param string $money_amount : Mexican formatted money amount
   * 
   * @return float : Converted floating money amount
   * 
   */
  public static function get_money(string $money_amount){
    $money_amount = str_replace(' ', '', $money_amount);
    $money_amount = str_replace('$', '', $money_amount);
    $money_amount = str_replace(',', '', $money_amount);
    return $money_amount;
  }

  /*
   * Returns a Monetary number with two decimal places and mexican notation
   * 
   * @param mix $number : Input number
   * @param int $decimals : Number of decimals to display
   * @param string $symbol : Monetary symbol and prefix space if needed
   * 
   * @return string : formated mexican currency
   * 
   */
  public static function monetarize($number, int $decimals = 2, string $symbol = '$ '){
    return $symbol.number_format((float)$number, $decimals, '.', ',');
  }

  /*
   * Returns a number with two decimal places and mexican notation
   * 
   * @param mix $number : Input number
   * @param int $decimals : Number of decimals to display
   * @param string $decimal_separator : Symbol used to separate decimals from integers
   * @param string $thousand_separator : Symbol used to separate thousands
   * 
   * @return string : formated number
   * 
   */
  public static function number($number, int $decimals = 2, string $decimal_separator = ".",
                                string $thousand_separator =","){
    return number_format((float)$number, $decimals, $decimal_separator, $thousand_separator);
  }

  /*
   * Converts a decimal hour into a time string 00:00:00
   * 
   * @param float $decimal_hours : Time in hours with decimals
   * @param        bool $seconds : if TRUE then returns also seconds
   * 
   * @return string : Standard time string [00:00:00]
   * 
   */
  public static function get_time_old(float $decimal_hours, bool $seconds = false){
    $is_negative = false;

    if($decimal_hours < 0){
      $decimal_hours *= -1;
      $is_negative = true;
    }
    $hours = floor($decimal_hours);

    $time = $hours < 10 ? '0'.$hours : $hours;

    $decimal_minutes = ($decimal_hours - $hours) * 60;
    $minutes = floor($decimal_minutes);
    $second = floor(($decimal_minutes - $minutes) * 60);

    if(!$seconds && $second > 0)
      $minutes++;

    $time .= ':' . ($minutes < 10 ? '0'.$minutes : $minutes);

    if(!$seconds)
      return ($is_negative ? '-' : null).$time;

    return ($is_negative ? '-' : null).$time . ':' . ($second < 10 ? '0'.$second : $second);
  }

  /*
  * Converts standard formatted time [00:00:00] into decimal time
  * 
  * @param string standard_time : Time in standard format
  *
  * @return float : Decimal time
  * 
  */
  public static function get_decimal_time(string $standard_time) : float {
    $sections = explode(':', $standard_time);
    $time = 0.0;

    if(count($sections) > 0){
      // hours
      $time += (float)$sections[0];
      if(count($sections) > 1){
        // minutes
        $time += (float)$sections[1] / 60.0;
        if(count($sections) > 2){
          // seconds
          $decimal_seconds = (float)$sections[2];
          $seconds = floor($decimal_seconds);
          $time += $seconds / 60;

          $milliseconds = $seconds - $decimal_seconds;
          if($milliseconds > 0)
            $time += $milliseconds;
        }
      }
    }
    return $time;
  }
  /**
   * @brief Gets the time in decimal seconds (with milliseconds as decimals)
   * @return float Decimal seconds
   */
  public static function get_exact_decimal_time(string $standard_time_with_milliseconds) : float {
    $sections = explode(':', $standard_time_with_milliseconds);
    $time = 0.0;

    if(count($sections) > 0){
      // hours
      $time += (float)$sections[0] * 3600.0;
      if(count($sections) > 1){
        // minutes
        $time += (float)$sections[1] * 60.0;
        if(count($sections) > 2){
          // decimal seconds
          $time += (float)$sections[2];
        }
      }
    }
    return $time;
  }

  public static function get_time(int $seconds, bool $full = false){
    $is_negative = false;

    if($seconds < 0){
      $seconds *= -1;
      $is_negative = true;
    }

    // Changed some operations to improve performance
    // because operations realized by a %= b are equal to a = a - floor(a/b) * b
    $hours    = floor($seconds / 3600.0);
    $seconds -= $hours * 3600;
    $minutes  = floor($seconds / 60.0);

    $time = ($hours < 10 ? '0'.$hours : $hours) . ':' . ($minutes < 10 ? '0'.$minutes : $minutes);

    // Erasing this because +1 second will increase +1 minute
    //if($seconds > 0)
    //  $minutes++;

    if($full){
      $seconds -= $minutes * 60;
      $time .= ':' . ($seconds < 10 ? '0'.$seconds : $seconds);
    }

    return ($is_negative ? '-' : null).$time;
  }

  /*
   * Converts standard time format [00:00:00] into seconds
   */
  public static function get_seconds(string $standard_time){
    $sections = explode(':', $standard_time);
    $length = count($sections);
    $seconds = 0;

    if($length > 0){
      // hours
      $seconds += ((int)$sections[0]) * 3600;
      if($length > 1){
        // minutes
        $seconds += ((int)$sections[1]) * 60;
        // seconds
        if($length > 2)
          $seconds += (int)$sections[2];
      }
    }
    return $seconds;
  }
  /*
   * Gets a cleaned number
   * 
   * @param mixed $number
   * 
   * @return mixed : Cleaned number
   * 
   */
  public static function clean_number($number){
    if(is_numeric($number))
      return $number;
    elseif(is_null($number))
      return 0;
    else
      return filter_var($number, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
  }

  /*
   * Clean the input $text of malicius code
   * 
   * @param string $text Input text to convert dangerous characters
   * 
   * @return string Cleaned text without dangerous characters
   * 
   */
  public static function clean_string(string $text, bool $trim = true) : string {
    if($trim)
      return htmlentities(strip_tags(trim($text)), ENT_QUOTES | ENT_HTML5, "UTF-8");
    else
      return htmlentities(strip_tags($text), ENT_QUOTES | ENT_HTML5, "UTF-8");
  }

  public static function clean_email(string $email) : string {
    return filter_var($email, FILTER_SANITIZE_EMAIL);
  }

  public static function clean_float($float) : float {
    return filter_var($float, FILTER_SANITIZE_NUMBER_FLOAT);
  }

  public static function clean_integer($integer) : int {
    return filter_var($integer, FILTER_SANITIZE_NUMBER_INT);
  }
  /**
   * Cleans a path string from undesired malitious code
   * @param path Path's string
   * @return string Cleaned path's string
   */
  public static function clean_path(string $path) : string {
    return addslashes(strip_tags($path));
  }

  public static function clean_url($url){
    return filter_var($url, FILTER_SANITIZE_URL);
  }

  public static function html_encode($html, bool $trim = true){
    if($trim)
      return htmlentities(trim($html), ENT_QUOTES | ENT_HTML5, "UTF-8", false);
    else
      return htmlentities($html, ENT_QUOTES | ENT_HTML5, "UTF-8", false);
  }

  public static function html_decode($html){
    return html_entity_decode($html, ENT_QUOTES | ENT_HTML5, "UTF-8", false);
  }

  /*
   * Calculates the new font-size depending in the string length and maximum 
   * permissible character counting. So, the $string will fit into the same space
   * than the $maximum_length if font-size were equal to $normal_font_size.
   * 
   * @param string $string          : Text to resize
   * @param int $maximum_length     : Maximum number of characters allowed to occupy 
   *                                  the same length
   * @param float $normal_font_size : Font size to show if the $string length is less than
   *                                  the $maximum_length
   * 
   * @return float : Resized font-size if $string length is bigger than $maximum_length OR
   *                 $normal_font_size if not.
   * 
   */
  public static function calculate_font_size(string $string, int $maximum_length,
                                             float $normal_font_size){
    $length = strlen($string);
    if($length > $maximum_length){
      $resizing_factor = $maximum_length / $length;
      return number_format($normal_font_size * $resizing_factor, 2);
    }
    return $normal_font_size;
  }

  /*
   * Adjust the size of a string, if smaller then it will fill it,
   * if larger then will cut the string length
   * 
   * @param string $string : Text to adjust length
   * @param int $length    : Number of characters the string must have
   * @param string $filler : If the $string is smaller than $length then it will add
   *                         this character until is full
   * @param bool $preffix  : TRUE indicates that $filler should be placed before the string
   * 
   * @return string : $string of length equal to $length.
   * 
   */
  public static function adjust_string_length(string $string, int $length,
                                              string $filler, bool $preffix = false){
    $string_length = strlen($string);
    $filler_length = strlen($filler);

    $new_string = $string;

    if($string_length > $length)
      $new_string = substr($string, 0, $length);
    else
      while($length > $string_length){
        if(($length - $string_length) < $filler_length)
          $filler = substr($filler, 0, $length - $string_length);
        
        $new_string = $preffix ? $filler.$new_string : $new_string.$filler;
        $string_length++;
      }

    return $new_string;
  }
  
  public static function get_day_name(int $day){
    switch($day){
      case 1:
      return 'Mo';
      break;
      case 2:
      return 'Tu';
      break;
      case 3:
      return 'We';
      break;
      case 4:
      return 'Th';
      break;
      case 5:
      return 'Fr';
      break;
      case 6:
      return 'Sa';
      break;
      case 7:
      return 'Su';
      break;
    }
  }
  
  public static function get_month_name(int $month){
    switch($month){
      case 1:
      return 'January';
      break;
      case 2:
      return 'February';
      break;
      case 3:
      return 'March';
      break;
      case 4:
      return 'April';
      break;
      case 5:
      return 'May';
      break;
      case 6:
      return 'June';
      break;
      case 7:
      return 'July';
      break;
      case 8:
      return 'August';
      break;
      case 9:
      return 'September';
      break;
      case 10:
      return 'October';
      break;
      case 11:
      return 'November';
      break;
      case 12:
      return 'December';
      break;
    }
  }
  /*
   * Appends the proper ordinal indicator to a number (st, nd, rd, and th)
   * 
   * @param number $number : number without ordinal indicator
   * 
   * @returns number with ordinal indicator
   *
   */
  public static function ordinal($number){
    if(empty($number)) return '0th';

    $splitted = str_split($number);
    $last_digit = (int)end($splitted);

    if($last_digit == 1) return $number.'st';
    elseif($last_digit == 2) return $number.'nd';
    elseif($last_digit == 3) return $number.'rd';
    elseif($last_digit == 0 || $last_digit <= 9) return $number.'th';
    else return $number;
  }
  /**
   * @brief Replaces all spaces with its scaped character
   * @return string Path with scaped spaces
   */
  public static function unix_path(string &$path) : string {
    return \str_replace($path, ' ', '\\ ');
  }
}
?>
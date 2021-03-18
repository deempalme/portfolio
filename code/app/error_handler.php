<?php
namespace code\app;

class error_handler_message {
  public $type    = null;
  public $message = null;

  public function __construct(int $type, $message){
    $this->type    = $type;
    $this->message = $message;
  }
}

class error_handler
{
  // Error types
  public const OK      = 0;
  public const INFO    = 1;
  public const WARNING = 2;
  public const ERROR   = 3;

  private static $messages = array();

  /*
   * Adds a new message to the queue
   * 
   */
  public static function set_message(int $type, $message){
    if($type == self::OK || $type == self::INFO || $type == self::WARNING || $type == self::ERROR){
      $message_type = gettype($message);
      switch($message_type){
        case 'boolean':
        $message_string = $message ? 'true' : 'false';
        break;
        case 'integer':
        $message_string = (string)$message;
        break;
        case 'double':
        $message_string = (string)$message;
        break;
        case 'string':
        $message_string = $message;
        break;
        default:
        $message_string = nl2br(json_encode($message));
        break;
      }
      self::$messages[count(self::$messages)] =
          new error_handler_message($type, htmlentities(trim($message_string),
                                    ENT_QUOTES | ENT_HTML5, ini_get("utf-8"), false) );
    }
  }

  /*
   * Returns an array containing all the messages
   * 
   * @return array(array( type => message )) : Returns the type and messages
   * 
   */
  public static function get_messages(){
    return self::$messages;
  }

  /*
   * Returns HTML code containing all the added messages
   * 
   */
  public static function print_messages(bool $is_dynamic = false){
    if($is_dynamic){
      echo '{ ';
      echo ' "messages": ';
      echo json_encode(self::$messages);
      echo ' }';
    }else{
      $code = '<div class="message-handler">'.PHP_EOL;
      foreach(self::$messages as &$message){
        $type = $message->type;
        $code .= '  <div class="message-element '.self::evaluate_type($type).' black-shadow clearfix"><p>'.$message->message.'</p></div>'.PHP_EOL;
      }
      $code .= '</div>'.PHP_EOL;

      return $code;
    }
  }

  /*
   * Prints the stored self::$message with $data as a *json* variable
   *
   */
  public static function unite_data_and_message(&$data, bool $encode = true){
    echo '{ ';
    echo ' "messages": ';
    if(count(self::$messages) > 0){
      echo json_encode(self::$messages).', ';
    }else{
      echo 'null, ';
    }
    echo '"result": ';
    if($encode)
      echo json_encode($data);
    else
      echo $data;
    echo ' }';
  }

  /*
   * Returns the name as string for each respective message type
   * 
   */
  private static function evaluate_type(int $type){
    switch($type){
      case self::OK:
        return "alright green";
      break;
      case self::WARNING:
        return "warning yellow";
      break;
      case self::ERROR:
        return "error red";
      break;
      default:
        return "info blue";
      break;
    }
  }
}
?>
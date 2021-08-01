<?php
namespace code\controller;

require_once 'code/app/analytics.php';
require_once 'code/app/error_handler.php';
require_once 'code/security/CSRF_tokenizer.php';
require_once 'code/security/encryptor.php';

use code\app\analytics;
use code\app\error_handler;
use code\security\CSRF_tokenizer;

class home
{
  private $token_ = null;

  public function __construct(){
    $token = CSRF_tokenizer::write_token();
    analytics::registry($token);

    $divider = 6;
    $parts = \strlen(analytics::id())/$divider;

    for($i = 0; $i < $parts; ++$i){
      $this->token_ .= \substr(analytics::id(), $i * $divider, $divider);
      $this->token_ .= \substr($token, 0, $divider);
      $token = \substr($token, $divider);
    }
    $this->token_ .= $token.$parts;
  }
  /**
   * @brief Getting the page's title 
   * 
   * @return string page's title
   */
  public function page_title(){
    return 'Portfolio';
  }
  /**
   * @brief Obtaining the token
   * 
   * @return string Token ID
   */
  public function token(){
    return $this->token_;
  }
}

$controller = new home;

// Loading HTML content
require 'views/pages/home.php'
?>
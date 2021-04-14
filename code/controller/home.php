<?php
namespace code\controller;

require_once 'code/app/error_handler.php';
require_once 'code/app/router.php';

use code\app\error_handler;
use code\app\router;

class home
{
  private $content = array();

  private $error = false;

  public function __construct(){
    $url = router::get_url_sections();
    // Checking if url is correct
    if(!empty($url[1]) && $url[1] == 'page')
      if(!empty($url[2]) && \is_numeric($url[2]) && $url[2] >= 0)
        $this->current_page = $url[2];
  }
  /**
   * @brief Getting the page's title 
   * @return string page's title
   */
  public function page_title(){
    return 'Portfolio';
  }
}

$controller = new home;

// Loading HTML content
require 'views/pages/home.php'
?>
<?php
namespace code\app;

// Constant variables are defined in here:
require_once 'code/app/definitions.php';

class router_path {
  public $path  = null;
  public $class = null;
  public $type  = null;
}

class router
{
  private static $paths       = array();
  private static $active_page = null;

  /*
   * Adds a URL path from where to call certain Controller Class
   * 
   * @param string $path  : URL input
   * @param string $class : Controller class name to be call 
   *                        (must be located in code/controller folder and have this
   *                         file name: $class.php, where $class is the class name)
   *
   */
  public static function add_path(string $path, string $class, string $type = 'controller'){
    // Registering/modifying a new $class for this respective $path
    $i = count(self::$paths);
    self::$paths[$i] = new router_path;
    self::$paths[$i]->path  = '/'.$path;
    self::$paths[$i]->class = $class;
    self::$paths[$i]->type  = $type;
  }

  /*
   * Finds the most likely URL path and calls the Controller Class
   * 
   * @param string $path : URL input to compare
   * 
   * @returns string : The absolute path of the file where the Controller class is located
   *
   */
  public static function find(string $url){
    // Separating the URL path using "/"
    $exploded_url = explode('/', $url);
    // Get the total number of separated sections at $path
    $total_sections = count($exploded_url);

    // Saves the most likely $url's array key
    $most_likely = null;
    // Contains the total number of equals folder/file's names from the given
    // $url to an array's key in $paths
    $match_counter = 0;

    //Looking at each registered element in $paths
    foreach(self::$paths as $route){
      // Separating the saved path using "/"
      $exploded_path = explode('/', $route->path);
      // Contains the number of coincidences in this $paths' element
      $this_path_match_counter = 0;
      // Get the total number of separated sections of $paths' $value
      $total_value_sections = count($exploded_path);
      // Compares if the number of sections for the saved ($paths)
      // and entered path ($url) are equal
      $total_sections_this = ($total_sections > $total_value_sections)?
                              $total_value_sections : $total_sections;

      // Comparing every $url's section with each $route->path's section
      for($i = 1; $i < $total_sections_this; $i++){
        // Comparing if they are the same
        //echo 'k: '.$exploded_path[$i].' p: '.$exploded_url[$i].PHP_EOL;

        if($exploded_url[$i] == $exploded_path[$i]){
          // Increasing the number of matches
          $this_path_match_counter++;
        }else{
          // At the first different section this will break the for loop
          break;
        }
      }

      // Checking if the number of matches in this $key is bigger than the actual
      if($this_path_match_counter > $match_counter){
        // Saving the maximum number of matches
        $match_counter = $this_path_match_counter;
        // Saving the most provable $key
        $most_likely = $route->type.'/'.$route->class;
      }
    }

    if(empty($most_likely)){
      return 'code/controller/home.php';
    }else{
      return 'code/'.$most_likely.'.php';
    }
  }

  /*
   * Separates the URL into sections using the character "/"
   * 
   * @returns array : The url separated by the character "/"
   *
   */
  public static function get_url_sections(){
    $url = str_replace('#', '', $_SERVER['REQUEST_URI']);
    $exploded_url = explode('/', $url);
    $iterations = count($exploded_url);
    $result = array();

    $counter = 0;
    for($i = 0; $i < $iterations; $i++){
      if(!empty($exploded_url[$i])){
        $result[$counter++] = $exploded_url[$i];
      }
    }
    return $result;
  }

  /*
   * Checks if $path is equal to our path
   * 
   * @returns string : Returns a string containing a CSS class declaration for highlighting
   *
   */
  public static function active(string $page){
    return (self::$active_page == $page) ? ' active' : null;
  }

  /*
   * Sets the $page
   *
   */
  public static function set_active_page(string $page){
    self::$active_page = $page;
  }
}

?>
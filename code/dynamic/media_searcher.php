<?php
namespace code\dynamic;

require_once 'code/app/error_handler.php';
require_once 'code/app/media.php';
require_once 'code/app/strings.php';
//require_once 'code/security/authorization.php';

use code\app\error_handler;
use code\app\media;
use code\app\strings;
//use code\security\authorization;

class media_searcher
{
  private $folders_found = 0;

  public function __construct(string $folder_path){
//    if(!empty($_POST['folder_path']))
//      $this->primary_list($_POST['folder_path']);
    if(!media::connect()) return;

    $this->primary_list($folder_path);

    media::disconnect();

    echo '<p>'.\nl2br(\json_encode(media::status())).'</p>';
    echo '<p>'.\nl2br(\json_encode(media::filed_errors())).'</p>';
    echo '<p>'.\nl2br(\json_encode(media::duplicated())).'</p>';

    echo error_handler::print_messages();
  }
  /**
   * @brief Reads the main media directory
   * @param folder_path Full path towards the main directory
   */
  private function primary_list(string $folder_path){
    if(\is_dir($folder_path)){
      $directory = new \FilesystemIterator($folder_path);
      foreach($directory as $entry)
        $this->secondary_list($entry, $folder_path, !media::folder_registry($entry));
    }
  }
  /**
   * @brief Looks for folders and files inside a secondarty folder
   * @param folder Directory's name
   * @param parent Directory's path without directory's name
   */
  private function secondary_list(\SplFileInfo &$folder, string &$parent, bool $modified){
    if($folder->isDir()){
      ++$this->folders_found;

      $directory = new \FilesystemIterator($folder->getPathname());
      foreach($directory as $entry){
        if($entry->isDir()){
          if(!media::folder_registry($entry)) $this->tertiary_list($entry, $folder->getFilename());
        }elseif($modified)
          media::media_entry($entry, $folder->getFilename(), $parent);
      }
    }
  }
  /**
   * @brief Looks for files inside a tertiary folder
   * @param folder Directory's name
   * @param parent Directory's path without directory's name
   * @param granpa Parent's directory path
   */
  private function tertiary_list(\SplFileInfo &$folder, string $parent){
    if($folder->isDir()){
      ++$this->folders_found;

      $directory = new \FilesystemIterator($folder->getPathname());
      foreach($directory as $entry){
        if(!$entry->isDir())
          media::media_entry($entry, $folder->getFilename(), $parent);
      }
    }
  }
}

$dynamic = new media_searcher('media/');
?>
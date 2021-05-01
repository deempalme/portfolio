<?php

namespace code\dynamic;

class file_entry {
  public $id          = 0;
  public $path        = '';
  public $filename    = '';
  public $folder_path = '';

  public function __construct(\SplFileInfo &$file, int $id){
    $this->filename = $file->getFilename();
    $this->folder_path = $file->getPath();
    $this->path = $file->getPathname();
    $this->id = $id;
  }
}

class code_directory
{
  private $folder_list = null;


  public function __construct(){
    if(!empty($_POST['directory']))
      $this->primary_list($_POST['directory']);

    \usort($this->folder_list, 'code\dynamic\code_directory::sorting');

    echo \json_encode($this->folder_list);
  }

  public function primary_list(string &$folder_path){
    $directory = new \DirectoryIterator($folder_path);
    $id = 0;

    foreach($directory as $entry)
      if($entry->isFile()){
        $this->folder_list[] = new file_entry($entry, 0);
      }elseif($entry->isDir() && !$entry->isDot())
        $this->secondary_list($entry, ++$id);
  }

  public function secondary_list(\SplFileInfo &$folder, int $id){
    $directory = new \DirectoryIterator($folder->getPathname());
    foreach($directory as $entry)
      if($entry->isFile())
        $this->folder_list[] = new file_entry($entry, $id);
  }

  public static function sorting(file_entry &$a, file_entry &$b){
    return \strcmp($a->path, $b->path);
  }
}

$dynamic = new code_directory;

?>
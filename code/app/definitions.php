<?php
// Defining named constants:
if(!defined('DEFAULT_TITLE')) define('DEFAULT_TITLE', 'Visualizer');

$subfolders = explode('/', $_SERVER['REQUEST_URI']);
$root = null;
for($i = 1; $i < count($subfolders); $i++){
  $root .= '../';
}
unset($subfolders);

/*
 * Returns the absolute file $path
 */
function root(string $path){
  global $root;
  return $root.$path;
}

/*
 * Returns the filesystem absolute path
 * 
 */
function filesystem(string $path){
  return $_SERVER['DOCUMENT_ROOT'].'/'.$path;
}

/*
 * Returns the absolute file $path located inside template's directory
 */
function template(string $path){
  return 'views/templates/'.$path;
}

/*
 * Returns the absolute file $path located inside resource's directory
 */
function resource(string $path){
  return root('resources/'.$path);
}

/*
 * Returns the absolute file $path located inside lib's directory
 */
function lib(string $path){
  return root('lib/'.$path);
}
?>
<?php

// Adding the class file
require_once 'code/app/router.php';

use code\app\router;

// +–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––+
// |                            Adding Controller URL paths                            |
// +–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––+

// Bio
router::add_path('home', 'home');
router::add_path('', 'home');

// +–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––+
// |                       Adding Dynamic data loaders URL paths                       |
// +–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––+

// Load code view for solar system
router::add_path('bio/code', 'code_directory', 'dynamic');

// +–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––+
// |                        Checking the most likely path to go                        |
// +–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––+
require router::find($_SERVER['REQUEST_URI']);

?>

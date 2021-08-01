
![Homescreen](resources/images/home.jpg)

# Portfolio

This is the source code of deempalme's [curriculum webpage](http://ramrod.tech). Their structure is the following:

 - `code/js`: Main UI's code made in TypeScript.
   - `code/js/gl`: WebGL library wrappers.
   - `code/js/math`: Linear algebra functions to transform the 3D models.
   - `code/js/shaders`: GLSL shaders used in the WebGL context.
 - `resources/lidar`: Point cloud data (floating) in the format `XYZI`.
 - `resources/models`: 3D models and textures used in the WebGL contexts.
 - `script/js`: TypeScript's compiled code.

 ___

## 1 - Installation

### 1.1 - Apache

Installation:

```sh
sudo apt update
sudo apt install apache2
```

Allowing it throught firewall:

```sh
sudo ufw allow 'Apache'
```

#### Adding a new virtual host called **portfolio** in *your computer*:

```sh
sudo gedit /etc/hosts
```

add a new line below `127.0.0.1  localhost`:

```
127.0.1.1	 portfolio
```

adding the `ServerName` to apache configuration file:

```sh
sudo gedit /etc/apache2/apache2.conf
```

and add this line to the end:

```conf
ServerName 127.0.0.1
```

#### Creating a new directory

Create a new directory called `portfolio` and change its permissions, don't forget to change `<your_user>` for your ubuntu's login username:

```sh
mkdir portfolio
sudo chown -R <your_user>:www-data portfolio
sudo chmod -R g+s portfolio
```

#### Adding a new virtual host called **portfolio** in *apache*:

```sh
sudo gedit /etc/apache2/sites-available/portfolio.conf
```

and write this inside, change `/path/to/folder/` for your current path to _portfolio_ folder:

```conf
<VirtualHost *:80>
  ServerAdmin webmaster@localhost
  ServerName portfolio
  ServerAlias www.portfolio
  DocumentRoot /path/to/folder/portfolio
  
  <Directory /path/to/folder/portfolio>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
  </Directory>
    
  ErrorLog ${APACHE_LOG_DIR}/portfolio-error.log
  CustomLog ${APACHE_LOG_DIR}/portfolio-access.log combined
</VirtualHost>
```

enabling this new host:

```sh
sudo a2ensite portfolio
```

checking everything is alright:

```sh
sudo apache2ctl configtest
```

#### Enabling `mod_rewrite` to redirect Error pages 

```sh
sudo ln -s /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/rewrite.load
```

### 1.2 - PHP

```sh
sudo apt install php
```

Editing `php.ini` to show errors and warnings:

```sh
sudo gedit /etc/php/7.4/apache2/php.ini
```

and make sure the following variables are set this way:

```php
error_reporting = E_ALL
display_errors = On
display_startup_errors = On
```

### 1.3 - MySQL server

Install it and improve its security:

```sh
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

to change the `root` password access do the following:

```sh
sudo mysql
```

and enter this SQL entry, don't forget to change the `new-password`:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new-password';
```

to exit `mysql` just enter `exit` or `quit` in the command line.

### 1.4 - PHPMyAdmin

```sh
sudo apt-get install phpmyadmin
```

1. Select `apache2` using space bar, when it prompts to select the webserver.
2. Navigate to <kbd>ok</kbd> using Tab key and hit Enter.
3. Select <kbd>Yes</kbd> and hit Enter to configure the database for PhpMyAdmin with `dbconfig-common`.
4. In the next screen, it will ask you to set the **password** for phpmyadmin user.

and finally reseting apache server:

```sh
sudo systemctl restart apache2
```

### 1.5 - Creating the database for web analytics

You must create a new database called `ramrod_analytics` with **2 new users** that should have restricted permissions:

```sql
CREATE DATABASE ramrod_analytics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Creating the users (don't forget to change their passwords):
-- Without DELETE permission
CREATE USER 'ramrod_guest'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'your_password';
-- Only global usage permission
GRANT USAGE ON *.* TO 'ramrod_guest'@'localhost';
ALTER USER 'ramrod_guest'@'localhost' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
-- Few permissions for the ramrod_analytics database
GRANT SELECT, INSERT, UPDATE ON `ramrod\_analytics`.* TO 'ramrod_guest'@'localhost'; 

-- With DELETE permission
CREATE USER 'ramrod_normal'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'your_password';
-- Only global usage permission
GRANT USAGE ON *.* TO 'ramrod_normal'@'localhost';
ALTER USER 'ramrod_normal'@'localhost' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
-- Few permissions for the ramrod_analytics database
GRANT SELECT, INSERT, UPDATE, DELETE ON `ramrod\_analytics`.* TO 'ramrod_normal'@'localhost'; 
```

Open the database in phpMyAdmin or use the following SQL statement to open it:

```sql
USE ramrod_analytics;
```

And finally **import** the `code/app/analytics.sql` file or *copy* its contents and execute it as a SQL statement.

### 1.6 - Modifying the php_config.ini file

It is also necessary to create a `php_config.ini` file, you could use the available `php_config.ini_example` file and change its extension name from `ini_example` into `ini`. There are a few details that you must change:

```ini
#config.ini
[info]
server   = localhost
database = ramrod_analytics

[guest]
username_guest = ramrod_guest
# Change this password to match the one used with the same user in MySQL
password_guest = "your_password"

[normal]
username_normal = ramrod_normal
# Change also this password
password_normal = "your_password"

[encryption key]
# These are examples of encryption keys:
enc_key = "8358551c7fe64507beacfe45ea3f157b89458eaa69978bb1714132074ac87cc5"
enc_vector = "155369b47afd2e74735874d63d5072a7"
```

You could leave the encryption keys as they are or change them (_recommended_) using:

```php
<?php
require_once 'code/security/encryptor.php';

use code\security\encryptor;

// For enc_key you will need a 64 character length key
echo encryptor::random_string_key(64);

// Printing a new line
echo PHP_EOL;

// For enc_vector you will need a 32 character length key
echo encryptor::random_string_key(32);
?>
```

From the **encryptor** class in `code/security/encryptor.php` file.

### 1.7 - Typescript

```sh
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install -g typescript
```

Initializing npm and typescript in case `package.json` and `tsconfig.json` are **deleted**:

```sh
cd /path/to/folder/portfolio
npm init
tsc --init
```

### 1.8 - jQuery

Execute this commmand in the project's folder to install **jQuery**.
```sh
npm install --save-dev @types/jquery
npm install jquery --save
```

### 1.9 - Browserify

When typescript is compiled standalone the keyword `require()` is not standarized by all browsers and it will create an error indicating that _such word does not exist_ to fix this problem, it is necessary to install **browserify**:

```sh
npm install -g browserify
# or sudo it, if there is a permission denied problem
sudo npm install -g browserify
```

___

## 2 - Building

### 2.1 - Normal building


It will build all typescript files located inside `code/js/` and place the compiled files in `build/` folder:

```sh
tsc --build tsconfig.json
```

### 2.2 - Automatically building after saving:

Execute **run build task** (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>) from the global terminal and select `tsc: watch - tsconfig.json`. More info [here](https://code.visualstudio.com/docs/typescript/typescript-compiling).

### 2.3 - Complete missing libraries with browserify

This will re-compile the main **js** file to include all missing libraries:

```sh
browserify build/js/home.js -o script/js/home.js
```

Or execute **run build task** (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>) from the global terminal and select `browserify`.
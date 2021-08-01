
## 1 - Windows installation

### 1.1 - Installing XAMPP

You could download the installer from [**xampp** webpage](https://www.apachefriends.org/download.html).

It is recommended that you install it outside the `C:\Program Files` folder, example: `C:\xampp`.


#### Adding a new virtual host called **portfolio** in *your computer*:

Go to <kbd>Windows</kbd> > <kbd>Search</kbd> > <kbd>Run</kbd> and paste the following line:

```bash
C:\Windows\System32\drivers\etc\hosts
```

add a new line at the end and save:

```
127.0.0.1	 portfolio
```

#### Adding a new virtual host called **portfolio** in *apache*:

Open the file `httpd-vhosts.conf` located inside the folder `c:\<xampp folder location>\apache\conf\extra` and write this inside, change `/path/to/folder/` for your current path to _portfolio_ folder:

```conf
<VirtualHost *:80>
  ServerAdmin webmaster@localhost
  ServerName portfolio
  ServerAlias www.portfolio
  DocumentRoot "C:/path/to/folder/portfolio"
  
  <Directory "C:/path/to/folder/portfolio">
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
  </Directory>
    
  ErrorLog "logs/portfolio-error.log"
  CustomLog "logsportfolio-access.log" combined
</VirtualHost>
```

### 1.2 - Configuring PHP

Open the **XAMPP** control panel and go to <kbd>Apache</kbd> > <kbd>config</kbd> > <kbd>PHP (php.ini)</kbd>, An editor will be opened and you must make sure the following variables are set this way to show errors and warnings:

```php
error_reporting = E_ALL
display_errors = On
display_startup_errors = On
```

### 1.3 - Connfiguring PHPMyAdmin

Open the **XAMPP** control panel and go to <kbd>Apache</kbd> > <kbd>config</kbd> > <kbd>phpMyAdmin (config.inc.php)</kbd>, An editor will be opened and you must change the following line values, from:

```php
$cfg['Servers'][$i]['auth_type'] = 'config';
$cfg['Servers'][$i]['AllowNoPassword'] = true
```

to:

```php
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['AllowNoPassword'] = false
```

### 1.4 - MySQL server

Improve MySQL security by changing `root`'s password, by opening **XAMPP** control panel and clicking in the <kbd>shell</kbd> button:

To open mysql server:

```shell
mysql -u root -p
```

and enter this SQL entry, don't forget to change the `new-password`:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new-password';
```

to exit `mysql` just enter `exit` or `quit` in the command line.

### 1.5 - Typescript

Install node using the [official installer](https://nodejs.org/en/download/) and then, install `typescript`

```sh
npm install -g typescript
```

Initializing npm and typescript in case `package.json` and `tsconfig.json` are **deleted**:

```sh
cd /path/to/folder/portfolio
npm init
tsc --init
```

### 1.6 - jQuery

Execute this commmand in the project's folder to install **jQuery**.
```sh
npm install --save-dev @types/jquery
npm install jquery --save
```

### 1.7 - Browserify

When typescript is compiled standalone the keyword `require()` is not standarized by all browsers and it will create an error indicating that _such word does not exist_ to fix this problem, it is necessary to install **browserify**:

```sh
npm install -g browserify
```

### 1.8 - Highlight.js

```sh
npm install highlight.js
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
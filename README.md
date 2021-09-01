# [Emoncms](http://github.com/emoncms/emoncms) frontend

brief example that allows to understand the functioning of the emoncms menuv3 with its three layers, its articulation with the routing, the loading of the svg icons, the color schemes...

[LIVE DEMO](https://alexandrecuer.github.io/frontend/)

**Nota : the menuv3 uses jquery**

# to install apache2 with mod rewrite enabled and php 

## on ubuntu

assuming you store your repos in a `github` folder within your your home directory 
```
sudo apt-get install -y apache2
sudo a2enmod rewrite
sudo apt-get install -y php
sudo apt-get install -y libapache2-mod-php
cd ~/github
git clone http://github.com/alexandrecuer/frontend
```

To create a new apache alias, inject the following lines in your virtual host :

```
Alias /frontend /home/alexandrecuer/github/frontend/
<Directory /home/alexandrecuer/github/frontend/>
  Options FollowSymLinks
  AllowOverride All
  DirectoryIndex index.php
  Require all granted
</Directory> 
```
replace `alexandrecuer` by your user name.

restart apache with `sudo systemctl restart apache2`

Nota : your virtualhost config should be in `/etc/apache2/sites-available/000-default.conf`

## on windows

use http://apachelounge.com/ and install to `C:/apache24`

download php binaries from https://windows.php.net/download and install to `C:/php`

insert this in your `httpd.conf` - cf https://www.php.net/manual/fr/install.windows.apache2.php

```
LoadModule php_module "c:/php/php8apache2_4.dll"
<FilesMatch \.php$>
    SetHandler application/x-httpd-php
</FilesMatch>
# configure the path to php.ini
PHPIniDir "C:/php"
```
Still in `httpd.conf`, uncomment `LoadModule rewrite_module modules/mod_rewrite.so` to enable mod-rewrite

unzip or clone source code in `C:/Apache24/htdocs/frontend`

inject the following lines in the virtual host of your `httpd.conf`:
```
<Directory "C:/Apache24/htdocs/frontend">
  Options FollowSymLinks
  AllowOverride All
  DirectoryIndex index.php
  Require all granted
</Directory>
```
if your `httpd.conf` does not yet have any virtual host, add a complete virtualhost block :
```
<VirtualHost *:80>
  <Directory "C:/Apache24/htdocs/frontend">
    Options FollowSymLinks
    AllowOverride All
    DirectoryIndex index.php
    Require all granted
  </Directory>
</VirtualHost>
```




# [Emoncms](http://github.com/emoncms/emoncms) frontend

brief example that allows to understand the functioning of the emoncms menuv3 with its three layers, its articulation with the routing, the loading of the svg icons, the color schemes...

**Nota : the menuv3 uses jquery**

To install on an apache2 server with mod rewrite enabled and php :
```
cd /var/www/html
sudo git clone http://github.com/alexandrecuer/frontend
```
To view : `http://127.0.0.1/frontend`

![image](https://user-images.githubusercontent.com/24553739/129034837-1428029f-2d3e-4b0d-9b7d-4b7a3c823f7b.png)

# to install apache2 with mod rewrite enabled and php 

## on ubuntu

```
sudo apt-get install -y apache2
sudo a2enmod rewrite
sudo apt-get install -y php
sudo apt-get install -y libapache2-mod-php
```
## on windows

use http://apachelounge.com/ and install to C:/apache24

download php binaries from https://windows.php.net/download and install to C:/php

insert this in your httpd.conf - cf https://www.php.net/manual/fr/install.windows.apache2.php

```
LoadModule php_module "c:/php/php8apache2_4.dll"
<FilesMatch \.php$>
    SetHandler application/x-httpd-php
</FilesMatch>
# configure the path to php.ini
PHPIniDir "C:/php"
```
Still in https.conf, uncomment `LoadModule rewrite_module modules/mod_rewrite.so` to enable mod-rewrite

unzip or clone source code in C:/Apache24/htdocs/frontend, modify your virtual host  :
```
<Directory "C:/Apache24/htdocs/frontend">
  Options FollowSymLinks
  AllowOverride All
  DirectoryIndex index.php
  Require all granted
</Directory>
```



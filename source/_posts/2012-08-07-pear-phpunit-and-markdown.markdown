---
layout: post
title: "PEAR, PHPUnit and MAMP"
date: 2012-08-07 22:30
comments: true
categories: [ PHP, Unit Testing, PEAR, MAMP ]
---

### The problem I had
When I had initially installed PEAR I just used it's suggested paths and didn't 
think it would be any problem. I could install phpunit and use it from the 
command line. But when I wanted to configure NetBeans to use PHPUnit I got the 
following error:  

`Selected PHPUnit (version ?.?.?) is too old, upgrade it if possible (the 
minimum version in 3.3.0).`

After reading some posts, trying to fix it through editing all the php.ini's, 
reinstalling PHPUnit, ... I still kept on getting errors. Finally I decided to 
take the time to restart from scratch and make sure all php related stuff would 
be kept in the MAMP directories so that in the future problems like this would 
be easier to solve. I removed the old php, phpunit, pear, ... binaries from 
`/usr/local/bin` and replaced them by symlinks to the ones in the MAMP directory.

This tutorials shows how I installed PEAR and PHPUnit from scratch.

### Installing PEAR for MAMP

```
cd /Applications/MAMP/bin/php/php5.3/
curl -O http://pear.php.net/go-pear.phar
./bin/php ./go-pear.phar 
```

Now pear will suggest a file layout for you, *but it will try to put everything 
in your home directory, while most of it should be in your MAMP folder*. 
The following is the correct layout: 

```
 1. Installation base ($prefix)                   : /Applications/MAMP/bin/php5.3
 2. Temporary directory for processing            : /tmp/pear/install
 3. Temporary directory for downloads             : /tmp/pear/install
 4. Binaries directory                            : /Applications/MAMP/bin/php5.3/bin
 5. PHP code directory ($php_dir)                 : /Applications/MAMP/bin/php5.3/lib/php
 6. Documentation directory                       : /Applications/MAMP/bin/php5.3/lib/php/doc
 7. Data directory                                : /Applications/MAMP/bin/php5.3/lib/php/data
 8. User-modifiable configuration files directory : /Applications/MAMP/bin/php5.3/conf
 9. Public Web Files directory                    : /Applications/MAMP/htdocs
10. Tests directory                               : /Applications/MAMP/bin/php5.3/lib/php/tests
11. Name of configuration file                    : /Users/yourusername/.pearrc
```

Of course the `php5.3/` and `username/` could be different for you.
By setting the paths this way all PEAR packages will automatically land inside 
the standard PHP `include_path` of MAMP.

Now let's go to `/usr/local/bin` and create a symlink to the pear command in 
your MAMP directory. This is an easy way to make sure it's in you `PATH`, 
allowing you to be able to just type `pear` to use it.

```
cd /usr/local/bin
ln -s /Applications/MAMP/bin/php5.3/bin/pear
```

If you want to you can repeat this for `php`, `phpunit` and the others too.

### Installing PHPUnit
Now that we have PEAR installed installing PHPUnit is easy.
```
sudo pear channel-discover pear.phpunit.de
sudo pear install --alldeps phpunit/PHPUnit
```

Starting from PHPUnit 3.6.8 the functionality behind "phpunit --skeleton-class" 
and "phpunit --skeleton-test" is marked as deprecated and it's going to be 
removed in 3.7. So it's best to install `phpunit-skelgen` too:

```
sudo pear install phpunit/PHPUnit_SkeletonGenerator
```

Having now installed PEAR and PHPUnit properly, you should be able to easily 
configure NetBeans for use with PHPUnit.

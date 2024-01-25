[![pipeline status](https://services.pfem.clermont.inra.fr/gitlab/mama/mama-webapp/badges/dev/pipeline.svg)](https://services.pfem.clermont.inra.fr/gitlab/mama/mama-webapp/commits/dev)

# MAMA - WebApp

## Metadata

* **@authors**: <nils.paulhe@inra.fr>, <franck.giacomoni@inra.fr>
* **@date creation**: `2016-01-29`
* **@main usage**: WebApp of the **M**etaboHUB's **A**nalyses **MA**nager
* **@see**: [MAMA - REST](../mama-rest)
 
## Configuration

### Requirement:
PHP web-server (Apache / ...)

### Deploy:
* get project data `git clone ssh://git@services.pfem.clermont.inra.fr:mama/mama-webapp.git`
* edit `config/mama-webapp.json` configuration file (or create it from `config/mama-webapp.json.sample` template file ) 
 
#### Apache

Please enable rewrite rules with a `sudo a2enmod rewrite && sudo service apache2 restart`; then add this config to your `apache2.conf` file:
```
<Directory /var/www/html/mama-webapp/>
  AllowOverride All
</Directory>
```

#### Nginx

TODO

### Warning:
TODO

## Services provided

TODO

## Technical description

TODO


## Notes

TODO

## License

TODO

## Tird part code

### [Start Bootstrap](http://startbootstrap.com/) - [SB Admin 2](http://startbootstrap.com/template-overviews/sb-admin-2/)

[SB Admin 2](http://startbootstrap.com/template-overviews/sb-admin-2/) is an open source, admin dashboard template for [Bootstrap](http://getbootstrap.com/) created by [Start Bootstrap](http://startbootstrap.com/).

#### Getting Started

To use this template, choose one of the following options to get started:
* Download the latest release on Start Bootstrap
* Fork this repository on GitHub
* Install via bower using `bower install startbootstrap-sb-admin-2`

#### Bugs and Issues

Have a bug or an issue with this template? [Open a new issue](https://github.com/IronSummitMedia/startbootstrap-sb-admin-2/issues) here on GitHub or leave a comment on the [template overview page at Start Bootstrap](http://startbootstrap.com/template-overviews/sb-admin-2/).

#### Creator

Start Bootstrap was created by and is maintained by **David Miller**, Managing Parter at [Iron Summit Media Strategies](http://www.ironsummitmedia.com/).

* https://twitter.com/davidmillerskt
* https://github.com/davidtmiller

Start Bootstrap is based on the [Bootstrap](http://getbootstrap.com/) framework created by [Mark Otto](https://twitter.com/mdo) and [Jacob Thorton](https://twitter.com/fat).

#### Copyright and License

Copyright 2013-2015 Iron Summit Media Strategies, LLC. Code released under the [Apache 2.0](https://github.com/IronSummitMedia/startbootstrap-sb-admin-2/blob/gh-pages/LICENSE) license.

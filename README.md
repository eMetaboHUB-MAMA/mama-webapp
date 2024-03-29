# MAMA - WebApp

[![pipeline status](https://unh-pfem-gitlab.ara.inrae.fr/mama/mama-webapp/badges/dev/pipeline.svg)](https://unh-pfem-gitlab.ara.inrae.fr/mama/mama-webapp/commits/dev)

## Metadata

* **@authors**: <nils.paulhe@inrae.fr>, <franck.giacomoni@inrae.fr>
* **@date creation**: `2016-01-29`
* **@main usage**: WebApp of the **M**etaboHUB's **A**nalyses **MA**nager
* **@see**: [MAMA - REST](../mama-rest)

## Configuration

### Requirement

PHP web-server (Apache / ...)

### Deploy

* get project data `git clone git@services.pfem.clermont.inrae.fr:mama/mama-webapp.git`
* edit `config/mama-webapp.json` configuration file (or create it from `config/mama-webapp.json.sample` template file )
* update Lab RNSR list `sudo -u www-data php -f ./tools/update_rnsr_list.php`

### Apache configuration

Please enable rewrite rules with a `sudo a2enmod rewrite && sudo service apache2 restart`; then add this config to your `apache2.conf` file:

```html
<Directory /var/www/html/mama-webapp/>
  AllowOverride All
</Directory>
```

### Warning

NA

## Services provided

Simple GUI for the `MAMA-REST` API.

## Dev and Tests

* Build test docker image: `docker build -t metabohub/mama-webapp .`
* Run test docker image: `docker run --rm -it -v $(pwd):/var/www/html_dev/ -p 8080:80 --name mama-webapp-tests metabohub/mama-webapp`
* Update code in docker image: `docker exec -it mama-webapp-tests bash -c "cp -r /var/www/html_dev/* /var/www/html/"`

## Technical description

NA

## Notes

NA

## License

MAMA "in-house" code is provided under [MIT license](LICENSE.md).

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

* [@davidmillerskt](https://twitter.com/davidmillerskt)
* [github | davidtmiller](https://github.com/davidtmiller)

Start Bootstrap is based on the [Bootstrap](http://getbootstrap.com/) framework created by [Mark Otto](https://twitter.com/mdo) and [Jacob Thorton](https://twitter.com/fat).

#### Copyright and License

Copyright 2013-2015 Iron Summit Media Strategies, LLC. Code released under the [Apache 2.0](https://github.com/IronSummitMedia/startbootstrap-sb-admin-2/blob/gh-pages/LICENSE) license.

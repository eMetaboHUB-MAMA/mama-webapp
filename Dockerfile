FROM metabohub/mama-core

# set author
MAINTAINER Nils Paulhe <nils.paulhe@inrae.fr>

# [php] copy MAMA-REST directoy
COPY . /var/www/html/

# [other] share volume
RUN chown -R www-data:www-data /var/www/html/

# [final] restart apache2
RUN echo "service apache2 start && tail -f /var/log/apache2/*.log" >> /startup.sh &&\
    chmod +x /startup.sh

CMD ["/bin/bash", "-c", "/startup.sh"]

# [END]

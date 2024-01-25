FROM metabohub/mama-core:1.2.0

# set author
LABEL maintainer="nils.paulhe@inrae.fr"

# [php] copy MAMA-REST directoy
COPY . /var/www/html/

# [other] set correct ownership on files
RUN chown -R www-data:www-data /var/www/html/

# set workdir
WORKDIR /var/www/html/

# update clients' labs RNSR  codes
RUN php -f ./tools/update_rnsr_list.php

# remove tools from Docker image
RUN rm -rf /var/www/html/tools/*.php

# re-set correct ownership on files
RUN chown -R www-data:www-data /var/www/html/json/*.json

# [final] restart apache2
RUN echo "service apache2 start && tail -f /var/log/apache2/*.log" >> /startup.sh &&\
    chmod +x /startup.sh

CMD ["/bin/bash", "-c", "/startup.sh"]

# [END]

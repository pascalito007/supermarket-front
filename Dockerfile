FROM nginx:alpine
#COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# A partir du repertoire parent du projet, builder le projet.
# ng serve doit continuer à être utiliser en mode dev mais juste pour tester dans un context réel d'un serveur,
# il faut builder comme comme cela se fait avant d'envoyer en recette ou en prod
#  `ng build --watch --delete-output-path false`

# 2. Construire une image docker du projet
# docker build -t nginx-angular -f nginx.dockerfile .

#3. Creer une instance d'execution de l'image (contenaire)
# Mapper le répertoire dist au répertoire html de nginx qui contient les fichiers html à servir via un volume
#
# you can use $(pwd) pour les systemes unix mais Ce blog montre pour le system windows https://blog.codewithdan.com/2017/10/25/docker-volumes-and-print-working-directory-pwd/
# docker run -p 8080:80 -v $(pwd)/dist/disco:/usr/share/nginx/html nginx-angular

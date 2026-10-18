# Configuration Nginx

## Rôle du proxy

Nginx s'exécute sur le serveur, en dehors de Docker. Il reçoit les requêtes pour
`webperfs.webdesignord.fr` et `www.webperfs.webdesignord.fr` et les transmet au
conteneur via `http://127.0.0.1:3040`.

Le fichier du dépôt est [`../deploy/nginx/webperfs.webdesignord.fr.conf`](../deploy/nginx/webperfs.webdesignord.fr.conf).
C'est un **template HTTP**, non utilisé directement par nginx. Le fichier réellement
utilisé par le serveur est `/etc/nginx/conf.d/webperfs.webdesignord.fr.conf`.

`server_name` sélectionne les deux domaines. `proxy_http_version 1.1` définit la
version HTTP vers l'application. Les en-têtes `Host`, `X-Real-IP`,
`X-Forwarded-For` et `X-Forwarded-Proto` transmettent le domaine demandé,
l'adresse du client et le protocole d'origine.

## Première installation (avant le certificat)

Avant la création du certificat TLS, le DNS doit pointer vers le serveur, puis :

```bash
sudo install -o root -g root -m 644 \
  /opt/apps/web-perf-lab/deploy/nginx/webperfs.webdesignord.fr.conf \
  /etc/nginx/conf.d/webperfs.webdesignord.fr.conf
sudo nginx -t && sudo systemctl reload nginx
```

Ensuite, lancer Certbot pour émettre le certificat (voir la documentation Certbot
du projet `portfolio`, `docs/certbot.md`, pour la procédure détaillée — identique
sur ce serveur).

## Configuration après activation de HTTPS

Certbot ajoute sur le serveur un bloc TLS sur le port 443, les chemins du
certificat et une redirection HTTP vers HTTPS, en modifiant directement
`/etc/nginx/conf.d/webperfs.webdesignord.fr.conf`.

Le template du dépôt reste en HTTP : **ne pas le réinstaller sur le serveur une
fois HTTPS actif**, cela remplacerait les blocs ajoutés par Certbot. Après toute
modification de la configuration active, reporter sa version HTTPS dans le dépôt :

```bash
cp /etc/nginx/conf.d/webperfs.webdesignord.fr.conf \
  /opt/apps/web-perf-lab/deploy/nginx/webperfs.webdesignord.fr.conf
```

Relire le diff avant de committer. Les chemins des certificats peuvent être
versionnés ; les certificats et clés privées restent dans `/etc/letsencrypt`.

Pour chaque modification ultérieure, vérifier `sudo nginx -t` avant de recharger
nginx. Un déploiement du code seul ne nécessite pas de modifier ce proxy.

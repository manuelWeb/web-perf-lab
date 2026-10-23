# Configuration Nginx

## Rôle du proxy

Nginx s'exécute sur le serveur, en dehors de Docker. Il reçoit les requêtes pour
`webperfs.webdesignord.fr` et `www.webperfs.webdesignord.fr` et les transmet au conteneur
via `http://127.0.0.1:3040`.

`server_name` sélectionne les deux domaines. `proxy_http_version 1.1` définit la
version HTTP vers l'application. Les en-têtes `Host`, `X-Real-IP`,
`X-Forwarded-For` et `X-Forwarded-Proto` transmettent le domaine demandé,
l'adresse du client et le protocole d'origine.

## Configuration versionnée

Le fichier [`webperfs.webdesignord.fr.conf`](webperfs.webdesignord.fr.conf) est
une copie versionnée de la configuration active sur le serveur, située dans
`/etc/nginx/conf.d/webperfs.webdesignord.fr.conf`. Elle comprend les blocs TLS
et les règles ajoutés par Certbot ; ce n'est pas un template HTTP générique.

Sur une nouvelle machine, ne pas installer cette copie avant d'avoir émis les certificats référencés dans la configuration. Après une modification de la
configuration active, valider et recharger Nginx, puis reporter la version utilisée dans le dépôt :

```bash
sudo nginx -t && sudo systemctl reload nginx
cp /etc/nginx/conf.d/webperfs.webdesignord.fr.conf \
  /opt/apps/web-perf-lab/docs/deploy/nginx/webperfs.webdesignord.fr.conf
```

Relire le diff avant de committer. Les chemins des certificats peuvent être
versionnés ; les certificats et clés privées restent dans `/etc/letsencrypt`.
Un déploiement du code seul ne nécessite pas de modifier ce proxy.

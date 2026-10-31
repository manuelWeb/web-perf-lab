# Configuration Docker

## Fichiers et construction

La configuration repose sur [`../Dockerfile`](../Dockerfile), [`../docker-compose.yml`](../docker-compose.yml),
[`../.dockerignore`](../.dockerignore) et le mode `output: "standalone"` de [`../next.config.ts`](../next.config.ts).

Le Dockerfile utilise deux étapes basées sur Node.js 24 Debian slim :

1. `build` installe les dépendances avec `npm ci --ignore-scripts` (le lockfile
   `package-lock.json` est figé, les scripts d'installation sont ignorés : Husky
   n'est pas nécessaire dans l'image), puis exécute `npm run build`.
2. `runtime` ne copie que le serveur standalone, `.next/static` et `public`. Il
   démarre avec `node server.js` sous l'utilisateur `node`.

Le contexte exclut `node_modules`, `.next`, `.git`, `.github`, `.husky`, `deploy`
et `docs`, ainsi que `.env*`, les journaux, `README.md` et `AGENTS.md`. Les guides
et configurations de déploiement ne sont donc pas copiés dans l'image.

## Identifiant GTM depuis `.env`

Dans le fichier `.env` situé à côté de `docker-compose.yml`, configurer :

```dotenv
NEXT_PUBLIC_GTM_ID=GTM-WHDFW9CD
```

Compose lit `.env` pour résoudre `build.args.NEXT_PUBLIC_GTM_ID`. Une variable
exportée dans le shell est prioritaire sur celle du fichier. Le Dockerfile
reçoit cette valeur via `ARG`, dans l'étape `build`, avant `npm run build`.
Next.js intègre alors l'identifiant dans les fichiers générés.

Le fichier `.env` reste exclu du contexte Docker : on transmet uniquement la
variable publique nécessaire à GTM, pas l'ensemble du fichier. Une section
`env_file` injecterait des variables au démarrage du conteneur ; elle ne remplace
pas ce passage au build pour `NEXT_PUBLIC_GTM_ID`.

Sans valeur, l'argument est vide et le layout n'ajoute pas GTM. L'identifiant
GA4 est configuré dans le conteneur GTM ; `NEXT_PUBLIC_GA_MEASUREMENT_ID` n'est
actuellement pas lu par l'application et n'a donc pas à être transmis à Docker.

Pour vérifier la substitution sans construire ni démarrer de conteneur :

```bash
docker compose config
```

Contrôler la valeur dans `services.app.build.args.NEXT_PUBLIC_GTM_ID`.
Après un changement d'identifiant, reconstruire l'image puis recréer le service :

```bash
docker compose build
docker compose up -d --wait
```

Un simple redémarrage ou une modification des variables du conteneur existant
ne modifie pas les fichiers déjà construits. Pour un build sans Compose,
transmettre explicitement `--build-arg NEXT_PUBLIC_GTM_ID=GTM-WHDFW9CD` à
`docker build` : Docker seul ne charge pas automatiquement le fichier `.env`.

Références : [interpolation Compose](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/)
et [variables au build](https://docs.docker.com/build/building/variables/).

## Service Compose

| Paramètre                 | Rôle                                                                          |
| -------------------------- | ------------------------------------------------------------------------------ |
| `build.context: .`         | Construit l'image depuis le projet courant.                                   |
| `build.args`               | Transmet l'identifiant GTM de `.env` au build Next.js.                         |
| `127.0.0.1:3040:3000`       | Expose le port 3000 du conteneur uniquement sur le port local 3040 de l'hôte. |
| `restart: unless-stopped`  | Redémarre le service, sauf après un arrêt volontaire.                         |
| `healthcheck`               | Attend une réponse HTTP réussie de `/` sur le port interne 3000 via `fetch`.  |
| Journaux `json-file`        | Limite chaque fichier à 50 Mo et conserve au maximum 5 fichiers.              |

Le serveur écoute sur `0.0.0.0` dans le conteneur avec `PORT=3000`, en production.
La télémétrie Next.js est désactivée. Aucun volume applicatif n'est configuré :
le code provient de l'image, donc un changement demande une reconstruction.

Le contrôle de santé s'exécute toutes les 30 secondes, avec un délai maximal de
5 secondes, une période de démarrage de 30 secondes et 3 échecs autorisés.

Le port `3040` suit la convention des autres applications du serveur
(incrément de 10 par rapport au dernier port local utilisé : 3030 pour
`portfolio`).

Pour lancer une version et consulter les journaux, suivre le
[guide de déploiement](deploy/deployment.md). Le proxy de l'hôte est décrit dans
[le guide Nginx](deploy/nginx/nginx.md).

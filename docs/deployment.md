# Déploiement de web-perf-lab

## Déploiement manuel

Depuis le dossier du projet sur le serveur, construire la branche courante puis
remplacer le conteneur par la nouvelle image :

```bash
cd /opt/apps/web-perf-lab
docker compose build && docker compose up -d --wait
```

Pour livrer une autre branche, se placer sur celle-ci avec `git switch <branche>`
puis relancer la commande.

`docker compose restart` seul ne prend pas en compte la nouvelle image.

## CI

Le workflow [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) se
déclenche sur les PR ciblant `main`. Il installe les dépendances puis vérifie
ESLint, TypeScript et le build Next.js (Node.js 24, aligné avec le Dockerfile).

## Livraison automatique (CD)

Le workflow [`../.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
se déclenche sur `push` filtré sur `main` — jamais sur une PR elle-même, pour
qu'aucun code non fusionné ne soit livré.

1. Une PR vers `main` passe la CI et reçoit les validations requises.
2. La fusion produit un `push` sur `main`.
3. Le workflow se connecte en SSH au serveur `mini-forum` et exécute, dans
   `/opt/apps/web-perf-lab` : `git fetch`, `git reset --hard origin/main`, puis
   `docker compose build && docker compose up -d --wait`.
4. Le healthcheck du service Compose valide la livraison : si le conteneur ne
   devient jamais `healthy`, le job échoue et le signale.

### Sécurité de la connexion

Le workflow utilise une clé SSH dédiée (`DEPLOY_SSH_KEY`), distincte des clés
personnelles, autorisée sur le serveur via une entrée `authorized_keys`
restreinte par une **commande forcée** : la clé ne peut exécuter que la
séquence de déploiement de ce projet, quelle que soit la commande envoyée par
le client SSH (`no-pty`, `no-port-forwarding`, `no-X11-forwarding`,
`no-agent-forwarding`). Une compromission du secret GitHub ne donne donc pas un
accès shell complet au serveur.

Secrets GitHub requis (Settings → Secrets and variables → Actions) :

| Secret           | Valeur                                      |
| ---------------- | -------------------------------------------- |
| `DEPLOY_HOST`     | IP publique ou nom d'hôte de mini-forum.     |
| `DEPLOY_USER`     | Utilisateur système (`manuel`).              |
| `DEPLOY_SSH_KEY`  | Clé privée dédiée (jamais la clé personnelle). |

### Protection de branche

L'approbation d'une PR seule ne doit pas suffire à déclencher la livraison :
le déclencheur réel est le `push` sur `main`, qui ne doit arriver que par un
merge de PR. Activer sur GitHub (Settings → Branches → Branch protection
rules pour `main`) :

- Require a pull request before merging.
- Require status checks to pass before merging → sélectionner le job `Validate`
  du workflow CI.

Sans cette protection, un push direct sur `main` (en bypassant la PR)
déclencherait quand même le déploiement.

### Limites actuelles

Ce flux reste volontairement simple (pas de registre d'images, rebuild direct
sur le serveur) : suffisant pour un projet sans backend et à faible trafic. En
cas d'échec du build ou du healthcheck, **le conteneur précédent continue de
tourner** (Compose ne coupe le service en cours que lorsque le remplacement
réussit), mais rien ne restaure automatiquement une image antérieure taguée :
il n'y a pas encore de rollback automatisé. Une publication d'image taguée sur
un registre (avec conservation de l'image précédente) pourra être envisagée si
le projet grossit.

Référence : [événements GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).

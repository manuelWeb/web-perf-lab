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
3. Le workflow s'exécute sur un **runner GitHub Actions auto-hébergé**, installé
   directement sur `mini-forum` (`~/actions-runners/web-perf-lab`, service
   systemd `actions.runner.manuelWeb-web-perf-lab.miniforum-web-perf-lab`,
   démarré au boot). Le job tourne donc localement et exécute, dans
   `/opt/apps/web-perf-lab` : `git fetch`, `git reset --hard origin/main`, puis
   `docker compose build && docker compose up -d --wait`.
4. Le healthcheck du service Compose valide la livraison : si le conteneur ne
   devient jamais `healthy`, le job échoue et le signale.

### Pourquoi un runner auto-hébergé plutôt que du SSH

Mini-forum est derrière un routeur qui ne fait du port-forwarding que pour 80
et 443 : le port 22 n'est pas joignable depuis l'extérieur, donc un
`appleboy/ssh-action` lancé sur `ubuntu-latest` échoue (`i/o timeout`). Le
runner auto-hébergé évite ce problème : il se connecte en sortant vers GitHub
(polling), aucun port entrant à ouvrir, aucun secret SSH à gérer ni de clé à
exposer. C'est aussi la solution la plus sûre pour un serveur à la maison.

Limite de cette approche : le runner tourne en permanence sur le serveur et
exécute le job avec les droits de l'utilisateur système `manuel` — ne pas lui
faire exécuter du code non fiable issu d'une PR externe (ce n'est pas un
risque ici, le repo n'accepte que des PR internes).

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

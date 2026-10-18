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

## CI existante

Aucun workflow GitHub Actions n'est encore configuré sur ce projet. Le build,
le lint et le typecheck restent à exécuter manuellement (`npm run check`,
`npm run build`) avant la fusion d'une PR, en attendant la mise en place de la CI.

## Livraison automatique (CD)

Le flux cible, une fois la CI en place :

1. Une PR vers `main` passe les contrôles et reçoit les validations requises.
2. La fusion produit un `push` sur `main`, qui déclenche le workflow de livraison.
3. Le workflow se connecte en SSH au serveur `mini-forum` et exécute
   `git pull && docker compose build && docker compose up -d --wait` dans
   `/opt/apps/web-perf-lab`.
4. Le healthcheck du service Compose valide la livraison.

L'approbation d'une PR seule ne doit pas lancer la livraison : le déclencheur
cible est `push` filtré sur `main`. La branche `main` doit être protégée pour
exiger une PR approuvée et une CI réussie avant fusion, afin d'éviter les
livraisons par push direct.

Ce flux reste volontairement simple (pas de registre d'images, rebuild direct sur
le serveur) : suffisant pour un projet sans backend et à faible trafic. Une
publication d'image taguée sur un registre (avec rollback vers l'image
précédente en cas d'échec) pourra être envisagée si le projet grossit.

Référence : [événements GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).

# Tester Google Tag Manager et Google Analytics

[Retour à la documentation du projet](../../README.md)

Ce guide explique comment vérifier séparément le chargement de GTM, le
déclenchement de la balise et la réception des événements dans GA4. Les noms
DevTools sont en anglais ; l'interface Google peut mélanger français et anglais.

## 1. Comprendre l'installation

```text
Layout racine Next.js
→ CookieConsent recueille ou restaure le choix
→ si Analytics est accepté, GoogleTagManager charge le conteneur GTM une fois par document
→ la configuration du conteneur déclenche la destination GA4
→ GA4 reçoit les événements, dont page_view
```

Le composant officiel `GoogleTagManager`, fourni par `@next/third-parties`, est
monté par [`ConsentManager`](../../src/components/consent-manager.tsx), placé dans
le layout racine. Il initialise
`window.dataLayer` et utilise `next/script` pour charger GTM après le début de
l'hydratation. Le layout partagé conserve cette instance pendant les navigations
Next.js côté client. Un rechargement complet crée un nouveau document et charge
normalement une nouvelle instance.

`dataLayer` est une file de messages, pas le rapport Analytics. La présence de
messages ne prouve pas leur envoi ni leur réception dans GA4.

### Identifiants du projet

| Élément | Identifiant | Emplacement de configuration |
| --- | --- | --- |
| Conteneur GTM | `GTM-WHDFW9CD` | `.env`, via `NEXT_PUBLIC_GTM_ID` |
| Flux Web GA4 | `G-7MSK4NKV7Z` | Balise de destination dans GTM |

Ces identifiants sont publics. Dans `.env.example`, les valeurs `GTM-XXXX` et
`G-XXXX` indiquent des valeurs à remplacer pour réutiliser le projet ; ce ne sont
pas des secrets masqués.

L'application lit seulement `NEXT_PUBLIC_GTM_ID`. La variable historique
`NEXT_PUBLIC_GA_MEASUREMENT_ID` n'est actuellement pas utilisée : GA4 est
configuré dans GTM, sans second chargeur GA4 dans Next.js.

### Configuration enregistrée dans GTM

- Nom : **GA4 — Configuration — All Pages**.
- Type : **Google Analytics**, présenté comme « Nouveau » dans l'interface testée.
- Champ : **Measurement ID**, avec l'identifiant du flux Web.
- Déclencheur : **Initialization - All Pages**.

L'initialisation du conteneur correspond au chargement d'un document. Le suivi
des changements de route Next.js doit être contrôlé séparément ; le déclencheur
initial ne prouve pas, à lui seul, ce suivi.

Le conteneur est maintenant bloqué avant acceptation de la catégorie Analytics.
Un refus doit laisser `gtm.js` et `collect` absents de Network. Consulter le
[guide du consentement](../consent/README.md) pour tester les différents choix.

## 2. Démarrer en local

À la racine du projet, ajouter dans `.env` la variable `NEXT_PUBLIC_GTM_ID` avec
la valeur du conteneur. Puis lancer :

```bash
npm ci
npm run dev
```

Ouvrir `http://localhost:3000/`. Après un changement de `.env`, redémarrer le
serveur de développement. Si le port est occupé et que Next.js en utilise un
autre, employer ce port réel dans Preview.

Pour une vérification en mode production, arrêter le serveur qui occupe le port,
puis lancer :

```bash
npm run check
npm run build
npm start
```

Le mode `dev` convient au diagnostic fonctionnel. Pour comparer les performances,
utiliser le build de production, sans breakpoints ni `debugger;`.

## 3. Vérifier que GTM est chargé

**Où : DevTools → Network.**

1. Accepter la mesure d’audience dans la popin, puis ouvrir Network avant de
   recharger la page. Sans accord, l’absence de GTM est le résultat attendu.
2. Filtrer sur `gtm.js`.
3. Vérifier une requête vers `www.googletagmanager.com/gtm.js` avec le bon
   paramètre `id=GTM-…` et une réponse réussie, normalement `200`.

**Résultat attendu :** le script du conteneur est téléchargé. Cela ne prouve pas
encore que la balise GA4 s'est déclenchée.

Pour vérifier sa présence dans le DOM, utiliser **Console** :

```js
document.querySelector('script[src*="googletagmanager.com/gtm.js"]')
```

Un élément `<script>` confirme sa présence ; `null` signifie qu'il n'est pas
présent au moment de la commande. Inspecter aussi :

```js
window.dataLayer
```

On attend une file contenant notamment un message avec `event: "gtm.js"`.
Un script présent ou une file créée ne garantit pas la réussite de son téléchargement.
Ne pas réinjecter le snippet Google manuellement pour contourner un échec.

## 4. Connecter GTM Preview

**But :** tester la configuration de l'espace de travail avant publication.

1. Ouvrir le conteneur dans [Google Tag Manager](https://tagmanager.google.com/).
2. Cliquer sur **Prévisualiser / Preview**.
3. Dans Tag Assistant, saisir `http://localhost:3000/`, puis **Connect / Se connecter**.
4. Le site s'ouvre dans une fenêtre ou un onglet avec un paramètre de débogage.
   Accepter Analytics sur ce navigateur pour autoriser le chargement de GTM et
   permettre la connexion de Tag Assistant.
5. Garder le site ouvert et revenir dans **Tag Assistant**.
6. Cliquer sur **Continue / Continuer** si proposé.
7. Dans les événements de la page, sélectionner **Initialization**, puis vérifier
   **Tags Fired / Balises déclenchées** et la balise GA4 configurée.

**Résultat attendu :** Tag Assistant est connecté et la balise est déclenchée.
C'est une preuve d'exécution de la balise, pas encore de réception côté GA4.
Fermer la session met fin au test ; pour la reprendre, relancer Preview.

**Enregistrer** conserve la balise dans l'espace de travail. **Prévisualiser** la
teste dans la session connectée. **Publier** rend une version du conteneur active
pour les visiteurs : ce sont trois opérations différentes.

## 5. Vérifier la réception dans GA4

**Où : Google Analytics → bonne propriété → Rapports → Temps réel.**

1. Garder Preview connecté et le site local ouvert.
2. Recharger une fois la page locale.
3. Chercher `page_view` dans **Nombre d'événements par nom d'événement**.
4. Ouvrir `page_view`, puis son paramètre **page_location**.
5. Vérifier une URL commençant par `http://localhost:3000/`.

Le rapport peut avoir un délai et agréger plusieurs visites. Un compteur « 2 »
ne prouve pas deux événements pour une seule navigation. La bonne propriété et
la valeur de `page_location` permettent d'identifier la destination et la page.
Les événements locaux arrivent réellement dans cette propriété ; Preview n'est
pas un simulateur Analytics. Pour séparer les données de test des données réelles,
utiliser une destination GA4 dédiée aux tests.

## 6. Vérifier une navigation Next.js

**But :** mesurer une nouvelle page sans recharger le document.

1. Partir de l'accueil dans la session Preview.
2. Cliquer une seule fois sur **Ouvrir le catalogue**.
3. Ne pas utiliser la barre d'adresse ni le bouton de rechargement.
4. Dans GA4, rechercher un `page_view` avec `page_location` se terminant par `/catalogue`.

Une occurrence pour cette navigation est le résultat attendu. Le comptage dans
Temps réel est une première indication, pas une preuve exhaustive d'absence de doublons.

Pour une vérification précise : **GA4 → Administration → Affichage des données →
DebugView**. Tag Assistant / Preview active le mode de débogage pour la session.
Sélectionner l'appareil de test, puis suivre les événements individuels `page_view`
en cliquant successivement sur des liens Next.js et en utilisant Précédent/Suivant.
Comparer `page_location`, `page_referrer` et le nombre d'événements pour chaque action.
Un délai ou un filtre peut expliquer l'absence de données dans DebugView.

Les doublons peuvent venir d'un tag GA4 installé à la fois directement et via GTM,
ou de deux mécanismes de suivi des routes : détection automatique d'historique et
envoi manuel. Choisir un mécanisme et contrôler son résultat avant d'en ajouter
un second. Le détail de la configuration des événements automatiques dépend du
type de balise et des réglages du conteneur / flux ; ne pas changer ces réglages
sans vérifier les événements réellement émis.

## 7. Tester la configuration de production

### Côté application Docker

Sur le serveur, préparer `.env` à côté de `docker-compose.yml` avec l'identifiant
GTM de l'environnement voulu. Vérifier la substitution :

```bash
docker compose config
```

Contrôler `services.app.build.args.NEXT_PUBLIC_GTM_ID`. Compose transmet cette
valeur à l'argument du Dockerfile avant `next build`. `.env` n'est pas copié dans
l'image. `env_file` seul fournirait les valeurs au démarrage, trop tard pour les
fichiers déjà générés contenant les variables publiques.

Lors d'une livraison validée, suivre le [guide de déploiement](../deploy/deployment.md).
Les commandes de reconstruction et de remplacement sont :

```bash
docker compose build
docker compose up -d --wait
```

`build` construit l'image ; `up` remplace le conteneur si l'image ou la configuration
a changé. `restart` seul conserve l'ancienne image. Le cache ne corrige pas une
variable qui n'a pas été transmise. Détails dans le [guide Docker](../docker.md).

### Côté conteneur GTM

1. Ouvrir Preview sur l'URL HTTPS déployée pour tester les changements de l'espace
   de travail et les événements reçus, avec les mêmes contrôles qu'en local.
2. Quand la configuration et la gestion du consentement de l'environnement sont
   prêtes pour diffusion, examiner les modifications GTM puis utiliser
   **Envoyer / Submit → Publier et créer une version**. Renseigner un nom et une
   description de version, puis confirmer la publication.
3. Fermer Preview et vérifier, dans une navigation normale, la version publiée :
   requête GTM, réception GA4 et suivi des routes.

Un déploiement Git ne publie pas la configuration GTM. Une publication GTM ne
reconstruit pas l'application. Si seul le contenu du même conteneur GTM change,
la publication de celui-ci ne nécessite pas de rebuild Next.js. Un changement
de son identifiant `NEXT_PUBLIC_GTM_ID` nécessite une nouvelle image.

## 8. Dépannage ciblé

| Symptôme | Première vérification |
| --- | --- |
| Tag Assistant ne se connecte pas | Chercher le script GTM dans Network et le DOM avant de modifier la balise. |
| `null` pour le script et `dataLayer` absent | Vérifier la variable, puis redémarrer `dev` ou reconstruire la production ; une ancienne version peut être servie. |
| Script présent, requête bloquée | Examiner Network / Console : bloqueur, protection navigateur ou CSP ; tester un profil sans extension pour isoler la cause. |
| GTM chargé, balise non déclenchée | Bon conteneur, workspace Preview et déclencheur ; après intégration, vérifier aussi le consentement. |
| Balise déclenchée, GA4 vide | Bonne propriété et Measurement ID, requêtes Analytics, délai, filtres ou protections navigateur. |
| Preview fonctionne, navigation normale non | Vérifier la version GTM publiée et la connexion éventuelle à une version de travail différente. |
| `/lcp-rgpd/slow` renvoie 404 | Cette route appartient à la démo au stash, pas à cette branche ; tester `/` et `/catalogue`. |
| Fonctionnement local, GTM absent dans Docker | Vérifier `.env` sur le serveur, `build.args`, puis reconstruire et remplacer le conteneur. |
| Compteur inattendu | Utiliser les événements individuels dans DebugView avant de conclure à des doublons. |

L'extension Tag Assistant peut aider dans certains scénarios, mais sa suggestion
à l'écran ne prouve pas qu'elle manque : l'échec rencontré pendant cette mise en
place venait d'une page servie sans GTM. Le redémarrage avec le code actuel l'a résolu.

## Références

- [Next.js : intégration Google Tag Manager](https://nextjs.org/docs/app/guides/third-party-libraries)
- [Google : configurer Analytics dans GTM](https://support.google.com/tagmanager/answer/9442095?hl=en)
- [Google : Tag Assistant et problèmes de connexion](https://support.google.com/tagassistant/answer/10039345?hl=en)
- [Google : rapport Temps réel](https://support.google.com/analytics/answer/9271392?hl=fr)
- [Google : DebugView](https://support.google.com/analytics/answer/7201382?hl=en)
- [Google : mesure des navigations côté client](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)

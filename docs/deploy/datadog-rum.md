# Datadog RUM et source maps

## Version de déploiement

À chaque déploiement sur `main`, le workflow transmet à Next.js les sept
premiers caractères du SHA Git construit, par exemple `9e8bc22`. Cette version
est envoyée comme tag `version` par le SDK RUM et sert à associer les source
maps au bon build. Le SHA complet reste consultable dans l’historique GitHub et
dans le commit correspondant.

Un libellé comme `PR#20 fix/datadog-rum-environments` serait plus parlant dans
un dashboard, mais il dépend de métadonnées de PR que le workflow ne récupère
pas actuellement. Il peut aussi être ambigu si plusieurs commits d’une même
PR sont déployés. Le SHA court est directement dérivé du commit réellement
construit et reste une clé courte et fiable ; on peut retrouver le message de
merge et le titre de PR depuis ce SHA.

Les builds `local-build` n’utilisent pas cette version de production par
défaut : leur environnement RUM est `local-build` et la version est absente,
sauf si elle est fournie explicitement. Les source maps locales peuvent être
générées pour le diagnostic sans être envoyées à Datadog.

## Créer la clé API Datadog

L’upload utilise une **API key Datadog**, jamais le client token RUM destiné au
navigateur. Dans Datadog EU :

1. Ouvrir **Organization Settings → API Keys**.
2. Créer une clé dédiée, par exemple `web-perf-lab-sourcemaps`.
3. Copier sa valeur lors de sa création et la conserver comme secret. Ne pas
   l’ajouter au `.env`, au dépôt ou au code client.

Datadog recommande une clé dédiée aux source maps. Les API keys et client
tokens ont des usages différents : [documentation des clés Datadog](https://docs.datadoghq.com/account_management/api-app-keys/) et [guide d’upload des source maps](https://docs.datadoghq.com/real_user_monitoring/guide/upload-javascript-source-maps/).

## Ajouter le secret GitHub Actions

Dans le dépôt GitHub, ouvrir **Settings → Secrets and variables → Actions**,
puis **New repository secret**. Nommer le secret `DD_API_KEY` et coller la
valeur de la clé API Datadog. Le workflow de déploiement lit ce secret sans
l’écrire dans les logs et le fournit au build Docker comme secret temporaire.

Si `DD_API_KEY` est absent, le déploiement continue sans générer ni uploader de
source maps de production. Si la clé est présente mais que l’upload échoue, le
build échoue et le conteneur courant n’est pas remplacé.

## Rôle de `datadog-ci`

`datadog-ci` est le CLI officiel de Datadog pour les opérations de pipeline CI
et de build. Ici, il exécute `datadog-ci sourcemaps upload` sur les maps
générées par Next.js, avec le service `web-performance-lab`, la version du
commit, le préfixe d’URL `/_next/static` et les métadonnées Git du dépôt.
Compose monte le dossier `.git` comme contexte BuildKit uniquement pendant
l’upload ; l’historique Git n’est pas copié dans l’image. Datadog peut ainsi
associer les frames déminifiées aux chemins et commits du dépôt. Les source maps
sont ensuite supprimées avant la copie des assets vers l’image runtime : elles
ne sont pas servies publiquement.

Pour afficher les fichiers et extraits du dépôt dans Datadog, il faut aussi
connecter le dépôt GitHub et activer la Source Code Integration. Suivre la
[procédure de liaison Datadog ↔ GitHub](datadog-github-source-code.md).

## Vérifier la symbolication

Après un déploiement avec `DD_API_KEY`, provoquer ou attendre une nouvelle
erreur JavaScript RUM. Dans Error Tracking ou l’événement RUM, vérifier le
service `web-performance-lab`, la version courte du commit déployé et une
stack trace résolue vers les sources d’origine. Les erreurs antérieures au
déploiement ne valident pas l’upload de cette version.

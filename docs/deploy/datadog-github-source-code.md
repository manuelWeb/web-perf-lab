# Relier Datadog au code source GitHub

Cette intégration permet de partir d’une erreur RUM, d’ouvrir le fichier
concerné dans GitHub et de retrouver le commit associé. Elle complète
l’upload des source maps : les maps déminifient les stacks, tandis que les
métadonnées Git et l’accès au dépôt permettent à Datadog de relier ces stacks
au code et à l’historique Git.

## Prérequis côté application

- Le workflow doit uploader les source maps avec `datadog-ci sourcemaps upload`
  sans désactiver les métadonnées Git.
- La version passée à RUM doit correspondre à la version passée à l’upload.
- Le build doit avoir accès aux métadonnées du dépôt Git afin que Datadog
  associe les fichiers aux chemins et commits.

Le pipeline de ce projet transmet les sept premiers caractères du SHA déployé
comme version RUM et à `datadog-ci`. Le SHA complet identifie le commit dans
GitHub.

## Connecter GitHub dans Datadog

Dans Datadog EU, ouvrir **Integrations → GitHub** et connecter le compte ou
l’organisation GitHub qui héberge le dépôt. Autoriser l’application Datadog
sur le dépôt `web-perf-lab` et accorder les permissions nécessaires pour lire
le contenu du dépôt et ses commits. Les permissions demandées dépendent des
fonctionnalités activées ; limiter l’installation au dépôt concerné si cela
convient à l’organisation.

Ensuite, dans Datadog, ouvrir **Integrations → Link Source Code** et associer
le service `web-performance-lab` au dépôt GitHub correspondant. Les écrans
peuvent varier selon l’organisation et les intégrations déjà configurées.

## Vérifier le lien depuis une erreur

Après un déploiement avec les source maps, ouvrir **Digital Experience → Error
Tracking**, puis une nouvelle erreur RUM du service `web-performance-lab`.
Vérifier que :

1. La stack trace affiche les frames déminifiées et les chemins des fichiers.
2. Une frame propose un lien ou un aperçu du fichier dans GitHub.
3. Le commit affiché correspond au SHA complet du build déployé.

Tester avec une nouvelle erreur après le déploiement : les événements déjà
ingérés avant l’upload des maps ou l’activation de l’intégration ne valident
pas nécessairement la configuration.

## Documentation Datadog

- [Source Code Integration](https://docs.datadoghq.com/source_code/)
- [Connecter un fournisseur de code source](https://docs.datadoghq.com/source_code/source-code-management/)
- [Fonctionnalités de l’intégration source code](https://docs.datadoghq.com/source_code/features/)
- [Intégration GitHub](https://docs.datadoghq.com/integrations/github/)
- [Relier les erreurs navigateur au code source](https://docs.datadoghq.com/real_user_monitoring/error_tracking/browser/)

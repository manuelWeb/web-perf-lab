# Auditer les dépendances npm

Ce guide propose une démarche pour comprendre les alertes de sécurité npm et
évaluer une mise à jour sans appliquer de correction à l'aveugle. Un audit
signale des vulnérabilités connues dans l'arbre de dépendances ; il ne prouve
pas qu'une application est sûre.

## Lire le rapport

```bash
npm audit
```

`npm audit` compare les dépendances du projet aux avis de sécurité connus et
présente leur sévérité, les versions concernées et, lorsque c'est possible, des
pistes de correction. Par défaut, le rapport inclut les dépendances de
production et de développement. Une alerte doit être étudiée : sa présence ne
signifie pas à elle seule que le code vulnérable est exécuté ou exploitable dans
notre application.

Pour obtenir un rapport exploitable par un outil ou conserver les détails :

```bash
npm audit --json
```

## Distinguer production et développement

```bash
npm audit --omit=dev
```

`--omit=dev` exclut les dépendances de développement de l'audit. Cette vue aide
à distinguer les risques associés à l'arbre de production de ceux liés aux
outils utilisés pour développer, tester ou construire le projet.

Un résultat `found 0 vulnerabilities` signifie qu'aucune vulnérabilité connue
n'a été signalée dans le périmètre ainsi audité, à la date de l'audit et selon
les données du registre. Ce n'est pas une garantie de sécurité absolue : cela
n'évalue ni tous les risques de l'application, ni la configuration du système,
ni les vulnérabilités encore inconnues. Les dépendances de développement restent
aussi pertinentes pour la sécurité des postes et de la CI.

## Remonter une dépendance transitive

Une dépendance **directe** est déclarée par le projet. Une dépendance
**transitive** est installée parce qu'une autre dépendance en a besoin. Pour
comprendre une alerte sur un paquet transitif, par exemple `braces` :

```bash
npm explain braces
npm ls braces
```

- `npm explain <package>` explique pourquoi le paquet est présent et remonte
  les chemins qui l'introduisent dans l'arbre.
- `npm ls <package>` affiche les versions installées et les chemins concernés.
  Il peut aussi révéler des paquets manquants, invalides ou surnuméraires.

Ces commandes complètent le rapport d'audit : elles aident à trouver quelle
dépendance directe il faut éventuellement mettre à jour, sans attribuer à tort
la vulnérabilité à chaque paquet de la chaîne.

## Vérifier les informations du paquet

```bash
npm view braces versions --json
npm view braces@<version> version engines
```

`npm view <package> <field>` consulte les métadonnées publiées dans le registre.
On peut vérifier les versions disponibles, les contraintes Node.js (`engines`)
ou, par exemple, les dépendances d'une version. Une version publiée n'est pas
automatiquement compatible avec le projet : vérifier aussi les plages déclarées,
les notes de version et les avis de sécurité.

## Prévisualiser une correction

```bash
npm audit fix --dry-run
```

`fix` demande à npm d'appliquer les corrections qu'il peut résoudre ;
`--dry-run` demande seulement un aperçu des changements envisagés. Cette
prévisualisation n'écrit pas les changements proposés dans l'installation du
projet. Elle sert à examiner les mises à jour prévues avant de décider quoi
appliquer. Relire ensuite les changements réels dans `package.json` et
`package-lock.json`.

Éviter de commencer par :

```bash
npm audit fix --force
```

`--force` lève plusieurs protections npm et peut autoriser des mises à jour hors
des plages déclarées, y compris des changements de version majeure (SemVer).
Une mise à jour majeure peut modifier des API, introduire des incompatibilités
entre plugins ou dépendances pairs, et casser le build ou le comportement de
l'application. Ne l'utiliser qu'après avoir identifié précisément les
changements proposés, vérifié leur compatibilité et prévu les validations
nécessaires.

## Exemple : Next.js 16.4.0 vers 16.4.2

Lors de cette mise à jour, `npm audit` a signalé six vulnérabilités de sévérité
élevée concernant le paquet `braces`, accessible par deux chaînes de
dépendances :

```text
lint-staged → micromatch → braces
eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces
```

Le paquet concerné par les avis est `braces`. Les autres noms décrivent les
dépendances qui l'introduisent dans l'arbre ; cela ne signifie pas que
`lint-staged`, `eslint-config-next`, `@next/eslint-plugin-next`, `fast-glob` ou
`micromatch` contiennent eux-mêmes cette vulnérabilité.

Dans le même état du projet, `npm audit --omit=dev` a retourné
`found 0 vulnerabilities`. Cela indiquait qu'aucune vulnérabilité n'était
signalée dans les dépendances non omises de l'arbre de production. Les alertes
de développement restaient néanmoins à examiner, notamment parce que ces outils
peuvent être utilisés en CI ou sur les postes de développement.

## Checklist avant validation

- [ ] Lire le rapport complet : paquet réellement concerné, sévérité, versions
      vulnérables et versions corrigées.
- [ ] Distinguer dépendance directe et transitive avec `npm explain` et
      `npm ls` ; identifier le chemin avant de choisir quoi mettre à jour.
- [ ] Comparer `npm audit` et `npm audit --omit=dev` sans interpréter le second
      comme une preuve de sécurité globale.
- [ ] Vérifier les métadonnées, contraintes et notes de version des versions
      envisagées (`npm view` et documentation du paquet).
- [ ] Examiner `npm audit fix --dry-run` ; ne pas lancer `--force` sans avoir
      compris et accepté les changements majeurs éventuels.
- [ ] Relire les diffs de `package.json` et `package-lock.json` et vérifier
      qu'ils correspondent à l'objectif de la mise à jour.
- [ ] Exécuter les validations du projet (installation reproductible, lint,
      types, tests disponibles et build), puis relancer les audits.
- [ ] Noter les alertes restantes, leur périmètre et la raison de leur maintien.

## Références

- [npm audit](https://docs.npmjs.com/cli/commands/npm-audit/)
- [npm explain](https://docs.npmjs.com/cli/commands/npm-explain/)
- [npm ls](https://docs.npmjs.com/cli/commands/npm-ls/)
- [npm view](https://docs.npmjs.com/cli/commands/npm-view/)
- [Auditer les dépendances npm](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities/)

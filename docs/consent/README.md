# Consentement et Analytics

[Retour à la documentation](../../README.md)

## Fonctionnement

CookieConsent 3.2.1 est installé via npm : aucun CDN n’est nécessaire pour afficher
la popin. Le SDK est initialisé dans un `useEffect` du composant racine
`ConsentManager`. Le HTML initial et le premier rendu client sont identiques ;
le SDK ne modifie pas `<html>` avant le montage React.

La configuration française se trouve dans `src/lib/consent-config.ts`. La popin
est centrée, accepter et refuser ont le même poids visuel. La catégorie Analytics
est désactivée par défaut ; les cookies nécessaires restent autorisés.

Le cookie `wpl_consent` conserve l’acceptation ou le refus pendant 182 jours.
La page `/confidentialite` reste lisible sans devoir répondre à la popin.
La révision de configuration permet de redemander un choix si les finalités
changent. Ne pas augmenter la révision à chaque livraison.

## Chargement et retrait

Avant acceptation, React ne monte pas `GoogleTagManager` : aucun chargement de
GTM, GA4 ou ping de mesure sans consentement. Il s’agit d’un blocage préalable,
pas une intégration de l’API Consent Mode avancé envoyant des pings sans cookies. Aucun script Google
ni snippet `noscript` ne doit être ajouté ailleurs pour contourner ce contrôle.

Après acceptation, le composant Next.js existant charge le conteneur une seule
fois. Le layout racine persiste pendant les navigations côté client. Les pages
vues restent gérées par la configuration GA4 existante, sans second envoi manuel.

« Gérer mes cookies » ouvre les préférences depuis tous les pieds de page. Un
retrait enregistre le refus, efface les cookies `_ga` et `_ga_*` accessibles sur l’hôte et ses domaines
parents, puis
recharge le document pour arrêter les scripts et écouteurs déjà exécutés.
Démonter un composant ou supprimer une balise script ne suffirait pas. Le retrait
ne supprime pas les événements déjà reçus par Google. Une requête déjà partie
avant le retrait ne peut pas être annulée rétroactivement.

Les anciens cookies Analytics issus de la version sans gestionnaire sont aussi
nettoyés au démarrage si le consentement Analytics est absent ou refusé.

Cette intégration concerne le conteneur actuel, réservé à Analytics. Ajouter des
balises publicitaires ou d’autres finalités dans GTM nécessitera de revoir les
catégories, les autorisations et les informations présentées. Le consentement du
site ne désactive pas les protections propres au navigateur.

## Vérifier en local et en production

Lancer `npm run dev` ou `npm run build` puis `npm start`. L’identifiant
`NEXT_PUBLIC_GTM_ID` reste configuré comme indiqué dans le
[guide Analytics](../analytics/README.md). Tester également hors GTM Preview.

Dans DevTools, ouvrir **Network**, activer **Preserve log** et filtrer sur `gtm`
puis `collect`. **Application → Cookies** permet de vérifier les cookies.

| Parcours | Résultat attendu |
| --- | --- |
| Nouveau navigateur, aucun choix | Popin, aucun GTM/collect, aucun nouveau cookie Analytics. |
| Tout refuser puis recharger | Popin fermée, refus mémorisé, toujours aucun GTM/collect. |
| Personnaliser, Analytics désactivé, enregistrer | Même résultat qu’un refus. |
| Tout accepter | Une requête GTM ; GA4 peut ensuite envoyer ses événements. |
| Recharger avec l’accord mémorisé | Pas de nouvelle demande, une instance GTM dans le nouveau document. |
| Naviguer vers le catalogue via un lien Next.js | Pas de seconde instance GTM ; vérifier le `page_view`. |
| Gérer mes cookies, puis retirer Analytics | Rechargement, suppression des cookies Analytics, aucun GTM dans le nouveau document. |
| Réaccepter depuis les préférences | Le chargement de GTM reprend. |

Inspecter aussi **Console** pour vérifier l’absence d’erreur d’hydratation, et
les modales au clavier (Tab, Maj+Tab, Échap, retour du focus) ainsi que sur mobile.
Pour rejouer une première visite, supprimer le cookie `wpl_consent` puis recharger.
Ne pas confondre disparition des requêtes et conformité : les réglages GTM/GA4
et l’information fournie doivent également correspondre aux usages réels.

## Informations à compléter avant publication

La page `/confidentialite` décrit le mécanisme technique et le fournisseur. Elle
ne constitue pas une politique juridique complète. Le responsable du site doit
y ajouter son identité et son contact, les informations applicables sur les
droits et leur exercice, ainsi que les durées de conservation réellement
configurées dans GA4 et les informations pertinentes sur les transferts de
données. Ces éléments ne sont pas déduits des identifiants publics de Google.

## Références

- [CookieConsent : intégration React](https://cookieconsent.orestbida.com/essential/getting-started.html#react)
- [Configuration CookieConsent](https://cookieconsent.orestbida.com/reference/configuration-reference.html)
- [CNIL : cookies et traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi)

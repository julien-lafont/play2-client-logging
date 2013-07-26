# Hackday S02E06 @ Zenexity

> WTF! Ca marche chez moi 

* Transmission intelligente des erreurs clientes au serveur
* Agrégation multi-sources
* Visualisation temps réel des logs
* Tri et recherche des logs avec tracking des utilisateurs


## V1 : Error catcher

### Client-side
* Catcher les erreurs dans `window.onError` **OK**
* Helper pour logger les exceptions `catch (e) { log("xxx", e); }` **OK**
* Bufferiser les erreurs pour les poster toutes les Xs **OK**
* Extraire une stacktrace (lorsque c'est possible) et le user-agent **OK**
* Ne pas bufferiser 2x la même erreur **OK**
* Envoyer en ajax au serveur (sans utiliser jQ si possible)
* Helper pour activer/désactiver le système (off en DEV) **OK**
* Possibilité de désactiver le système via une config dans `application.conf` **OK**

### Server-side 
* Plugin play2 avec une route `POST /log` **OK**
* Parser les erreurs **OK**
* Stocker les logs dans un fichier indépendant (via logger.xml?) **OK**
* Linker les erreurs au client (ip?) **OK**
* Prévoir un niveau d'abstraction pour pouvoir stocker les logs autre part **OK**

## V2 : Log visualizer

* Real time log visualizer **OK**
* Plugger à minima sur les logs client-side, au mieux sur les logs back&client sides **OK**
* Suivre les erreurs par utilisateur **OK par login ou IP**
* Filtrer, grouper, rechercher des erreurs **OK**
* Tri par date, Url, message, type d'erreur **OK**
* Grouper les erreurs similaires **OK**

## Bonus

* Catch des erreurs JS dans Angular (avec des super stacktraces) **OK**
* Stats sur le taux d'erreur **OK**

## Réfs
* http://stacktracejs.com/
* http://errorception.com/ ($)

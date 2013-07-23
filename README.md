play2-client-logging
====================

Hackday S02E06

## V1 : Error catcher

### Client-side
* Catcher les erreurs dans `window.onError`
* Helper pour logger les exceptions `catch (e) { log("xxx", e); }`
* Bufferiser les erreurs pour les poster toutes les Xs
* Extraire une stacktrace (lorsque c'est possible) et le user-agent
* Ne pas bufferiser 2x la même erreur
* Envoyer en ajax au serveur (sans utiliser jQ si possible)
* Helper pour activer/désactiver le système (off en DEV)
* Possibilité de désactiver le système via une config dans `application.conf`

### Server-side 
* Plugin play2 avec une route `POST /log`
* Parser les erreurs
* Stocker les logs dans un fichier indépendant (via logger.xml?)
* Linker les erreurs au client (ip?)
* Prévoir un niveau d'abstraction pour pouvoir stocker les logs autre part

## V2 : Log visualizer

* Real time log visualizer
* Plugger à minima sur les logs client-side, au mieux sur les logs back&client sides
* Suivre les erreurs par utilisateur
* Filtrer, grouper, rechercher des erreurs

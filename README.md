Initiation à la création / configuration d'un serveur Linux

# 0] Ubuntu Desktop 16.04

La première partie de ce tp consiste bien entendu à télécharger et installer une distribution Linux. Par un soucis de facilité pour les tests, notation, etc... Nous allons partir sur un Ubuntu classique (Ubuntu 16.04.3 LTS).

> https://www.ubuntu.com/download/desktop

Une installation basique est suffisante, tout comme le nombre de ressources allouées à la machine virtuelle.

> Pour la création d'un serveur de test ou de production, il est préférable de partir sur des distributions plus légères, tel que __Debian__ ou __Ubuntu Server__
> ___
> Si vous rentrez dans la catégorie des gens _Même pas peur_ vous pouvez vous ruer sur un __ArchLinux__ et pleurer quelques jours après. 

Avant de passer à la partie suivante, n'oubliez pas un petit `apt-get update` dans votre petit terminal !


> Pour la suite du TP, la triche est __interdite__. Cependant je vous **encourage** à avoir un esprit de promo et donc d'aider vos camarades en difficultés (coucou les YAKAs :) ), qui sera bien entendu bien vu. Cependant, ne vous partagez pas les _hash_ générés aux différentes étapes, car ils sont propres à votre login et votre environnement.

> Ce tp est un _follow the guide_, il devrait donc être bouclé en 20min (installation comprise).
 
> Vous  pouvez suivre votre avancement sur [http://217.182.253.20/advancement](http://217.182.253.20/advancement)
> Attention: Avoir 100% ne veut pas dire 20/20 ! D'autres variables calculées par la moulinette rentrent en jeu. Par contre, un 0% à de forte chance de ne pas vous rapporter beaucoup de point...

Le programme de ce TP:

1. Installation basique de notre environnement.
2. On se fait tourner une première application
3. Idem en jouant avec les ports de notre machine
4. On utilise un vrai _reverse proxy_ pour manager un minimum l'utilisation des ports
5. On couple notre _reverse proxy_ avec notre application
6. On monte notre base de données
7. On utilise une version sécurisée de notre base de données


> Pour la suite du TP, merci d'utiliser vos logins tels qu'ils m'ont été communiqué:
```
    const login_arr = [
        "nicolas.acart",
        "quentin.barbarat",
        "axel.baroux",
        "bazill_e",
        "boucen_s",
        "bouche_7",
        "ingo.braekman",
        "allan.cantin",
        "chung_f",
        "colon_b",
        "thomas.curti",
        "julien.da-cunha",
        "hugo.dairin",
        "thibaut.de-la-chapelle",
        "clement.dedenis",
        "yohann.degli-esposti",
        "alexandre.delaunay",
        "gatien.delerue",
        "louis.dufeu",
        "el_hal_a",
        "gauthier.fiorentino",
        "thomas.franel",
        "jeanne.gardebois",
        "antonin.ginet",
        "gracia_a",
        "antoine.harel",
        "samy.hussaein",
        "kevin.lai",
        "antoine.lievre",
        "sebastien.lin",
        "baptiste.lloret",
        "thomas1.lopes",
        "loyau_n",
        "martin.marx",
        "vincent1.masson",
        "oceane.merlo",
        "antoine.montes",
        "di-lam.nguyen",
        "noumri_i",
        "sarah.onfray",
        "florian.padel",
        "papini_j",
        "piro_j",
        "pouzad_f",
        "paul.putier",
        "james.richet",
        "ruth_p",
        "bastien.seira",
        "killian.siou",
        "thanh-tam-tangu.tran",
        "turlie_m",
        "jean-louis.ung",
        "varet_p",
        "maxime.yip"
    ];
```

Si vous avez un problème, faites moi signe !

# I] _Basics_

> Commande(s) utile(s) pour cette partie:
> 
> * apt-get
> * adduser
> * sudo
> * echo

Commençons par quelques basiques lors de la création d'un nouvel environnement de travail.

## 1] _root_ c'est le mal

Parce qu'on ne fait pas n'importe quoi, la première chose à faire lors de la création d'un serveur est de créer un utilisateur.

```sh
sudo adduser login_x		# Remplacez par votre login
```
Du moment que l'on vous demande une information autre que le mot de passe (par exemple full name, room number, etc), renseignez votre login.

Une fois l'utilisateur créé (avec un mot de passe !!), vous pouvez vous déconnecter / reconnecter sur votre compte utilisateur.

## 2] M.A.J.

Dans cette partie, nous allons tout simplement installer les outils que nous allons utiliser: 

* Git: Pour récupérer notre application serveur
* Curl: Pour tester notre application
* NodeJS: Notre application tourne sur NodeJS
* NPM: Package manager
* Nginx: Notre reverse proxy
* MongoDB: Notre base de donnée que l'on va installer via le script suivant:
```sh
#1
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

#2
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

#3
sudo apt-get update

#4
sudo apt-get install -y mongodb-org
```

> Lorsque l'on crée un serveur (Linux, Windows, _MacChose_), il est important d'adopter les bons réflexes en installant les outils que vous utiliserez de toute façon tôt ou tard tel que Git, Docker (si vous êtes fan des conteneurs) etc...
> ____
> Pour les _Même pas peur_: Il peut être intéressant et "amusant" (suivant le point de vue) de faire un petit script __sh__ pour dl et installer le tout. Ainsi, un simple `curl my_remote_script.sh | bash` et c'est gagné !
> 
> Pour les _Même pas peur_ de la catégorie _Même pas peur_: Ansible, Vagrant, etc...

# II] Backend (#LoveTiger)

> Commande(s) utile(s) pour cette partie:
> 
> * git
> * netstat
> * ps
> * npm
> * export
> * kill
> * env
> * grep 

Pour ce tp, vous allez utiliser un _backend_ en Node JS très simple qui s'occupera de vous retourner des _hash_. Le code est volontairement "pas-super-lisible", non pas pour éviter la triche, mais surtout parce que le but du tp est l’orchestration du serveur et non la logique du _backend_.

`clone https://github.com/adrienfenech/tplinux_locale.git`

Une fois cloné, un petit `npm install` à l'intérieur du projet sera le bienvenu.

## Checkpoint 1

Pour vérifier que tout fonctionne bien, un petit `npm run step1` devrait vous demander votre login et vous donner finalement un _hash_ qui vous sera utile pour la suite.

> Si cela ne fonctionne pas, vérifiez que vous utilisez bien le compte utilisateur correspondant à votre login et non root. (`env | grep -G ^HOME=` devrait vous retourner `/home/login_x`).

Une fois le _hash_ récupéré, vous pouvez le stocker dans une variable d'environnement que vous nommerez `STEP_1_VAR` qui sera utilisé par la suite.

> Les variables d'environnements sont un point clé des mises en production d'application. L'exemple le plus courant est celui des identifiants / mot de passe de connexion que vous n'incluez JAMAIS dans des repo git etc...

## Checkpoint 2

Il est important lorsque l'on crée un serveur d'être au point sur l'utilisation des ports. Plus le nombre de port ouvert est grand, plus vous vous exposez à des risques de sécurités (cf SRS).

Il est temps de lancer `npm run step2`.

Ici seulement 3 ports sont utilisés par notre application. Vous pouvez les découvrir via  `netstat -tulpn`. Ceux qui vous intéressent sont ceux liés à notre process en cours ;)

Une fois que vous les avez récupéré, direction http://217.182.253.20/step2/login_x avec votre _hash_ de l'étape 1.
_____
**ATTENTION**

*  Le port 5xxxx correspond au port le plus petit
*  Le port 5yyyy correspond au port intermédiaire
*  Le port 5zzzz correspond au port le plus grand

Par exemple: Si les ports utilisés sont **50657**, **57056** et **50403** alors: 

* 5xxxx <=> 50403
* 5yyyy <=> 50657
* 5zzzz <=> 57056
_____

Rentrez les 3 ports utilisés. Si tout se passe bien, vous devriez récupérer  un nouvel _hash_. qui va terminé en variable d'environnement `STEP_2_VAR`.


> Durant le tp (et la vraie vie également), il est possible que certaines erreurs par rapport à l'utilisation des _ports_ sur la machine se manifestent. Dans ces cas là, pas de panique (sauf si vous êtes à 5min de la fin du tp, ou de votre vie):
>
> `netstat -tulpn | grep LISTEN` vous permettra de découvrir quels sont les ports utilisés sur votre machine.
>
> `ps aux | grep node` vous permettra de découvrir quel est le **pid** associé à votre process Node JS
>
> `kill [pid]` devrait en venir à bout.
>___
> Pour les _Même pas peur_: **SCRIPT**


# III] Nginx

> Commande(s) utile(s) pour cette partie:
> 
> * sudo
> * systemctl
> * ufw
> * curl

## Setup

Vous avez normalement installé votre _nginx_ il y a un peu moins de 5min si tout se passe bien. Nous allons nous occuper d'un petit _firewall_ utilisé avec Nginx.

`sudo ufw app list` devrait normalement vous afficher:
```sh
$ sudo ufw app list
 
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  [...]
```

Il s'agit des profils disponibles pour votre _nginx_:

* **Nginx HTTP** ouvrira uniquement le port 80 (Normal)
* **Nginx HTTPS** ouvrira uniquement le port 443 (TLS/SSL)
* **Nginx Full** Ouvrira donc les deux (80 & 443)

> Il est recommandé de toujours rester au plus restrictif !
> ___
> Pour les _Même pas peur_: Idem, on fait pas le malin

Nous allons ici nous restreindre à HTTP: `sudo ufw allow 'Nginx HTTP'`
Et pour vérifier: `sudo ufw status` qui devrait vous afficher:
```sh
$ sudo ufw status

Status: active

To                         Action      From
--                         ------      ----
Nginx HTTP                 ALLOW       Anywhere                  
Nginx HTTP (v6)            ALLOW       Anywhere (v6)
[...]                      [...]       [...]
```

Si ce n'est pas le cas, `sudo ufw --help` vous permettra d'y voir un plus clair, et vous devriez trouver une commande pour _activer_ le service.

Pour vérifier que tout fonctionne: 

1. `systemctl status nginx` devrait vous dire que le service est actif
2. `curl -4 127.0.0.1` devrait également vous retourner la page html de Nginx.

> Voici une petite panoplie de commandes pouvant être utile:
> `sudo systemctl [cmd] nginx` avec  `cmd` pouvant être
> 
> * `start` ...
> * `stop ` ...
> * `restart` ...
> * `reload` Permet de récupérer de nouvelles configurations sans _drop_ des connections 
> * `enable` Quand le serveur se lance, nginx le fera également
> * `disable` ...

Si c'est les cas, alors __Checkpoint 3__

## Checkpoint 3

Il est temps de passer ce checkpoint qui sera automatiquement validé si vos commandes précédentes ont fonctionnées. `npm run step3` devrait vous donner un nouveau _hash_ qui partira dans `STEP_3_VAR`.

# IV] Nginx + Backend


> Commande(s) utile(s) pour cette partie:
> 
> * ?

Il est temps d'orchestrer !

## Orchestration

Nginx se configure principalement via un fichier de configuration, situé par défaut `/etc/nginx/sites-available/default`

Notre application Node JS utilise 3 ports que vous avez trouvé précédemment:

* Le port _5xxxx_ donnant accès à une route `api`
* Le port _5yyyy_ donnant accès à une route `ipa`
* Le port _5zzzz_ donnant accès à une route `db`

_____
**RAPPEL**

*  Le port 5xxxx correspond au port le plus petit
*  Le port 5yyyy correspond au port intermédiaire
*  Le port 5zzzz correspond au port le plus grand

_CF plus haut_
_____

Pour lier le tout, nous allons créer une autre gestion 'location' dans nginx, pour cela modifier le fichier de configuration en ajoutant 3 objets locations de la forme suivante: 
```
location /api {
        proxy_pass http://127.0.0.1:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
```

Modifier simplement la **location** et le **port**  associé comme suit:

* `/api` -> port _5xxxx_
* `/ipa` -> port _5yyyy_
* `/db` -> port _5zzzz_

Il y a "éventuellement" du code à ajouter :)

Pour checker, rien de pus simple: `curl 127.0.0.1/api` devrait vous renvoyer un `status 200`, tout comme `curl 127.0.0.1/ipa` et `curl 127.0.0.1/db`.

De même que `curl 127.0.0.1/api` devrait être égal à `curl 127.0.0.1:5xxxx/api` alors que `curl 127.0.0.1:5yyyy/api` ne devrait pas fonctionner.

C'est le cas ? Super, direction __Checkpoint 4__


## Checkpoint 4

On perd pas de temps et on run un `npm run step4` qui vous donnera un nouveau _hash_ qui partira dans `STEP_4_VAR`.

# V] MongoDB (#MayBeIHateSql)

> Commande(s) utile(s) pour cette partie:
> 
> * mongo
> * db
> * insert
> * use

Pour changer un peu du sql, nous allons ici mettre en place une base de données '_document_': MongoDB

## Init

Vérifier tout d'abord que votre MongoDB est en vie: `sudo netstat -tlnpu` et checkez si le process mongod (ou mongodb) tourne sur le port 27017.

Il est temps d'attaquer Mongo avec la commande `mongo`. Vous devriez vous retrouver dans le shell mongo.
Chargez la base **basicdb**  avec `use basicdb`

et ajouter l'objet suivant à la collection O (C'est la lettre et non un zero...) en remplaçant login_x par votre login:

```
db.O.insert({ o: login_x })
```

et utilisez la méthode `find()` sur cette même collection pour vérifier que votre objet est présent.

## Checkpoint 5

Dernier checkpoint automatique: `npm run step5` qui vous donnera un nouveau _hash_ qui partira dans `STEP_5_VAR`.

# VI] MongoDB (#Security)

> Commande(s) utile(s) pour cette partie:
> 
> * mongo
> * db
> * insert
> * use
> * createUser

Dernière étape du TP ! 
>"Quoi ? Déjà ? 10min de tp au total, 20min en comptant l'installation, rajoute moi du contenu s'il te plait !"
> ___
> Pour les _Même pas peur_: Vous pouvez toujours vous dire que "La sécurité c'est surfait", mais en fait non.


## Init secure

Vérifiez que vous avez tout fait avant, et que tout fonctionne (Vous n'aurez pas la possibilité de revenir en arrière) ! NodeJS ne sera pas couplé avec le Mongo sécurisé.
Cette fois, on va sécuriser notre DB: On repart dans mongo, mais cette fois on switch sur `admin`.

et on créé un utilisateur via `db.createUser(...)`
L'utilisateur est un objet comprenant:

* Un champ `user` avec pour valeur `admin`
* Un champ `pwd` avec pour valeur `test`
* Un champ `roles` avec pour valeur un tableau comprenant un  seul objet:
	* Un champ `role` avec pour valeur `root`
	* Un champ `db` avec pour valeur `admin`

Si tout est bon, mongo vous le fera savoir. 
Modifier maintenant `/lib/systemd/system/mongod.service` et  ajouter `--auth` à la ligne `ExecStart....`.
Un petit `systemd daemon-reload` suivi d'un `sudo service mongodb restart` nous permettra de prendre ces changements en compte.

## Checkpoint 6

Montrez moi que `mongo -u admin -p test --authenticationDatabase admin` fonctionne, et on pourra aller prendre un café !

# VII] Pour aller plus loin...

Parce que vous vous ennuyez déjà, voici quelques pistes de recherches que nous verront possiblement durant nos heures de DevOps mais qui peuvent vous rapporter des points pour ce tutoriel (à envoyer sur "adrienfenech@gmail.com" et comme objet "[MTI][TP-linux] login_x"):

* Refaire ce tp en moins de 2min30 avec Docker (Téléchargement et installation compris),
* Gérer dynamiquement la génération de configuration nginx
* Faire un _push to configure_ (Une commande à exécuter pour installer et configurer). Script sh que l'on peut lancer facilement: `curl my_remote_script.sh | bash`)
* Faire un _push to start_ (Une commande à exécuter pour installer, configurer et lancer). Script sh + Docker peut être un très beau combo (idem: `curl my_remote_script.sh | bash`)
* Lancer une belle CI pour tester les différentes étapes à notre place (A quoi ça sert de la lancer si elle crash :)).
* Et surtout le plus important, __aider vos camarades__. Une promo MTI sans esprit de promo a toujours été un échec pour le reste de l'année.
---
Adrien Fenech

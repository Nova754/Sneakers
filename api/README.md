# RESTAPI

## Documentation de l’API Restaurant

### Installation

1. ***Docker*** : On l'utilise pour créer la base de données MySQL et phpMyAdmin. [Télécharger Docker](https://www.docker.com/products/docker-desktop)
2. ***Node.js*** : L'API est construite grâce Node.js. [Installer Node.js](https://nodejs.org/en)
3. ***Postman*** : On l'utilise pour tester les routes de l'API. [Télécharger Postman](https://www.postman.com/downloads/)

### Installation et Configuration

#### Étape 1 : Installer les dépendances Node.js

```
npm init -y
 
npm install express
 
npm install mysql2
```
On utilise 
- express pour simplifier la gestion des requêtes HTTP, des routes et des middleware (fonction dans une application web qui se situe entre la requête d’un client et la réponse du serveur)
- mysql2, une bibliothèque pour intéragir avec des bases de données MySQL

#### Étape 2 : Configuration de MySQL et phpMyAdmin avec Docker

1. On télécharge le fichier `docker-compose.yml` dans le dossier du projet.
2. On lance Docker pour configurer MySQL et phpMyAdmin :

```
docker-compose up -d
```

3. On accède à phpMyAdmin via [http://localhost:6060](http://localhost:6060) et on se connecte avec les identifiants suivants :
- ***Nom d'utilisateur*** : `root`
- ***Mot de passe*** : `teo`

La base de données `restaurantapi` sera déjà créée et on pourra y gérer les tables et données via phpMyAdmin.

#### Étape 3 : Démarrer le Serveur API

Une fois la base de données opérationnelle, on démarre le serveur API avec :

```
node index.js
```

L'API sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

### Authentification

L'API utilise une authentification basique pour limiter l'accès à certaines routes aux administrateurs. On configure deux types d'utilisateurs : 

- ***Administrateur*** :
  - Nom d'utilisateur : `admin`
  - Mot de passe : `adminpassword`
  - Rôle : `admin`
  
- ***Utilisateur*** :
  - Nom d'utilisateur : `client`
  - Mot de passe : `clientpassword`
  - Rôle : `client`

### Endpoints de l'API (URL spécifiques sur un serveur web qui permettent aux utilisateurs d'accéder à des bases de données ou des services via à l'API)

On utilise des méthodes HTTP : GET, POST, PUT, DELETE, PATCH, OPTIONS.

#### Items

***GET***
- `GET /items` : Récupération de tous les items.
- `GET /items/:id` : Récupération d'un item par son ID.


***POST***
- `POST /items` : Ajout d'un nouvel item (réservé aux administrateurs).


***PUT***
- `PUT /items/:id` : Mise à jour d'un item par son ID, remplacement de l'ensemble de la ressource (réservé aux administrateurs).


***DELETE***
- `DELETE /items/:id` : Supression d'un item par son ID (réservée aux administrateurs).

***PATCH***
- `PATCH /items/:id` : Mise à jour d'un item par son ID, application des modifications partielles à la ressource (réservée aux administrateurs)

#### Catégories

***GET***
- `GET /categories` : Récupération de toutes les catégories.
- `GET /categories/:id` : Récupération d'une catégorie par son ID.

***POST***
- `POST /categories` : Ajout d'une nouvelle catégorie (réservé aux administrateurs).

***PUT***
- `PUT /categories/:id` : Mise à jour d'une catégorie par son ID, remplacement de la ressource entière (réservé aux administrateurs).

***DELETE***
- `DELETE /categories/:id` : Suppression d'une catégorie par son ID (réservé aux administrateurs).

***PATCH***
- `PATCH /categories/:id` : Mise à jour d'une catégorie par son ID, application des modifications partielles à la ressource (réservée aux administrateurs).

#### Formules

***GET***
- `GET /formulas` : Récupération de toutes les formules (filtrage par nom, prix, et catégorie disponible).
- `GET /formulas/:id` : Récupération d'une formule par son ID.

***POST***
- `POST /formulas` : Ajout d'une nouvelle formule (réservé aux administrateurs).

***PUT***
- `PUT /formulas/:id` : Mise à jour d'une formule par son ID, remplacement de la ressource entière (réservé aux administrateurs).

***DELETE***
- `DELETE /formulas/:id` : Suppression d'une formule par son ID (réservée aux administrateurs).

***PATCH***
- `PATCH /formulas/:id` : Mise à jour d'une formule par son ID, application des modifications partielles à la ressource (réservée aux administrateurs).

#### Filtre 

***GET***
- `GET /item?parameters=` : Filtrer les items en fonction du paramètre (nom, description, prix et catégorie).
- `GET /formulas?parameters=` : Filtrer les formules en fonction du paramètre (nom, prix et catégorie)

#### Affichage des méthodes autorisées en fonction du type d'utilisateur

***OPTIONS***
- cela s'affiche dès que l'URL `http://localhost:3000` est écrit.

### Tester l'API avec Postman

Pour vérifier que les requêtes de l'API fonctionne, on utilise Postman :

1. On ajoute au début de l'URL `http://localhost:3000` dans les requêtes.

2. Pour choisir le type d'utilisateur qu'on souhaite être :
  - on va sur l'onglet **Authorization**.
  - puis sur **Basic Auth**.
  - on écrit l'identifiant et le mot de passe de l'utilisateur qu'on veut tester

3. Si on souhaite mettre à jour des données avec les commandes PUT et PATCH :
  - on va sur l'onglet **Body**
  - puis sur **raw**
  - on choisit **JSON**
  - on écrit les modifications qu'on souhaite effectuer.

  ***Exemple***
  ```json
  {
    "id": 2,
    "name": "Pizza Margherita",
    "description": "Pizza traditionnelle avec sauce tomate et fromage",
    "price": 10.99,
    "category_id": 1
  }
  ```

4. Si on souhaite afficher les méthodes autorisées en fonction de l'utilisateur :
  - on va sur l'onglet **Headers**
  
  ***Exemple***

  |                              |              |
  |------------------------------|--------------|
  | Allow                        | GET, OPTIONS |
  | Access-Control-Allow-Methods | GET, OPTIONS |
  | Access-Control-Allow-Origin  |      *       |

5. Signification des codes de statut HTTP qui s'affichent à chaque requête
    - **200 OK**
      - La requête a réussi. Le serveur a renvoyé la réponse demandée. 

    - **201 Created**
      - La requête a été réussie et qu’une nouvelle ressource a été créée à la suite de cette requête. 

    - **204 No Content**
      - La requête a été réussie, mais qu’il n’y a pas de contenu à renvoyer. 

    - **400 Bad Request**
      - La requête envoyée au serveur est mal formée ou invalide. Cela peut être dû à des données manquantes ou à une syntaxe incorrecte.

    - **401 Unauthorized**
      - L’utilisateur doit s’authentifier pour accéder à la ressource demandée. 

    - **403 Forbidden**
      - Le serveur a compris la requête, mais refuse de l’exécuter. Cela peut être dû à des permissions insuffisantes pour accéder à la ressource.

    - **404 Not Found**
      - Le serveur n’a pas trouvé la ressource demandée. Cela se produit souvent lorsque l’URL demandée est incorrecte ou lorsque la ressource a été supprimée.

    - **500 Internal Server Error**
      - Il y a eu une erreur inattendue sur le serveur lors du traitement de la requête. Cela peut être dû à un bug dans le code du serveur ou à un problème avec la configuration du serveur.
# SNEAKERS

## Documentation de l’API Rest

### Introduction
SneakR est une API permettant d'afficher les items et de gérer les utilisateurs, les collections et les wishlists de sneakers. Elle offre des fonctionnalités telles que l'enregistrement des utilisateurs ainsi que l'envoi de la collection par e-mail.


### Installation

1. ***Docker*** : On l'utilise pour créer la base de données MySQL et phpMyAdmin. [Télécharger Docker](https://www.docker.com/products/docker-desktop)
2. ***Node.js*** : L'API est construite grâce Node.js. [Installer Node.js](https://nodejs.org/en)
3. ***Postman*** : On l'utilise pour tester les routes de l'API. [Télécharger Postman](https://www.postman.com/downloads/)

### Installation et Configuration

#### Étape 1 : Installer les dépendances Node.js

On utilise :
- express : Framework web pour Node.js.
- mysql2 : Connecteur MySQL pour Node.js.
- bcrypt : Bibliothèque pour le hachage de mots de passe.
- cors : Middleware pour autoriser les requêtes CORS.
- pdfkit : Librairie pour générer des PDF.
- nodemailer : Module pour envoyer des e-mails via Node.js.

```
npm init -y
 
npm install express 
npm install mysql2
npm install bcrypt 
npm install cors
npm install pdfkit
npm install nodemailer
```


#### Étape 2 : Configuration de MySQL et phpMyAdmin avec Docker

1. On télécharge le fichier `docker-compose.yml` dans le dossier du projet.
2. On lance Docker pour configurer MySQL et phpMyAdmin :

```
cd api
docker-compose up -d
```

3. On accède à phpMyAdmin via [http://localhost:6060](http://localhost:6060) et on se connecte avec les identifiants suivants :
- ***Nom d'utilisateur*** : `root`
- ***Mot de passe*** : `teo`

4. On crée la base de données sneakersapi et ajoute les différentes tables avec les colonnes en copiant le code suivant dans l'onglet **SQL**


``` sql
CREATE DATABASE sneakersapi;

USE sneakersapi;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lastName VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50)
);

CREATE TABLE item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    brand VARCHAR(255),
    colorway VARCHAR(255),
    retailPrice DECIMAL(10, 2),
    estimatedMarketValue DECIMAL(10, 2),
    image VARCHAR(255)
);

CREATE TABLE collections (
    user_id INT,
    sneaker_id INT,
    PRIMARY KEY (user_id, sneaker_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (sneaker_id) REFERENCES item(id)
);

CREATE TABLE wishlists (
    user_id INT,
    sneaker_id INT,
    PRIMARY KEY (user_id, sneaker_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (sneaker_id) REFERENCES item(id)
);
```
5. On importe les données à la base de données en copiant le code suivant dans le **terminal**

```
cd api
node import.js
```
6. On enleve les items n'ayant pas d'image avec le code suivant dans le **SQL de la table item**
```
DELETE FROM item
WHERE image = '[]';
```

#### Étape 3 : Démarrer le Serveur API

Une fois la base de données opérationnelle, on démarre le serveur API avec :

```
cd api
node index.js
```

L'API sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).


### Endpoints de l'API (URL spécifiques sur un serveur web qui permettent aux utilisateurs d'accéder à des bases de données ou des services via à l'API)

On utilise des méthodes HTTP : GET, POST, PUT, DELETE

#### 1. `/item` - Récupérer les sneakers avec pagination
- **Méthode** : `GET`
- **Paramètres** :
  - `page` : Page de la pagination (par défaut : 1)
  - `limit` : Nombre d'articles par page (par défaut : 8)
- **But** : Récupérer la liste paginée des sneakers disponibles.

---

#### 2. `/register` - Inscription d'un nouvel utilisateur
- **Méthode** : `POST`
- **Paramètres** : 
  - `lastName` : Nom de famille
  - `name` : Prénom
  - `email` : Adresse e-mail
  - `password` : Mot de passe
- **But** : Créer un nouvel utilisateur dans le système.

---

#### 3. `/login` - Connexion de l'utilisateur
- **Méthode** : `POST`
- **Paramètres** :
  - `email` : Adresse e-mail
  - `password` : Mot de passe
- **But** : Authentifier l'utilisateur et lui fournir ses informations (ID, nom, rôle, etc.).

---

#### 4. `/users` - Récupérer tous les utilisateurs
- **Méthode** : `GET`
- **But** : Récupérer la liste de tous les utilisateurs dans le système.

---

#### 5. `/users/:id` - Récupérer les détails d'un utilisateur
- **Méthode** : `GET`
- **Paramètres** :
  - `id` : ID de l'utilisateur
- **But** : Récupérer les informations détaillées d'un utilisateur spécifique.

---

#### 6. `/users/:id` - Mise à jour du rôle de l'utilisateur
- **Méthode** : `PUT`
- **Paramètres** :
  - `role` : Nouveau rôle de l'utilisateur (ex. 'USER', 'ADMIN')
- **But** : Modifier le rôle d'un utilisateur dans le système.

---

#### 7. `/users/:id` - Suppression d'un utilisateur
- **Méthode** : `DELETE`
- **Paramètres** :
  - `id` : ID de l'utilisateur
- **But** : Supprimer un utilisateur spécifique du système.

---

#### 8. `/collections` - Ajouter un sneaker à la collection de l'utilisateur
- **Méthode** : `POST`
- **Paramètres** :
  - `userId` : ID de l'utilisateur
  - `sneakerId` : ID du sneaker
- **But** : Ajouter un sneaker à la collection de l'utilisateur.

---

#### 9. `/wishlists` - Ajouter un sneaker à la wishlist de l'utilisateur
- **Méthode** : `POST`
- **Paramètres** :
  - `userId` : ID de l'utilisateur
  - `sneakerId` : ID du sneaker
- **But** : Ajouter un sneaker à la wishlist de l'utilisateur.

---

#### 10. `/wishlists/:userId` - Récupérer la wishlist d'un utilisateur
- **Méthode** : `GET`
- **Paramètres** :
  - `userId` : ID de l'utilisateur
- **But** : Récupérer la liste des sneakers présents dans la wishlist de l'utilisateur.

---

#### 11. `/collections/:userId` - Récupérer la collection d'un utilisateur
- **Méthode** : `GET`
- **Paramètres** :
  - `userId` : ID de l'utilisateur
- **But** : Récupérer la liste des sneakers dans la collection de l'utilisateur.

---

#### 12. `/collections/:userId/:sneakerId` - Supprimer un sneaker de la collection de l'utilisateur
- **Méthode** : `DELETE`
- **Paramètres** :
  - `userId` : ID de l'utilisateur
  - `sneakerId` : ID du sneaker
- **But** : Supprimer un sneaker de la collection de l'utilisateur.

---

#### 13. `/wishlists/:userId/:sneakerId` - Supprimer un sneaker de la wishlist de l'utilisateur
- **Méthode** : `DELETE`
- **Paramètres** :
  - `userId` : ID de l'utilisateur
  - `sneakerId` : ID du sneaker
- **But** : Supprimer un sneaker de la wishlist de l'utilisateur.

---

#### 14. `/send-collection-email` - Envoyer la collection par e-mail
- **Méthode** : `POST`
- **Paramètres** :
  - `userId` : ID de l'utilisateur
  - `userEmail` : E-mail de l'utilisateur
- **But** : Envoyer la collection de sneakers de l'utilisateur à son adresse e-mail.

#### Signification des codes de statut HTTP qui s'affichent à chaque requête
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
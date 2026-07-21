# MotoSearch

(frontend temporaire généré à l'IA pour s'amuser)

## Stack


Node.js 22 

TypeScript 5

Prisma 5

PostgreSQL 15

JWT + bcrypt


## Lancer l'API

###  mock

```bash
DATA_SOURCE=mock
```

### bdd prisma

```bash
docker compose up -d

npx prisma migrate dev --name init
npx prisma db seed

DATA_SOURCE=db
npm run dev
```


## Endpoints

#### Lister les motos

```
GET /api/motos
```


#### Détail d'une moto

```
GET /api/motos/:id
```




#### Créer un compte

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "utilisateur@example.com",
  "password": "monmotdepasse"
}
```

retourne un token JWT

#### Se connecter

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "utilisateur@example.com",
  "password": "monmotdepasse"
}
```



#### Lister ses favoris

```
GET /api/favoris
```


#### Ajouter un favori

```
POST /api/favoris/:motoId
```


#### Supprimer un favori

```
DELETE /api/favoris/:motoId
```
Tous les endpoints favoris nécessitent un token JWT.

## Score
### Calcul du score
Le score se calcul en fonction de si le résultat correspond aux critères (filtres).
Lorsqu'il n'y a pas de filtre, seule le kilometrage et la date de publication de l'annonce contribue. Dans ce cas, la note maximal ne peut être que de 6.

Le score maximum étant de 20, voici comment il peut être calculé :
```
marque (+5) 
type (+4) 
région (+3) 
prix très centré (+3)
 km < 5000 (+3) 
 annonce < 7 jours (+3)
```
Le permis A2 n'est pas compté car c'est un filtre optionnel.

### Route score 
Renvoie toute les motos de la marque Yamaha trié par leur score
```
GET /api/motos?marque=Yamaha&sortBy=score&order=desc
```

## Schéma d'architecture
![img.png](img.png)
# API de comptes

## Configuració

La base URL del backend és:

```text
http://localhost:<PORT>
```

El proxy del frontend utilitza `http://localhost:5008` per defecte. Per canviar-lo, defineix `API_BASE_URL` a l'entorn de Next.js.

Totes les peticions necessiten aquests headers:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

El JWT ha de contenir l'ID de l'usuari autenticat. El backend obté l'usuari a partir del token. No s'ha d'enviar `userId` en cap body.

## Endpoints

### Crear un compte

```http
POST /v1/account
```

Crea un compte bancari per a l'usuari autenticat. L'ID del compte i l'IBAN es generen automàticament.

Body obligatori:

```json
{
  "typeAccount": "CURRENT_ACCOUNT"
}
```

`typeAccount` accepta `CURRENT_ACCOUNT` o `PAYROLL_ACCOUNT`.

Resposta correcta: `201 Created`.

No s'han d'enviar `userId`, `id` ni `iban` en aquesta petició.

### Obtenir els comptes de l'usuari autenticat

```http
GET /v1/accounts/me
```

No necessita body. Resposta correcta: `200 OK`.

```json
{
  "message": "Accounts retrieved successfully",
  "data": {
    "accounts": [
      {
        "id": "account-id",
        "iban": "ES...",
        "balance": 1000,
        "typeAccount": "CURRENT_ACCOUNT"
      }
    ]
  }
}
```

### Obtenir un compte per ID

```http
GET /v1/account/:id
```

El paràmetre `id` és obligatori. Exemple: `GET /v1/account/123`.

Resposta correcta: `200 OK`.

### Actualitzar completament un compte

```http
PUT /v1/account/:id
```

El paràmetre `id` és obligatori. Aquesta operació substitueix les dades principals del compte.

```json
{
  "iban": "ES1234567890123456789012",
  "balance": 1500,
  "typeAccount": "CURRENT_ACCOUNT"
}
```

Camps: `iban` és `string`, `balance` és `number` i `typeAccount` és `CURRENT_ACCOUNT` o `PAYROLL_ACCOUNT`.

Resposta correcta: `200 OK`.

### Actualitzar només el saldo

```http
PATCH /v1/account/:id
```

El paràmetre `id` és obligatori. Aquesta operació només modifica el saldo.

```json
{
  "balance": 2500
}
```

Resposta correcta: `200 OK`.

PUT i PATCH tenen peticions i formularis diferents en el client: `updateAccount` i `updateAccountBalance`.

### Eliminar un compte

```http
DELETE /v1/account/:id
```

El paràmetre `id` és obligatori i no necessita body.

Resposta correcta: `200 OK`.

## Errors habituals

- `400`: dades incorrectes o falta l'ID del compte.
- `401`: token absent, invàlid o caducat.
- `404`: compte o usuari no trobat.
- `409`: l'usuari ja té un compte o hi ha conflicte amb l'IBAN.
- `500`: error intern del servidor.

## Nota sobre `/me`

`GET /v1/account/me` existeix, però actualment retorna les dades de l'usuari autenticat, no els seus comptes. Per obtenir els comptes s'ha d'utilitzar:

```http
GET /v1/accounts/me
```

## Rutes del proxy del frontend

El frontend exposa les mateixes operacions amb aquestes rutes locals:

- `POST /api/account`
- `GET /api/accounts`
- `GET /api/account/:id`
- `PUT /api/account/:id`
- `PATCH /api/account/:id`
- `DELETE /api/account/:id`

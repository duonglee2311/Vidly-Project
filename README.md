# Vidly-Project
An Rental movie server built with NodeJS, Express, MongoDB and test with Jest.

- Link deloy: https://vidly-project-demo.herokuapp.com/

# API:
## Users:<hr>
>GET: /api/users/me  - get CURRENT USER

- input: HEADER: x-auth-token : _token_ (jwt of user)
- output: JSON

>POST: /api/users/ - register account <br>
- input:
     BODY: { "name": _value_, "email": _value_, "password": _value_ }
- output:  { "name": _value_, "email": _value_ }

## Auth:<hr>
>GET: /api/auth/  - Login

- input: BODY: { "email": _value_, "password": _value_ }
- output: token (jwt)

## Customers:<hr>
>GET: /api/customers/  - get All the customers
- input: none
- output: JSON Array

>GET: /api/customers/:id - get customer by id
- input: none
- output: JSON <br>
>POST: /api/genres/ - create a new customer <br>
- input:
     HEADER: x-auth-token : _token_ (jwt of user)
     BODY: { "name": _value_, "phone": _value_, "isGold": _value_ }
- output:  { "_id": _value_ , "name": _value_, "phone": _value_, "isGold": _value_ }
>PUT: /api/customers/ - update an exist customer
- input:
     HEADER: x-auth-token : _token_ (jwt of user)
     BODY: { "name": _value_ }
- output:{ "_id": _value_ , "name": _value_ }<br>
>DELETE: /api/customers/:id - delete customer
- input
  HEADER: x-auth-token : _token_ : _token_ (jwt of admin)
- output: { "_id": _value_ , "name": _value_ }

## Genres:<hr>
>GET: /api/genres/  - get All the genres

- input: none
- output: JSON Array

>GET: /api/genres/:id - get genres by id
- input: none
- output: JSON <br>
>POST: /api/genres/ - create a new genre <br>
- input:
     HEADER: x-auth-token : _token_ (jwt of admin)
     BODY: { "name": _value_ }
- output:  { "_id": _value_ , "name": _value_ }
>PUT: /api/genres/ - update an exist genre
- input:
     HEADER: x-auth-token : _token_ (jwt of admin)
     BODY: { "name": _value_ }
- output:{ "_id": _value_ , "name": _value_ }<br>
>DELETE: /api/genres/:id - delete genre
- input
  HEADER: x-auth-token : _token_ (jwt of admin)
- output: { "_id": _value_ , "name": _value_ }

## Movies:<hr>
>GET: /api/movies/  - get All the movies
- input: none
- output: JSON Array

>GET: /api/movies/:id - get movies by id
- input: none
- output: JSON <br>
>POST: /api/movies/ - create a new movie <br>
- input:
     HEADER: x-auth-token : _token_ (jwt of admin)
     BODY: { "title": _value_, "genreId":_value_, "numberInStock":_value_, "dailyRentalRate": _value_ }
- output:  { "_id": _value_ , "title": _value_, "genreId":_value_, "numberInStock":_value_, "dailyRentalRate": _value_ }
>PUT: /api/movies/ - update an exist movie
- input:
     HEADER: x-auth-token : _token_ (jwt of admin)
     BODY: { "title": _value_, "genreId":_value_, "numberInStock":_value_, "dailyRentalRate": _value_ }
- output:{ "_id": _value_ ,"title": _value_, "genreId":_value_, "numberInStock":_value_, "dailyRentalRate": _value_ }
>DELETE: /api/movies/:id - delete movie
- input
  HEADER: x-auth-token : _token_ (jwt of admin)
- output: { "_id": _value_ , "title": _value_, "genreId":_value_, "numberInStock":_value_, "dailyRentalRate": _value_ }

## Rental:<hr>
>GET: /api/rentals/  - get All the rentals
- input: HEADER: x-auth-token (jwt of user)
- output: JSON Array

>GET: /api/rentals/:id - get rental by id
- input: HEADER: x-auth-token : _token_ (jwt of user)
- output: JSON <br>
>POST: /api/rentals/ - create a new rental <br>
- input:
     HEADER: x-auth-token : _token_ (jwt of user)
     BODY: { "customerId": _value_, "movieId": _value_ }
- output:  { "_id": _value_ , "customerId": _value_, "movieId": _value_, "dateOut": _value_ }

## Returns
>POST: /api/rentals/ - create a new rental <br>
- input:
     HEADER: x-auth-token : _token_ (jwt of user)
     BODY: { "customerId": _value_, "movieId": _value_ }
- output:  { "_id": _value_ , "customerId": _value_, "movieId": _value_, "dateOut": _value_, "dateReturned": _value_, "rentalFee": _value_ }

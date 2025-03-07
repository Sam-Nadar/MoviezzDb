This website is made using MERN stack 

Live url : https://moviezz-db.vercel.app/register

User routes 
User registration - https://moviezz-db.vercel.app/register

User login - https://moviezz-db.vercel.app/login

Home - Get all movies & filtering movies - https://moviezz-db.vercel.app/home

Search - search a particular movie using title or description - https://moviezz-db.vercel.app/search


Admin routes
Admin registration - https://moviezz-db.vercel.app/register 
for both user & admin register route is same 

Admin login - https://moviezz-db.vercel.app/admin/login
Note : The website will take you to https://moviezz-db.vercel.app/login but manually change the url to https://moviezz-db.vercel.app/admin/login. It is done for security purpose & in future the admin login link will be gibberish

Admin Home - https://moviezz-db.vercel.app/admin/adminHome
The home route allows admin to view , edit & delete movies

Admin Add Movies - https://moviezz-db.vercel.app/admin/admin-addMovie
This route allows admin to add movie

Bonus - you can add multiple movies in one go but only via postman 
[
  {
    "title": "The Dark Knight",
    "description": "Batman faces the Joker, a criminal mastermind who unleashes chaos upon Gotham City.",
    "rating": 9.0,
    "releaseDate": "18 Jul 2008",
    "duration": 152,
    "genre": "Action, Crime, Drama"
  },

  {
    "title": "The Shawshank Redemption",
    "description": "Two imprisoned men bond over decades, finding solace and redemption through acts of kindness.",
    "rating": 9.3,
    "releaseDate": "14 Oct 1994",
    "duration": 142,
    "genre": "Drama"
  }
] 
follow the same format inside body & use the same add-movie route for adding movies (NOTE: give Authorization token)
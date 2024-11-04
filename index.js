const express = require("express");
const { Movies } = require("./utils/data"); 
const expressLayouts = require("express-ejs-layouts");
const router = express.Router();
const app = express();
const PORT = 3000;
app.use(express.static("movie/public"));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

// Routes
app.get("/", (req, res) => {
    const shuffledMovies = Movies.sort(() => 0.5 - Math.random());
    const randomMovies = shuffledMovies.slice(0, 9);
    
    res.render("index", { movies: randomMovies }); 
});

app.get("/movie/:id", (req, res) => {
  const movie = Movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send("Movie not found");

  const recommendations = Movies
    .filter((m) => m.genre === movie.genre && m.id !== movie.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  res.render("movie", { movie, recommendations });
});

app.get("/upcoming", (req, res) => {
  const upcomingMovies = Movies.slice(0, 5);
  res.render("upcoming", { upcomingMovies });
});

app.get("/topRated", (req, res) => {
    const topRatedMovies = Movies
      .filter((movie) => movie.rating && movie.rating >= 8)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 15);
    res.render("topRated", { topRatedMovies });
});

app.get("/randomMovie", (req, res) => {
    const randomMovie = Movies[Math.floor(Math.random() * Movies.length)];
    res.render("randomMovie", { movie: randomMovie });
});




app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userID = req.session["user_id"];
    console.log("user ID", userID);
    db.query(`SELECT favourites.id, maps.title, favourites.map_id FROM favourites JOIN users ON users.id = favourites.user_id JOIN maps ON maps.id = favourites.map_id WHERE favourites.user_id = $1 AND favourites.active = TRUE;`, [userID])
      .then(data => {
        const favourites = data.rows;
        console.log("fave", favourites);
        res.render("favourites", { favourites });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/add/:id", (req, res) => {
    const mapID = req.params.id;
    const userID = req.session["user_id"];
    console.log("added to favourite user id", userID)
    console.log("map ID", mapID);
    console.log("req body", req.body);

    db.query(`INSERT INTO favourites (user_id, map_id) VALUES ($1, $2) RETURNING *;`, [userID, mapID])
      .then(data => {
        const favourites = data.rows;
        console.log("fave", favourites);
        res.redirect("/favourites");
      });


  });
  router.post("/:id/delete", (req, res) => {
    const mapID = req.params.id;
    console.log("map ID", mapID);
    console.log("req body", req.body);

    db.query(`UPDATE favourites SET active = FALSE WHERE id = $1`, [mapID])
      .then(data => {
        const favourites = data.rows;
        console.log("fave", favourites);
        res.redirect("/favourites");
      });


  });
  return router;
};

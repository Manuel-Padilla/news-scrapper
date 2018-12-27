// Required dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = app => {
  // Routes
  app.get("/", (req, res) => {
    db.Article.find({})
      .then(function(data) {
        if (data) {
          let dbData = {
            article: data
          };
          res.render("index", dbData);
        } else {
          res.render("index");
        }
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // A GET route for scraping website
  app.get("/scrape", function(req, res) {
    request("https://www.houstonchronicle.com/", function(err, response, body) {
      var $ = cheerio.load(body);

      $("h2.headline").each(function(err, element) {
        var title = $(element).text();
        var paragraph = $(element)
          .parent()
          .find($("p.blurb"))
          .text();
        var link = $(element)
          .children("a")
          .attr("href");

        var scrapperObj = {
          link: link,
          title: title,
          paragraph: paragraph
        };

        db.Article.create(scrappedObj)
          .then(function(data) {
            console.log(data);
          })
          .catch(function(err) {
            return res.json(err);
          });
      });
      res.send("Scrape successful!");
    });
  });

  // Route for getting all articles from the db
  app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(data) {
        let dbData = {
          article: data
        };
        res.render("index", dbData);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Route for getting all saved articles from the db and sending it to view
  app.get("/savedarticles", function(req, res) {
    db.Article.find({
      saved: true
    })
      .then(function(data) {
        let dbData = {
          article: data
        };
        res.render("saved", dbData);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Route for saving new article
  app.post("/savedarticles/:id", function(req, res) {
    console.log(req.params.id);
    db.Article.findOnAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: {
          saved: true
        }
      }
    )
      .then(function(data) {
        res.send("article was saved in database");
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Route for deleting
  app.post("/delete/:id", function(req, res) {
    console.log(req.params.id);
    db.Article.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: {
          saved: false
        }
      }
    )
      .then(function(data) {
        res.send("article was deleted from saved");
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Route for grabbing a specific article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    db.Article.findById(req.params.id)
      .populate("note")
      .then(function(data) {
        res.json(data);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Route for saving/updating an articles associated note
  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(data) {
        return db.Article.findOneAndUpdate(
          {
            _id: req.params.id
          },
          {
            $push: {
              note: data.id
            }
          },
          {
            new: true
          }
        );
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Delete note route
  app.post("/deletenote/:id", function(req, res) {
    db.Note.remove({
      _id: req.params.id
    }).then(function(data) {
      console.log("note was deleted from the server");
      res.send("note was deleted from the server");
    });
  });
};

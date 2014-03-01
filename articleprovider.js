var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var crypto = require('crypto');

ArticleProvider = function (host, port) {
  var server = new Server(host, port);

  this.db = new Db('freetime', server, {fsync:true});
  this.db.open(function(err, db) {
    if(!err) {
      console.log("Connected to database");
      db.authenticate('freetime', '7H4v35eXftdb', function(err, res) {
        if(!err) {
          console.log("Authenticated");
        } else {
          console.log("Error in authentication.");
          console.log(err);
        }
      });
    } else {
      console.log("Error in open().");
      console.log(err);
    };
  });
};


ArticleProvider.prototype.getCollection = function (callback) {
  this.db.collection('articles', function (error, article_collection) {
    if (error) callback(error);
    else callback(null, article_collection);
  });
};

ArticleProvider.prototype.findAll = function (callback) {
  this.getCollection(function (error, article_collection) {
    if (error) callback(error)
    else {
      article_collection.find().toArray(function (error, results) {
        if (error) callback(error)
        else callback(null, results)
      });
    }
  });
};


ArticleProvider.prototype.findById = function (id, callback) {
  this.getCollection(function (error, article_collection) {
    if (error) callback(error)
    else {
      article_collection.findOne({link: id}, function (error, result) {
        if (error) callback(error)
        else callback(null, result)
      });
    }
  });
};

ArticleProvider.prototype.save = function (articles, callback) {
  this.getCollection(function (error, article_collection) {
    if (error) callback(error)
    else {
      if (typeof(articles.length) == "undefined")
        articles = [articles];

      for (var i = 0; i < articles.length; i++) {
        article = articles[i];
        article.created_at = new Date();
        // sync
        try {
          article.link = crypto.randomBytes(7).toString('hex');
          console.log('Have %d bytes of random data: %s', buf.length, buf);
        } catch (ex) {
          // handle error
          // most likely, entropy sources are drained
        }

      }

      article_collection.insert(articles, function () {
        callback(null, articles);
      });
    }
  });
};

exports.ArticleProvider = ArticleProvider;
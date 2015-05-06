var express = require('express');
var router = express.Router();

var Post = require('./../models/post');

/* GET home page. */
router.get('/', function(req, res, next) {
    Post.find(function (err, posts){
        if (err) console.log(err);
        res.render('index', { title: 'Blog', posts: posts });
    });
});

module.exports = router;

exports.new_post = function(reg, res){
    var post = new Post({
        title: req.body.post_title,
        body: req.body.post_body,
        slug: req.body.post_slug
    });
    
    post.save(function(err){
        if (err) console.log(err);
        else res.redirect('/');
    });
    
}
/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../model/Book')

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book
      .aggregate([
        {$match: {}},
        {
          $project: {
            commentcount: {$size: '$comments'},
            comments: 1,
            _id: 1,
            title: 1
          }
        }
      ])
      .then(data => res.json(data))
      .catch(err => res.json(err))
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      
      if (!title) {
        return res.json('missing required field title')
      };

      Book
      .create({title})
      .then(data => res.json({_id: data._id, title: data.title}))
      .catch(err => res.json(err))
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book
      .deleteMany({})
      .then(() => res.json('complete delete successful'))
      .catch(err => res.json(err))
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book
      .findById(bookid)
      .then(data => {
        if (!data) res.json('no book exists')
        else res.json(data);
      })
      .catch(err => res.json(err))
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.json('missing required field comment')
      }
      
      Book
      .findOneAndUpdate(
        {_id: bookid},
        {
          $push: {comments: comment}
        },
        {
          returnDocument: 'after',
          runValidators: true
        }
      )
      .then(data => {
        if (!data) res.json('no book exists') 
        else res.json(data)
      })
      .catch(err => res.json(err));
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book
      .findOneAndDelete({_id: bookid})
      .then(data => {
        if (!data) res.json('no book exists')
        else res.json('delete successful')
      })
    });
  
};

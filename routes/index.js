var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

 mongoose.connect('mongodb://127.0.0.1:27017/movie');
var db = mongoose.connection;

db.on('error',function(err){


	console.log(err)
})

db.once('open', function(){

	console.log('connected');
})


var MovieSchema = new mongoose.Schema({
        user:{type:String},
        up: {type:Number},
        down: {type:Number},
        content:{type:String},
        time:{type:Date, default:Date.now}
});

var Movie = mongoose.model("Movie", MovieSchema);


/* GET home page. */
router.get('/review/:action', function(req, res) {
 var params = req.params
if(params == "count"){
Movie.count({}, (err, count)=>{
	return res.json(count)
})
}

var limit = req.query.limit
var page = req.query.page
 



Movie.find({}).limit(limit).sort({'_id':-1}).skip(page).then((err, docs)=>{

	res.json(docs);
}) 

})  



});

router.post('/review', function(req, res){
var newMovie = new Movie({
        user: req.body.user,
        up: req.body.up,
        down: req.body.down,
        content:req.body.content
})
Movie.find({user: req.body.user},function(err, docs){
	if(err){
	console.log(err);
}else{
	if(docs.length != 0){
	console.log('user existed');
	return res.json({"status:":"fail", "message":"user existed"})
}
newMovie.save().then((err, doc)=>{
        var res = {status:"success"}
        if(err){
        console.log(err)
        res.status = "fail"
}else{
}
        res.json(res)
})
}
} )})






/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

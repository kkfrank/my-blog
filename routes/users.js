var express=require('express')
var router=express.Router()

router.get('/:name',function(req,res){
	//res.send(`hello,${req.params.name}`)
	res.render('users',{
		name:`<span>${req.params.name}</span>`
	})
})

module.exports=router
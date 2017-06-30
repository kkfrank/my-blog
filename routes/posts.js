var express=require('express')
var router=express.Router()

var checkLogin=require('../middlewares/check').checkLogin
var PostModel=require('../models/posts')
//GET /posts所有用户或者特定用户的文章页
//  eg: GET /posts?author=xxx
router.get('/',function(req,res,next){
	//res.send(req.flash())
	//res.render('posts')
	var author=req.query.author
	PostModel.getPosts(author)
		.then(function(posts){
			res.render('posts',{
				posts:posts
			})
		})
		.catch(function(e){
			console.log(e.message)
			//req.flash('error',e.message)
			next()
		})

})

//POST /posts发表一篇文章
router.post('/',checkLogin,function(req,res,next){
	//res.send(req.flash())
	var author=req.session.user._id
	var title=req.fields.title
	var content=req.fields.content

	try{
		if(!title){
			throw new Error('标题不能为空')
		}
		if(!content){
			throw new Error('内容不能为空')
		}
	}catch(e){
		req.flash('error',e.message)
		//res.redirect('/create')
		res.redirect('back')
		return 
	}

	var post={
		author:author,
		title:title,
		content:content,
		pv:0
	}
	PostModel.create(post)
		.then(function(result){
			//此post是插入mongodb后的值，包含_id
			post=result.ops[0]
			req.flash('success','发表成功')
			res.redirect(`/posts/${post._id}`)
		})
		.catch(function(){
			//res.redirect('/create')
			next()
		})
})

//GET /posts/create发表文章页
router.get('/create',checkLogin,function(req,res,next){
	//res.send(req.flash())
	res.render('create')
})

//GET /posts/:postId单独一篇的文章页
router.get('/:postId',function(req,res,next){
	res.send(req.flash())
})

//GET /posts/:postId/edit更新文章页
router.get('/:postId/edit',checkLogin,function(req,res,next){
	res.send(req.flash())
})

//POST /posts/:postId/edit更新一篇文章
router.post('/:postId/edit',checkLogin,function(req,res,next){
	res.send(req.flash())
})

//GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove',checkLogin,function(req,res,next){
	res.send(req.flash())
})

//POST /posts/:postId/comment创建一条留言
router.post('/:postId',checkLogin,function(req,res,next){
	res.send(req.flash())
})
//GET /posts/:postId/comment/:commentId/remove删除一条留言
router.get('/:postId/comment/:commentId',checkLogin,function(req,res,next){
	res.send(req.flash())
})
module.exports=router





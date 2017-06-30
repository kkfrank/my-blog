var fs=require('fs')
var path=require('path')
var sha1=require('sha1')
var express=require('express')
var router=express.Router()

var UserModel=require('../models/users')
var checkNotLogin=require('../middlewares/check.js').checkNotLogin
console.log(checkNotLogin)
//Get  /signup注册页
router.get('/',checkNotLogin,function(req,res,next){
	//res.send(req.flash())
	res.render('signup')
})
//Post /signup用户注册页
router.post('/',checkNotLogin,function(req,res,next){
	//res.send(req.flash())
	//res.send(req.flash(req))
	//console.log(path.sep)
	var name=req.fields.name
	var password=req.fields.password
	var repassword=req.fields.repassword
	var gender=req.fields.gender
	var bio=req.fields.bio
	var avatar=req.files.avatar.path.split(path.sep).pop()
	//console.log(req.files)
	//console.log(req.files)
	try{
		if(name.length<1 || name.length >10){
			throw new Error('名字限制在1-10个字符')
		}
		if(['m','f','x'].indexOf(gender)<0){
			throw new Error('性别只能是m、f或x')
		}
		if(bio.length<1 || bio.length>30){
			throw new Error('个人简介限制在1-30个字符')
		}
		if(!req.files.avatar.name){
			throw new Error('请上传头像')
		}
		if(password.length<6){
			throw new Error('密码长度至少6位')
		}
		if(password.length!==repassword.length){
			throw new Error('两次输入密码不一致')	
		}
	}catch(e){
		//注册失败，异步删除上传的头像
		console.log('unlink',req.files.avatar.path)
		fs.unlink(req.files.avatar.path)
		req.flash('error',e.message)
		return res.redirect('/signup')
	}
	//明文密码加密
	password=sha1(password)

	//待写入数据库的用户信息
	var user={
		name:name,
		password:password,
		avatar:avatar,
		gender:gender,
		bio:bio
	}

	//用户信息写入数据库 
	UserModel.create(user)
		.then(function(result){
			console.log(result)
			var user=result.ops[0];
			delete user.password
			req.session.user=user
			req.flash('success','注册成功')
			res.redirect('/posts')
		}).catch(function(e){
			fs.unlink(req.files.avatar.path)
			if(e.message.match('E11000 duplicate key')){
				req.flash('error','用户名已被占用')
				return res.redirect('/signup')
			}
			next(e)
		})	
})

module.exports=router
var marked=require('marked')
var Post=require("../lib/mongo").Post

//将post的content从markdown转换成html
Post.plugin('contentToHtml',{
	afterFind:function(posts){
		return posts.map(function(post){
			if(post){
				post.content=marked(post.content)
			}
			return post
		})
	},
	afterFindOne:function(post){
		if(post){
			post.content=marked(post.content)
		}
		return post
	}
})

module.exports={
	create:function(post){
		return Post.create(post).exec()
	},
	//通过文章id获取一篇文章
	getPostById:function(postId){
		return Post
			.findOne({_id:postId})
			.populate({path:'author',model:'User'})//what's this
			.addCreatedAt()
			.contentToHtml()
			.exec()
	},
	//按创建时间降序获取所有用户文章或者某个特定用户的文章
	getPosts:function(author){
		var query={}
		if(author){
			query.author=author
			//query=author
		}
		return Post
			.find(query)
			.populate({path:'author',model:"User"})
			.sort({_id:-1})
			.addCreatedAt()//有必要？
			.contentToHtml()
			.exec()
	},
	incPv:function(postId){
		return Post
			.undate({_id:postId},{$inc:{pv:1}})
			.exec()
	}
}
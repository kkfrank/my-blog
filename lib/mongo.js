var config=require('config-lite')(__dirname)
var Mongolass=require('mongolass')
var moment=require('moment')
var objectIdToTimestamp=require('objectid-to-timestamp')

var mongolass=new Mongolass()

mongolass.plugin('addCreatedAt',{
	afterFind:function(results){
		results.forEach(function(result){
			result.created_at=moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
		})
		return results
	},
	afterFindOne:function(result){
		if(result){
			result.created_at=moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
		}
		return result
	}
})
mongolass.connect(config.mongodb)

exports.User=mongolass.model('user',{
	name:{type:'string'},
	password:{type:'string'},
	avatar:{type:'string'},
	gender:{type:'string',enum:['m','f','x']},
	bio:{type:'string'}
})
exports.User.index({name:1},{unique:true}).exec()// 根据用户名找到用户，用户名全局唯一

exports.Post=mongolass.model('Post',{
	//id:{type:'string'},
	author:{type:Mongolass.Types.ObjectId},
	title:{type:'string'},
	content:{type:'string'},
	pv:{type:'number'}
})
exports.Post.index({author:1,_id:-1}).exec()// 按创建时间降序查看用户的文章列表

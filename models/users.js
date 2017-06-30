var User=require('../lib/mongo').User

module.exports={
	create:function(user){
		console.log('-------------')
		//console.log("User",User)
		return User.create(user).exec()
	},
	getUserByName:function(name){
		return User.findOne({name:name})
			.addCreatedAt()
			.exec()
	}
}
const Wiki = require("./models").Wiki;
const User = require('./models').User;
const Collaborator = require('./models').Collaborator;
const Authorizer = require('./../policies/application');

module.exports = {

	getAllWikis(callback) {
		let result = {};

		return Wiki.findAll()

		.then((wikis) => {
			result['wikis'] = wikis;
			callback(null, result);
		})
		.catch((err) => {
			callback(err);
		})
	},

	getWiki(id, callback) {
		let result = {};
		return Wiki.findByPk(id, {
			include: [{
				model: User,
				as: "User"
			}]
		})
		.then((wiki) => {
			if(!wiki) {
				callback(400);
			} else {
				result['wiki'] = wiki;
				Collaborator.scope({method: ['collaboratorsFor', id]}).findAll()
				.then(collaborators => {
					result['collaborators'] = collaborators;
					callback(null, result);

				})
			}
		})
		.catch((err) => {
			// console.log("get wiki queries line 45");
			callback(err);
		});
	},

	addWiki(newWiki, callback) {
		return Wiki.create({
			title: newWiki.title,
			body: newWiki.body,
			private: newWiki.private,
			userId: newWiki.userId
		})
		.then((wiki) => {
			callback(null, wiki)
		})
		.catch((err) => {
			callback(err);
		})
	},


	deleteWiki(id, callback) {
		const authorized = new Authorizer(req.user).destroy();

		if(authorized) {
			return Wiki.destroy({
			where: {id: req.params.id}
			})
			.then((wiki) => {
				callback(null, wiki)
			})
			.catch((err) => {
				callback(err);
			});
		} else {
			req.flash("notice", "You are not authorized to do that.");
			callback(403);
		}
		
	},

	updateWiki(req, updatedWiki, callback) {
		return Wiki.findByPk(req.params.id)
		.then((wiki) => {
			if(!wiki) {
				return callback("Wiki not found");
			}

			const authorized = new Authorizer(req.user, wiki).update();

			if(authorized) {
				wiki.update(updatedWiki, {
				fields: Object.keys(updatedWiki)
				})
				.then(() => {
					callback(null, wiki);
				})
				.catch((err) => {
					callback(err);
				});
			} else {
				req.flash("notice", "You are not authorized to do that.");
				callback(403);
			}
			
		});
	},

	makePrivate(id){
		return Wiki.findAll()
		.then((wikis) => {
			wikis.forEach((wiki) => {
				if(wiki.userId == id && (wiki.private == true)) {
					wiki.update({
						private: false
					})
				}
			})
		})
		.catch((err) => {
			console.log(err);
		})
	}
}
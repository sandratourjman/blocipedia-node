const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/wiki");
const wikiQueries = require("../db/queries.wikis.js");
const userQueries = require('../db/queries.users');


module.exports = {
    create(req, res, next){
        collaboratorQueries.createCollaborator(req, (err, collaborator) => {
            if (err) {
                req.flash("error", err);
            }
            res.redirect(req.headers.referer);
        });
    },
    show(req, res, next){
        wikiQueries.getWiki(req.params.wikiId, (err, result) => {
            if(err){
                res.redirect(404, '/');
            } else {
                wiki = result["wiki"];
                collaborators = result["collaborators"];
     
                userQueries.getAllUsers((err, result) => {
                    users = result['users'];

                    res.render("collaborators/show", {wikis, collaborators, users});
                });
            }
        });
    },
    destroy(req, res, next){
        if(req.user) {
            collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
                if (err) {
                    req.flash("error", err);
                }
                res.redirect(req.headers.referer);
            });
        } else {
            req.flash("notice", "You must be signed in to do that");
            res.redirect(req.headers.referer);
        }
    }
}
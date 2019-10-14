const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/wiki");
const wikiQueries = require("../db/queries.wikis.js");


module.exports = {
    create(req, res, next){
        collaboratorQueries.createCollaborator(req, (err, collaborator) => {
            if (err) {
                req.flash("error", err);
            }
            console.log(req);
            console.log("collab controler line 13");
            console.log(collaborator);

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
                const authorized = new Authorizer(req.user, wiki, collaborators).edit();
                if (authorized) {
                    res.render("collaborators/show", { wiki, collaborators });
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect(`/wikis/${req.params.wikiId}`);
                }
                
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
const { body, validationResult } = require('express-validator/check')

/* GET actorController. */
let controller = {
	index: function(req, res) {  
		// res.send('welcome');
		req.getConnection(function(err,connection){
			if(!err){
				// res.send('good');
				var query = connection.query('SELECT * FROM repos', function(err,rows)
				{
                    if(err) {
                        var errornya  = ("Error Selecting : %s ",  err);   
                        res.send('400', errornya);
                    }
                    var repos = [];
                    rows.forEach(act => {
                        var repo = {
                            id:act.uid,
                            name: act.name,
                            url: act.url,
                        } 
                        repos.push(repo);
                    });
                    res.status(200).json(repos);
				});
			}else{
				res.send('Error connect mysql');
			}
		});
	},
	create: function(req, res, next){
        try {
            req.checkBody('name', "missing Repo Name").notEmpty(); 
            req.checkBody('url', 'Missing Repo Url').notEmpty(); 
            var errors = req.validationErrors();
            // res.send(errors)
            if(!errors){
                v_name = req.body.name;
                // v_login = req.sanitize( 'name' ).escape().trim();
                v_avatar_url = req.body.url;
                // v_avatar_url = req.avatar_url
                    var repo = {
						uid: Math.random().toFixed(7).split('.')[1],
                        name: v_name,
                        url: v_avatar_url,
                    }
                // res.status(200).json({repo});
                var insert_sql = 'INSERT INTO repos SET ?';
                req.getConnection(function(err,connection){
                    var query = connection.query(insert_sql, repo, function(err, result){
                        if(err)
                        {
                            var errors_detail  = ("Error Insert : %s ",err );   
                            res.status(400).json(errors_detail);
                        }if(result){
                            res.status(200).json('Repo Added successfully');
                        }
                    });
                });
            }else{
              res.status(422).json({ errors: errors});
              return;
            } 
        }catch(err) {
            return next(err)
        }
	}
};

module.exports = controller;
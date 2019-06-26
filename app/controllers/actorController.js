const { body, validationResult } = require('express-validator/check')

/* GET actorController. */
let controller = {
	index: function(req, res) { 
		req.getConnection(function(err,connection){
			if(!err){
				// res.send('good');
				var query = connection.query('SELECT * FROM actors', function(err,rows)
				{
                    if(err) {
                        var errornya  = ("Error Selecting : %s ",  err);   
                        res.send('400', errornya);
                    }
                    var actors = [];
                    rows.forEach(act => {
                        var actor = {
                            id:act.uid,
                            login: act.login,
                            avatar_url: act.avatar_url,
                        } 
                        actors.push(actor);
                    });
                    res.status(200).json(actors);
				});
			}else{
				res.send('Error connect mysql');
			}
		});
	},
	streak: function(req, res) { 
		req.getConnection(function(err,connection){
			if(!err){
				// res.send('good');
				var query = connection.query('SELECT * FROM actors INNER JOIN events ON events.actor_id = actors.uid GROUP BY actors.uid ORDER BY count(events), events.created_at DESC, actors.login ASC ', function(err,rows)
				{
                    if(err) {
                        var errornya  = ("Error Selecting : %s ",  err);   
                        res.send('400', errornya);
                    }
                    var actors = [];
                    rows.forEach(act => {
                        var actor = {
                            id:act.uid,
                            login: act.login,
                            avatar_url: act.avatar_url,
                        } 
                        actors.push(actor);
                    });
                    res.status(200).json(actors);
				});
			}else{
				res.send('Error connect mysql');
			}
		});
	},
	create: function(req, res, next){
        try {
            req.checkBody('login', 'Not login').notEmpty(); 
            req.checkBody('avatar_url', 'Not login').notEmpty(); 
            var errors = req.validationErrors();
            // res.send(errors)
            if(!errors){
                v_login = req.sanitize( 'login' ).escape().trim();
                v_avatar_url = req.body.avatar_url;
                // v_avatar_url = req.avatar_url
                    var actor = {
						uid: Math.random().toFixed(7).split('.')[1],
                        login: v_login,
                        avatar_url: v_avatar_url,
                    }
                // res.status(200).json({actor});
                var insert_sql = 'INSERT INTO actors SET ?';
                req.getConnection(function(err,connection){
                    var query = connection.query(insert_sql, actor, function(err, result){
                        if(err)
                        {
                            var errors_detail  = ("Error Insert : %s ",err );   
                            res.status(400).json(errors_detail);
                        }if(result){
                            res.status(200).json('Actor Add success');
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
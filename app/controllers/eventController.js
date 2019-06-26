/* GET eventController. */
let controller = {
	index:async function(req, res) {  
		// res.send('welcome');
					// console.log(acts);
		req.getConnection(function(err,connection){
			if(!err){
				connection.query('SELECT * FROM events JOIN actors ON events.actor_id=actors.uid JOIN repos ON events.repo_id=repos.uid', function(err,rows)
				{
					if(err) {
                        var errornya  = ("Error Selecting : %s ",  err);   
                        res.send('400', errornya);
					}
					// controller.getActor();

					// console.log(rows);
                    var events = [];
                    rows.forEach(act => {
                        var event = {
                            id:act.uid,
                            type: act.type,
                            actor: {
								login: act.login,
								avatar_url: act.avatar_url
							},
							repo: {
								name: act.name,
								url:act.url
							},
							created_at: act.created_at
                        } 
                        events.push(event);
                    });
                    return res.status(200).json(events);
				});
			}else{
				res.send('Error connect mysql');
			}
		});
	},
	create: function(req, res, next){
        try {
            req.checkBody('type', 'Missing Type').notEmpty(); 
            req.checkBody('actor', 'Missing Actor').notEmpty(); 
            req.checkBody('repo', 'Missing Repo').notEmpty(); 
            var errors = req.validationErrors();
            // res.send(errors)
            if(!errors){
                v_type = req.body.type;
                v_actor = req.body.actor;
                v_repo = req.body.repo;
                // v_avatar_url = req.avatar_url
                    var repo = {
						uid: Math.random().toFixed(7).split('.')[1],
                        type: v_type,
						actor_id: v_actor,
						repo_id: v_repo,
                    }
                // res.status(200).json({repo});
                var insert_sql = 'INSERT INTO events SET ?';
                req.getConnection(function(err,connection){
                    var query = connection.query(insert_sql, repo, function(err, result){
                        if(err)
                        {
                            var errors_detail  = ("Error Insert : %s ",err );   
                            res.status(400).json(errors_detail);
                        }if(result){
                            res.status(200).json('Event Created successfully');
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
	},
	delete: function(req, res, next){
		req.getConnection(function(err,connection){
			var customer = {
				uid: req.params.id,
			}
			var delete_sql = 'delete from events where ?';
			req.getConnection(function(err,connection){
				var query = connection.query(delete_sql, customer, function(err, result){
					if(err)
					{
						var errors_detail  = ("Error Delete : %s ",err);
						res.status(400).json(errors_detail); 
					}
					else{
						res.status(200).json('Delete Event Successfully');
					}
				});
			});
		});
	},
};

module.exports = controller;
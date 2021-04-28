const bcrypt = require('bcrypt');
class Router{
    constructor(app,db){
        this.login(app,db);
        this.logout(app,db);
        this.isLoggedIn(app,db);
        this.signup(app,db);

        
    }
    login(app,db){
        app.post('/login',(req,res) => {
            let username = req.body.username;
            let password = req.body.password;

            username = username.toLowerCase();
            //console.log(password)
            //console.log(username)
            if (username.length > 12 || password.length > 12) {
                res.json({
                    success: false,
                    msg: 'An error occured, please try again'
                })
                return;
            }
            let cols = [username];
            db.query('SELECT * FROM user WHERE username = ? LIMIT 1', cols, (err, data,fields) =>{
                if(err){
                    res.json({
                        success:false,
                        msg: 'An error occured, please try again'
                    })
                    return;
                }
                //found 1 user
                if(data && data.length === 1){
                    
                    if(password === data[0].password){
                            req.session.userID = data[0].id;
                            res.json({
                                success:true,
                                username: data[0].username
                            })
                            console.log(data[0].id);
                            return;
                            
                        }
                        
                    else{
                            res.json({
                                success: false,
                                msg:'Invalid password'
                            })
                            //console.log(data[0].password)
                        }
                    

                }
                else {
                    res.json({
                        success: false,
                        msg: 'User not found, please try again'
                    })
                }
            });
            
        });

    }
    logout(app,db){
        app.post('/logout',(req,res)=> {
            if(req.session.userID){
                req.session.destroy();
                res.json({
                    success:true
                })
                return true;
            }
            else {
                res.json({
                    success: false
                })
                return false;
            }

        });

    }
    isLoggedIn(app,db){
        app.post('/isLoggedIn',(req,res) => {
            if(req.session.userID){
                let cols=[req.session.userID];
                db.query('SELECT * FROM user WHERE id = ? LIMIT 1', cols, (err,data,fields) => {
                    if(data && data.length === 1){
                        res.json({
                            success: true,
                            username: data[0].username
                        })
                        return true;
                    }
                    else{
                        res.json({
                            success:false
                        })
                    }
                });
            }
            else{
               res.json({
                   success: false
               }) 
            }
        });

    }
    signup(app,db){
        app.post('/signup',(req,res) => {
            // This is our Default number value

            //var RandomNumber = Math.floor(Math.random() * 100) + 1 ;

            let username = req.body.username;
            let password = req.body.password;
            username = username.toLowerCase();
            //console.log(password)
            //console.log(username)
            //console.log(res)
            //return;
            
            if (username.length > 12 || password.length > 12) {
                res.json({
                    success: false,
                    msg: 'An error occured, long username or password !!'
                })
                return;
            }

            var max='SELECT MAX(id) FROM user WHERE ID=? LIMIT 1';
            var maximum=max+1
                
            //console.log(maximum)
            //console.log(max)
            var sql="INSERT INTO user (id,username,password) VALUES ?";
            var values = [
                [maximum,username,password]
            ];
            db.query(sql, [values], function(err, data) {
                //if(err) throw err;
                //console.log(err)
                if(err){
                    res.json({
                        success:false,
                        msg: 'An error occured, query error'
                        
                    })
                    //console.log(data)
                    return false;
                }
                //insert 1 user
                else if(err==null){        
                    res.json({
                        success:true,
                        msg: 'Database Updated: 1 row added!'
                    })
                    console.log(username)
                    return true;
                    
                }
                
                
            });
            

        });

    }
    

}
module.exports = Router;

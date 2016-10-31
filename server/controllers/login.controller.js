

module.exports = {
    renderLogin:function(req,res,next){
        res.render('login', { title: '登录' });
    }
};

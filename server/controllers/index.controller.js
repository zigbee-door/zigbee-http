

module.exports = {
    renderIndex:function(req,res,next){
        res.render('index', { title: '主页' });
    }
};
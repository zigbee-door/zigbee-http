

module.exports = {
    /**
     * describe: 主页渲染
     * data:     16.11.03
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    renderIndex(req,res,next) {
        res.render('index', {
            username: req.session.username,
            usertype: req.session.usertype
        });
    }
};
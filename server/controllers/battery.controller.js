

module.exports = {
    /**
     * describe: 电池监测渲染
     * data:     16.11.08
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    renderBattery(req,res,next) {
        res.render('battery', {
            username: req.session.username,
            usertype: req.session.usertype
        });
    }
};
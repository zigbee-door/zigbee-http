/**
 * node:        config.js
 * data:        16.11.01
 * author:      zhuxiankang
 * describe:    mongodb,redis等数据配置文件
 */

module.exports = {
    //mongo
    mongodb: {
        'local': 'mongodb://localhost/zigbee',
        'development':'mongodb://10.33.31.234/zigbee',
        'production': 'mongodb://10.33.31.234/zigbee' //有待修改
    }
};


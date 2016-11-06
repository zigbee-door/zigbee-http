# zigbee-http

## 启动

```javascript
npm start   //本地环境,其他环境查看package.json
```

## 服务

- [localhost:3000](localhost:3000)


## 插件

| 名称      |     描述 |
| :-------- | :--------|
| mongoose    |   mongodb数据库存储 |
| redis    |   缓存和进程间通信 |
| socket.io    |   websocket通信 |
| bootstrap    |   响应式设计 |
| bootstrap-table    |   丰富的表格形式 |


## 目录

```javascript
.
├── app.js                      # 启动脚本
├── config                      # 配置
│   ├── config.js               # 参数配置
│   └── index.config.js         # 导出配置
├── client                      # 客户端
├── server                      # 服务端
│   ├── constants/              # 常量
│   ├── controllers/            # 逻辑处理
│   ├── models/                 # 数据库
│   ├── routes/                 # 路由
│   ├── sockets/                # socket.io
│   └── sub/                    # redis订阅
└── views                       # 视图

```


## 进度记录

| 日期      |     进度 |
| :-------- | :--------|
| 2016/11/01    |  socket.io成功 |
| 2016/11/06    |  redis订阅成功 |




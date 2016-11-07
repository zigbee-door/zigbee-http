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
├── client                      # 客户端
│   ├── css                     # 样式
│   ├── imgs                    # 图片
│   ├── js                      # 脚本
│   └── lib                     # 插件
├── config                      # 配置
│   ├── config.js               # 参数配置
│   └── index.config.js         # 导出配置
├── server                      # 服务端
│   ├── constants/              # 常量
│   ├── controllers/            # 逻辑
│   ├── events/                 # 事件
│   ├── models/                 # 数据
│   ├── routes/                 # 路由
│   ├── sockets/                # socket.io
│   └── subs/                   # 订阅
├── views                       # 视图
└── app.js                      # 启动脚本

```


## 进度记录

| 日期      |     进度 |
| :-------- | :--------|
| 2016/11/01    |  socket.io成功 |
| 2016/11/06    |  redis订阅成功 |
| 2016/11/07    |  redis订阅数据成功通过socket.io发送至浏览器 |




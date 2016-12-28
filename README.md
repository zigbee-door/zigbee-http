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
| metisMenu   |   菜单 |
| angular   |   前端库 |
| chart | |
| angular-chart   |   丰富的图表形式 |

## 工具

| 名称      |     描述 |
| :-------- | :--------|
| Redis DeskTop Manager | Redis可视化工具 |
| MongoChef Core   |   Mongodb可视化工具(Robomongo对于mongodb 3.0以上版本无效) |


## 目录

```javascript
.
├── client                      # 客户端
│   ├── css/                    # 样式
│   ├── imgs/                   # 图片
│   ├── js/                     # 脚本
│   │  ├── angular/             # angular应用
│   │  │  ├── controllers/   	# angular控制器
│   │  │  ├── services/	        # angular服务
│   │  │  └── webapp.js/	 	# angular自动引导应用程序
│   │  └── sockets/			  # sockets应用
│   └── lib                     # 插件
├── config                      # 配置
│   ├── config.js               # 参数配置
│   └── index.config.js         # 导出配置
├── server                      # 服务端
│   ├── constants/              # 常量
│   ├── controllers/            # 逻辑
│   ├── events/                 # 事件(有问题，移除，使用socket全局变量)
│   ├── models/                 # 数据
│   ├── routes/                 # 路由
│   ├── sockets/                # socket.io
│   ├── pubs/                   # 发布
│   └── subs/                   # 订阅
├── views                       # 视图
└── app.js                      # 启动脚本

```


## 全局变量
| 变量   			|     说明 |
| :-------- 			| :--------|
|  global.redis_sub 		|  http服务的redis发布客户对象，config/config.js |
|  global.redis_pub 		|  http服务的redis订阅客户对象，config/config.js |
|  global.global.socket_index 	|  index.html保持的socket通信对象 |
|  global.global.socket_doorList|  doorList.html保持的socket通信对象 |




## 问题

| 类型      |     说明 |
| :-------- | :--------|
| redis发布订阅    |  在Redis中，一旦一个client发出了SUBSCRIBE命令，它就处于监听的模式，此时除了SUBSCRIBE， PSUBSCRIBE，UNSUBSCRIBE，PUNSUBSCRIBE这4条命令之外的所有其它命令都不能用，所以需要使用两个client. |
| event事件   |  不知什么原因导致了监听器建立了多个，所以socket发送给客户端的redis数据（来自于tcp服务端）重复了好多次，所以去掉了事件触发，采用全局变量socket通信对象的方式，追加原因：每次页面刷新会导致执行sockets-> index.js触发页面的socket的connection事件，在事件里添加了监听函数....socket并不是一直长连着的，socket可能断开重连 |


## 进度记录

| 日期      |     进度 |
| :-------- | :--------|
| 2016/11/01    |  socket.io成功 |
| 2016/11/06    |  redis订阅成功 |
| 2016/11/07    |  redis订阅数据成功通过socket.io发送至浏览器 |
| 2016/12/07    |  修复windows环境运行问题 |
| 2016/12/26    |  添加了获取门锁关联列表页面 |
| 2016/12/27    |  使用angular实现了控制器，并实现了socket不同的页面之间的连接，实现了redis发布，成功发布命令给tcp程序 |
| 2016/12/28    |  可以发送命令给基站，并从基站获取数据显示到网页客户端，通过socket和redis实现，添加了开门命令，可以远程进行开门 |





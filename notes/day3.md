Allergy项目第三节课\
老师：刘心语 Max\
学生：方旭浩\
用时：1小时

## 数据库
我们用数据库来存储某些格式的数据，举个例子

User table:
| id | username | password | created | updated |
| -- | --| -- | -- | -- |
| 1 | username1 | 123456 | 2023/1/1 | 2023/1/23 |
| 2 | user2 | user2password | 2023/1/2 | 2023/1/2 |
| 3 | xxxGamerxxx | IAMGAMER | 2023/1/3 | 2023/1/3 |
| 4 | 360n0sc0p3 | randompassword | 2023/1/4 | 2023/1/25 |

### 结构
Table
Field/Attribute
Row
Column

### 数据类型
整数 小数 字符串

## MySQL安装
为了方便环境管理，我们使用brew进行安装

打开terminal

```shell
brew install mysql
```

下载完以后给MySQL加一个新密码
首先我们要进入数据库服务自己的terminal
```shell
mysql -u root
```
接下来的所有命令其实都是SQL语言，新手不用纠结每条命令的意思，照抄即可
```sql
SET GLOBAL validate_password.length = 0;
# 这里我们给root用户添加一个新密码
# 密码: admin
ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin';
# 刷新权限
flush privileges;
exit;
```

现在我们已经退出了MySQL，接下来我们用密码登陆试试
```shell
mysql -u root -p
```

## 图形界面
本课程我们会用MySQL Workbench，因为穷

下载以后直接用

## 建表

## python链接mysql

首先，我们需要下载一个python链接mysql用的模块
```shell
pip3 install mysql-connector-python
```

接下来就是代码实现

### Select 获取数据
```py
import mysql.connector

db = mysql.connector.connect(
  host="localhost",
  user="root",
  password="admin",
  database="allergy"
)

@app.route('/dbtest')
@cross_origin()
def dbtest():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM user")
    result = cursor.fetchall()
    return result
```

我们添加了一个 dbtest 的路径来获取所有user的信息，在浏览器中打开尝试一下\
这时网页上应该会显示`[]`, 这就意味着目前user里面没有任何内容

### Insert 插入数据
添加一个新的接口来进行添加数据的操作
```py
@app.route('/dbadd')
@cross_origin()
def dbadd():
    cursor = db.cursor()
    sql = "INSERT INTO user (username, password) VALUES (%s, %s)"
    val = ("user1", "password1")
    cursor.execute(sql, val)
    db.commit()
    return "0"
```

写完以后在浏览器上打开/dbadd，每次打开这个网页，我们都会添加一个新的用户\
网页上应该会显示一个`0`，我们可以不用管。

这个时候再打开/dbtest, 我们应该可以看到重复的用户信息如下:
```json
[
  [
    1,
    "user1",
    "password"
  ],
  [
    2,
    "user1",
    "password"
  ],
]
```

写死代码多少有点捞，所以我们可以让用户自己传username和password:
```py
@app.route('/dbadd/<username>/<password>')
@cross_origin()
def dbadd(username, password):
    cursor = db.cursor()
    sql = "INSERT INTO user (username, password) VALUES (%s, %s)"
    val = (username, password)
    cursor.execute(sql, val)
    db.commit()
    return "0"
```

重新在浏览器中打开/dbadd, 后面加上自定义的username和password，比如
`localhost:xxxx/dbadd/user222/randompassword`

然后再打开/dbtest，用户自己写的信息就应该被插入数据库了，运行结果大致如下
```json
[
  [
    1,
    "user1",
    "password"
  ],
  [
    2,
    "user1",
    "password"
  ],
  [
    3,
    "user222",
    "randompassword"
  ]
]
```
Allergy项目第五节课\
老师：刘心语 Max\
学生：方旭浩\
用时：1小时

# 代码架构更新
首先进入我们的虚拟环境，然后安装今天上课需要用到的依赖
```sh
source venv/bin/activate
pip3 install flask-sqlalchemy flask-login
```

当我们安装好以后进行环境变量的定义
```sh
export FLASK_APP=.
export FLASK_DEBUG=1
```

之前我们所有的代码都在一个`app.py`, 当我们代码变多的时候把所有API都放在一个文件里必然是不现实的。因此我们今天第一步要做的事情就是将代码结构化

首先在backend根目录内创建一个`__init__.py`(注意这里头尾都是两个_)。注意我们前面的一行命令
```sh
export FLASK_APP=.
```
前面我们讲过`.`就代表当前目录，在这里`.`就代表backend。这样当我们运行代码的时候`__init__.py`会自动被运行

接下来我们把`__init__.py`的代码写一下
```py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'secret-key-goes-here'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

    db.init_app(app)

    # blueprint for auth routes in our app
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    # blueprint for non-auth parts of app
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
```
注意这里的import auth和main，意思就是从当前目录倒入这两个文件。因此当我们运行程序后auth.py和main.py都会运行。之后如果你要创建新的flask接口文件，可以参考段代码

那么接下来我们补充一下`main.py`和`auth.py`
```py
# main.py
from flask import Blueprint, session
from flask_cors import CORS, cross_origin
import mysql.connector

main = Blueprint('main', __name__)
cors = CORS(main)
db = mysql.connector.connect(
  host="localhost",
  user="root",
  password="admin",
  database="allergy"
)

@main.route('/dbtest')
@cross_origin()
def dbtest():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM food")
    result = cursor.fetchall()
    return result
```
```py
# auth.py
from flask import Blueprint
from flask_cors import CORS, cross_origin

auth = Blueprint('auth', __name__)
cors = CORS(auth)
```

当我们把这些代码都准备好以后可以运行程序了
```sh
export FLASK_APP=.
export FLASK_DEBUG=1
flask run
```

# 用户登录和Session
登录相关的所有功能我们会在`auth.py`中进行

## 注册
注册的流程
1. 检查是否有email和password
2. 检查email是否已经被注册
3. 写入数据库

以下为注册功能的代码
```py
# 添加request
from flask import Blueprint, request

@cross_origin()
@auth.route("/register", methods=['POST'])
def register():
    # 获取客户端请求body中的数据
    data = request.get_json()
    # 检查信息是否齐全
    if ("email" not in data) or ("password" not in data):
        return {
            "code": 1,
            "error": "Missing information"
        }
    
    # 检查email是否已经被注册
    cursor = db.cursor()
    sql = "SELECT * FROM user where email = %s"
    val = [data['email']]
    cursor.execute(sql, val)
    result = cursor.fetchone()
    if result:
        return {
            "code": 1,
            "error": "Email is already registered"
        }
    
    # 写入数据库
    sql = "INSERT INTO user(email, password) values (%s, %s)"
    val = (data["email"], data["password"])
    cursor.execute(sql, val)
    db.commit()
    return {
        "code": 0,
        "error": ""
    }
```

## 登录
1. 检查用户名密码是否存在
2. 检查用户名密码是否正确

```py
@cross_origin()
@auth.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    if ("email" not in data) or ("password" not in data):
        return {
            "code": 1,
            "error": "Missing information"
        }
    cursor = db.cursor()
    sql = "SELECT * FROM user where email = %s and password = %s"
    val = [data['email'], data['password']]
    cursor.execute(sql, val)
    result = cursor.fetchone()
    # result 内容的格式应该是一个list
    # [id, email, password, created, updated]
    if not result:
        return {
            "code": 1,
            "error": "Incorrect login information"
        }

    return {
        "data": result[1],
        "code": 0,
        "error": ""
    }
```

## Cookie & Session

我们的网站大部分接口都是需要用户登陆以后才能够使用的（例：获取用户的过敏源）。因此我们需要用某种方式来储存用户的登录状态，在这里我们引入Cookie和Session的概念。具体原理这里就不细说了，可以阅读这篇[知乎](https://zhuanlan.zhihu.com/p/55522549)

阅读完以后应该能理解，每次登陆的时候我们都需要当前用户使用的浏览器创建一个session。Session是需要有唯一性的，所以在session中我们会存入用户的id，代码实现如下:
```py
# 这里我们需要引用 session
from flask import Blueprint, request, session
@cross_origin()
@auth.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    if ("email" not in data) or ("password" not in data):
        return {
            "code": 1,
            "error": "Missing information"
        }
    cursor = db.cursor()
    sql = "SELECT * FROM user where email = %s and password = %s"
    val = [data['email'], data['password']]
    cursor.execute(sql, val)
    result = cursor.fetchone()
    # result 内容的格式应该是一个list
    # [id, email, password, created, updated]
    if not result:
        return {
            "code": 1,
            "error": "Incorrect login information"
        }

    #################### 这里只添加了一行代码 ####################
    # result[0]就是用户的id
    session["user"] = result[0]
    return {
        "data": result[1],
        "code": 0,
        "error": ""
    }
```

创建完session后，下一步自然是要写一个log out接口来删除session
```py
@cross_origin()
@auth.route("/logout")
def logout():
    if "user" in session:
        session.clear() # 这里清除session
        return {
            "code": 0,
            "error": ""
        }
    return {
        "code": 1,
        "error": "Not logged in"
    }
```

## 非Auth接口的保护
以上的代码都是`auth.py`中的，这些接口（API）不需要登录就可以请求，所以我们没有对他们进行登录状态（session）的检查。但是`main.py`中的代码是需要用户用户登录以后才能请求的（例：获取用户的过敏源）

在`main.py`中我们可以添加这样一段代码来保护所有这个文件中的API
```py
@main.before_request
def check_session():
    if "user" not in session:
        return {
            "error": "not signed in"
        }, 401
    cursor = db.cursor()
    sql = "SELECT * FROM user where id = %s"
    val = [int(session["user"])]
    cursor.execute(sql, val)
    result = cursor.fetchone()
    if not result:
        return {
            "error": "not signed in"
        }, 401
```
`@<variable>.before_request`这个tag会让对应的function运行在所有API之前。Flask框架对于前端request的处理流程如下

1. Flask App获取前端的请求（request）
2. 找到被请求的API所在的文件
3. 运行该文件中的`before_request`(如果有)
   - 如果return，直接跳到第5步 （没有session
   - 如果不return，继续第4步 （有session
4. 运行API所对应的function
5. 把结果打包并发回给前端

# Postman
Postman是我们用来测试接口用的工具。上课讲过如何使用了，就不具体展开说了
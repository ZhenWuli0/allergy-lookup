Allergy项目第一节课
老师：刘心语 Max
学生：方旭浩
用时：1小时

# Python Flask

## 安装Flask
Flask是本项目的后端服务框架，通过网络接口向前端提供数据

前端（网页） -> 后端（Flask） -> 数据库

### 创建python虚拟环境
```shell
python3 -m venv venv

. venv/bin/activate
```
运行完以上两条命令后应该可以看到
```
(venv) blahblah % 
```
`(venv)` 代表当前虚拟环境已启动，接下来所有的python命令都应该在虚拟环境中执行

### 安装Flask框架
在当前虚拟环境中运行
```shell
pip3 install Flask
```

如果之后要移动这个项目，可以把虚拟环境中所有library的版本读取到一个txt文件中
```shell
pip3 freeze >> requirements.txt
```

## 运行Flask
创建 app.py
```py
from flask import Flask
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
```

## URL Routing
一般情况下`/`是网页的根目录，网页中可能包含其他子目录，例如下方两个网页地址\
https://www.thinktown.com/ \
https://www.thinktown.com/our-story

第一个是个网站的根目录，也就是首页\
第二个则是网站中的某个子节点网页

用代码实现如下:
```py
@app.route('/')
def index():
    return '这里是首页'

@app.route('/our-story')
def our_story():
    return '我们的故事?'
```


## Routing variables
有的时候url地址中会包含一些动态信息，例如github用户名，或者google搜索的内容

http://github.com/kolxy # kolxy是俺的用户名\
https://www.google.com/search?q=what+is+thinktown # what is thinktown 是谷歌搜索时搜索框里的内容，这里用+代替空格。网页url不允许有空格

## Redirecting
网页跳转是一个经常用到的动作，例如一下场景：

微博：如果用户没有登录则不能查看其他用户发布的内容并将网页跳转到登录页面

代码操作如下
```py
from flask import abort, redirect, url_for

@app.route('/')
def index():
    # 用户没有登录，跳转login
    return redirect(url_for('login'))

@app.route('/login')
def login():
    abort(401) # Unauthorized
```

## Return的内容
课上讲过了

string dict list三种类型，可以互相套娃
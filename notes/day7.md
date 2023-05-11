Allergy项目第七节课\
老师：刘心语 Max\
学生：方旭浩\
用时：1小时

# User Authentication
今天这节课主要讲解我们整个网站50%的重点，也就是用户登录。

如果平时用各种网站，有没有注意过一些现象。例如Facebook，我们第一次登录的时候需要输入用户名和密码，之后只要我们不清空浏览器就可以一直保持在登录状态。那这种功能是如何做到的呢？

## 后端：密码验证
前几节课的时候我们已经在后端完成了大部分的用户登录API：login, register, logout. 其中我们用到了Session和Cookie的概念。

Session: 会话。用户登录以后的对话可以存在服务器上。由于我们目前水平有限，session暂时用加密的方式写死，每个用户的session唯一签名直接使用用户id

Cookie：一段来自服务器的数据并且被储存在浏览器中。在做自动登录的时候我们讲session发给客户端的浏览器，并且存于浏览器中。当下一次打开我们网页的时候可以直接用Cookie中存的session来和服务器继续上一次的会话。

### 密码加密
为了保护用户隐私，我们的数据库不应该直接存用户的密码。为了解决这个问题，我们可以使用一种one-way的加密方式。一个plain text可以很容易就被转成encrypted text, 但是encrypted text很难被转成plain text。

在python中我们使用到了一个`hashlib`自带的加密功能`md5`.
```py
import hashlib

password = data["password"]
encodedPassword = hashlib.md5(password.encode()).hexdigest()
```

### 传输cookie
前面我们讲到要给客户端传输一个cookie，那我们是怎么做到的呢？
```py
from flask import session

session["user"] = user['id']
```
只要写了这一行代码，之后的response会自动带上这个cookie。cookie的内容其实就是加密后的user id。Flask自动帮我们做好了所有事情，非常简单。

## 前端登录状态维护
我们大部分的时候网页浏览都是使用`RESTful API`的方式进行通信的。每一次操作都是如下流程:

```
前端 - request -> 后端server - response -> 前端
```

那我们如何知道用户当前是否是登录状态呢？没错，还得靠Cookie。

### 后端guard
当后端需要权限的API（例如getfood）被请求时，我们首先查看请求里的Cookie是否符合要求:
```py 
@cross_origin()
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
    global user
    user = convertUser(result)

def convertUser(info):
    return {
        "id": info[0],
        "email": info[2],
        "role": info[1]
    }
```

注意这段代码
```py
if "user" not in session:
    return {
        "error": "not signed in"
    }, 401
```
401 在http协议中代表`unauthorized`. 只要前端川过来的Cookie不符合我们的要求，后端就要告诉前端你目前是`Unauthorized`状态。

### 前端guard
在我给你封装的http class中，我们定义了常见的error handling。其中出现 401 error 时会跳转到login页面。具体代码如下:
```js
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      window.location.href = '/login'
      // toLogin();
      break
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      // alert('登录过期，请重新登录');
      // localStorage.removeItem('token');
      // store.commit('loginSuccess', null);
      // setTimeout(() => {
      //     toLogin();
      // }, 1000);
      break
    // 404请求不存在
    case 404:
      alert('请求的资源不存在')
      break
    default:
      console.log(other)
  }
}
```

http在遇到401 error的时候会做拦截，正常情况则是不对请求做特殊处理。

### 路径定义
在主页`App.js`中，我们定义了所有路径。`*`是通配符:
```xml
<Route exact path="/login" name="Login Page" element={<Login />} />
<Route exact path="/register" name="Register Page" element={<Register />} />
<Route exact path="/404" name="Page 404" element={<Page404 />} />
<Route exact path="/500" name="Page 500" element={<Page500 />} />
<Route path="*" name="Home" element={<DefaultLayout />} />
```

如上所示，当401出现时 `/login` 对应的就是登录页面


## 总结
本节课内容比较多，学生可以课后自己去做调试玩一下。
Allergy项目第二节课
老师：刘心语 Max
学生：方旭浩
用时：1小时

# 下载前端模版

下载地址: https://github.com/BootstrapDash/PurpleAdmin-Free-Admin-Template

# 前端三剑客语言

所有前端网页的基础都是基于HTML, CSS, js 这三种语言的，接下来会简单讲一下每一种的作用\
现场表演代码环节

## HTML
通过tag结构对页面上的所有组件做一个布局

## CSS
对组件样式进行更改

## JS
组件的逻辑代码

# 更改模版内容

首先取出`blank`和`login`页面，这两个我们一定是会用到的。\
在根目录下新建一个叫`allergy`的目录，我们会在目录里写自己的页面。

## 尝试http请求

新建一个目录`allergy/js`，并创建`login.js`。然后在login.html中进行引入
```html
<!-- 前面的按钮记得加上id -->
<script src="js/login.js"></script>
```
login.js的代码
```js
$(function() {
    $("#sign_in").click(function(e) {
        $.ajax({
            type: "GET",
            url: "https://icanhazdadjoke.com/",
            contentType: "application/json",
            dataType: "json",
            data: "",
            success: function(response) {
                console.log(response);
            },
            error: function(response) {
                console.log(response);
            }
        });
    });
});
```

打开浏览器Inspection，点击sign in按钮。这个时候console应该会打印出一个joke

## 请求flask的后端

首先按照上节课的方式运行我们的后端程序

把`login.js`中的代码改为
```js
const base_url = "http://127.0.0.1:8000";
$(function() {
    $("#sign_in").click(function(e) {
        $.ajax({
            type: "GET",
            url: base_url + "/test",
            contentType: "application/json",
            dataType: "json",
            data: "",
            success: function(response) {
                console.log(response);
            },
            error: function(response) {
                console.log("Error!");
            }
        });
    });
});
```

现在我们再打开浏览器，再次点击sign in按钮。这次console中会现实一个红色的错误`No 'Access-Control-Allow-Origin' header is present on the requested resource.`

### 跨域 CORS

谷歌浅搜一下什么意思

解决方案如下

backend根目录运行
```shell
pip3 install flask-cors

pip3 freeze >> requirements.txt
```

在后端`app.py`中可以加入以下代码:
```py
from flask import Flask
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)

@app.route('/test')
@cross_origin()
def test():
    obj = {}
    obj['status'] = 200
    obj['data'] = [1, 2, 3]
    return obj
```
Allergy项目第四节课\
老师：刘心语 Max\
学生：方旭浩\
用时：1小时

# 数据库
本节课重点为数据库的基础操作和表结构设计

## 表结构
上节课我们已经建立过一个完整的表了，重新举个例子：

班级:
| ID | 班级名 | 班主任 | 
| -- | -- | -- | 
| 301 | 三年一班 | 张老师 | 
| 302 | 三年二班 | 李老师 |

学生
| ID | 姓名 | 班级 | 性别 | 
| -- | -- | -- | -- | 
| 1 | 小王 | 301 | 男 | 
| 2 | 小刘 | 302 | 女 | 
| 3 | 小黄 | 302 | 男 | 

每一行代表什么？\
每一列代表什么？

这两个表是否有关系：
一对多的关系

Primary key 主键\
Foreign key 外键

多对多:

食品:
| ID | Food name |
| -- | -- | 
| 1 | 可乐 | 
| 2 | 雪碧 |
| 3 | 芬达 |  

过敏源:
| ID | Ingredient |
| -- | -- | 
| 1 | 碳酸 |
| 2 | 塘 |
| 3 | 柠檬 |

食品_过敏源
| Food_ID | Ingredient_ID |
| -- | -- | 
| 1 | 1 |
| 1 | 2 |
| 1 | 3 |
| 2 | 1 |
| 2 | 2 |
| 2 | 3 |
| 3 | 1 |
| 3 | 2 |

## 数据操作

对于数据的操作通常可以归为四种类型：
1. 增加 Create
2. 查看 Read
3. 改动 Update
4. 删除 Delete

以上四种我们简称CRUD


### Create
```sql
INSERT INTO <表名> (字段1, 字段2, ...) VALUES (值1, 值2, ...);
```

### Read
```sql
SELECT * FROM <表名>;
```

带条件查询:
```sql
SELECT id, food_name FROM allergy.food WHERE food_name like '%a%';
```

### Update
```sql
UPDATE <表名> SET 字段1=值1, 字段2=值2, ... WHERE ...;
```

### Delete
```sql
DELETE FROM <表名> WHERE ...;
```
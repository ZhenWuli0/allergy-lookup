Allergy项目第六节课\
老师：刘心语 Max\
学生：方旭浩\
用时：1小时

# User auth
1. 密码没有加密
2. 忘记密码使用security question
3. 有没有其他权限，比如admin


# Main product功能
- Food
  - admin可以上传
    - food信息
    - ingredients 信息
      - 输入前需要先确保数据库里已经存在
  - user查看里面的ingredients
  - admin可以删除
  - admin可以改动

- Ingredients
  - 用户根据ingredients搜索food

- 搜索记录

# API

### addFood 添加食物
Param:
Food name

return food id

### addIngredient 添加过敏源
Param:
Ingredient name

return Ingredient id

### linkFood 添加对应Ingredients
Param:
Food id
Ingredient id

return 

### findFood
Param:
Food name

### findIngredients
Param:
Ingredient name

### findFoodByIngredients
Param:
Ingredient list

### updateFood

### updateIngredient

### updateFoodIngredient

### deleteFood

### deleteIngredient

### deleteFoodIngredient
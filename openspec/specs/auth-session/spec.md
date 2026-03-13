## 新增需求

### 需求:Session 必须正确包含用户信息
用户登录成功后，session 对象必须包含用户的 id、name、email、image、role 等信息。

#### 场景:登录后 session 可用
- **当** 用户通过 OAuth 成功登录
- **那么** session.user 必须包含 id、name、email、image 属性

#### 场景:middleware 可正确判断登录状态
- **当** middleware 调用 auth() 获取 session
- **那么** 必须能正确判断用户是否已登录

#### 场景:页面组件可获取用户信息
- **当** 服务端组件调用 auth() 获取 session
- **那么** 必须返回包含正确用户信息的 session 对象

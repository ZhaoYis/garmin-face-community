## 新增需求

### 需求:用户可以绑定 Garmin 账号
系统必须允许已登录用户通过 OAuth 授权流程绑定其 Garmin 账号。

#### 场景:获取授权链接
- **当** 用户点击"绑定佳明"按钮
- **那么** 系统生成包含 state 参数的授权 URL 并跳转到 Garmin 授权页面

#### 场景:授权回调成功
- **当** Garmin 回调携带有效的 code 和 state 参数
- **那么** 系统交换 code 获取 access_token 和 refresh_token，加密存储到用户记录，并跳转到成功页面

#### 场景:授权回调失败
- **当** Garmin 回调携带 error 参数或 state 验证失败
- **那么** 系统显示错误信息，提示用户重新授权

### 需求:系统必须加密存储 Garmin Token
敏感凭证必须使用 AES-256-GCM 加密存储，禁止明文存储。

#### 场景:Token 加密存储
- **当** 系统获取到用户的 access_token 和 refresh_token
- **那么** 系统使用 ENCRYPTION_KEY 对 Token 进行加密后存储

#### 场景:Token 解密读取
- **当** 系统需要使用用户的 Token 调用 API
- **那么** 系统解密 Token 后使用，使用后立即清除内存中的明文

### 需求:用户可以解绑 Garmin 账号
系统必须允许用户解除 Garmin 账号绑定。

#### 场景:解绑成功
- **当** 用户点击"解绑佳明"按钮并确认
- **那么** 系统清除用户的 Garmin 相关字段（garminUserId, garminAccessToken, garminRefreshToken, garminTokenExpireAt）

### 需求:系统必须自动刷新过期 Token
当 Token 即将过期或已过期时，系统必须自动使用 refresh_token 刷新。

#### 场景:Token 自动刷新
- **当** Token 距离过期时间少于 5 分钟或已过期
- **那么** 系统使用 refresh_token 获取新的 access_token 并更新存储

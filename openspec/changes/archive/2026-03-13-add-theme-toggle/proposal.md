## 为什么

当前项目虽然定义了 Light 和 Dark 模式的 CSS 变量，但仅依赖系统偏好 (`prefers-color-scheme`) 自动切换。用户无法手动切换主题，也无法保存自己的主题偏好。为了提升用户体验，需要：

1. **手动切换能力**：用户可以自由切换 Light/Dark 模式
2. **持久化存储**：用户选择的主题应该被记住
3. **系统跟随选项**：支持跟随系统主题设置

## 变更内容

1. **添加 next-themes 依赖**：使用成熟的主题管理库

2. **创建 ThemeProvider**：在 root layout 中包装应用

3. **创建 ThemeToggle 组件**：在 Header 中添加主题切换按钮

4. **完善 CSS 变量**：补充 Dark 模式下所有颜色变量

5. **更新 Tailwind 配置**：确保 dark mode 正确工作

## 功能 (Capabilities)

### 新增功能
- `theme-toggle`: 主题切换功能，支持 Light/Dark/System 三种模式，用户选择持久化存储

## 影响

- **依赖新增**：`next-themes`
- **文件修改**：`src/app/layout.tsx`、`src/app/globals.css`、`tailwind.config.ts`
- **文件新增**：`src/components/theme-provider.tsx`、`src/components/theme-toggle.tsx`
- **UI 变更**：Header 右侧添加主题切换按钮

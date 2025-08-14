# Node.js 版本配置指南

## 快速配置

### 1. 创建版本配置文件

```bash
echo "20.19.4" > .nvmrc
echo "20.19.4" > .node-version
```

### 2. 更新 package.json

在 `package.json` 中添加：

```json
{
  "engines": {
    "node": "20.19.4"
  }
}
```

### 3. 配置自动切换（一次性）

将以下内容添加到 `~/.zshrc`：

```bash
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"
  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")
    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

### 4. 重新加载配置

```bash
source ~/.zshrc
```

## 完成！

现在进入项目目录时会自动切换到 Node.js 20.19.4，无需手动运行 `nvm use`。

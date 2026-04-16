# xkeywords-rust

`xkeywords` 的 Rust/WASM 重构版，目标是直接接入 Cloudflare Workers。

这个版本不再依赖 Flask 或 SQLite，而是把原项目中的核心逻辑迁移为：

- Rust 业务库
- `wasm-bindgen` 导出的 `wasm`
- 一个可直接挂到 Workers 的 `worker/index.ts`

## 当前覆盖的逻辑

已迁移原项目的核心行为：

- `is_valid_keyword`
- `parse_keyword`
- `parse_keywords`
- `addKeyword`
- `getKeywords`
- `update_keyword_status`
- `deleteKeyword`
- `deleteTag`
- `import_keywords`

额外补了两个批量操作，方便前端/Workers 用：

- `updateKeywordStatuses`
- `deleteKeywords`

## 目录结构

```text
xkeywords-rust/
├── Cargo.toml
├── src/lib.rs
├── worker/index.ts
├── wrangler.toml
└── package.json
```

## 导出的 Rust API

### 纯函数

- `isValidKeyword(keyword: string): boolean`
- `parseKeyword(keyword: string): { keyword: string, tags: string }`
- `parseKeywords(input: string): string[]`

### `KeywordStore`

```ts
const store = new KeywordStore();

store.addKeyword("Nasdaq[work,news]");
store.listKeywords();
store.updateKeywordStatus("Nasdaq", "cold");
store.deleteKeyword("Nasdaq", "normal");
store.deleteTag("work");
store.importKeywords(["btc", "eth"]);
store.exportRecords();
```

也可以从外部数据恢复：

```ts
const store = KeywordStore.fromRecords([
  { keyword: "Nasdaq", status: "active", tags: "work,news" }
]);
```

## Cloudflare Workers 接法

`worker/index.ts` 已提供 HTTP 路由示例，默认支持：

- `GET /`
- `GET /health`
- `GET /getKeywords`
- `POST /addKeyword`
- `POST /update_keyword_status`
- `POST /update_keyword_statuses`
- `POST /deleteKeyword`
- `POST /deleteKeywords`
- `POST /deleteTag`
- `POST /import_keywords`
- `POST /parse_keywords`
- `POST /parse_keyword`
- `POST /validate_keyword`

### 持久化

项目现在默认使用 Cloudflare Workers KV，binding 名称是 `XKEYWORDS_STATE`：

```toml
[[kv_namespaces]]
binding = "XKEYWORDS_STATE"
```

本地开发时，`wrangler dev` 会为这个 binding 提供本地 KV 存储，所以关键词状态会在本地开发环境里持久化，而不是只存在单次请求内存里。

首次线上部署前需要先登录 Cloudflare：

```bash
npx wrangler login
```

然后直接部署：

```bash
npx wrangler deploy
```

如果你的账号里还没有对应的 namespace，Wrangler 会根据这个 binding 自动创建并绑定。

如果你后面要换成 D1、Durable Object 或 R2，也只需要改 `loadStore` / `persistStore`。

## 编译

本地需要：

- Rust toolchain
- `wasm-pack`
- Node.js

### 生成 wasm 包

```bash
wasm-pack build --target web --out-dir pkg
```

或者：

```bash
npm run build:wasm
```

### 启动 Worker 本地调试

```bash
npm install
export PATH=/home/donnie/.cargo/bin:$PATH
npm run dev:worker
```

## 迁移说明

原 Flask 版使用 SQLite 作为状态存储。Workers 环境里不适合直接沿用这一层，所以这里的 Rust 只负责：

- 关键词校验
- 关键词/标签解析
- 状态变更
- 集合操作

存储交给 Workers 侧的 KV binding 实现。

## 注意

当前实现保持了原项目的大部分接口语义，但做了三处面向 Workers 的调整：

- 删除和状态更新支持批量接口，避免前端循环发很多请求
- 存储从 SQLite 改为 KV binding，便于接 Workers
- 根路由 `/` 现在直接返回 Worker 内置前端页面

## 下一步建议

如果你要直接上线到 Cloudflare Workers，下一步通常是：

1. 运行 `npx wrangler login`
2. 运行 `npx wrangler deploy`
3. 如果需要更强一致性或复杂查询，再考虑把 KV 升级成 D1 / Durable Objects

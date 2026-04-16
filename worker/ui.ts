type HomePageOptions = {
  hasPersistence: boolean;
};

function escapeScriptJson(input: string): string {
  return input.replace(/</g, "\\u003c");
}

export function renderHomePage(options: HomePageOptions): string {
  const bootstrap = escapeScriptJson(JSON.stringify(options));

  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>xkeywords rust</title>
    <style>
      :root {
        --bg: #f5efe4;
        --panel: rgba(255, 252, 245, 0.86);
        --panel-strong: rgba(255, 250, 240, 0.96);
        --ink: #1f1a16;
        --muted: #665f56;
        --line: rgba(67, 55, 44, 0.14);
        --accent: #0d8a72;
        --accent-strong: #06634f;
        --warm: #bc5b36;
        --cold: #5d6fd3;
        --shadow: 0 20px 60px rgba(56, 43, 28, 0.14);
        --radius-xl: 28px;
        --radius-lg: 20px;
        --radius-md: 14px;
        --font-display: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif;
        --font-body: "Avenir Next", "Segoe UI", sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(13, 138, 114, 0.18), transparent 24%),
          radial-gradient(circle at top right, rgba(188, 91, 54, 0.16), transparent 28%),
          linear-gradient(135deg, #efe4d0 0%, #f8f4ea 42%, #efe8db 100%);
        color: var(--ink);
        font-family: var(--font-body);
      }

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        background-image: linear-gradient(rgba(26, 22, 18, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(26, 22, 18, 0.03) 1px, transparent 1px);
        background-size: 24px 24px;
        pointer-events: none;
        opacity: 0.26;
      }

      .shell {
        position: relative;
        max-width: 1380px;
        margin: 0 auto;
        padding: 40px 20px 72px;
      }

      .hero {
        display: grid;
        grid-template-columns: 1.3fr 0.9fr;
        gap: 18px;
        margin-bottom: 18px;
      }

      .hero-main,
      .hero-side,
      .panel,
      .lane,
      .drawer,
      .tag-card,
      .parsed-card {
        backdrop-filter: blur(14px);
        background: var(--panel);
        border: 1px solid var(--line);
        box-shadow: var(--shadow);
      }

      .hero-main {
        border-radius: var(--radius-xl);
        padding: 28px 30px;
      }

      .hero-side {
        border-radius: var(--radius-xl);
        padding: 24px 24px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 7px 12px;
        border-radius: 999px;
        background: rgba(13, 138, 114, 0.12);
        color: var(--accent-strong);
        font-size: 13px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      h1,
      h2,
      h3 {
        margin: 0;
        font-family: var(--font-display);
        font-weight: 700;
        letter-spacing: -0.03em;
      }

      h1 {
        margin-top: 16px;
        font-size: clamp(40px, 6vw, 72px);
        line-height: 0.95;
      }

      .hero-copy {
        margin-top: 14px;
        max-width: 720px;
        color: var(--muted);
        font-size: 17px;
        line-height: 1.7;
      }

      .hero-links {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 22px;
      }

      a.link-chip,
      button,
      .ghost-button {
        transition: transform 160ms ease, background 160ms ease, border-color 160ms ease, color 160ms ease;
      }

      .link-chip,
      button,
      .ghost-button {
        border-radius: 999px;
        border: 1px solid rgba(31, 26, 22, 0.1);
        background: rgba(255, 255, 255, 0.74);
        color: var(--ink);
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
      }

      .link-chip {
        padding: 10px 14px;
      }

      .link-chip:hover,
      button:hover,
      .ghost-button:hover {
        transform: translateY(-1px);
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-top: 16px;
      }

      .stat {
        border-radius: var(--radius-lg);
        background: var(--panel-strong);
        border: 1px solid rgba(31, 26, 22, 0.08);
        padding: 16px;
      }

      .stat-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
      }

      .stat-value {
        margin-top: 8px;
        font-size: 30px;
        font-weight: 700;
      }

      .status-banner {
        margin-top: 18px;
        padding: 14px 16px;
        border-radius: var(--radius-md);
        background: rgba(93, 111, 211, 0.12);
        color: #334095;
        line-height: 1.6;
      }

      .status-banner.warn {
        background: rgba(188, 91, 54, 0.12);
        color: #8a3b20;
      }

      .grid {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 18px;
        margin-bottom: 18px;
      }

      .panel,
      .drawer {
        border-radius: var(--radius-xl);
        padding: 22px;
      }

      .panel-header,
      .drawer-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }

      .panel-title {
        font-size: 28px;
      }

      .panel-subtitle {
        color: var(--muted);
        margin-top: 6px;
        line-height: 1.6;
      }

      .field-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 12px;
      }

      .stack {
        display: grid;
        gap: 12px;
      }

      input[type="text"],
      textarea {
        width: 100%;
        border: 1px solid rgba(31, 26, 22, 0.12);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.8);
        padding: 14px 16px;
        color: var(--ink);
        font: inherit;
      }

      textarea {
        min-height: 132px;
        resize: vertical;
      }

      input[type="text"]:focus,
      textarea:focus {
        outline: 2px solid rgba(13, 138, 114, 0.24);
        border-color: rgba(13, 138, 114, 0.38);
      }

      button {
        border: none;
        padding: 12px 16px;
        font: inherit;
      }

      .primary-button {
        background: linear-gradient(135deg, var(--accent) 0%, #119e84 100%);
        color: white;
      }

      .accent-button {
        background: linear-gradient(135deg, #bc5b36 0%, #d57e52 100%);
        color: white;
      }

      .soft-button {
        background: rgba(31, 26, 22, 0.06);
        color: var(--ink);
      }

      .copy-output {
        border-radius: 18px;
        background: #1f1a16;
        color: #f8f4ea;
        padding: 16px;
        min-height: 88px;
        font-family: "SFMono-Regular", "Consolas", monospace;
        line-height: 1.65;
        white-space: pre-wrap;
      }

      .controls {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .board {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .lane {
        border-radius: var(--radius-xl);
        padding: 18px;
      }

      .lane.active {
        background: linear-gradient(180deg, rgba(13, 138, 114, 0.11), rgba(255, 252, 245, 0.92));
      }

      .lane.cold {
        background: linear-gradient(180deg, rgba(93, 111, 211, 0.11), rgba(255, 252, 245, 0.92));
      }

      .lane-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 14px;
      }

      .lane-title {
        font-size: 28px;
      }

      .lane-desc {
        color: var(--muted);
      }

      .lane-stack {
        display: grid;
        gap: 14px;
      }

      .tag-card {
        border-radius: 20px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.7);
      }

      .tag-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .tag-name {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        font-size: 18px;
      }

      .tag-badge {
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(13, 138, 114, 0.1);
        color: var(--accent-strong);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .tiny-button {
        padding: 8px 12px;
        font-size: 13px;
      }

      .keyword-list {
        display: grid;
        gap: 10px;
      }

      .keyword-item {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(31, 26, 22, 0.08);
      }

      .keyword-item input {
        width: 18px;
        height: 18px;
      }

      .keyword-text {
        min-width: 0;
      }

      .keyword-label {
        display: block;
        font-weight: 700;
        overflow-wrap: anywhere;
      }

      .keyword-meta {
        margin-top: 3px;
        color: var(--muted);
        font-size: 13px;
      }

      .keyword-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
      }

      .parsed-card {
        margin-top: 16px;
        border-radius: 20px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.72);
      }

      .parsed-list {
        display: grid;
        gap: 10px;
        margin-top: 12px;
      }

      .parsed-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.84);
        border: 1px solid rgba(31, 26, 22, 0.08);
      }

      .empty {
        padding: 18px;
        border-radius: 18px;
        border: 1px dashed rgba(31, 26, 22, 0.14);
        text-align: center;
        color: var(--muted);
        background: rgba(255, 255, 255, 0.5);
      }

      .toast {
        position: fixed;
        right: 18px;
        bottom: 18px;
        padding: 14px 16px;
        border-radius: 16px;
        background: rgba(31, 26, 22, 0.92);
        color: white;
        box-shadow: 0 18px 32px rgba(31, 26, 22, 0.28);
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 180ms ease, transform 180ms ease;
        pointer-events: none;
      }

      .toast.show {
        opacity: 1;
        transform: translateY(0);
      }

      @media (max-width: 1100px) {
        .hero,
        .grid,
        .board {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 700px) {
        .shell {
          padding: 18px 14px 40px;
        }

        .hero-main,
        .hero-side,
        .panel,
        .drawer,
        .lane {
          padding: 18px;
        }

        .field-row {
          grid-template-columns: 1fr;
        }

        .stats {
          grid-template-columns: 1fr;
        }

        .keyword-item {
          grid-template-columns: auto minmax(0, 1fr);
        }

        .keyword-actions {
          grid-column: 1 / -1;
          justify-content: flex-start;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <section class="hero">
        <div class="hero-main">
          <span class="eyebrow">xkeywords for workers</span>
          <h1>把关键词池变成一张可编辑的情报面板。</h1>
          <p class="hero-copy">
            这版前端保留了 Python 原型里的关键词管理、冷藏/激活、按标签组织、解析导入和复制组合，
            但把界面做成更适合长期使用的双栏工作台。默认 OR，想表达 AND 条件时仍然给关键词加 <code>and </code> 前缀。
          </p>
          <div class="hero-links">
            <a class="link-chip" href="https://xding.top/archives/538.html" target="_blank" rel="noreferrer">推特搜索小技巧</a>
            <a class="link-chip" href="#importer">跳到批量导入</a>
          </div>
        </div>
        <aside class="hero-side">
          <div>
            <h2 class="panel-title">运行状态</h2>
            <p class="panel-subtitle">页面直接调用 Worker API，没有额外前端框架。</p>
            <div class="stats">
              <div class="stat">
                <div class="stat-label">Active</div>
                <div class="stat-value" id="stat-active">0</div>
              </div>
              <div class="stat">
                <div class="stat-label">Cold</div>
                <div class="stat-value" id="stat-cold">0</div>
              </div>
              <div class="stat">
                <div class="stat-label">Tags</div>
                <div class="stat-value" id="stat-tags">0</div>
              </div>
            </div>
          </div>
          <div class="status-banner ${options.hasPersistence ? "" : "warn"}" id="persistence-banner"></div>
        </aside>
      </section>

      <section class="grid">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">快速操作</h2>
              <p class="panel-subtitle">添加关键词、勾选活跃项并生成用于 X 搜索的复制结果。</p>
            </div>
          </div>
          <div class="stack">
            <div class="field-row">
              <input id="new-keyword" type="text" placeholder='输入新关键词，例如 Nasdaq[work,daily,news]' />
              <button class="primary-button" id="add-keyword-button">添加关键词</button>
            </div>
            <div class="controls">
              <button class="soft-button" id="toggle-active-selection">全选/反选活跃区</button>
              <button class="accent-button" id="copy-selection">复制当前选择</button>
            </div>
            <div class="copy-output" id="copy-output">勾选活跃区关键词后，这里会生成最终搜索表达式。</div>
          </div>
        </div>

        <div class="drawer" id="importer">
          <div class="drawer-header">
            <div>
              <h2 class="panel-title">批量导入</h2>
              <p class="panel-subtitle">输入一段组合查询，先解析，再选择需要导入的关键词。</p>
            </div>
          </div>
          <div class="stack">
            <textarea id="import-source" placeholder="例如：(OpenAI OR Anthropic) and agents model"></textarea>
            <div class="controls">
              <button class="primary-button" id="parse-input-button">解析组合</button>
              <button class="soft-button" id="toggle-import-selection">全选/反选解析结果</button>
              <button class="accent-button" id="import-selection-button">导入已勾选</button>
            </div>
            <div class="parsed-card">
              <div class="panel-subtitle">解析结果</div>
              <div class="parsed-list" id="parsed-list">
                <div class="empty">还没有解析结果。</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="board">
        <section class="lane active">
          <div class="lane-head">
            <div>
              <h2 class="lane-title">活跃区</h2>
              <div class="lane-desc">用于当前搜索、复制和跟进。</div>
            </div>
          </div>
          <div class="lane-stack" id="active-lane"></div>
        </section>

        <section class="lane cold">
          <div class="lane-head">
            <div>
              <h2 class="lane-title">冷藏区</h2>
              <div class="lane-desc">先保留，之后再激活。</div>
            </div>
          </div>
          <div class="lane-stack" id="cold-lane"></div>
        </section>
      </section>
    </div>

    <div class="toast" id="toast"></div>

    <script id="bootstrap" type="application/json">${bootstrap}</script>
    <script>
      const bootstrap = JSON.parse(document.getElementById("bootstrap").textContent);
      const state = {
        keywords: [],
        grouped: { active: [], cold: [] },
        parsedKeywords: [],
        selectedKeywords: new Set(),
      };

      const els = {
        activeLane: document.getElementById("active-lane"),
        coldLane: document.getElementById("cold-lane"),
        statActive: document.getElementById("stat-active"),
        statCold: document.getElementById("stat-cold"),
        statTags: document.getElementById("stat-tags"),
        persistenceBanner: document.getElementById("persistence-banner"),
        newKeyword: document.getElementById("new-keyword"),
        copyOutput: document.getElementById("copy-output"),
        importSource: document.getElementById("import-source"),
        parsedList: document.getElementById("parsed-list"),
        toast: document.getElementById("toast"),
      };

      let toastTimer;

      function showToast(message) {
        clearTimeout(toastTimer);
        els.toast.textContent = message;
        els.toast.classList.add("show");
        toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
      }

      function setPersistenceBanner() {
        els.persistenceBanner.textContent = bootstrap.hasPersistence
          ? "KV 已绑定，数据会持久化保存。"
          : "当前没有绑定 KV。页面能操作 API，但数据不会跨请求持久化。";
      }

      async function api(path, init) {
        const response = await fetch(path, init);
        const contentType = response.headers.get("content-type") || "";
        const payload = contentType.includes("application/json") ? await response.json() : await response.text();
        if (!response.ok) {
          const message = typeof payload === "string" ? payload : payload.error || "Request failed";
          throw new Error(message);
        }
        return payload;
      }

      function splitTags(tags) {
        if (!tags) {
          return ["normal"];
        }
        return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
      }

      function groupKeywords(records) {
        const byStatus = { active: new Map(), cold: new Map() };

        for (const record of records) {
          const tags = splitTags(record.tags);
          for (const tag of tags) {
            const store = byStatus[record.status] || byStatus.active;
            if (!store.has(tag)) {
              store.set(tag, []);
            }
            store.get(tag).push(record);
          }
        }

        return {
          active: Array.from(byStatus.active.entries())
            .map(([tag, keywords]) => ({ tag, keywords }))
            .sort((a, b) => a.tag.localeCompare(b.tag)),
          cold: Array.from(byStatus.cold.entries())
            .map(([tag, keywords]) => ({ tag, keywords }))
            .sort((a, b) => a.tag.localeCompare(b.tag)),
        };
      }

      function updateStats() {
        const activeCount = state.keywords.filter((row) => row.status === "active").length;
        const coldCount = state.keywords.filter((row) => row.status === "cold").length;
        const tagCount = new Set(state.keywords.flatMap((row) => splitTags(row.tags))).size;
        els.statActive.textContent = String(activeCount);
        els.statCold.textContent = String(coldCount);
        els.statTags.textContent = String(tagCount);
      }

      function buildCopyOutput() {
        const selectedRecords = state.keywords.filter((row) => row.status === "active" && state.selectedKeywords.has(row.keyword));
        if (selectedRecords.length === 0) {
          els.copyOutput.textContent = "勾选活跃区关键词后，这里会生成最终搜索表达式。";
          return;
        }

        const plain = [];
        const andList = [];
        for (const row of selectedRecords) {
          if (row.keyword.toLowerCase().startsWith("and ")) {
            andList.push(row.keyword.slice(4));
          } else {
            plain.push(row.keyword);
          }
        }

        const orResult = plain.join(" OR ");
        const andResult = andList.join(" ");
        const finalResult = andResult && orResult ? andResult + " (" + orResult + ")" : andResult || orResult;
        els.copyOutput.textContent = finalResult || "当前选择为空。";
      }

      function renderKeywordItem(record, tag, status) {
        const item = document.createElement("div");
        item.className = "keyword-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = state.selectedKeywords.has(record.keyword);
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            state.selectedKeywords.add(record.keyword);
          } else {
            state.selectedKeywords.delete(record.keyword);
          }
          buildCopyOutput();
        });

        const text = document.createElement("div");
        text.className = "keyword-text";

        const label = document.createElement("span");
        label.className = "keyword-label";
        label.textContent = record.keyword;

        const meta = document.createElement("div");
        meta.className = "keyword-meta";
        meta.textContent = tag === "normal" ? "未归档标签" : "标签: " + tag;

        text.append(label, meta);

        const actions = document.createElement("div");
        actions.className = "keyword-actions";

        const statusButton = document.createElement("button");
        statusButton.className = "soft-button tiny-button";
        statusButton.textContent = status === "active" ? "冷藏" : "激活";
        statusButton.addEventListener("click", async () => {
          await api("/update_keyword_status", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ keyword: record.keyword, status: status === "active" ? "cold" : "active" }),
          });
          showToast("状态已更新");
          await refresh();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "soft-button tiny-button";
        deleteButton.textContent = tag === "normal" ? "删除关键词" : "移除标签";
        deleteButton.addEventListener("click", async () => {
          await api("/deleteKeyword", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ keyword: record.keyword, tag }),
          });
          state.selectedKeywords.delete(record.keyword);
          showToast(tag === "normal" ? "关键词已删除" : "标签已移除");
          await refresh();
        });

        actions.append(statusButton, deleteButton);
        item.append(checkbox, text, actions);
        return item;
      }

      function renderTagCard(group, status) {
        const card = document.createElement("section");
        card.className = "tag-card";

        const head = document.createElement("div");
        head.className = "tag-head";

        const title = document.createElement("div");
        title.className = "tag-name";
        title.innerHTML = '<span class="tag-badge">' + group.keywords.length + "</span>" + group.tag;

        const controls = document.createElement("div");
        controls.className = "chip-row";

        const selectionButton = document.createElement("button");
        selectionButton.className = "soft-button tiny-button";
        selectionButton.textContent = group.keywords.every((row) => state.selectedKeywords.has(row.keyword))
          ? "反选"
          : "全选";
        selectionButton.addEventListener("click", () => {
          const shouldSelectAll = group.keywords.some((row) => !state.selectedKeywords.has(row.keyword));
          for (const row of group.keywords) {
            if (shouldSelectAll) {
              state.selectedKeywords.add(row.keyword);
            } else {
              state.selectedKeywords.delete(row.keyword);
            }
          }
          render();
        });

        const toggleButton = document.createElement("button");
        toggleButton.className = "soft-button tiny-button";
        toggleButton.textContent = status === "active" ? "整组冷藏" : "整组激活";
        toggleButton.addEventListener("click", async () => {
          await api("/update_keyword_statuses", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              keywords: group.keywords.map((row) => row.keyword),
              status: status === "active" ? "cold" : "active",
            }),
          });
          showToast("整组状态已更新");
          await refresh();
        });

        controls.append(selectionButton, toggleButton);

        if (group.tag !== "normal") {
          const deleteTagButton = document.createElement("button");
          deleteTagButton.className = "soft-button tiny-button";
          deleteTagButton.textContent = "删除标签";
          deleteTagButton.addEventListener("click", async () => {
            await api("/deleteTag", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ tag: group.tag }),
            });
            showToast("标签已从所有关键词中移除");
            await refresh();
          });
          controls.append(deleteTagButton);
        }

        head.append(title, controls);

        const list = document.createElement("div");
        list.className = "keyword-list";
        for (const record of group.keywords) {
          list.append(renderKeywordItem(record, group.tag, status));
        }

        card.append(head, list);
        return card;
      }

      function renderLane(status, target, groups) {
        target.innerHTML = "";
        if (groups.length === 0) {
          const empty = document.createElement("div");
          empty.className = "empty";
          empty.textContent = status === "active" ? "还没有活跃关键词。" : "冷藏区为空。";
          target.append(empty);
          return;
        }
        for (const group of groups) {
          target.append(renderTagCard(group, status));
        }
      }

      function renderParsedKeywords() {
        els.parsedList.innerHTML = "";
        if (state.parsedKeywords.length === 0) {
          const empty = document.createElement("div");
          empty.className = "empty";
          empty.textContent = "还没有解析结果。";
          els.parsedList.append(empty);
          return;
        }

        for (const keyword of state.parsedKeywords) {
          const item = document.createElement("label");
          item.className = "parsed-item";

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = true;
          checkbox.value = keyword;

          const text = document.createElement("span");
          text.textContent = keyword;

          item.append(checkbox, text);
          els.parsedList.append(item);
        }
      }

      function render() {
        state.grouped = groupKeywords(state.keywords);
        updateStats();
        buildCopyOutput();
        renderLane("active", els.activeLane, state.grouped.active);
        renderLane("cold", els.coldLane, state.grouped.cold);
        renderParsedKeywords();
      }

      async function refresh() {
        const keywords = await api("/getKeywords");
        state.keywords = Array.isArray(keywords) ? keywords : [];
        render();
      }

      async function handleAddKeyword() {
        const keyword = els.newKeyword.value.trim();
        if (!keyword) {
          showToast("先输入关键词");
          return;
        }
        await api("/addKeyword", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ keyword }),
        });
        els.newKeyword.value = "";
        showToast("关键词已添加");
        await refresh();
      }

      async function handleCopySelection() {
        buildCopyOutput();
        if (!navigator.clipboard) {
          showToast("当前环境不支持剪贴板");
          return;
        }
        await navigator.clipboard.writeText(els.copyOutput.textContent);
        showToast("搜索表达式已复制");
      }

      function toggleActiveSelection() {
        const activeKeywords = state.keywords.filter((row) => row.status === "active").map((row) => row.keyword);
        const shouldSelectAll = activeKeywords.some((keyword) => !state.selectedKeywords.has(keyword));
        if (shouldSelectAll) {
          for (const keyword of activeKeywords) {
            state.selectedKeywords.add(keyword);
          }
        } else {
          for (const keyword of activeKeywords) {
            state.selectedKeywords.delete(keyword);
          }
        }
        render();
      }

      async function handleParseImportSource() {
        const keywords = els.importSource.value.trim();
        if (!keywords) {
          showToast("先输入要解析的组合");
          return;
        }
        state.parsedKeywords = await api("/parse_keywords", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ keywords }),
        });
        renderParsedKeywords();
        showToast("解析完成");
      }

      function toggleImportSelection() {
        const checkboxes = els.parsedList.querySelectorAll('input[type="checkbox"]');
        const shouldSelectAll = Array.from(checkboxes).some((checkbox) => !checkbox.checked);
        checkboxes.forEach((checkbox) => {
          checkbox.checked = shouldSelectAll;
        });
      }

      async function handleImportSelection() {
        const selected = Array.from(els.parsedList.querySelectorAll('input[type="checkbox"]:checked'))
          .map((checkbox) => checkbox.value);
        if (selected.length === 0) {
          showToast("没有勾选任何解析结果");
          return;
        }
        const result = await api("/import_keywords", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ keywords: selected }),
        });
        showToast("已导入 " + result.added_keywords.length + " 个关键词");
        await refresh();
      }

      document.getElementById("add-keyword-button").addEventListener("click", () => {
        handleAddKeyword().catch((error) => showToast(error.message));
      });

      document.getElementById("copy-selection").addEventListener("click", () => {
        handleCopySelection().catch((error) => showToast(error.message));
      });

      document.getElementById("toggle-active-selection").addEventListener("click", toggleActiveSelection);
      document.getElementById("parse-input-button").addEventListener("click", () => {
        handleParseImportSource().catch((error) => showToast(error.message));
      });
      document.getElementById("toggle-import-selection").addEventListener("click", toggleImportSelection);
      document.getElementById("import-selection-button").addEventListener("click", () => {
        handleImportSelection().catch((error) => showToast(error.message));
      });

      els.newKeyword.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleAddKeyword().catch((error) => showToast(error.message));
        }
      });

      setPersistenceBanner();
      refresh().catch((error) => {
        showToast(error.message || "加载失败");
      });
    </script>
  </body>
</html>`;
}

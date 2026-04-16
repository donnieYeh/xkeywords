import init, {
  KeywordStore,
  isValidKeyword,
  parseKeyword,
  parseKeywords,
} from "../pkg/xkeywords_rust";
import wasmModule from "../pkg/xkeywords_rust_bg.wasm";
import { renderHomePage } from "./ui";

interface Env {
  XKEYWORDS_STATE?: KVNamespace;
}

let wasmReady: Promise<unknown> | undefined;

function ensureWasm(): Promise<unknown> {
  if (!wasmReady) {
    wasmReady = init(wasmModule);
  }
  return wasmReady;
}

async function loadStore(env: Env): Promise<KeywordStore> {
  await ensureWasm();
  if (!env.XKEYWORDS_STATE) {
    return new KeywordStore();
  }

  const stored = await env.XKEYWORDS_STATE.get("keywords", "json");
  if (!stored) {
    return new KeywordStore();
  }

  return KeywordStore.fromRecords(stored);
}

async function persistStore(env: Env, store: KeywordStore): Promise<void> {
  if (!env.XKEYWORDS_STATE) {
    return;
  }
  await env.XKEYWORDS_STATE.put(
    "keywords",
    JSON.stringify(store.exportRecords()),
  );
}

function json(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}

function html(body: string, init?: ResponseInit): Response {
  return new Response(body, {
    ...init,
    headers: {
      "content-type": "text/html; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}

function badRequest(error: unknown): Response {
  const message = error instanceof Error ? error.message : String(error);
  return json({ success: false, error: message }, { status: 400 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return html(renderHomePage({ hasPersistence: Boolean(env.XKEYWORDS_STATE) }));
    }

    await ensureWasm();

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true });
    }

    if (request.method === "POST" && url.pathname === "/parse_keywords") {
      const body = (await request.json()) as { keywords?: string };
      return json(parseKeywords(body.keywords ?? ""));
    }

    if (request.method === "POST" && url.pathname === "/parse_keyword") {
      const body = (await request.json()) as { keyword?: string };
      return json(parseKeyword(body.keyword ?? ""));
    }

    if (request.method === "POST" && url.pathname === "/validate_keyword") {
      const body = (await request.json()) as { keyword?: string };
      return json({ valid: isValidKeyword(body.keyword ?? "") });
    }

    const store = await loadStore(env);

    if (request.method === "GET" && url.pathname === "/getKeywords") {
      return json(store.listKeywords());
    }

    if (request.method === "POST" && url.pathname === "/addKeyword") {
      const body = (await request.json()) as { keyword?: string };
      const result = store.addKeyword(body.keyword ?? "");
      if ((result as { success: boolean }).success) {
        await persistStore(env, store);
        return json(result);
      }
      return json(result, { status: 400 });
    }

    if (request.method === "POST" && url.pathname === "/update_keyword_status") {
      const body = (await request.json()) as { keyword?: string; status?: string };
      try {
        const updated = store.updateKeywordStatus(body.keyword ?? "", body.status ?? "");
        if (updated) {
          await persistStore(env, store);
          return json({ success: true });
        }
        return json({ success: false, error: "Invalid keyword or status" }, { status: 400 });
      } catch (error) {
        return badRequest(error);
      }
    }

    if (request.method === "POST" && url.pathname === "/update_keyword_statuses") {
      const body = (await request.json()) as { keywords?: string[]; status?: string };
      try {
        const updated = store.updateKeywordStatuses(body.keywords ?? [], body.status ?? "");
        await persistStore(env, store);
        return json({ success: true, updated });
      } catch (error) {
        return badRequest(error);
      }
    }

    if (request.method === "POST" && url.pathname === "/deleteKeyword") {
      const body = (await request.json()) as { keyword?: string; tag?: string };
      const result = store.deleteKeyword(body.keyword ?? "", body.tag ?? "normal");
      if (result.success) {
        await persistStore(env, store);
        return json(result);
      }
      return json(result, { status: 400 });
    }

    if (request.method === "POST" && url.pathname === "/deleteKeywords") {
      const body = (await request.json()) as { keywords?: string[]; tag?: string };
      try {
        const deleted = store.deleteKeywords(body.keywords ?? [], body.tag ?? "normal");
        await persistStore(env, store);
        return json({ success: true, deleted });
      } catch (error) {
        return badRequest(error);
      }
    }

    if (request.method === "POST" && url.pathname === "/deleteTag") {
      const body = (await request.json()) as { tag?: string };
      try {
        const deleted = store.deleteTag(body.tag ?? "");
        await persistStore(env, store);
        return json({ success: deleted });
      } catch (error) {
        return badRequest(error);
      }
    }

    if (request.method === "POST" && url.pathname === "/import_keywords") {
      const body = (await request.json()) as { keywords?: string[] };
      const result = store.importKeywords(body.keywords ?? []);
      await persistStore(env, store);
      return json(result);
    }

    return new Response("Not found", { status: 404 });
  },
};

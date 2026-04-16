/* tslint:disable */
/* eslint-disable */

export class KeywordStore {
    free(): void;
    [Symbol.dispose](): void;
    addKeyword(keyword: string): any;
    deleteKeyword(keyword: string, tag: string): any;
    deleteKeywords(keywords: any, tag: string): any;
    deleteTag(tag: string): boolean;
    exportRecords(): any;
    static fromRecords(records: any): KeywordStore;
    importKeywords(keywords: any): any;
    listKeywords(): any;
    constructor();
    updateKeywordStatus(keyword: string, status: string): boolean;
    updateKeywordStatuses(keywords: any, status: string): any;
}

export function isValidKeyword(keyword: string): boolean;

export function parseKeyword(keyword: string): any;

export function parseKeywords(input: string): any;

export function start(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_keywordstore_free: (a: number, b: number) => void;
    readonly isValidKeyword: (a: number, b: number) => number;
    readonly keywordstore_addKeyword: (a: number, b: number, c: number) => [number, number, number];
    readonly keywordstore_deleteKeyword: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
    readonly keywordstore_deleteKeywords: (a: number, b: any, c: number, d: number) => [number, number, number];
    readonly keywordstore_deleteTag: (a: number, b: number, c: number) => [number, number, number];
    readonly keywordstore_exportRecords: (a: number) => [number, number, number];
    readonly keywordstore_fromRecords: (a: any) => [number, number, number];
    readonly keywordstore_importKeywords: (a: number, b: any) => [number, number, number];
    readonly keywordstore_new: () => number;
    readonly keywordstore_updateKeywordStatus: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
    readonly keywordstore_updateKeywordStatuses: (a: number, b: any, c: number, d: number) => [number, number, number];
    readonly parseKeyword: (a: number, b: number) => [number, number, number];
    readonly parseKeywords: (a: number, b: number) => [number, number, number];
    readonly start: () => void;
    readonly keywordstore_listKeywords: (a: number) => [number, number, number];
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;

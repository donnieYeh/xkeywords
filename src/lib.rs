use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

const ACTIVE: &str = "active";
const COLD: &str = "cold";
const MAX_KEYWORD_LEN: usize = 50;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct KeywordRecord {
    pub keyword: String,
    pub status: String,
    pub tags: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct AddKeywordResult {
    pub success: bool,
    pub error: Option<String>,
    pub record: Option<KeywordRecord>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct DeleteKeywordResult {
    pub success: bool,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ImportKeywordsResult {
    pub success: bool,
    pub added_keywords: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ParsedKeyword {
    pub keyword: String,
    pub tags: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
struct KeywordStoreState {
    keywords: Vec<KeywordRecord>,
}

#[wasm_bindgen]
pub struct KeywordStore {
    inner: KeywordStoreState,
}

#[wasm_bindgen]
impl KeywordStore {
    #[wasm_bindgen(constructor)]
    pub fn new() -> KeywordStore {
        KeywordStore {
            inner: KeywordStoreState::default(),
        }
    }

    #[wasm_bindgen(js_name = fromRecords)]
    pub fn from_records(records: JsValue) -> Result<KeywordStore, JsValue> {
        let keywords = parse_js::<Vec<KeywordRecord>>(records)?;
        Ok(KeywordStore {
            inner: KeywordStoreState { keywords },
        })
    }

    #[wasm_bindgen(js_name = listKeywords)]
    pub fn list_keywords(&self) -> Result<JsValue, JsValue> {
        to_js(&self.inner.keywords)
    }

    #[wasm_bindgen(js_name = exportRecords)]
    pub fn export_records(&self) -> Result<JsValue, JsValue> {
        to_js(&self.inner.keywords)
    }

    #[wasm_bindgen(js_name = addKeyword)]
    pub fn add_keyword(&mut self, keyword: String) -> Result<JsValue, JsValue> {
        let result = self.inner.add_keyword(&keyword);
        to_js(&result)
    }

    #[wasm_bindgen(js_name = updateKeywordStatus)]
    pub fn update_keyword_status(
        &mut self,
        keyword: String,
        status: String,
    ) -> Result<bool, JsValue> {
        self.inner.update_keyword_status(&keyword, &status)
    }

    #[wasm_bindgen(js_name = updateKeywordStatuses)]
    pub fn update_keyword_statuses(
        &mut self,
        keywords: JsValue,
        status: String,
    ) -> Result<JsValue, JsValue> {
        let keywords = parse_js::<Vec<String>>(keywords)?;
        let updated = self.inner.update_keyword_statuses(&keywords, &status)?;
        to_js(&updated)
    }

    #[wasm_bindgen(js_name = deleteKeyword)]
    pub fn delete_keyword(&mut self, keyword: String, tag: String) -> Result<JsValue, JsValue> {
        let result = self.inner.delete_keyword(&keyword, &tag);
        to_js(&result)
    }

    #[wasm_bindgen(js_name = deleteKeywords)]
    pub fn delete_keywords(&mut self, keywords: JsValue, tag: String) -> Result<JsValue, JsValue> {
        let keywords = parse_js::<Vec<String>>(keywords)?;
        let deleted = self.inner.delete_keywords(&keywords, &tag)?;
        to_js(&deleted)
    }

    #[wasm_bindgen(js_name = deleteTag)]
    pub fn delete_tag(&mut self, tag: String) -> Result<bool, JsValue> {
        self.inner.delete_tag(&tag)
    }

    #[wasm_bindgen(js_name = importKeywords)]
    pub fn import_keywords(&mut self, keywords: JsValue) -> Result<JsValue, JsValue> {
        let keywords = parse_js::<Vec<String>>(keywords)?;
        let result = self.inner.import_keywords(&keywords);
        to_js(&result)
    }
}

#[wasm_bindgen(js_name = isValidKeyword)]
pub fn is_valid_keyword(keyword: &str) -> bool {
    is_valid_keyword_impl(keyword)
}

#[wasm_bindgen(js_name = parseKeyword)]
pub fn parse_keyword(keyword: &str) -> Result<JsValue, JsValue> {
    let (plain_keyword, tags) = parse_keyword_impl(keyword);
    let parsed = ParsedKeyword {
        keyword: plain_keyword,
        tags,
    };
    to_js(&parsed)
}

#[wasm_bindgen(js_name = parseKeywords)]
pub fn parse_keywords(input: &str) -> Result<JsValue, JsValue> {
    let parsed = parse_keywords_impl(input);
    to_js(&parsed)
}

#[wasm_bindgen(start)]
pub fn start() {}

fn parse_js<T>(value: JsValue) -> Result<T, JsValue>
where
    T: for<'de> Deserialize<'de>,
{
    serde_wasm_bindgen::from_value(value).map_err(|err| JsValue::from_str(&err.to_string()))
}

fn to_js<T>(value: &T) -> Result<JsValue, JsValue>
where
    T: Serialize,
{
    serde_wasm_bindgen::to_value(value).map_err(|err| JsValue::from_str(&err.to_string()))
}

impl KeywordStoreState {
    fn add_keyword(&mut self, keyword: &str) -> AddKeywordResult {
        if !is_valid_keyword_impl(keyword) {
            return AddKeywordResult {
                success: false,
                error: Some("Invalid keyword".to_string()),
                record: None,
            };
        }

        let (plain_keyword, tags) = parse_keyword_impl(keyword);
        if plain_keyword.is_empty() {
            return AddKeywordResult {
                success: false,
                error: Some("Invalid keyword".to_string()),
                record: None,
            };
        }

        if self.find_keyword_index(&plain_keyword).is_some() {
            return AddKeywordResult {
                success: false,
                error: Some("Keyword already exists".to_string()),
                record: None,
            };
        }

        let record = KeywordRecord {
            keyword: plain_keyword,
            status: ACTIVE.to_string(),
            tags,
        };
        self.keywords.push(record.clone());
        AddKeywordResult {
            success: true,
            error: None,
            record: Some(record),
        }
    }

    fn update_keyword_status(&mut self, keyword: &str, status: &str) -> Result<bool, JsValue> {
        ensure_valid_status(status)?;
        if let Some(index) = self.find_keyword_index(keyword) {
            self.keywords[index].status = status.to_string();
            return Ok(true);
        }
        Ok(false)
    }

    fn update_keyword_statuses(
        &mut self,
        keywords: &[String],
        status: &str,
    ) -> Result<Vec<String>, JsValue> {
        ensure_valid_status(status)?;
        let mut updated = Vec::new();
        for keyword in keywords {
            if let Some(index) = self.find_keyword_index(keyword) {
                self.keywords[index].status = status.to_string();
                updated.push(keyword.clone());
            }
        }
        Ok(updated)
    }

    fn delete_keyword(&mut self, keyword: &str, tag: &str) -> DeleteKeywordResult {
        if !is_valid_keyword_impl(keyword) {
            return DeleteKeywordResult {
                success: false,
                error: Some("Invalid keyword".to_string()),
            };
        }

        match self.find_keyword_index(keyword) {
            Some(index) if tag != "normal" => {
                let tags = split_tags(&self.keywords[index].tags)
                    .into_iter()
                    .filter(|current| current != tag)
                    .collect::<Vec<_>>();
                self.keywords[index].tags = tags.join(",");
                DeleteKeywordResult {
                    success: true,
                    error: None,
                }
            }
            Some(index) => {
                self.keywords.remove(index);
                DeleteKeywordResult {
                    success: true,
                    error: None,
                }
            }
            None => DeleteKeywordResult {
                success: false,
                error: Some("Keyword not found".to_string()),
            },
        }
    }

    fn delete_keywords(&mut self, keywords: &[String], tag: &str) -> Result<Vec<String>, JsValue> {
        if tag != "normal" {
            let mut touched = Vec::new();
            for keyword in keywords {
                let result = self.delete_keyword(keyword, tag);
                if result.success {
                    touched.push(keyword.clone());
                }
            }
            return Ok(touched);
        }

        let mut deleted = Vec::new();
        self.keywords.retain(|record| {
            let should_delete = keywords.iter().any(|keyword| keyword == &record.keyword);
            if should_delete {
                deleted.push(record.keyword.clone());
            }
            !should_delete
        });
        Ok(deleted)
    }

    fn delete_tag(&mut self, tag: &str) -> Result<bool, JsValue> {
        if tag.trim().is_empty() {
            return Err(JsValue::from_str("Tag is required"));
        }
        for record in &mut self.keywords {
            let remaining = split_tags(&record.tags)
                .into_iter()
                .filter(|current| current != tag)
                .collect::<Vec<_>>();
            record.tags = remaining.join(",");
        }
        Ok(true)
    }

    fn import_keywords(&mut self, keywords: &[String]) -> ImportKeywordsResult {
        let mut added_keywords = Vec::new();
        for keyword in keywords {
            if self.find_keyword_index(keyword).is_some() {
                continue;
            }
            if !is_valid_keyword_impl(keyword) {
                continue;
            }
            self.keywords.push(KeywordRecord {
                keyword: keyword.clone(),
                status: ACTIVE.to_string(),
                tags: String::new(),
            });
            added_keywords.push(keyword.clone());
        }
        ImportKeywordsResult {
            success: true,
            added_keywords,
        }
    }

    fn find_keyword_index(&self, keyword: &str) -> Option<usize> {
        self.keywords.iter().position(|row| row.keyword == keyword)
    }
}

fn ensure_valid_status(status: &str) -> Result<(), JsValue> {
    match status {
        ACTIVE | COLD => Ok(()),
        _ => Err(JsValue::from_str("Invalid keyword status")),
    }
}

fn is_valid_keyword_impl(keyword: &str) -> bool {
    if keyword.is_empty() || keyword.chars().count() > MAX_KEYWORD_LEN {
        return false;
    }

    keyword.chars().all(is_allowed_keyword_char)
}

fn is_allowed_keyword_char(ch: char) -> bool {
    ch.is_ascii_alphanumeric()
        || matches!(ch, '_' | ':' | '-' | '@' | ' ' | '"' | ',' | '#' | '[' | ']')
}

fn parse_keyword_impl(keyword: &str) -> (String, String) {
    match keyword.find('[') {
        Some(index) if keyword.ends_with(']') && index < keyword.len() - 1 => (
            keyword[..index].to_string(),
            keyword[index + 1..keyword.len() - 1].to_string(),
        ),
        _ => (keyword.to_string(), String::new()),
    }
}

fn parse_keywords_impl(input: &str) -> Vec<String> {
    let mut parts = Vec::new();
    let mut current = String::new();
    let mut depth = 0usize;

    for ch in input.chars() {
        match ch {
            '(' => {
                depth += 1;
                current.push(ch);
            }
            ')' => {
                if depth > 0 {
                    depth -= 1;
                }
                current.push(ch);
            }
            c if c.is_whitespace() && depth == 0 => {
                if !current.is_empty() {
                    parts.push(std::mem::take(&mut current));
                }
            }
            _ => current.push(ch),
        }
    }

    if !current.is_empty() {
        parts.push(current);
    }

    let mut keywords = Vec::new();
    for part in parts {
        if part.starts_with('(') && part.ends_with(')') {
            keywords.extend(part[1..part.len() - 1].split(" OR ").map(str::to_string));
        } else if !part.is_empty() {
            keywords.push(format!("and {part}"));
        }
    }
    keywords
}

fn split_tags(tags: &str) -> Vec<String> {
    if tags.trim().is_empty() {
        return Vec::new();
    }
    tags.split(',')
        .filter(|tag| !tag.trim().is_empty())
        .map(str::to_string)
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn validates_keywords() {
        assert!(is_valid_keyword_impl("Nasdaq[work,news]"));
        assert!(is_valid_keyword_impl("hello world"));
        assert!(!is_valid_keyword_impl(""));
        assert!(!is_valid_keyword_impl("bad!keyword"));
    }

    #[test]
    fn parses_keyword_and_tags() {
        assert_eq!(
            parse_keyword_impl("Nasdaq[work,daily,news]"),
            ("Nasdaq".to_string(), "work,daily,news".to_string())
        );
        assert_eq!(
            parse_keyword_impl("Tesla"),
            ("Tesla".to_string(), String::new())
        );
    }

    #[test]
    fn parses_keyword_groups() {
        assert_eq!(
            parse_keywords_impl("(a OR b) c d"),
            vec!["a", "b", "and c", "and d"]
        );
    }

    #[test]
    fn store_supports_keyword_workflow() {
        let mut store = KeywordStoreState::default();

        let add_result = store.add_keyword("Nasdaq[work,news]");
        assert!(add_result.success);
        assert_eq!(store.keywords[0].tags, "work,news");

        let imported = store.import_keywords(&["btc".to_string(), "eth".to_string()]);
        assert_eq!(imported.added_keywords, vec!["btc", "eth"]);

        assert!(store.update_keyword_status("btc", COLD).unwrap());
        assert_eq!(
            store
                .keywords
                .iter()
                .find(|row| row.keyword == "btc")
                .unwrap()
                .status,
            COLD
        );

        assert!(store.delete_tag("work").unwrap());
        assert_eq!(store.keywords[0].tags, "news");

        let deleted = store.delete_keyword("Nasdaq", "normal");
        assert!(deleted.success);
    }
}

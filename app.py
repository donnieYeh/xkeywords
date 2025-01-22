from flask import Flask, request, jsonify, render_template, Blueprint
from werkzeug.middleware.proxy_fix import ProxyFix
import sqlite3
import os
import re

app = Flask(__name__)
DATABASE = "keywords.db"

# 添加 ProxyFix 中间件来处理代理头信息
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

# 创建蓝图
xkeywords = Blueprint(
    "xkeywords", __name__, static_folder="static", static_url_path="/static"
)


def init_db():
    if not os.path.exists(DATABASE):
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute(
            """CREATE TABLE keywords (
                    id INTEGER PRIMARY KEY,
                    keyword TEXT UNIQUE,
                    status TEXT DEFAULT 'active',
                    tags TEXT
            );"""
        )
        conn.commit()
        conn.close()


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def is_valid_keyword(keyword):
    # 允许字母、数字、下划线、:, @, ", #, []，但不允许空格，长度为1到50
    return re.match(r'^[\w:\-@ ",#\[\]]{1,50}$', keyword) is not None


@xkeywords.route("/")
def index():
    return render_template("index.html")


@xkeywords.route("/getKeywords", methods=["GET"])
def get_keywords():
    conn = get_db_connection()
    keywords = conn.execute(
        "SELECT keyword, status, tags FROM keywords"
    ).fetchall()  # 获取状态字段
    conn.close()

    # 返回包含关键词和状态的 JSON 数据
    return jsonify(
        [{"keyword": row["keyword"], "status": row["status"], "tags": row["tags"]} for row in keywords]
    )


@xkeywords.route("/update_keyword_status", methods=["POST"])
def update_keyword_status():
    data = request.get_json()
    keyword = data.get("keyword")
    status = data.get("status")  # "active" 或 "cold"

    if keyword and status in ["active", "cold"]:
        conn = get_db_connection()
        conn.execute(
            "UPDATE keywords SET status = ? WHERE keyword = ?", (status, keyword)
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 200
    return jsonify({"success": False, "error": "Invalid keyword or status"}), 400


@xkeywords.route("/addKeyword", methods=["POST"])
def add_keyword():
    data = request.get_json()
    keyword = data.get("keyword")
    if keyword and is_valid_keyword(keyword):
        plain_keyword, tags = parse_keyword(keyword)
        try:
            conn = get_db_connection()
            conn.execute("INSERT INTO keywords (keyword,tags) VALUES (?,?)", (plain_keyword,tags))
            conn.commit()
            conn.close()
            return jsonify({"success": True}), 200
        except sqlite3.IntegrityError:
            return jsonify({"success": False, "error": "Keyword already exists"}), 400
    return jsonify({"success": False, "error": "Invalid keyword"}), 400


# 解析带tags的关键词
def parse_keyword(keyword):
    # 正则表达式：匹配格式 "xxx[yyy]" 或者 "xxx"
    match = re.match(r"([^\[]+)(?:\[(.*)\])?", keyword)

    if match:
        keyword = match.group(1)  # 提取关键词
        tags = (
            match.group(2) if match.group(2) is not None else ""
        )  # 提取标签，若没有标签则为空字符串
        return keyword, tags
    else:
        return None, ""  # 如果没有匹配到，返回 None 和空字符串


@xkeywords.route("/deleteKeyword", methods=["POST"])
def delete_keyword():
    data = request.get_json()
    keyword = data.get("keyword")
    if keyword and is_valid_keyword(keyword):
        conn = get_db_connection()
        conn.execute("DELETE FROM keywords WHERE keyword = ?", (keyword,))
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 200
    return jsonify({"success": False, "error": "Invalid keyword"}), 400


# 解析关键词组合的函数
def parse_keywords(input_string):
    # 首先将括号内容整体识别，然后将其他部分按空格分割
    parts = re.findall(r"\(.*?\)|\S+", input_string)
    keywords = []

    for part in parts:
        if part.startswith("(") and part.endswith(")"):
            # 去掉括号，并按 OR 拆解括号内组合
            inner_keywords = part[1:-1].split(" OR ")
            keywords.extend(inner_keywords)  # 添加拆解后的关键词
        else:
            # 非 OR 集合关键词，添加 "and " 前缀
            keywords.append("and " + part)

    return keywords


# 接收关键词组合并解析
@xkeywords.route("/parse_keywords", methods=["POST"])
def parse_keywords_api():
    data = request.get_json()
    input_string = data.get("keywords", "")
    parsed_keywords = parse_keywords(input_string)
    return jsonify(parsed_keywords)


# 导入确认后的关键词到数据库
@xkeywords.route("/import_keywords", methods=["POST"])
def import_keywords():
    data = request.get_json()
    keywords = data.get("keywords", [])

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    added_keywords = []

    for keyword in keywords:
        try:
            cursor.execute("INSERT INTO keywords (keyword) VALUES (?)", (keyword,))
            added_keywords.append(keyword)
        except sqlite3.IntegrityError:
            # 忽略重复关键词
            continue

    conn.commit()
    conn.close()
    return jsonify({"success": True, "added_keywords": added_keywords}), 200


if __name__ == "__main__":
    init_db()
    # 注册蓝图，设置url_prefix
    app.register_blueprint(xkeywords, url_prefix="/xkeywords")
    app.run(debug=True)

from flask import Flask, request, jsonify, render_template
import sqlite3
import os
import re

app = Flask(__name__)
DATABASE = "keywords.db"


def init_db():
    if not os.path.exists(DATABASE):
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute(
            """CREATE TABLE keywords (id INTEGER PRIMARY KEY, keyword TEXT UNIQUE)"""
        )
        conn.commit()
        conn.close()


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def is_valid_keyword(keyword):
    # 允许字母、数字、下划线、:, @, ", #，但不允许空格，长度为1到50
    return re.match(r'^[\w:\-@ ",#]{1,50}$', keyword) is not None


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/getKeywords", methods=["GET"])
def get_keywords():
    conn = get_db_connection()
    keywords = conn.execute("SELECT keyword FROM keywords").fetchall()
    conn.close()
    return jsonify([row["keyword"] for row in keywords])


@app.route("/addKeyword", methods=["POST"])
def add_keyword():
    data = request.get_json()
    keyword = data.get("keyword")
    if keyword and is_valid_keyword(keyword):
        try:
            conn = get_db_connection()
            conn.execute("INSERT INTO keywords (keyword) VALUES (?)", (keyword,))
            conn.commit()
            conn.close()
            return jsonify({"success": True}), 200
        except sqlite3.IntegrityError:
            return jsonify({"success": False, "error": "Keyword already exists"}), 400
    return jsonify({"success": False, "error": "Invalid keyword"}), 400


@app.route("/deleteKeyword", methods=["POST"])
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


if __name__ == "__main__":
    init_db()
    app.run(debug=True)

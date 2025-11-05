from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
from datetime import date

app = Flask(__name__)
CORS(app)

DB = "jobs.db"

@app.route("/api/jobs")
def jobs():
    today = date.today().isoformat()
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, title, short_desc, long_desc, close_date, contact_email
        FROM jobs
        WHERE close_date > ?
        ORDER BY close_date ASC
        """,
        (today,),
    )
    rows = cur.fetchall()
    conn.close()
    result = [
        {
            "id": r[0],
            "title": r[1],
            "short_desc": r[2],
            "long_desc": r[3],
            "close_date": r[4],
            "contact_email": r[5],
        }
        for r in rows
    ]
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)

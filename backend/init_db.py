# backend/init_db.py
import sqlite3

DB = "jobs.db"

def create():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            short_desc TEXT,
            long_desc TEXT,
            close_date TEXT NOT NULL,
            contact_email TEXT NOT NULL
        )
        """
    )
    # demo rows
    cur.execute("SELECT COUNT(*) FROM jobs")
    if cur.fetchone()[0] == 0:
        demo = [
            ("Python Data Engineer",
             "Work on ETL pipelines.",
             "Full‑time role building data pipelines, writing Airflow DAGs, and maintaining our data lake.",
             "2099-12-31",
             "hr@example.com"),
            ("Frontend Developer",
             "Build responsive UI.",
             "Create modern, mobile‑first interfaces using React, Tailwind CSS, and component‑driven design.",
             "2025-12-01",
             "jobs@example.com"),
        ]
        cur.executemany(
            "INSERT INTO jobs (title, short_desc, long_desc, close_date, contact_email) VALUES (?,?,?,?,?)",
            demo,
        )
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create()

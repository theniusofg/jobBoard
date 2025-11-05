# jobBoard
job board prototype

job‑board‑prototype/
│
├─ backend/                 # Python API
│   ├─ app.py
│   ├─ jobs.db              # SQLite file (created automatically)
│   └─ requirements.txt
│
├─ frontend/                # Static files served by GitHub Pages
│   ├─ index.html
│   ├─ style.css
│   └─ script.js
│
└─ README.md

####
Run the backend

```
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
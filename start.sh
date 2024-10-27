# !/bin/bash
source .venv/bin/activate
pip install -r requirements.txt
nohup python app.py > info.log 2>&1 &
echo app startup! please check info.log
deactivate
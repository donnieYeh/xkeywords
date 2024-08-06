# !/bin/bash
source ./venv/bin/activate
nohup python app.py > info.log 2>&1 &
echo app startup! please check info.log
deactivate
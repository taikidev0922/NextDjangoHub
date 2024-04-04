# NextDjangoHub

requirements.txt の更新
pip freeze > requirements.txt

requirements.txt の反映
pip install -r requirements.txt

yml 生成
python manage.py generateschema --file schema.yml(こっちだとカスタムアクションの型がおかしい)
python manage.py spectacular --file schema.yml

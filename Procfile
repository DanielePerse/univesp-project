release: python init_render.py && python -m flask db upgrade
web: gunicorn run:app --log-level info
from datetime import timedelta
from flask_cors import CORS
from flask import Blueprint, Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
import pymysql


def get_database():
    load_dotenv()
    db = pymysql.connect(
        host = os.getenv('MYSQL_HOST'),
        port = int(os.getenv('MYSQL_PORT')),
        user = os.getenv('MYSQL_USER'),
        passwd = os.getenv('MYSQL_PASSWORD'),
        db = os.getenv('MYSQL_DATABASE'),
        charset=os.getenv('MYSQL_CHARSET')
    )
    return db

def create_app():
    app = Flask(__name__)
    app.secret_key = 'super secret key'
    app.config["JWT_SECRET_KEY"] = "super secret"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

    api = Api(app)
    CORS(app)
    jwt = JWTManager(app)

    from user_api import user
    from education import education
    from award import award
    from project import project
    from certificate import certificate
    from search import search

    app.register_blueprint(user)
    app.register_blueprint(education)
    app.register_blueprint(award)
    app.register_blueprint(project)
    app.register_blueprint(certificate)
    app.register_blueprint(search)

    return app


# if __name__ == "__main__":
#     app.run("0.0.0.0", port=5000)

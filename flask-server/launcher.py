
from flask_cors import CORS
from flask import Blueprint, Flask
from flask_restful import Api
from api.user_api import user
from api.portfolio_api import portfolio
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

app = Flask(__name__)
app.secret_key = 'super secret key'
app.config["JWT_SECRET_KEY"] = "super secret"

api = Api(app)
CORS(app)
jwt = JWTManager(app)

app.register_blueprint(user)
app.register_blueprint(portfolio)

if __name__ == "__main__":
    app.run("0.0.0.0", port=5000)

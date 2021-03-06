import pymysql
from flask import Blueprint, Flask, jsonify, request, session
from flask_restful import reqparse, abort, Api, Resource
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, JWTManager
from app import get_database

user = Blueprint('user', __name__)
api = Api(user)
db = get_database()
cursor = db.cursor()

parser = reqparse.RequestParser()
parser.add_argument('id')
parser.add_argument('fullname')
parser.add_argument('email')
parser.add_argument('password')
parser.add_argument('check')

@user.route('/auth/signup', methods=['GET', 'POST'])
def signup():
    args = parser.parse_args()
    if request.method == 'POST':
        if not args['fullname']:
            return jsonify(status = 'failure', result = 'fullname is empty')
        elif not args['email']:
            return jsonify(status = 'failure', result = 'email is empty')
        elif not args['password'] or not args['check']:
            return jsonify(status = 'failure', result = 'password/check is empty')
        elif args['password'] != args['check']:
            return jsonify(status = 'failure', result = 'password/check is not equal')

        sql = "SELECT `email` FROM `user` WHERE `email` = %s"
        cursor.execute(sql, (args['email'],))
        result = cursor.fetchone()
        if result:
            return jsonify(status = "failure", result = "registered email")
        else:
            pw_hash = generate_password_hash(args['password'])
            sql = "INSERT INTO `user` (`fullname`, `email`, `password`) VALUES (%s, %s, %s)"
            cursor.execute(sql, (args['fullname'], args['email'], pw_hash))
            db.commit()
            return jsonify(status = "success", result = {"fullname": args["fullname"], "email": args["email"], "password": pw_hash})

    else:
        sql = "SELECT `id`, `fullname`, `email`, `password` FROM `user`"
        cursor.execute(sql)
        result = cursor.fetchall()
        return jsonify(status = "success", result = result)
        

@user.route('/auth/login', methods=['GET', 'POST'])
def login():
    args = parser.parse_args()
    if request.method == 'POST':
        if not args['email']:
            return jsonify(status = 'failure', result = 'email is empty')
        elif not args['password']:
            return jsonify(status = 'failure', result = 'password is empty')

        sql = "SELECT `password`, `fullname` FROM `user` WHERE `email` = %s"
        cursor.execute(sql, (args['email'],))
        result = cursor.fetchone()
        if result:
            if check_password_hash(result[0], args['password']):
                access_token = create_access_token(identity = args['email'])
                return jsonify(
                    status = 'success', 
                    access_token = access_token,
                    current_user = args['email'],
                    user_name = result[1],
                    result = 'logged in'
                    )
            else:
                return jsonify(
                    status = 'failure', 
                    result = 'wrong password'
                    )
        else:
            return jsonify(
                status = "failure", 
                result = 'not registered email'
                )
    else:
        sql = "SELECT `fullname` FROM `user` WHERE `email` = %s"
        cursor.execute(sql, (args['email'],))
        result = cursor.fetchone()

        return jsonify(
            user_name= result
        )

@user.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == "__main__":
    app.run("0.0.0.0", port=5000)
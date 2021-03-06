import os
import pymysql
from flask import Blueprint, Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from app import get_database

search = Blueprint('search', __name__)
api = Api(search)
db = get_database()
cursor = db.cursor()

search_parser = reqparse.RequestParser()
search_parser.add_argument('user_name')

class Search(Resource):
     def get(self):
        args = search_parser.parse_args()
        user_name = '%' + args['user_name'] + '%'
        sql = "SELECT * FROM `user` WHERE fullname LIKE %s"
        cursor.execute(sql, (user_name ,))
        searched_users = cursor.fetchall()
        
        return jsonify(status = "success", result = searched_users)
    
api.add_resource(Search, '/search')
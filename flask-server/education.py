import os
import pymysql
from flask import Blueprint, Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from app import get_database

education = Blueprint('education', __name__)
api = Api(education)
db = get_database()
cursor = db.cursor()

parser_education = reqparse.RequestParser()

parser_education.add_argument('university')
parser_education.add_argument('major')
parser_education.add_argument('degree')
parser_education.add_argument('user_email')
parser_education.add_argument('id')

class Education(Resource):
    @jwt_required()
    def post(self):
        args = parser_education.parse_args()
        sql = "INSERT INTO `education` (`university`, `major`, `degree`, `user_email`) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (args['university'], args['major'], args['degree'], args['user_email']))
        db.commit()

        return jsonify(
            status = 'success', 
            result = {
                'university': args['university'], 
                'major': args['major'], 
                'degree': args['degree'],
                'user_email': args['user_email']
            }
        )
        
    @jwt_required()
    def get(self):
        args = parser_education.parse_args()
        sql = "SELECT id, university, major, degree FROM `education` WHERE `user_email` = %s"
        cursor.execute(sql, (args['user_email'],))
        result = cursor.fetchall()

        return jsonify(
            status = 'success',
            result = result
        )

    @jwt_required()
    def put(self):
        args = parser_education.parse_args()
        sql = "UPDATE `education` SET university = %s, major = %s, degree = %s WHERE `id` = %s"
        cursor.execute(sql, (args['university'], args['major'], args['degree'], args['id']))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'id': args['id'],
                'university': args['university'],
                'major': args['major'],
                'degree': args['degree']
            }
        )

    @jwt_required()
    def delete(self):
        args = parser_education.parse_args()
        sql = "DELETE FROM `education` WHERE `id` = %s"
        cursor.execute(sql, (args['id'],))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'id': args['id']
            }
        )

        
api.add_resource(Education, '/portfolio/education')
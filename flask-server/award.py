import os
import pymysql
from flask import Blueprint, Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from app import get_database

award = Blueprint('award', __name__)
api = Api(award)
db = get_database()
cursor = db.cursor()


parser_award = reqparse.RequestParser()
parser_award.add_argument('award')
parser_award.add_argument('details')
parser_award.add_argument('user_email')
parser_award.add_argument('id')

class Award(Resource):
    @jwt_required()
    def post(self):
        args = parser_award.parse_args()
        if not args['award']:
            return jsonify(status = 'failure', result = 'award is empty')
        elif not args['details']:
            return jsonify(status = 'failure', result = 'details is empty')
        sql = "INSERT INTO `award` (`award_name`, `award_details`, `user_email`) VALUES (%s, %s, %s)"
        cursor.execute(sql, (args['award'], args['details'], args['user_email']))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'award': args['award'],
                'details': args['details'],
                'username': args['user_email']
            }
        )

    @jwt_required()
    def get(self):
        args = parser_award.parse_args()
        sql = "SELECT id, award_name, award_details FROM `award` WHERE `user_email` = %s"
        cursor.execute(sql, (args['user_email'],))
        result = cursor.fetchall()

        return jsonify(
            status = 'success',
            result = result
        )
    
    @jwt_required()
    def put(self):
        args = parser_award.parse_args()
        if not args['award']:
            return jsonify(status = 'failure', result = 'award is empty')
        elif not args['details']:
            return jsonify(status = 'failure', result = 'details is empty')
        sql = "UPDATE `award` SET award_name = %s, award_details = %s WHERE `id` = %s"
        cursor.execute(sql, (args['award'], args['details'], args['id']))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'id': args['id'],
                'award': args['award'],
                'details': args['details']
            }
        )
    
    @jwt_required()
    def delete(self):
        args = parser_award.parse_args()
        sql = "DELETE FROM `award` WHERE `id` = %s"
        cursor.execute(sql, (args['id'],))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'id': args['id']
            }
        )

api.add_resource(Award, '/portfolio/award')
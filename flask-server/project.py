import os
import pymysql
from flask import Blueprint, Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from app import get_database

project = Blueprint('project', __name__)
api = Api(project)
db = get_database()
cursor = db.cursor()



parser_project = reqparse.RequestParser()
parser_project.add_argument('project')
parser_project.add_argument('details')
parser_project.add_argument('startDate')
parser_project.add_argument('endDate')
parser_project.add_argument('user_email')
parser_project.add_argument('id')

class Project(Resource):
    @jwt_required()
    def post(self):
        args = parser_project.parse_args()
        if not args['project']:
            return jsonify(status = 'failure', result = 'project is empty')
        elif not args['details']:
            return jsonify(status = 'failure', result = 'details is empty')
        elif not args['startDate']:
            return jsonify(status = 'failure', result = 'startDate is empty')
        elif not args['endDate']:
            return jsonify(status = 'failure', result = 'endDate is empty')
        sql = "INSERT INTO `project` (`project_name`, `project_details`, `start_date`, `end_date`, `user_email`) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (args['project'], args['details'], args['startDate'], args['endDate'], args['user_email']))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'project': args['project'],
                'details': args['details'],
                'startDate': args['startDate'],
                'endDate': args['endDate'],
                'username': args['user_email']
            }
        )

    @jwt_required()
    def get(self):
        args = parser_project.parse_args()
        sql = "SELECT id, project_name, project_details, start_date, end_date FROM `project` WHERE `user_email` = %s"
        cursor.execute(sql, args['user_email'],)
        result = cursor.fetchall()

        return jsonify(
            status = 'success',
            result = result
        )
    
    @jwt_required()
    def put(self):
        args = parser_project.parse_args()
        if not args['project']:
            return jsonify(status = 'failure', result = 'project is empty')
        elif not args['details']:
            return jsonify(status = 'failure', result = 'details is empty')
        elif not args['startDate']:
            return jsonify(status = 'failure', result = 'startDate is empty')
        elif not args['endDate']:
            return jsonify(status = 'failure', result = 'endDate is empty')
        sql = "UPDATE `project` SET project_name = %s, project_details = %s, start_date = %s, end_date = %s WHERE `id` = %s"
        cursor.execute(sql, (args['project'], args['details'], args['startDate'], args['endDate'], args['id']))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'project': args['project'],
                'details': args['details'],
                'startDate': args['startDate'],
                'endDate': args['endDate'],
                'username': args['user_email']
            }
        )

    @jwt_required()
    def delete(self):
        args = parser_project.parse_args()
        sql = "DELETE FROM `project` WHERE `id` = %s"
        cursor.execute(sql, (args['id'],))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'id': args['id']
            }
        )

api.add_resource(Project, '/portfolio/project')
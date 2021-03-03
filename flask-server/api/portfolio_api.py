import os
import pymysql
from flask import Blueprint, Flask, jsonify, request, session
from flask_restful import reqparse, abort, Api, Resource
from dotenv import load_dotenv
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

portfolio = Blueprint('portfolio', __name__)
api = Api(portfolio)
load_dotenv()

db = pymysql.connect(
        host = os.getenv('MYSQL_HOST'),
        port = int(os.getenv('MYSQL_PORT')),
        user = os.getenv('MYSQL_USER'),
        passwd = os.getenv('MYSQL_PASSWORD'),
        db = os.getenv('MYSQL_DATABASE'),
        charset=os.getenv('MYSQL_CHARSET')
    )
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

    def get(self):
        args = parser_education.parse_args()
        sql = "SELECT id, university, major, degree FROM `education` WHERE `user_email` = %s"
        cursor.execute(sql, (args['user_email'],))
        result = cursor.fetchall()

        return jsonify(
            status = 'success',
            result = result
        )

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
parser_award = reqparse.RequestParser()
parser_award.add_argument('award')
parser_award.add_argument('details')
parser_award.add_argument('user_email')

class Award(Resource):
    def post(self):
        args = parser.parse_args()
        sql = "INSERT INTO `award` (`award_name`, `award_details`, 'user_email') VALUES (%s, %s, %s)"
        cursor.execute(sql, (args['award'], args['details'], session['user_name']))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'award': args['award'],
                'details': args['details'],
                'username': session['user_name']
            }
        )

    def get(self):
        args = parser.parse_args()
        sql = "SELECT id, award_name, award_details FROM `award` WHERE `user_name` = %s"
        cursor.execute(sql, (session['user_name'],))
        result = cursor.fetchall()

        return jsonify(
            status = 'success',
            result = result
        )
    
    def put(self):
        args = parser.parse_args()
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
    
    def delete(self):
        args = parser.parse_args()
        sql = "DELETE FROM `award` WHERE `id` = %s"
        cursor.execute(sql, (args['id'],))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'id': args['id']
            }
        )

parser_project = reqparse.RequestParser()
parser_project.add_argument('project')
parser_project.add_argument('startDate')
parser_project.add_argument('endDate')
parser_project.add_argument('user_email')

class Project(Resource):
    def post(self):
        args = parser.parse_args()
        sql = "INSERT INTO `project` (`project_name`, `project_details`, `start_date`, `end_date`, `user_email`) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (args['project'], args['details'], args['startDate'], args['endDate'], session['user_name']))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'project': args['project'],
                'details': args['details'],
                'startDate': args['startDate'],
                'endDate': args['endDate'],
                'username': session['user_name']
            }
        )

    def get(self):
        args = parser.parse_args()
        sql = "SELECT id, project_name, project_details, start_date, end_date FROM `project` WHERE `user_name` = %s"
        cursor.execute(sql, session['user_name'],)
        result = cursor.fetchall()

        return jsonify(
            status = 'success',
            result = result
        )
    
    def put(self):
        args = parser.parse_args()
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
                'username': session['user_name']
            }
        )

    def delete(self):
        args = parser.parse_args()
        sql = "DELETE FROM `project` WHERE `id` = %s"
        cursor.execute(sql, (args['id'],))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'id': args['id']
            }
        )

parser_certificate = reqparse.RequestParser()
parser_certificate.add_argument('certificate')
parser_certificate.add_argument('authority')
parser_certificate.add_argument('acquisition')
parser_certificate.add_argument('user_email')

class Certificate(Resource):
    def post(self):
        args = parser.parse_args()
        sql = "INSERT INTO `certificate` (`certificate_name`, `authority`, `acquisition_date`, `user_name`) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (args['certificate'], args['authority'], args['acquisition']))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'certificate': args['certificate'],
                'authority': args['authority'],
                'acquisition': args['acquisition']
            }
        )

    def get(self):
        args = parser.parse_args()
        sql = "SELECT id, certificate_name, authority, acquisition_date FROM `certificate` WHERE `user_name` = %s"
        cursor.execute(sql, (session['user_name'],))
        result = cursor.fetchall()

        return jsonify(
            status = 'success',
            result = result
        )

    def put(self):
        args = parser.parse_args()
        sql = "UPDATE `certificate` SET certificate_name = %s, authority = %s, acquisition_date = %s WHERE `id` = %s"
        cursor.execute(sql, (args['certificate'], args['authority'], args['acquisition'], args['id']))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'id': args['id'],
                'certificate': args['certificate'],
                'authority': args['authority'],
                'acquisition': args['acquisition']
            }
        )
        
    
    def delete(self):
        args = parser.parse_args()
        sql = "DELETE FROM `certificate` WHERE `id` = %s"
        cursor.execute(sql, (args['id'],))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'id': args['id']
            }
        )

api.add_resource(Education, '/portfolio/education')
api.add_resource(Award, '/portfolio/award')
api.add_resource(Project, '/portfolio/project')
api.add_resource(Certificate, '/portfolio/certificate')
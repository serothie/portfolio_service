import os
import pymysql
from flask import Blueprint, Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from app import get_database

certificate = Blueprint('certificate', __name__)
api = Api(certificate)
db = get_database()
cursor = db.cursor()


parser_certificate = reqparse.RequestParser()
parser_certificate.add_argument('certificate')
parser_certificate.add_argument('authority')
parser_certificate.add_argument('acquisition')
parser_certificate.add_argument('user_email')
parser_certificate.add_argument('id')

class Certificate(Resource):
    @jwt_required()
    def post(self):
        args = parser_certificate.parse_args()
        if not args['certificate']:
            return jsonify(status = 'failure', result = 'certificate is empty')
        elif not args['authority']:
            return jsonify(status = 'failure', result = 'authority is empty')           
        elif not args['acquisition']:
            return jsonify(status = 'failure', result = 'acquisition is empty')
        sql = "INSERT INTO `certificate` (`certificate_name`, `authority`, `acquisition_date`, `user_email`) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (args['certificate'], args['authority'], args['acquisition'], args['user_email']))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'certificate': args['certificate'],
                'authority': args['authority'],
                'acquisition': args['acquisition']
            }
        )

    @jwt_required()
    def get(self):
        args = parser_certificate.parse_args()
        sql = "SELECT id, certificate_name, authority, acquisition_date FROM `certificate` WHERE `user_email` = %s"
        cursor.execute(sql, (args['user_email'],))
        result = cursor.fetchall()

        return jsonify(
            status = 'success',
            result = result
        )

    @jwt_required()
    def put(self):
        args = parser_certificate.parse_args()
        if not args['certificate']:
            return jsonify(status = 'failure', result = 'certificate is empty')
        elif not args['authority']:
            return jsonify(status = 'failure', result = 'authority is empty')           
        elif not args['acquisition']:
            return jsonify(status = 'failure', result = 'acquisition is empty')
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
        
    @jwt_required()
    def delete(self):
        args = parser_certificate.parse_args()
        sql = "DELETE FROM `certificate` WHERE `id` = %s"
        cursor.execute(sql, (args['id'],))
        db.commit()

        return jsonify(
            status = 'success',
            result = {
                'id': args['id']
            }
        )

api.add_resource(Certificate, '/portfolio/certificate')
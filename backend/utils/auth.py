import jwt
import datetime
from flask import request, jsonify, current_app
from functools import wraps
from models.user import User
from models.revoked_token import RevokedToken

def generate_token(user_id):
    """
    Generates a secure JSON Web Token for the user session.
    """
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES'],
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
    except Exception as e:
        return None

def decode_token(token):
    """
    Decodes a JWT token. Returns user_id if valid, or throws an error.
    """
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload['sub']
    except jwt.ExpiredSignatureError:
        raise ValueError('Session token has expired. Please log in again.')
    except jwt.InvalidTokenError:
        raise ValueError('Invalid session token. Access denied.')

def token_required(f):
    """
    Flask decorator to protect REST API endpoints.
    Accepts:
    1. Header: 'Authorization: Bearer <JWT_token>'
    2. Cookie: 'fs_token=<JWT_token>'
    Validates token signature, expiration, and ensures token is not revoked.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # 1. Check Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                
        # 2. Fallback to HttpOnly cookie
        if not token:
            token = request.cookies.get('fs_token')
                
        if not token:
            return jsonify({'message': 'Authorization credentials are required.'}), 401
            
        # 3. Check server-side revocation list
        if RevokedToken.is_revoked(token):
            return jsonify({'message': 'Session token has been invalidated. Please log in again.'}), 401
            
        try:
            user_id = decode_token(token)
            current_user = User.query.get(user_id)
            if not current_user:
                return jsonify({'message': 'Logged in account was not found.'}), 401
        except ValueError as err:
            return jsonify({'message': str(err)}), 401
        except Exception as e:
            return jsonify({'message': 'Failed to process authentication.'}), 401
            
        return f(current_user, *args, **kwargs)
        
    return decorated

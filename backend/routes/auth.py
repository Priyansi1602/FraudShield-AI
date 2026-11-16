from flask import Blueprint, request, jsonify
from database import db
from models.user import User
from models.revoked_token import RevokedToken
from utils.auth import generate_token, token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    Handles user signup and database registration.
    """
    data = request.get_json() or {}
    fullName = data.get('fullName')
    email = data.get('email')
    password = data.get('password')

    if not fullName or not email or not password:
        return jsonify({'message': 'Missing required signup fields: fullName, email, password.'}), 400

    # Clean inputs
    fullName = fullName.strip()
    email = email.strip().lower()

    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'An account with this email address already exists.'}), 409

    try:
        new_user = User(full_name=fullName, email=email)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        # Auto-login upon registration by issuing a token
        token = generate_token(new_user.id)
        
        response = jsonify({
            'message': 'Account created successfully.',
            'token': token,
            'user': new_user.to_dict()
        })
        # Set secure HttpOnly, SameSite cookie
        response.set_cookie(
            'fs_token',
            token,
            max_age=24 * 3600,
            httponly=True,
            samesite='Lax',
            secure=request.is_secure
        )
        return response, 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error during account registration: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Handles user authentication and JWT token generation.
    """
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email address and password are required.'}), 400

    email = email.strip().lower()

    try:
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'message': 'Invalid email address or password combination.'}), 401
            
        token = generate_token(user.id)
        
        response = jsonify({
            'message': 'Log in successful.',
            'token': token,
            'user': user.to_dict()
        })
        # Set secure HttpOnly, SameSite cookie
        response.set_cookie(
            'fs_token',
            token,
            max_age=24 * 3600,
            httponly=True,
            samesite='Lax',
            secure=request.is_secure
        )
        return response, 200
        
    except Exception as e:
        return jsonify({'message': f'Server error during user login: {str(e)}'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Terminates session server-side, revokes JWT token, and removes cookies.
    """
    token = None
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
    if not token:
        token = request.cookies.get('fs_token')
        
    if token:
        try:
            if not RevokedToken.is_revoked(token):
                revoked = RevokedToken(token=token)
                db.session.add(revoked)
                db.session.commit()
        except Exception as e:
            db.session.rollback()

    response = jsonify({'message': 'Logged out successfully.'})
    response.delete_cookie('fs_token', path='/')
    return response, 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """
    Retrieves current user details if session token is verified.
    """
    return jsonify({
        'user': current_user.to_dict()
    }), 200

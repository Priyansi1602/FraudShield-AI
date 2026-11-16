from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import db, init_db
from routes.auth import auth_bp
from routes.prediction import predict_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configure CORS to accept requests from our React frontend dev/prod origins with credentials
    CORS(app, resources={r"/api/*": {
        "origins": [
            "http://localhost:5173", 
            "http://127.0.0.1:5173", 
            "http://localhost:3000", 
            "http://127.0.0.1:3000",
            "http://localhost:5000",
            "http://127.0.0.1:5000"
        ],
        "supports_credentials": True,
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }})
    
    # Bind and initialize MySQL database context
    init_db(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(predict_bp, url_prefix='/api')
    
    @app.route('/', methods=['GET'])
    def index():
        return jsonify({
            'status': 'active',
            'message': 'Welcome to FraudShield AI Core REST API. Go to /api/health for system telemetry.',
            'version': '1.0.0'
        }), 200

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'FraudShield AI Core REST API',
            'version': '1.0.0'
        }), 200

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'message': 'Requested API endpoint was not found.'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'message': 'An unexpected server error occurred.'}), 500
        
    return app

if __name__ == '__main__':
    app = create_app()
    port = app.config.get('PORT', 5000)
    debug = app.config.get('DEBUG', True)
    app.run(host='0.0.0.0', port=port, debug=debug)

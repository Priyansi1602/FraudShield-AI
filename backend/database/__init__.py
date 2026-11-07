from flask_sqlalchemy import SQLAlchemy

# Instantiate the SQLAlchemy ORM engine globally
db = SQLAlchemy()

def init_db(app):
    """
    Binds the SQLAlchemy instance to the Flask application context.
    """
    db.init_app(app)
    
    # Import models to register them with SQLAlchemy before db.create_all()
    from models.user import User
    from models.prediction_history import PredictionHistory
    
    with app.app_context():
        try:
            db.create_all()
            print("Database tables initialized successfully.")
            
            # Auto-seed the demo analyst account if the database is empty
            if User.query.filter_by(email='admin@fraudshield.ai').first() is None:
                admin_user = User(
                    full_name='System Admin',
                    email='admin@fraudshield.ai',
                    role='Fraud Analyst'
                )
                admin_user.set_password('admin123')
                db.session.add(admin_user)
                db.session.commit()
                print("Demo analyst user (admin@fraudshield.ai) seeded successfully.")
        except Exception as e:
            db.session.rollback()
            print(f"Error during database initialization: {e}")

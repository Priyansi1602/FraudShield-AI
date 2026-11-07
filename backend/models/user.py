import datetime
import bcrypt
from database import db

class User(db.Model):
    """
    SQLAlchemy User Model mapping users database table.
    Handles bcrypt password hashing and token metadata.
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), default='Fraud Analyst')
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def set_password(self, password):
        """
        Hashes password using bcrypt.
        """
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        """
        Verifies hashed password using bcrypt.
        """
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        """
        Serializes user details for API responses. Excludes sensitive hashes.
        """
        return {
            'id': self.id,
            'fullName': self.full_name,
            'email': self.email,
            'role': self.role,
            'createdAt': self.created_at.isoformat()
        }

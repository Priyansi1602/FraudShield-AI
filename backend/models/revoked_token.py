import datetime
from database import db

class RevokedToken(db.Model):
    """
    SQLAlchemy Model storing invalidated / logged out JWT tokens.
    Guarantees server-side revocation of active sessions upon logout.
    """
    __tablename__ = 'revoked_tokens'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False, index=True)
    revoked_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    @classmethod
    def is_revoked(cls, token_str):
        """
        Checks if a given JWT token string has been marked revoked in the database.
        """
        if not token_str:
            return False
        try:
            return cls.query.filter_by(token=token_str).first() is not None
        except Exception:
            return False

    def to_dict(self):
        return {
            'id': self.id,
            'token': self.token[:15] + '...',
            'revokedAt': self.revoked_at.isoformat()
        }

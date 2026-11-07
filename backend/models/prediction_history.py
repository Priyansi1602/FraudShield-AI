import datetime
from database import db

class PredictionHistory(db.Model):
    """
    SQLAlchemy Model representing the transaction predictions log table.
    Tracks all transaction audits performed by analysts.
    """
    __tablename__ = 'prediction_history'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    analyst_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    txn_type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    old_balance_org = db.Column(db.Float, nullable=False)
    new_balance_org = db.Column(db.Float, nullable=False)
    old_balance_dest = db.Column(db.Float, nullable=False)
    new_balance_dest = db.Column(db.Float, nullable=False)
    is_fraud = db.Column(db.Boolean, nullable=False)
    probability = db.Column(db.Float, nullable=False)
    risk_percentage = db.Column(db.Float, nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    prediction_time_ms = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Relationship to user
    analyst = db.relationship('User', backref=db.backref('predictions', lazy=True))

    def to_dict(self):
        """
        Serializes model metrics to JSON format.
        """
        return {
            'id': self.id,
            'analystId': self.analyst_id,
            'type': self.txn_type,
            'amount': self.amount,
            'oldbalanceOrg': self.old_balance_org,
            'newbalanceOrig': self.new_balance_org,
            'oldbalanceDest': self.old_balance_dest,
            'newbalanceDest': self.new_balance_dest,
            'is_fraud': self.is_fraud,
            'probability': self.probability,
            'risk_percentage': self.risk_percentage,
            'confidence_score': self.confidence_score,
            'prediction_time_ms': self.prediction_time_ms,
            'createdAt': self.created_at.isoformat()
        }

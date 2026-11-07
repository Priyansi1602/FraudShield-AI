from flask import Blueprint, request, jsonify
from utils.auth import token_required
from services.model_service import model_service
from database import db
from models.prediction_history import PredictionHistory

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST'])
@token_required
def predict_fraud(current_user):
    """
    POST API to evaluate credit transaction parameters for fraud risks.
    Guarded by JWT authentication.
    """
    data = request.get_json() or {}
    
    # Required parameters check
    required_fields = ['type', 'amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest']
    missing_fields = [f for f in required_fields if f not in data]
    
    if missing_fields:
        return jsonify({
            'message': f"Missing transaction parameters for model features: {', '.join(missing_fields)}"
        }), 400

    try:
        # Run prediction through machine learning service
        result = model_service.predict_transaction(data)
        
        # Save to database prediction history
        history_entry = PredictionHistory(
            analyst_id=current_user.id,
            txn_type=str(data.get('type', 'PAYMENT')).upper(),
            amount=float(data.get('amount', 0)),
            old_balance_org=float(data.get('oldbalanceOrg', 0)),
            new_balance_org=float(data.get('newbalanceOrig', 0)),
            old_balance_dest=float(data.get('oldbalanceDest', 0)),
            new_balance_dest=float(data.get('newbalanceDest', 0)),
            is_fraud=result['is_fraud'],
            probability=result['probability'],
            risk_percentage=result['risk_percentage'],
            confidence_score=result['confidence_score'],
            prediction_time_ms=result['prediction_time_ms']
        )
        db.session.add(history_entry)
        db.session.commit()
        
        # Include analyst ID in audit logs output
        result['analyst_id'] = current_user.id
        result['id'] = history_entry.id
        
        return jsonify(result), 200
        
    except ValueError as val_err:
        db.session.rollback()
        return jsonify({'message': str(val_err)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f"Failed to score transaction metrics: {str(e)}"}), 500

@predict_bp.route('/predictions', methods=['GET'])
@token_required
def get_predictions(current_user):
    """
    GET API to retrieve chronological audit logs of all transaction predictions.
    """
    try:
        logs = PredictionHistory.query.order_by(PredictionHistory.id.desc()).all()
        return jsonify([log.to_dict() for log in logs]), 200
    except Exception as e:
        return jsonify({'message': f"Failed to retrieve prediction logs: {str(e)}"}), 500

@predict_bp.route('/reload-model', methods=['POST'])
@token_required
def reload_model(current_user):
    """
    Restricted endpoint to reload the joblib model pipeline dynamically.
    """
    if current_user.role != 'Fraud Analyst':
        return jsonify({'message': 'Administrative privileges required to reload models.'}), 403
        
    try:
        model_service.load_model()
        return jsonify({
            'message': 'Machine learning model pipeline reloaded successfully.',
            'model_active': model_service.model is not None
        }), 200
    except Exception as e:
        return jsonify({'message': f"Failed to reload model: {str(e)}"}), 500

import os
import time
import joblib
import pandas as pd
import numpy as np

class ModelService:
    """
    Service layer responsible for loading the trained Scikit-Learn classifier
    and executing transaction risk predictions.
    """
    def __init__(self):
        self.model = None
        self.model_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), 
            'trained_model', 
            'fraud_model.joblib'
        )
        self.load_model()

    def load_model(self):
        """
        Loads the joblib model artifact. If file not found, alerts console
        and prepares fallback classifier.
        """
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                print(f"Machine learning model loaded successfully from {self.model_path}")
            else:
                print(f"Warning: Model artifact not found at {self.model_path}. Fallback rules-engine enabled.")
        except Exception as e:
            print(f"Error loading model artifact: {e}. Fallback rules-engine enabled.")
            self.model = None

    def predict_transaction(self, tx_data):
        """
        Scores a single transaction dict and returns details.
        
        tx_data structure:
        {
            'type': str,           # TRANSFER, CASH_OUT, PAYMENT, DEBIT, CASH_IN
            'amount': float,
            'oldbalanceOrg': float,
            'newbalanceOrig': float,
            'oldbalanceDest': float,
            'newbalanceDest': float
        }
        """
        start_time = time.time()
        
        # Verify inputs and parse floats
        try:
            amount = float(tx_data.get('amount', 0))
            old_bal_org = float(tx_data.get('oldbalanceOrg', 0))
            new_bal_org = float(tx_data.get('newbalanceOrig', old_bal_org - amount))
            old_bal_dest = float(tx_data.get('oldbalanceDest', 0))
            new_bal_dest = float(tx_data.get('newbalanceDest', old_bal_dest + amount))
            tx_type = str(tx_data.get('type', 'PAYMENT')).upper()
        except ValueError as err:
            raise ValueError(f"Invalid numerical formatting in transaction parameters: {err}")

        # If model is loaded, run real inference
        if self.model is not None:
            try:
                # Prepare single-row DataFrame
                input_df = pd.DataFrame([{
                    'type': tx_type,
                    'amount': amount,
                    'oldbalanceOrg': old_bal_org,
                    'newbalanceOrig': new_bal_org,
                    'oldbalanceDest': old_bal_dest,
                    'newbalanceDest': new_bal_dest
                }])
                
                # Predict probability [P(Safe), P(Fraud)]
                probabilities = self.model.predict_proba(input_df)[0]
                fraud_prob = float(probabilities[1])
                is_fraud = int(self.model.predict(input_df)[0])
                
            except Exception as e:
                print(f"Real ML prediction failed: {e}. Falling back to rules-engine.")
                is_fraud, fraud_prob = self._rules_engine_fallback(tx_type, amount, old_bal_org)
        else:
            # Standalone fallback rules engine
            is_fraud, fraud_prob = self._rules_engine_fallback(tx_type, amount, old_bal_org)

        duration = time.time() - start_time
        
        return {
            'is_fraud': bool(is_fraud),
            'probability': fraud_prob,
            'risk_percentage': round(fraud_prob * 100, 2),
            'confidence_score': round(1 - abs(0.5 - fraud_prob) * 2, 4), # confidence closeness indicator
            'prediction_time_ms': round(duration * 1000, 4)
        }

    def _rules_engine_fallback(self, tx_type, amount, old_bal_org):
        """
        Determines transaction risk score based on standard fraud rules.
        Used as a safety net when sklearn pipelines are loading/missing.
        """
        risk_score = 0.0
        
        # Rule 1: High risk payment methods
        if tx_type in ['TRANSFER', 'CASH_OUT']:
            risk_score += 0.25
            
        # Rule 2: Large transaction amounts
        if amount > 10000:
            risk_score += 0.35
        elif amount > 2500:
            risk_score += 0.15
            
        # Rule 3: Insufficient starting balance / overdraft behavior
        if old_bal_org < amount:
            risk_score += 0.30
            
        # Rule 4: Rapid depleting transfers
        if tx_type == 'TRANSFER' and amount > 5000 and old_bal_org == amount:
            risk_score += 0.10
            
        # Cap limits
        risk_score = min(0.99, max(0.01, risk_score))
        
        # Soften binary decision threshold
        is_fraud = 1 if risk_score > 0.5 else 0
        return is_fraud, risk_score

# Instantiate singleton service
model_service = ModelService()

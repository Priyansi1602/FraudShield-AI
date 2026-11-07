import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
import joblib

def generate_synthetic_data(num_samples=2000):
    """
    Generates synthetic financial transactions to train our fraud model.
    Matches standard Kaggle PaySim features.
    """
    np.random.seed(42)
    
    # Features
    amounts = np.random.exponential(scale=500, size=num_samples)
    old_balance_org = np.random.exponential(scale=5000, size=num_samples)
    new_balance_org = np.maximum(0, old_balance_org - amounts)
    
    old_balance_dest = np.random.exponential(scale=10000, size=num_samples)
    new_balance_dest = old_balance_dest + amounts
    
    # Categorical Transaction Types
    types = np.random.choice(['TRANSFER', 'CASH_OUT', 'PAYMENT', 'DEBIT', 'CASH_IN'], size=num_samples, p=[0.2, 0.4, 0.2, 0.1, 0.1])
    
    # Establish a correlation between TRANSFER/CASH_OUT with large amounts and high fraud rates
    is_fraud = np.zeros(num_samples, dtype=int)
    for i in range(num_samples):
        score = 0
        if types[i] in ['TRANSFER', 'CASH_OUT']:
            score += 2
        if amounts[i] > 1500:
            score += 3
        if old_balance_org[i] < amounts[i]:
            score += 2  # overdraft/depleted balance
            
        prob = 1 / (1 + np.exp(-score + 4.5))  # Sigmoid probability
        is_fraud[i] = np.random.choice([0, 1], p=[1 - prob, prob])
        
    df = pd.DataFrame({
        'type': types,
        'amount': amounts,
        'oldbalanceOrg': old_balance_org,
        'newbalanceOrig': new_balance_org,
        'oldbalanceDest': old_balance_dest,
        'newbalanceDest': new_balance_dest
    })
    
    return df, is_fraud

def train_and_save_model():
    """
    Trains a Scikit-Learn Random Forest Pipeline and serializes the model artifact.
    """
    print("Generating synthetic financial data...")
    X, y = generate_synthetic_data()
    
    # Define columns
    categorical_cols = ['type']
    numerical_cols = ['amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest']
    
    # Preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
        ]
    )
    
    # Full predictive model pipeline
    model_pipeline = Pipeline(
        steps=[
            ('preprocessor', preprocessor),
            ('classifier', RandomForestClassifier(n_estimators=50, random_state=42, max_depth=8))
        ]
    )
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Training Random Forest classifier...")
    model_pipeline.fit(X_train, y_train)
    
    accuracy = model_pipeline.score(X_test, y_test)
    print(f"Model trained successfully. Accuracy: {accuracy:.4f}")
    
    # Save the pipeline to trained_model directory
    model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'trained_model')
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
        
    model_path = os.path.join(model_dir, 'fraud_model.joblib')
    joblib.dump(model_pipeline, model_path)
    print(f"Serialized model artifact saved to: {model_path}")

if __name__ == '__main__':
    train_and_save_model()

# FraudShield AI – Financial Fraud Detection Platform

## Project Overview
FraudShield AI is a full-stack web application designed to identify potentially fraudulent financial transactions using a Machine Learning model.

The application predicts whether a transaction is SAFE or FRAUD and provides transaction analysis and prediction history.

## Features
- User registration and login
- Financial transaction fraud prediction
- Random Forest Machine Learning model
- Risk and prediction results
- CSV transaction scanning
- Prediction history
- Analytics dashboard
- Transaction investigation details

## Technology Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- Recharts
- Axios

**Backend**
- Python
- Flask
- Flask-SQLAlchemy
- JWT Authentication

**Machine Learning**
- Scikit-learn
- Random Forest Classifier
- Pandas
- NumPy
- Joblib

**Database**
- SQLite
- MySQL support

## Project Structure
- `backend/` – Flask backend and API
- `frontend/` – React frontend
- `backend/models/` – Model-related files
- `backend/routes/` – API routes
- `backend/services/` – Application services

## Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/Priyansi1602/FraudShield-AI.git
cd FraudShield-AI
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

Windows:
```bash
venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Configure the required environment variables using your local `.env` file. Never commit secrets.

Run the backend using the entry point and configuration provided in the project.

### 3. Frontend Setup

Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

## Model Information
The project uses a Scikit-learn Random Forest classifier trained on synthetic transaction data.

Predictions are categorized as SAFE or FRAUD based on the configured classification threshold.

## Limitations
- The model is trained on synthetic data.
- CSV scanning processes transactions through sequential requests.
- This project is an academic demonstration and is not a production banking security system.

## Author
Priyansi Prajapati

GitHub: https://github.com/Priyansi1602

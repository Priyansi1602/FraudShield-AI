from app import create_app

# Instantiate the application context for Gunicorn production server
app = create_app()

if __name__ == "__main__":
    app.run()

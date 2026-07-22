import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    # Start the FastAPI server using the host localhost and port loaded from settings (.env)
    print(f"Starting server on http://localhost:{settings.PORT}")
    uvicorn.run("app.main:app", host="localhost", port=settings.PORT, reload=False)

from fastapi import FastAPI

app = FastAPI()

@app.get("/api")
async def api_health():
    return {
        "status": "ok",
        "service": "lahio-api"
    }

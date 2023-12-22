from fastapi import FastAPI
from fastapi import APIRouter, Request
from pydantic import BaseModel
from .create_course import create_course

app = FastAPI()

router = APIRouter()

class Course(BaseModel):
    topic: str


@router.post("/api/create-course")
async def route_create_course(data: Course) -> str:
    print(f"creating new course: {data.topic}")
    id = await create_course(data.topic)
    return id

app.include_router(router)

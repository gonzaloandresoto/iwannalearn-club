import os
from typing import Optional

import motor.motor_asyncio
from pydantic import BaseModel, Field
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

# read .env into os.environ
with open(".env", "r") as f:
    for line in f.readlines():
        parts = line.strip().split("=")
        k = parts[0]
        v = "=".join(parts[1:])
        os.environ[k] = v
client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URI"])
db = client.learnAnything

PyObjectId = Annotated[str, BeforeValidator(str)]


class CourseModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str
    summary: str
    tableOfContents: str


class UnitModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str
    summary: str
    status: str
    order: str
    courseId: str


class ElementModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    type: str
    order: str
    title: str
    content: str
    unitId: str


class QuizModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    type: str
    question: str
    order: str
    choices: str
    answer: str
    status: bool
    unitId: str


async def create_course(course):
    print("creating course in db")
    res = await db.courses.insert_one(course.model_dump())
    return res

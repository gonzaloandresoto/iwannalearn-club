import json
import os
from typing import List, Optional

from openai import OpenAI
from pydantic import BaseModel
from . import db

try:
    with open(os.path.expanduser("~/.cache/oai"), "r") as f:
        client = OpenAI(api_key=f.read().strip())
except FileNotFoundError:
    print("Error reading openai api key from ~/.cache/oai")
    exit(1)

lesson_schema = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "description": "the title of the lesson"
        },
    },
    "required": ["title"],
}

chapter_schema = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "description": "the title of the section"
        },
        "description": {
            "type": "string",
            "description": "a short description of the section"
        },
        "lessons": {
            "type": "array",
            "items": lesson_schema,
        }
    },
    "required": ["title", "description", "lessons"],
}

course_schema = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "description": "the title of the course"
        },
        "summary": {
            "type": "string",
            "description": "a short summary of the course"
        },
        "table_of_contents": {
            "type": "array",
            "items": chapter_schema,
        },
    },
    "required": ["title", "summary", "table_of_contents"],
}

create_course_func = {
    "name": "create_course",
    "description": "creates a new course",
    "parameters": course_schema,
}

sys_prompt = """You are a well-rounded, highly qualified teacher extremely
knowledgable in a wide variety of subject matter. Your students will ask about
some high level topic and you will create a textbook quality course on the
topic for them."""


class Quiz(BaseModel):
    question: str
    options: List[str]
    answer: int


class Lesson(BaseModel):
    title: str
    content: Optional[str] = None
    quiz: Optional[Quiz] = None


class Chapter(BaseModel):
    title: str
    description: str
    lessons: List[Lesson]


class Course(BaseModel):
    title: str
    summary: str
    table_of_contents: List[Chapter]


def generate_course(topic: str):
    print("generating course...")

    res = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=[
            {
                "role": "system",
                "content": sys_prompt
            },
            {
                "role": "user",
                "content": f"Create a course about {topic}"
            },
        ],
        tools=[{
            "type": "function",
            "function": create_course_func,
        }],
        tool_choice={
            "type": "function",
            "function": {
                "name": "create_course"
            }
        }
    )
    print("generated course data")

    try:
        tool_calls = res.choices[0].message.tool_calls
    except AttributeError:
        print("Failed to use tool call")
        print("Response:")
        print(res)
        return None

    if len(tool_calls) != 1: print(f"WARNING: got {len(tool_calls)} tool calls, only using the last one")
    tool = tool_calls[-1]

    args = tool.function.arguments
    try:
        args = json.loads(args)
    except json.decoder.JSONDecodeError:
        print("Failed to decode json")
        print(args)

    print(args)
    # {'title': 'Mastering the Art of Test-Taking', 'summary': 'This course is designed to help students develop effective test-taking strategies to excel in various types of assessments. From multiple-choice exams to essay writing, this course covers a wide range of topics to equip students with the skills needed for academic success.', 'table_of_contents': [{'title': 'Understanding Test Formats', 'description': 'An overview of different types of test formats and how to approach them strategically.', 'lessons': [{'title': 'Introduction to Test Formats'}, {'title': 'Strategies for Multiple-Choice Tests'}, {'title': 'Approaching Essay Questions'}]}, {'title': 'Study Techniques for Test Preparation', 'description': 'Effective study methods to prepare for tests and retain information.', 'lessons': [{'title': 'Active Reading and Note-Taking'}, {'title': 'Memory Enhancement Techniques'}, {'title': 'Time Management for Study Sessions'}]}, {'title': 'Test-Taking Strategies', 'description': 'Specific strategies for approaching tests, managing time, and handling test anxiety.', 'lessons': [{'title': 'Pacing and Time Management During Tests'}, {'title': 'Dealing with Test Anxiety'}, {'title': 'Best Guess Strategies for Multiple-Choice Questions'}]}, {'title': 'Writing Skills for Essay Exams', 'description': 'Guidance on refining writing skills and structuring essays for test scenarios.', 'lessons': [{'title': 'Essay Structure and Organization'}, {'title': 'Developing Clear and Concise Arguments'}, {'title': 'Effective Use of Evidence and Examples'}]}]}
    return Course(
        title=args["title"],
        summary=args["summary"],
        table_of_contents=[
            Chapter(
                title=chapter["title"],
                description=chapter["description"],
                lessons=[
                    Lesson(
                        title=lesson["title"],
                    ) for lesson in chapter["lessons"]
                ],
            ) for chapter in args["table_of_contents"]
        ]
    )


async def create_course(topic: str):
    print("creating course...")
    course = generate_course(topic)
    res = await db.create_course(course)
    print("created course")
    print(res)
    # asyncronously create_course_content
    return str(res.inserted_id)

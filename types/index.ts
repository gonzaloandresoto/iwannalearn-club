export interface SampleTopic {
  item: string;
}

export interface SampleTOC {
  id: number;
  title: string;
}

export interface CourseDetails {
  title: string;
  summary: string;
  tableOfContents?: CourseWithLessonTitles[];
}

export interface CourseCustomAttributes {
  topic: string;
  concepts: string[];
  tableOfContents: SampleTOC[];
}

export interface CourseWithLessonTitles {
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  _id: string;
  title: string;
  content: string;
  unitId: string;
  order: number;
  links: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnitLessons {
  _id: string;
  order: number;
  title: string;
}

export interface SampleTopic {
  item: string;
}

export interface SampleTOC {
  item: string;
}

export interface CourseDetails {
  title: string;
  summary: string;
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

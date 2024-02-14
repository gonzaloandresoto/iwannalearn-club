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

export interface Unit {
  _id: string;
  courseId: string;
  order: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnitCompletions {
  [key: string]: {
    order: number;
    status: string;
  };
}

export interface CourseWithProgress extends Course {
  progress: number;
}

export interface Course {
  _id: string;
  title: string;
  summary: string;
  tableOfContents: string;
  userId: string;
  doneGenerating: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StructuredUnitContent {
  unitName: string;
  courseId: string;
  content: Lesson[];
}

export interface StructuredCourseContent {
  [key: string]: StructuredUnitContent;
}

export interface UserCoursesGrid {
  courses: CourseWithProgress[];
  isNext: boolean;
}

export interface User {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  onboarding: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingUserDetails {
  firstName: string;
  lastName: string;
  attribution: string;
  whyLearn: string;
}

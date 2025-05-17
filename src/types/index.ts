export interface IUser {
  token: string;
  info: {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
  };
}

export interface IUserAsyncStorage {
  token: string;
  info: {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
  };
  expiresAt: string;
}

export interface IAssignment {
  id: string;
  title: string;
  description: string;
  deadLine: string;
  createBy: string;
  filesName: Array<string>;
  className: string;
  classId: number;
}

export interface IAssignmentCreation {
  title: string;
  description: string;
  classId: string;
  deadLine: string;
  files: Array<IFileUpload>;
}

export interface IFileUpload {
  uri: string;
  name: string;
  size: number | undefined;
  type: string | undefined;
}

export interface IStudentSubmission {
  id: string;
  submissionTime: string;
  filesName: Array<string>;
  submissionBy: string;
  point: number; 
  feedback?: string;
}

export interface IStudentGrading {
  point: number; 
  feedback: string; 
}

export interface IActivity {
  title: string;
  body: string;
  createdAt: string;
  classId: number;
  className: string;
  type: string;
  assignmentId?: string;
  postId?: number;
}

export interface IPost {
  id: number;
  classId: number;
  className: string;
  teacherId: number;
  teacherName: string;
  title: string;
  content: string;
  createdAt: string;
  comments: Array<any>;
}

export type RootStackParamList = {
  Start: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
};
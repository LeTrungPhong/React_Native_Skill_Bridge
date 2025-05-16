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
  classId: string;
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
  feedback?: string; //thêm demo
}

export interface IStudentGrading {
  point: number; 
  feedback?: string; 
}

////////////////
export type RootStackParamList = {
  Start: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
};

export interface IActivity {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  group: string;
}
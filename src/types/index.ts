export type RootStackParamList = {
  Start: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
};

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface IActivity {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  group: string;
}

export interface IAssignment {
  id: string;
  title: string;
  content: string;
  submittedAt?: string;
  deadline: string;
  group: string;
  score?: number;
}
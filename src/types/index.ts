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
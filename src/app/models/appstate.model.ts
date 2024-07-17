export interface AppState {
  counter: CounterState;
  user: UserState;
}

export interface CounterState {
  count: number;
  incrementTimes:string[]
}

export interface UserState {
  userName: string;
  isLoggedIn: boolean;
}

export const initialCounterState: CounterState = {
  count: 0,
  incrementTimes:[]
};

export const initialUserState: UserState = {
  userName: '',
  isLoggedIn: false,
};

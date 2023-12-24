export type SignalListener<T> = (data: T) => void;
export type SignalType<T> = () => T;
export interface SignalState<T> {
  [key: string]: T | T[];
}
export type Action<T> = {
  type: string;
  payload?: T;
};
export type Listener = () => void;
export interface State<T> {
  getState: SignalType<T>;
  setState: (updater: (prevState: T) => T) => void;
  add: (item: any) => void;
}

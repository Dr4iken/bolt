import { Action, Listener, SignalListener, SignalType, State } from "./types/bolt.types";
/**
 * Represents a lightweight implementation of the observer pattern.
 * Allows subscribing and emitting events with a specific data type.
 *
 * @template T - The type of data the signal will carry.
 */
export class Signal<T = any> {
  private listenersMap: Map<string, SignalListener<T>[]> = new Map();

  /**
   * Subscribes a listener to the signal.
   *
   * @param {string} key - The key to identify the listener.
   * @param {SignalListener<T>} listener - The function to be called when the signal is emitted.
   * @returns {() => void} - A function that unsubscribes the listener when called.
   */
  subscribe(key: string, listener: SignalListener<T>): () => void {
    if (!this.listenersMap.has(key)) {
      this.listenersMap.set(key, []);
    }

    this.listenersMap.get(key)!.push(listener);

    return () => {
      this.unsubscribeByKey(key);
    };
  }

  /**
   * Unsubscribes all listeners associated with a specific key.
   *
   * @param {string} key - The key to identify the listeners to unsubscribe.
   */
  unsubscribeByKey(key: string): void {
    this.listenersMap.delete(key);
  }

  /**
   * Emits an event to all subscribed listeners associated with a specific key.
   *
   * @param {string} key - The key to identify the listeners to emit the event to.
   * @param {T} data - The data to be sent to the listeners.
   */
  emit(key: string, data: T): void {
    const listeners = this.listenersMap.get(key) || [];
    listeners.forEach((listener) => listener(data));
  }
}

/**
 * The above code defines TypeScript functions for creating and managing state, as well as functions
 * for using signals and actions with the state.
 * @param {T} initialState - The `initialState` parameter is the initial value of the state. It can be
 * of any type and will be used as the starting value for the state.
 * @returns The `createState` function returns an object with three properties: `getState`, `setState`,
 * and `add`.
 */
export function createState<T>(initialState: T): State<T> {
  let state: T = initialState;
  const listeners: Listener[] = [];
  const getState: SignalType<T> = () => state;
  const setState = (updater: (prevState: T) => T) => {
    const newState = updater(state);
    state = newState;
    listeners.forEach(listener => listener());
  };
  const add = (payload: any) => setState(prevState => {
    if (typeof prevState === 'object' && prevState !== null) {
      const keys = Object.keys(prevState);
      if (keys.length > 0 && typeof keys[0] === 'string') {
        const key = keys[0] as keyof T; // Obtener la única clave de prevValue
        const currentValue = prevState[key];
        const updatedValue = Array.isArray(currentValue) ? [...currentValue, payload] : [payload];
        return { ...prevState, [key]: updatedValue } as T;
      } else {
        // Manejar el caso en el que prevValue no tiene una clave de tipo string
        console.error('Error: prevValue no tiene una clave de tipo string.');
        return prevState;
      }
    } else {
      // Manejar el caso en el que prevValue no es un objeto
      console.error('Error: prevValue no es un objeto válido.');
      return prevState;
    }
  });
  return {
    getState,
    setState,
    add
  };
}

/**
 * The `useSignal` function is a TypeScript function that returns a signal value and a setter function
 * for updating the value in a state object.
 * @param state - The `state` parameter is an object that represents the current state of your
 * application. It should have a `getState` method that returns the current state and a `setState`
 * method that allows you to update the state.
 * @param key - The `key` parameter is the key of the property in the `state` object that you want to
 * create a signal for. It is used to access the specific property in the state object and update its
 * value.
 * @returns The `useSignal` function returns an array containing two elements. The first element is a
 * function of type `SignalType<T[keyof T]>`, which represents the current value of the specified key
 * in the state. The second element is a function that takes an updater function as an argument and
 * updates the value of the specified key in the state.
 */
export function useSignal<T>(state: State<T>, key: keyof T): [SignalType<T[keyof T]>, (updater: (prevValue: T[keyof T]) =>  T[keyof T]) => void] {
  const signal = () => state.getState()[key];
  const setSignal = (updater: (prevValue: T[keyof T]) => T[keyof T]) => {
    state.setState(prevState => ({ ...prevState, [key]: updater(prevState[key]) }));
  };
  return [signal, setSignal]
}
/**
 * The `useActions` function is a TypeScript function that takes in a state and a set of actions, and
 * returns a record of functions that can be used to dispatch actions to update the state.
 * @param state - The `state` parameter is an object that represents the current state of your
 * application. It typically contains various properties that hold different pieces of data.
 * @param actions - The `actions` parameter is a record object where the keys are action types and the
 * values are functions that accept a payload and perform some action.
 * @returns The function `useActions` returns a record of action functions.
 */
export function useActions<T>(state: State<T>, actions: Record<string, (payload: any) => void>): Record<string, (payload: any) => void>{
  const dispatch = (action: Action<any>) => {
    state.setState(prevState => {
      const actionType = actions[action.type];
      if (actionType){
        actionType(action.payload)
      }
      return prevState;
    });
  };
  return Object.fromEntries(Object.keys(actions).map(actionType => [actionType, (payload: any) =>  dispatch({type: actionType, payload})]))
}



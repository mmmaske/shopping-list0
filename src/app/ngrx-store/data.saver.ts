import { DataState } from "./data.reducer";

export const loadState = (): DataState | undefined => {
    try {
      const serializedState = localStorage.getItem('appState');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      console.error('Error loading state from localStorage', err);
      return undefined;
    }
  };

  export const saveState = (state: DataState): void => {
    try {
      const serializedState = JSON.stringify(state);
      console.log(state);
      localStorage.setItem('appState', serializedState);
    } catch (err) {
      console.error('Error saving state to localStorage', err);
    }
  };
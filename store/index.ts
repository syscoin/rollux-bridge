// init react redux store and return it to the caller
// Path: store/index.ts

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import AppState from './slices/AppState';
import Deposits from './slices/Deposits';


const loadFromLocalStorage = (key: string, fallback = "[]") => {
    if (typeof window !== 'undefined') {
        return JSON.parse(window.localStorage.getItem(key) || fallback);
    }

    // return a default value when running on the server
    return [];
}


const localStorageMiddleware = ({ getState }: any) => {
    return (next: any) => (action: any) => {
        const result = next(action);

        window.localStorage.setItem('app::deposits', JSON.stringify(
            getState().rootReducer.Deposits.deposits
        ));

        return result;
    };
};

const rootReducer = combineReducers({
    AppState,
    Deposits
});

const store = configureStore({
    reducer: {
        rootReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
    preloadedState: {
        rootReducer: {
            Deposits: {
                deposits: loadFromLocalStorage('app::deposits'),
            }
        }
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => {
    return selector(store.getState());
}

export default store;

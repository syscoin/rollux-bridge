// init react redux store and return it to the caller
// Path: store/index.ts

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import AppState from './slices/AppState';
import Deposits from './slices/Deposits';
import Withdrawals from './slices/Withdrawals';


// const loadFromLocalStorage = (key: string, fallback = "[]") => {
//     if (typeof window !== 'undefined') {
//         return JSON.parse(window.localStorage.getItem(key) || fallback);
//     }

//     // return a default value when running on the server
//     return [];
// }


// const localStorageMiddleware = ({ getState }: any) => {
//     return (next: any) => (action: any) => {
//         const result = next(action);

//         window.localStorage.setItem('app::deposits', JSON.stringify(
//             getState().rootReducer.Deposits.deposits
//         ));

//         return result;
//     };
// };

const rootReducer = combineReducers({
    AppState,
    Deposits,
    Withdrawals,
});

const store = configureStore({
    reducer: {
        rootReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

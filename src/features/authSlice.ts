import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store';

export interface AuthSlice {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    token: string | null;
}

const initialState: AuthSlice = {
    id: null,
    firstName: null,
    lastName: null,
    username: null,
    token: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ id: string, firstName: string, lastName: string, username: string, token: string }>) => {
            localStorage.setItem('user', JSON.stringify({
                id: action.payload.id,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                username: action.payload.lastName,
                token: action.payload.token
            }))
            state.id = action.payload.id
            state.firstName = action.payload.firstName
            state.lastName = action.payload.lastName
            state.username = action.payload.username
            state.token = action.payload.token
        },

        logOutUser: (state) => {
            localStorage.clear()
            state.firstName = null
            state.token = null
        },
        addNotifications:(state, {payload}) => {},
        resetNotifications:(state, {payload}) => {}

    }
})


export const selectAuth = (state: RootState) => state.auth;
export const { setUser, logOutUser } = authSlice.actions
export default authSlice.reducer

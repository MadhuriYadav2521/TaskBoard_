import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    unreadChatCount : 0
}

const chatSlice = createSlice({
    name: "chatCount",
    initialState,
    reducers : {
        setCount : (state, action) => {
            state.unreadChatCount = action.payload.unreadCount
        }
    }
})

export const {setCount} = chatSlice.actions
export default chatSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice"

const store = configureStore({
    reducer : {
        chatReducer: chatReducer
    }
})

export default store;
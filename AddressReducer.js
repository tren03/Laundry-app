import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    address:""
}
const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers:{
        setAddress:(state,action) => {
            state.address = action.payload
        }
    }
});

export const { setAddress } = addressSlice.actions;
export default addressSlice.reducer;
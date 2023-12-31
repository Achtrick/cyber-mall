import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import auth from "./reducers/auth";
import ui from "./reducers/ui";
import cart from "./reducers/cart";

// creating store
export const store = configureStore({ reducer: { auth, ui, cart } });

// assigning store to next wrapper
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);

import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import auth from "./reducers/auth";
import cart from "./reducers/cart";
import ui from "./reducers/ui";

// creating store
export const store = configureStore({ reducer: { auth, cart, ui } });

// assigning store to next wrapper
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);

import { combineReducers} from "redux";
import articleReducer from "./articleReducer.js";

import userReducer from './userReducer.js';


const rootReducer = combineReducers({
    userState:userReducer,
    articleState:articleReducer,
})

export default rootReducer;
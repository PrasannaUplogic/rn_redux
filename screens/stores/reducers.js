import { combineReducers } from 'redux';

import { MENU_AVAILABLE, ADD_MENU, DEL_MENU, UPDATE_MENU, DEL_ALL_MENU } from "./actions" //Import the actions types constant we defined in our actions

let dataState = {
    menus: []
};

const dataReducers = (state = dataState, action) => {
    switch (action.type) {

        case ADD_MENU: {
            var get_menu = action.data.details;
            console.log("get_menu", get_menu)
            state.menus.push(get_menu);
            return { ...state };
        }

        case MENU_AVAILABLE: {
            console.log("MENU_AVAILABLE action from async", action)
            let get_menus = action.data.details;
            state.menus = (get_menus);
            console.log("state.menus", state.menus)
            return { ...state };
        }

        case UPDATE_MENU: {
            var get_menu = action.data.details;
            console.log("get_menu", get_menu)
            state.menus.map((val, key) => {
                if (val.itemId == get_menu.itemId) {
                    state.menus[key].itemSelcted = get_menu.itemSelcted
                }
            })
            // state.menus.push(get_menu);
            return { ...state };
        }

        case DEL_MENU: {
            var id = action.data.details;
            console.log("id", id)
            state.menus.map((val, key) => {
                if (val.itemId == id) {
                    state.menus.splice(key, 1)
                }
            })

            return { ...state };
        }

        case DEL_ALL_MENU: {
            var id = action.data.details;
            state.menus = []
            return { ...state };
        }

        default:
            return state;
    }
};

// Combine all the reducers
const rootReducer = combineReducers({ dataReducers });

export default rootReducer;


export const MENU_AVAILABLE = 'MENU_AVAILABLE';
export const ADD_MENU = 'ADD_MENU';
export const UPDATE_MENU = 'UPDATE_MENU';
export const DEL_MENU = 'DEL_MENU';
export const DEL_ALL_MENU = 'DEL_ALL_MENU';




export const get_addMenu = (details) => ({
    type: MENU_AVAILABLE,
    data: { details }
});

export const add_menu = (details) => ({
    type: ADD_MENU,
    data: { details }
})

export const update_menu = (details) => ({
    type: UPDATE_MENU,
    data: { details }
})
export const del_menu = (details) => ({
    type: DEL_MENU,
    data: { details }
})

export const del_all_menu = (details) => ({
    type: DEL_ALL_MENU,
    data: {}
})
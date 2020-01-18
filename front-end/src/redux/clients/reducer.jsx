
const initialState = {
    list: []
}

export default function clientsReducer(originalState = initialState, action) {
    let state = {...originalState};
    switch(action.type){

        case 'ADD_CLIENT':
            state.list.push(action.data);
            return state;

        case 'FETCH_CLIENTS':
            state.list = action.data;
            return state;

        case 'REMOVE_CLIENT':
            state.list.splice(action.key, 1);
            return state;

        case 'EDIT_CLIENT':
            state.list[action.key] = action.data;
            return state;
            
        default:
            return state;
    }
}

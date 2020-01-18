
const initialState = {
    list: []
}

export default function propertiesReducer(originalState = initialState, action) {
    let state = {...originalState};
    switch(action.type){

        case 'ADD_PROPERTY':
            state.list.push(action.data);
            return state;

        case 'FETCH_PROPERTIES':
            state.list = action.data;
            return state;

        case 'REMOVE_PROPERTY':
            state.list.splice(action.key, 1);
            return state;

        case 'EDIT_PROPERTY':
            state.list[action.key] = action.data;
            return state;
            
        default:
            return state;
    }
}

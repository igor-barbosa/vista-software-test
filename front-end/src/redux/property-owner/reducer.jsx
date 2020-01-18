
const initialState = {
    list: []
}

export default function propertyOwnerReducer(originalState = initialState, action) {
    let state = {...originalState};
    switch(action.type){

        case 'ADD_PROPERTY_OWNER':
            state.list.push(action.data);
            return state;

        case 'FETCH_PROPERTY_OWNER':
            state.list = action.data;
            return state;

        case 'REMOVE_PROPERTY_OWNER':
            state.list.splice(action.key, 1);
            return state;

        case 'EDIT_PROPERTY_OWNER':
            state.list[action.key] = action.data;
            return state;
            
        default:
            return state;
    }
}

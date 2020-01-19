
const initialState = {
    list: []
}

export default function contractReducer(originalState = initialState, action) {
    let state = {...originalState};
    switch(action.type){

        case 'ADD_CONTRACT':
            state.list.push(action.data);
            return state;

        case 'FETCH_CONTRACTS':
            state.list = action.data;
            return state;

        case 'REMOVE_CONTRACT':
            state.list.splice(action.key, 1);
            return state;
            
        default:
            return state;
    }
}

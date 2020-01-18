const addProperty = (data) => ({ type: 'ADD_PROPERTY', data });

const fetchProperties = (data) => ({ type: 'FETCH_PROPERTIES', data});

const removeProperty = key => ({ type: 'REMOVE_PROPERTY', key });

const editProperty = (data, key) => ({ type: 'EDIT_PROPERTY', key, data });

const propertyOwnerActions = {
    addProperty,
    fetchProperties,
    removeProperty,
    editProperty
}


export default propertyOwnerActions;
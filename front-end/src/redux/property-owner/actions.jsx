const addPropertyOwner = (data) => ({ type: 'ADD_PROPERTY_OWNER', data });

const fetchPropertyOwners = (data) => ({ type: 'FETCH_PROPERTY_OWNER', data});

const removePropertyOwner = key => ({ type: 'REMOVE_PROPERTY_OWNER', key });

const editPropertyOwner = (data, key) => ({ type: 'EDIT_PROPERTY_OWNER', key, data });

const propertyOwnerActions = {
    addPropertyOwner,
    fetchPropertyOwners,
    removePropertyOwner,
    editPropertyOwner
}


export default propertyOwnerActions;
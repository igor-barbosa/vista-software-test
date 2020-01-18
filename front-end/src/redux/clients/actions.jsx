const addClient = (data) => ({ type: 'ADD_CLIENT', data });

const fetchClients = (data) => ({ type: 'FETCH_CLIENTS', data});

const removeClient = key => ({ type: 'REMOVE_CLIENT', key });

const editClient = (data, key) => ({ type: 'EDIT_CLIENT', key, data });

const clientsActions = {
    addClient,
    fetchClients,
    removeClient,
    editClient
}

export default clientsActions;
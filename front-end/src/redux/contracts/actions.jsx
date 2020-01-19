const addContract = (data) => ({ type: 'ADD_CONTRACT', data });

const fetchContracts = (data) => ({ type: 'FETCH_CONTRACTS', data});

const removeContract = key => ({ type: 'REMOVE_CONTRACT', key });

const contractActions = {
    addContract,
    fetchContracts,
    removeContract
}


export default contractActions;
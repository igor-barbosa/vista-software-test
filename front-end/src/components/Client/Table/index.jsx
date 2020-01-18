import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useSelector, useDispatch } from 'react-redux';
import { Button, IconButton, Icon } from '@material-ui/core';
import ClientService from '../../../services/ClientService';
import { useSnackbar } from 'notistack';
import * as PropTypes from 'prop-types'
import ClientFormDialog from '../Form/Dialog';
import { bindActionCreators } from 'redux';
import clientsActions from '../../../redux/clients/actions';

const useStyles = makeStyles({
    tableContainer: {
        maxHeight: '440px'
    }
});

ClientTable.propTypes =  {
    onRemoveClient: PropTypes.func,
    onEditClient: PropTypes.func
}

ClientTable.defaultProps =  {
    onRemoveClient: () => null,
    onEditClient: () => null
}

export default function ClientTable(props) {

    const dispatch = useDispatch();
    const actions = bindActionCreators(clientsActions, dispatch);

    const clients = useSelector(state => state.clientsReducer);
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [clientDialogData, setClientDialogData] = useState({
        open: false,
        data: null,
        key: null,
        messages: []
    });


    const handleRemoveClient = (id, key) => async () => {

        const confirmRemove = window.confirm('Você deseja realmente remover esse cliente ?');
        if(confirmRemove){
            const resp = await ClientService.removeClient(id);

            if(!resp.data.error) {
                enqueueSnackbar('Os dados foram salvos com sucesso!', {
                    variant: 'success'
                });
    
                props.onRemoveClient(id, key);
            } else {
                enqueueSnackbar(resp.data.data.messages[0], {
                    variant: 'error'
                });
            }
        }        
    }

    const handleOpenEditClientDialog = (data, key) => () => {
        setClientDialogData({
            open: true,
            data,
            key
        })
    }
    
    const handleCloseEditClient = () => {
        setClientDialogData({ open: false, data: null, key: null });
    }


    const handleEditClient = async (client, form) => {
        setClientDialogData({ ...clientDialogData, messages: [] });   
        const resp = await ClientService.editClient(client.cl_id, client);
        if(!resp.data.error) {
            enqueueSnackbar('Os dados foram salvos com sucesso!', {
                variant: 'success'
            });
            form.resetForm();
            actions.editClient(resp.data.data, clientDialogData.key);
            setClientDialogData({ ...clientDialogData, messages: resp.data.data.messages, open: false, key: null, data: null });  
        } else {
            setClientDialogData({ ...clientDialogData, messages: resp.data.data.messages });  
        }
    }
    
    return (
        <>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="center">Cliente</TableCell>
                            <TableCell align="center">E-mail</TableCell>
                            <TableCell align="center">Telefone</TableCell>
                            <TableCell align="center">Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.list.map((client, key) => (
                            <TableRow key={key}>
                                <TableCell align="left">{client.cl_id}</TableCell>
                                <TableCell align="center">{client.cl_name}</TableCell>
                                <TableCell align="center">{client.cl_email}</TableCell>
                                <TableCell align="center">{client.cl_phone}</TableCell>
                                <TableCell align="right">
                                    
                                    <IconButton size="small" onClick={handleOpenEditClientDialog(client, key)}>
                                        <Icon>edit</Icon>
                                    </IconButton>

                                    <IconButton size="small" onClick={handleRemoveClient(client.cl_id, key)}>
                                        <Icon>delete</Icon>
                                    </IconButton>

                                </TableCell>
                            </TableRow>
                        ))}

                        {clients.list.length === 0 && (
                            <TableRow>
                                <TableCell component="th" scope="row" colSpan={4} align="center">
                                    Nenhum registro encontrado.
                                </TableCell>
                            </TableRow>
                        )} 
                    </TableBody>
                </Table>
            </TableContainer>
            <ClientFormDialog 
                open={clientDialogData.open} 
                onClose={handleCloseEditClient}
                initialValues={clientDialogData.data}
                onSubmit={handleEditClient}
                messages={clientDialogData.messages}
            />
        </>
    );
}
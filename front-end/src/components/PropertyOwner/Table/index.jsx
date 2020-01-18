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

import { bindActionCreators } from 'redux';
import propertyOwnerActions from '../../../redux/property-owner/actions';
import PropertyOwnerService from '../../../services/PropertyOwnerService';
import PropertyOwnerFormDialog from '../Form/Dialog';

const useStyles = makeStyles({
    tableContainer: {
        maxHeight: '440px'
    }
});

PropertyOwnerTable.propTypes =  {
    onRemove: PropTypes.func
}

PropertyOwnerTable.defaultProps =  {
    onRemove: () => null
}

export default function PropertyOwnerTable(props) {

    const dispatch = useDispatch();
    const actions = bindActionCreators(propertyOwnerActions, dispatch);

    const propertyOwners = useSelector(state => state.propertyOwnerReducer);
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [editDialogData, setEditDialogData] = useState({
        open: false,
        data: null,
        key: null,
        messages: []
    });


    const handleRemove = (id, key) => async () => {

        const confirmRemove = window.confirm('Você deseja realmente remover esse proprietário ?');
        if(confirmRemove){
            const resp = await PropertyOwnerService.removePropertyOwner(id);

            if(!resp.data.error) {
                enqueueSnackbar('Os dados foram salvos com sucesso!', {
                    variant: 'success'
                });
    
                props.onRemove(id, key);
            } else {
                enqueueSnackbar(resp.data.data.messages[0], {
                    variant: 'error'
                });
            }
        }        
    }

    const handleOpenEditDialog = (data, key) => () => {
        setEditDialogData({
            open: true,
            data,
            key
        })
    }
    
    const handleCloseEdit = () => {
        setEditDialogData({ open: false, data: null, key: null });
    }


    const handleEdit = async (propertyOwner, form) => {
        setEditDialogData({ ...editDialogData, messages: [] });   
        const resp = await PropertyOwnerService.editPropertyOwner(propertyOwner.po_id, propertyOwner);
        if(!resp.data.error) {
            enqueueSnackbar('Os dados foram salvos com sucesso!', {
                variant: 'success'
            });
            form.resetForm();
            actions.editPropertyOwner(resp.data.data, editDialogData.key);
            setEditDialogData({ ...editDialogData, messages: resp.data.data.messages, open: false, key: null, data: null });  
        } else {
            setEditDialogData({ ...editDialogData, messages: resp.data.data.messages });  
        }
    }
    
    return (
        <>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="center">Proprietário</TableCell>
                            <TableCell align="center">E-mail</TableCell>
                            <TableCell align="center">Dia de Repasse</TableCell>
                            <TableCell align="center">Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {propertyOwners.list.map((propertyOwner, key) => (
                            <TableRow key={key}>
                                <TableCell align="left">{propertyOwner.po_id}</TableCell>
                                <TableCell align="center">{propertyOwner.po_name}</TableCell>
                                <TableCell align="center">{propertyOwner.po_email}</TableCell>
                                <TableCell align="center">{propertyOwner.po_transfer_day}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={handleOpenEditDialog(propertyOwner, key)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                    <IconButton size="small" onClick={handleRemove(propertyOwner.po_id, key)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {propertyOwners.list.length === 0 && (
                            <TableRow>
                                <TableCell component="th" scope="row" colSpan={4} align="center">
                                    Nenhum registro encontrado.
                                </TableCell>
                            </TableRow>
                        )} 
                    </TableBody>
                </Table>
            </TableContainer>
            <PropertyOwnerFormDialog
                open={editDialogData.open} 
                onClose={handleCloseEdit}
                initialValues={editDialogData.data}
                onSubmit={handleEdit}
                messages={editDialogData.messages}
            />
        </>
    );
}
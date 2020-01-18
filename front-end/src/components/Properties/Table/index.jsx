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
import { useSnackbar } from 'notistack';
import * as PropTypes from 'prop-types'

import { bindActionCreators } from 'redux';
import propertiesActions from '../../../redux/properties/actions';
import PropertiesFormDialog from '../Form/Dialog';
import PropertiesService from '../../../services/PropertiesService';

const useStyles = makeStyles({
    tableContainer: {
        maxHeight: '440px'
    }
});

PropertiesTable.propTypes =  {
    onRemove: PropTypes.func
}

PropertiesTable.defaultProps =  {
    onRemove: () => null
}

export default function PropertiesTable(props) {

    const dispatch = useDispatch();
    const actions = bindActionCreators(propertiesActions, dispatch);

    const properties = useSelector(state => state.propertiesReducer);
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [editDialogData, setEditDialogData] = useState({
        open: false,
        data: null,
        key: null,
        messages: []
    });


    const handleRemove = (id, key) => async () => {

        const confirmRemove = window.confirm('Você deseja realmente remover esse imóvel ?');
        if(confirmRemove){
            const resp = await PropertiesService.removeProperty(id);

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


    const handleEdit = async (property, form) => {
        setEditDialogData({ ...editDialogData, messages: [] });   
        const resp = await PropertiesService.editProperty(property.pro_id, property);
        if(!resp.data.error) {
            enqueueSnackbar('Os dados foram salvos com sucesso!', {
                variant: 'success'
            });
            form.resetForm();
            actions.editProperty(resp.data.data, editDialogData.key);
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
                            <TableCell align="center">CEP</TableCell>
                            <TableCell align="center">Rua</TableCell>
                            <TableCell align="center">Número</TableCell>
                            <TableCell align="center">Complemento</TableCell>
                            <TableCell align="center">Bairro</TableCell>
                            <TableCell align="center">Cidade</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="right">Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties.list.map((property, key) => (
                            <TableRow key={key}>
                                <TableCell align="left">{property.pro_id}</TableCell>
                                <TableCell align="center">{property.pro_po_id}</TableCell>
                                <TableCell align="center">{property.pro_cep}</TableCell>
                                <TableCell align="center">{property.pro_street}</TableCell>
                                <TableCell align="center">{property.pro_number}</TableCell>
                                <TableCell align="center">{property.pro_complement}</TableCell>
                                <TableCell align="center">{property.pro_neighborhood}</TableCell>
                                <TableCell align="center">{property.pro_city}</TableCell>
                                <TableCell align="center">{property.pro_state}</TableCell>
                                
                                <TableCell align="right">
                                    <IconButton size="small" onClick={handleOpenEditDialog(property, key)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                    <IconButton size="small" onClick={handleRemove(property.pro_id, key)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {properties.list.length === 0 && (
                            <TableRow>
                                <TableCell component="th" scope="row" colSpan={10} align="center">
                                    Nenhum registro encontrado.
                                </TableCell>
                            </TableRow>
                        )} 
                    </TableBody>
                </Table>
            </TableContainer>
            <PropertiesFormDialog
                open={editDialogData.open} 
                onClose={handleCloseEdit}
                initialValues={editDialogData.data}
                onSubmit={handleEdit}
                messages={editDialogData.messages}
            />
        </>
    );
}
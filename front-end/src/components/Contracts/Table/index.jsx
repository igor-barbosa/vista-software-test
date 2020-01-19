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
import contractsActions from '../../../redux/contracts/actions';
import ContractsService from '../../../services/ContractsService';

const useStyles = makeStyles({
    tableContainer: {
        maxHeight: '440px'
    }
});

ContractsTable.propTypes =  {
    onRemove: PropTypes.func
}

ContractsTable.defaultProps =  {
    onRemove: () => null
}

export default function ContractsTable(props) {

    const contracts = useSelector(state => state.contractReducer);
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleRemove = (id, key) => async () => {

        const confirmRemove = window.confirm('Você deseja realmente remover esse contrato ?');
        if(confirmRemove){
            const resp = await ContractsService.removeContract(id);

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

    return (
        <>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="center">Imóvel</TableCell>
                            <TableCell align="center">Proprietário </TableCell>
                            <TableCell align="center">Locatário</TableCell>
                            <TableCell align="center">Início</TableCell>
                            <TableCell align="center">Fim</TableCell>
                            <TableCell align="center">Taxa de Adm.</TableCell>
                            <TableCell align="center">Aluguel</TableCell>
                            <TableCell align="center">Condomínio</TableCell>
                            <TableCell align="center">IPTU</TableCell>
                            <TableCell align="right">Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contracts.list.map((contract, key) => (
                            <TableRow key={key}>
                                <TableCell align="left">{contract.ct_id}</TableCell>
                                <TableCell align="center">{contract.ct_pro_id}</TableCell>
                                <TableCell align="center">{contract.ct_po_id}</TableCell>
                                <TableCell align="center">{contract.ct_cl_id}</TableCell>
                                <TableCell align="center">{contract.ct_start_date.split('-').reverse().join('/')}</TableCell>
                                <TableCell align="center">{contract.ct_end_date.split('-').reverse().join('/')}</TableCell>
                                <TableCell align="center">{contract.ct_administration_fee}</TableCell>
                                <TableCell align="center">{contract.ct_rent_amount}</TableCell>
                                <TableCell align="center">{contract.ct_condo_value}</TableCell>
                                <TableCell align="center">{contract.ct_IPTU}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={handleRemove(contract.ct_id, key)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {contracts.list.length === 0 && (
                            <TableRow>
                                <TableCell component="th" scope="row" colSpan={11} align="center">
                                    Nenhum registro encontrado.
                                </TableCell>
                            </TableRow>
                        )} 
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useSelector } from 'react-redux';
import { IconButton, Icon, Tooltip } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import * as PropTypes from 'prop-types'
import {Link} from 'react-router-dom';

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
                            <TableCell align="right">Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contracts.list.map((contract, key) => (
                            <TableRow key={key}>
                                <TableCell align="left">{contract.ct_id}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title={`${contract.pro_cep} - ${contract.pro_street}, ${contract.pro_number}, ${contract.pro_neighborhood}, ${contract.pro_city}, ${contract.pro_state}`}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <Icon>info</Icon> 
                                                <span style={{marginLeft: '5px'}}>
                                                {contract.pro_city}/{contract.pro_state}
                                            </span>
                                        </div>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center">{contract.po_name}</TableCell>
                                <TableCell align="center">{contract.cl_name}</TableCell>
                                <TableCell align="center">{contract.ct_start_date.split('-').reverse().join('/')}</TableCell>
                                <TableCell align="center">{contract.ct_end_date.split('-').reverse().join('/')}</TableCell>
                                <TableCell align="center">{contract.ct_administration_fee}</TableCell>
                                <TableCell align="center">{contract.ct_rent_amount}</TableCell>                                
                                <TableCell align="right">
                                    <IconButton size="small" onClick={handleRemove(contract.ct_id, key)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                    <IconButton size="small" to={`/contratos/${contract.ct_id}`} component={Link}>
                                        <Icon>keyboard_arrow_right</Icon>
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
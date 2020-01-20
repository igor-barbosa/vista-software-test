import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useSnackbar } from 'notistack';

import {Card, CardHeader, CardContent, Typography, Grid, IconButton, Icon} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ContractsService from '../../services/ContractsService';
import ContractsPaymentDialog from '../../components/Contracts/PaymentDialog';

const cardTitle = (cod) => (
    <span>
        <span>Contrato: </span>
        <span style={{color: 'red'}}>{cod}</span>
    </span>
)

export default function ContractsDetailsPage(props){


    const [state, setState] = useState({
        messages: [],
        data: null
    });
    
    const [paymentConfig, setPaymentConfig] = useState({
        key: null,
        messages: []
    });

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleOpenPaymentDialog = (key) => () =>  {
        setPaymentConfig({
            key,
            messages: []
        })
    }

    const handleClosePaymentDialog = () => {
        setPaymentConfig({
            key: null,
            messages: []
        })
    }

    const handleSavePaymentStatus = async (data) => {
        const resp = await ContractsService.savePaymentStatus(props.match.params.id, state.data.monthly_payments[paymentConfig.key].mp_order,  data);
        if(!resp.data.error){
            /**
             * APAGAR OS 2 ARQUIVOS
             */
            enqueueSnackbar('Os dados foram salvos com sucesso.', {
                variant: 'success'
            });
            let newState ={...state};
            newState.data.monthly_payments[paymentConfig.key] = {
                ...newState.data.monthly_payments[paymentConfig.key], 
                ...data
            }
            setState({
                messages: [],
                ...newState
            });
            setTimeout(() => {
                setPaymentConfig({ key: null, messages: [] });
            },100)
            
        } else {
            if(!!resp.data.data.messages) {
                setPaymentConfig({
                    ...paymentConfig,
                    messages: resp.data.data.messages
                });
            } else {
                enqueueSnackbar('Não foi possível carregar os dados.', {
                    variant: 'error'
                }); 
            }
        }
    }

    useEffect(() => {
        (async () => {
            const resp = await ContractsService.getContractById(props.match.params.id);
            if(!resp.data.error){
                setState({data: resp.data.data , messages: []});
            } else {
                if(!!resp.data.data.messages) {
                    setState({
                        ...state,
                        messages: resp.data.data.messages
                    });
                } else {
                    enqueueSnackbar('Não foi possível carregar os dados.', {
                        variant: 'error'
                    }); 
                }
            }
        })();
    }, [])

    function calculateAmountCharged(row) {
        return (parseFloat(row.mp_rent_amount) + parseFloat(row.mp_condo_value) + parseFloat(row.mp_IPTU)).toFixed(2);
    }

    function calculateRepasse(row){
        return (parseFloat(calculateAmountCharged(row)) - parseFloat(row.mp_administration_fee)).toFixed(2);
    }

    return (
        <Card>
            {!!state.data && (
                <CardHeader title={cardTitle(state.data.ct_id.padStart(4,'0'))}/>
            )}
            
            <CardContent>
                <Grid container spacing={2}>
                    
                    {state.messages.length > 0 && (
                        <Grid item xs={12} md={12}>
                            <displayMessages messages={state.messages} />
                        </Grid>
                    )}
                    {!!state.data && (
                        <>
                            <Grid item xs={12} md={12}>
                                <Typography>
                                    Imóvel
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Cod.</TableCell>
                                            <TableCell>Endereço</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>#{state.data.pro_id}</TableCell>
                                                <TableCell>{state.data.pro_cep} - {state.data.pro_street}, {state.data.pro_number}, {state.data.pro_neighborhood}, {state.data.pro_city}, {state.data.pro_state}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Locador</TableCell>
                                            <TableCell>E-mail</TableCell>
                                            <TableCell>Dia para repasse</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{state.data.po_name}</TableCell>
                                                <TableCell>{state.data.po_email}</TableCell>
                                                <TableCell style={{color: 'red'}}>{state.data.po_transfer_day}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography>
                                    Locatário
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Nome</TableCell>
                                            <TableCell>E-mail</TableCell>
                                            <TableCell>Telefone</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{state.data.cl_name}</TableCell>
                                                <TableCell>{state.data.cl_email}</TableCell>
                                                <TableCell>{state.data.cl_phone}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography>
                                    Financeiro
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Início</TableCell>
                                            <TableCell>Fim</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{state.data.ct_start_date.split('-').reverse().join('/')}</TableCell>
                                                <TableCell>{state.data.ct_end_date.split('-').reverse().join('/')}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} md={9}>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Aluguel</TableCell>
                                            <TableCell>Condomínio</TableCell>
                                            <TableCell>IPTU</TableCell>
                                            <TableCell>Taxa de Adm</TableCell>                                    
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{state.data.ct_rent_amount}</TableCell>
                                                <TableCell>{state.data.ct_condo_value}</TableCell>
                                                <TableCell>{state.data.ct_IPTU}</TableCell>
                                                <TableCell>{state.data.ct_administration_fee}%</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>                                        
                            <Grid item xs={12} md={12}>
                                
                                <TableContainer component={Paper}>
                                    <Table size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" colSpan={9}>
                                                    <Typography>
                                                        Mensalidades
                                                    </Typography>    
                                                </TableCell>                                                        
                                            </TableRow>
                                        </TableHead>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Parc.</TableCell>                                                    
                                                <TableCell align="center">Vencimento</TableCell>                                                    
                                                <TableCell align="center">Aluguel</TableCell>                                                    
                                                <TableCell align="center">Condomínio</TableCell>                                                    
                                                <TableCell align="center">IPTU</TableCell>   
                                                <TableCell align="center">Cobrança</TableCell>       
                                                <TableCell align="center">Repasse</TableCell>
                                                <TableCell align="center">Taxa de Adm.</TableCell>                                                    
                                                <TableCell align="right">Opções</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {state.data.monthly_payments.map((row, key) => (
                                            <TableRow key={row.mp_order}>                                                
                                                <TableCell align="center">{row.mp_order}/{state.data.monthly_payments.length}</TableCell>
                                                <TableCell align="center">{row.mp_date.split('-').reverse().join('/')}</TableCell>
                                                <TableCell align="center">{row.mp_rent_amount}</TableCell>
                                                <TableCell align="center">{row.mp_condo_value}</TableCell>
                                                <TableCell align="center">{row.mp_IPTU}</TableCell>
                                                <TableCell align="center">{calculateAmountCharged(row)}</TableCell>       
                                                <TableCell align="center">{calculateRepasse(row)}</TableCell>
                                                <TableCell align="center">{row.mp_administration_fee}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" onClick={handleOpenPaymentDialog(key)}>
                                                        <Icon>settings</Icon>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>   
                        </>
                    )}
                </Grid>
            </CardContent>
            {paymentConfig.key !== null && (
                <ContractsPaymentDialog 
                    open 
                    contract={state.data} 
                    monthlyPayment={state.data.monthly_payments[paymentConfig.key]}
                    onClose={handleClosePaymentDialog} 
                    messages={paymentConfig.messages}
                    onSave={handleSavePaymentStatus}
                />
            )}
            
        </Card>
    )
}
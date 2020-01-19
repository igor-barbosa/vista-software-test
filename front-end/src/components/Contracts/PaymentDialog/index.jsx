import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as PropTypes from 'prop-types';
import ClientForm from '.';
import { Card, CardHeader, CardContent, Grid, IconButton, Icon, makeStyles, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, TextField, MenuItem} from '@material-ui/core';
import CustomMessages from '../../Custom/Messages';


ContractsPaymentDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    messages: PropTypes.array,
    contract: PropTypes.object,
    monthlyPayment: PropTypes.object,
    onSave: PropTypes.func
}

ContractsPaymentDialog.defaultProps = {
    open: false,
    onClose: () => null,
    contract: null,
    monthlyPayment: null,
    messages: [],
    onSave: () => null
}

export default function ContractsPaymentDialog(props) {

  const [paymentStates, setPaymentStates] = useState({
    mp_payment_done: null,
    mp_transfer_done: null
  });

  useEffect(() => {
    setPaymentStates({
      mp_payment_done: props.monthlyPayment.mp_payment_done,
      mp_transfer_done: props.monthlyPayment.mp_transfer_done
    })
  }, []);


  const handleChangePaymentStatus = (event) => {
    let newState = {...paymentStates};
    newState[event.target.name] = event.target.value;
    setPaymentStates(newState);
  }
  
  const handleSave = () => {
    props.onSave(paymentStates);
  }
  return (    
      <Dialog
        open={props.open}
        onClose={props.onClose}
        maxWidth="lg"
      >  
        <Card>
          <CardHeader title={`Mensalidade ${props.monthlyPayment.mp_order}/${props.contract.monthly_payments.length}`}/>
          <CardContent>
              <Grid container spacing={2}>
                {props.messages.length && (
                  <Grid item xs={12} md={12}>
                    <CustomMessages messages={props.messages}/>
                  </Grid>
                )}
                <Grid item xs={12} md={12}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                          <TableRow>
                              <TableCell>Aluguel</TableCell>
                              <TableCell>Condomínio</TableCell>
                              <TableCell>IPTU</TableCell>
                              <TableCell>Taxa de Adm.</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{props.monthlyPayment.mp_rent_amount}</TableCell>
                                <TableCell>{props.monthlyPayment.mp_condo_value}</TableCell>
                                <TableCell>{props.monthlyPayment.mp_IPTU}</TableCell>
                                <TableCell>{props.monthlyPayment.mp_administration_fee}</TableCell>
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
                                <TableCell>Cobrança</TableCell>
                                <TableCell>Vencimento</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>1500.00</TableCell>
                                  <TableCell>{props.monthlyPayment.mp_date.split('-').reverse().join('/')}</TableCell>
                                  <TableCell>
                                    <TextField select value={`${paymentStates.mp_payment_done}`} size="small" name="mp_payment_done" onChange={handleChangePaymentStatus}>
                                      <MenuItem value="0">Pendente</MenuItem>
                                      <MenuItem value="1">Pago</MenuItem>
                                    </TextField>
                                  </TableCell>
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
                                <TableCell>Repasse</TableCell>
                                <TableCell>Dia</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>1290.00</TableCell>
                                  <TableCell>{props.contract.po_transfer_day}</TableCell>
                                  <TableCell>
                                    <TextField select value={`${paymentStates.mp_transfer_done}`} size="small" name="mp_transfer_done" onChange={handleChangePaymentStatus}>
                                      <MenuItem value="0">Pendente</MenuItem>
                                      <MenuItem value="1">Realizado</MenuItem>
                                    </TextField>
                                  </TableCell>
                              </TableRow>
                          </TableBody>
                      </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
                    Salvar Dados
                  </Button>
                </Grid>
              </Grid>
          </CardContent>
        </Card>
      </Dialog>
  );
}
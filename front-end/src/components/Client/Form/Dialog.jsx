import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as PropTypes from 'prop-types';
import ClientForm from '.';
import { Grid, IconButton, Icon, makeStyles} from '@material-ui/core';

ClientFormDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func,
    messages: PropTypes.array,
}


ClientFormDialog.defaultProps = {
    open: false,
    onClose: () => null,
    initialValues: null,
    onSubmit: () => null,
    messages: [],
}

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  }
}))

export default function ClientFormDialog(props) {
  
  const classes = useStyles();

  return (    
      <Dialog
        open={props.open}
        onClose={props.onClose}
        maxWidth="xs"
      >  
          {props.initialValues && (
            <ClientForm 
              headerActions={(
                <IconButton aria-label="close" onClick={props.onClose} size="small">
                  <Icon>close</Icon>
                </IconButton>
              )}
              title="Editar Cliente"
              messages={props.messages}
              initialValues={props.initialValues}
              onSubmit={props.onSubmit}
              fieldsFullWidth={true}
            />
          ) || ''}
      </Dialog>
  );
}
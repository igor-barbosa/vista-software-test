import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import * as PropTypes from 'prop-types';
import { IconButton, Icon, makeStyles} from '@material-ui/core';
import PropertiesForm from './../Form';

PropertiesFormDialog.propTypes = {
    ...PropertiesForm.propTypes,
    open: PropTypes.bool,
    onClose: PropTypes.func
}


PropertiesFormDialog.defaultProps = {
    open: false,
    onClose: () => null,
    ...PropertiesForm.defaultProps,
}

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  }
}))

export default function PropertiesFormDialog(properties) {
  
  const classes = useStyles();

  const {open, onClose, ...props} = properties;

  return (    
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
      >  
          {props.initialValues && (
            <PropertiesForm 
              {...props}
              headerActions={(
                <IconButton aria-label="close" onClick={onClose} size="small">
                  <Icon>close</Icon>
                </IconButton>
              )}
              title="Editar Imóvel"              
              fieldsFullWidth={true}
            />
          ) || ''}
      </Dialog>
  );
}
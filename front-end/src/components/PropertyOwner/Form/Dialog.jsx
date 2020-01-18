import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import * as PropTypes from 'prop-types';
import { IconButton, Icon, makeStyles} from '@material-ui/core';
import PropertyOwnerForm from './../Form';

PropertyOwnerFormDialog.propTypes = {
    ...PropertyOwnerForm.propTypes,
    open: PropTypes.bool,
    onClose: PropTypes.func
}


PropertyOwnerFormDialog.defaultProps = {
    open: false,
    onClose: () => null,
    ...PropertyOwnerForm.defaultProps,
}

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  }
}))

export default function PropertyOwnerFormDialog(properties) {
  
  const classes = useStyles();

  const {open, onClose, ...props} = properties;

  return (    
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
      >  
          {props.initialValues && (
            <PropertyOwnerForm 
              {...props}
              headerActions={(
                <IconButton aria-label="close" onClick={onClose} size="small">
                  <Icon>close</Icon>
                </IconButton>
              )}
              title="Editar Proprietário"              
              fieldsFullWidth={true}
            />
          ) || ''}
      </Dialog>
  );
}
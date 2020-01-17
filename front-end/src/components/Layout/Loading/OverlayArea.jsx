import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from "@material-ui/core";
import clsx from 'clsx';

// First way to import
import { HashLoader } from 'react-spinners';


LayoutLoadingOverlayArea.propTypes = {
    backgroundColor: PropTypes.string,
    loading: PropTypes.bool.isRequired,
};

LayoutLoadingOverlayArea.propTypes = {
    loading: PropTypes.bool
}

LayoutLoadingOverlayArea.defaultProps = {
    loading: false,
    backgroundColor: 'rgba(255, 255, 255, 0.59)',
    loadingColor: '#7e91f9'
}

function LayoutLoadingOverlayArea(props) {
    const classes = useStyles();
    const styles = {
        backgroundColor: props.backgroundColor
    };

    return (
        <div style={{position: 'relative'}}>
            <div className={clsx(classes.root, {[classes.inProgress]: props.loading})} style={styles}>
                <HashLoader
                    sizeUnit={"px"}
                    size={50}
                    color={props.loadingColor}
                    loading={props.loading}
                />
            </div>
            {props.children}
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'none'
    },
    inProgress: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    }
}));

export default LayoutLoadingOverlayArea;
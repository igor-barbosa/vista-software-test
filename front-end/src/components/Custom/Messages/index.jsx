import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        border: '1px solid #de9191',
        background: '#f3e5e5',
        padding: '10px',
        borderRadius: '6px',
        color:'#bd4040',
        marginBottom: '15px',
        fontSize: '12px'
    }
})

export default function CustomMessages(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <ul>
                {props.messages.map((message, key) => (
                    <li key={key}>
                        {message}
                    </li>
                ))}
            </ul>
        </div>
    );
}

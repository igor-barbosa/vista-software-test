import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import LayoutAdmin from '../components/Layout/Admin';
import HomePage from './Home';


export default function Routes(){
    return (
        <Router>    
            <LayoutAdmin>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                </Switch>
            </LayoutAdmin>
        </Router>
    );
}
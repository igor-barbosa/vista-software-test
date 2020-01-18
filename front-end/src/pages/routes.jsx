import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import LayoutAdmin from '../components/Layout/Admin';
import HomePage from './Home';
import ClientsManagementPage from './Clients/ManagementPage';


export default function Routes(){
    return (
        <Router>    
            <LayoutAdmin>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route exact path="/clientes" component={ClientsManagementPage}/>
                </Switch>
            </LayoutAdmin>
        </Router>
    );
}
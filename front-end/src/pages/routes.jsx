import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import LayoutAdmin from '../components/Layout/Admin';
import HomePage from './Home';
import ClientsManagementPage from './Clients/ManagementPage';
import PropertyOwnerManagementPage from './PropertyOwner/ManagementPage';


export default function Routes(){
    return (
        <Router>    
            <LayoutAdmin>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route exact path="/clientes" component={ClientsManagementPage}/>
                    <Route exact path="/proprietarios" component={PropertyOwnerManagementPage}/>
                </Switch>
            </LayoutAdmin>
        </Router>
    );
}
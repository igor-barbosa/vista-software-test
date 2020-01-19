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
import PropertiesManagementPage from './Properties/ManagementPage';
import ContractsManagementPage from './Contracts/ManagementPage';
import ContractsDetailsPage from './Contracts/DetailsPage';


export default function Routes(){
    return (
        <Router>    
            <LayoutAdmin>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route exact path="/clientes" component={ClientsManagementPage}/>
                    <Route exact path="/proprietarios" component={PropertyOwnerManagementPage}/>
                    <Route exact path="/imoveis" component={PropertiesManagementPage}/>
                    <Route exact path="/contratos" component={ContractsManagementPage}/>
                    <Route exact path="/contratos/:id" component={ContractsDetailsPage}/>
                </Switch>
            </LayoutAdmin>
        </Router>
    );
}
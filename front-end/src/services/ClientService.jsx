import axios from 'axios';
import { enviroments } from '../enviroments';
import Helpers from '../helpers';

export default class ClientService {

    static async saveClient(data) {
        return axios.post(`${enviroments.baseUrlApi}/api/clients/create.php`, Helpers.serializeFormData(data));        
    }

    static async getClients() {
        return axios.get(`${enviroments.baseUrlApi}/api/clients/list.php`);        
    }

    static async removeClient(id){
        return axios.get(`${enviroments.baseUrlApi}/api/clients/remove.php?id=${id}`);
    }

    static async editClient(id, data){
        return axios.post(`${enviroments.baseUrlApi}/api/clients/edit.php?id=${id}`, Helpers.serializeFormData(data));
    }

}
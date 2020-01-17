import axios from 'axios';
import { enviroments } from '../enviroments';
import Helpers from '../helpers';

export default class ClientService {

    static async saveClient(data) {
        return axios.post(`${enviroments.baseUrlApi}/api/clients/create.php`, Helpers.serializeFormData(data));        
    }
}
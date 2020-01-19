import axios from 'axios';
import { enviroments } from '../enviroments';
import Helpers from '../helpers';

export default class ContractsService {

    static async saveContract(data) {
        return axios.post(`${enviroments.baseUrlApi}/api/contracts/create.php`, Helpers.serializeFormData(data));        
    }

    static async getContracts() {
        return axios.get(`${enviroments.baseUrlApi}/api/contracts/list.php`);        
    }

    static async removeContract(id){
        return axios.get(`${enviroments.baseUrlApi}/api/contracts/remove.php?id=${id}`);
    }

    static async calculateMonthlyPayments(data){
        return axios.post(`${enviroments.baseUrlApi}/api/contracts/calculate-monthly-payments.php`, Helpers.serializeFormData(data));
    }

    

}
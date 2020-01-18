import axios from 'axios';
import { enviroments } from '../enviroments';
import Helpers from '../helpers';

export default class PropertiesService {

    static async saveProperty(data) {
        return axios.post(`${enviroments.baseUrlApi}/api/properties/create.php`, Helpers.serializeFormData(data));        
    }

    static async getProperties() {
        return axios.get(`${enviroments.baseUrlApi}/api/properties/list.php`);        
    }

    static async removeProperty(id){
        return axios.get(`${enviroments.baseUrlApi}/api/properties/remove.php?id=${id}`);
    }

    static async editProperty(id, data){
        return axios.post(`${enviroments.baseUrlApi}/api/properties/edit.php?id=${id}`, Helpers.serializeFormData(data));
    }

}
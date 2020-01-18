import axios from 'axios';
import { enviroments } from '../enviroments';
import Helpers from '../helpers';

export default class PropertyOwnerService {

    static async savePropertyOwner(data) {
        return axios.post(`${enviroments.baseUrlApi}/api/property-owner/create.php`, Helpers.serializeFormData(data));        
    }

    static async getPropertyOwners() {
        return axios.get(`${enviroments.baseUrlApi}/api/property-owner/list.php`);        
    }

    static async removePropertyOwner(id){
        return axios.get(`${enviroments.baseUrlApi}/api/property-owner/remove.php?id=${id}`);
    }

    static async editPropertyOwner(id, data){
        return axios.post(`${enviroments.baseUrlApi}/api/property-owner/edit.php?id=${id}`, Helpers.serializeFormData(data));
    }

}
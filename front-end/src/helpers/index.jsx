export default class Helpers {

    static serializeFormData(obj){
        const f = new FormData();
        for(const key of Object.keys(obj)){
            f.append(key, obj[key])
        }

        return f;
    }

    static convertToMoney(data){
        return parseFloat(data).toLocaleString('pt-BR',{ style: 'currency', currency: 'BRL' });
    }
    
}
export default class Helpers {

    static serializeFormData(obj){
        const f = new FormData();
        for(const key of Object.keys(obj)){
            f.append(key, obj[key])
        }

        return f;
    }

    static convertToMoney(data){
        if(data === '0' || !data) return 'R$ 0,00';
        else {
            return parseFloat(data).toLocaleString('pt-BR',{ style: 'currency', currency: 'BRL' });
        }
    }
    
}
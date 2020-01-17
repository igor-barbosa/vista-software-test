export default class Helpers {

    static serializeFormData(obj){
        const f = new FormData();
        for(const key of Object.keys(obj)){
            f.append(key, obj[key])
        }

        return f;
    }
    
}
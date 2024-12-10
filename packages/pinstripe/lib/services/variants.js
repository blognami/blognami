
let variants;

export const client = {
    create(){
        if(!variants){
            variants = fetch('/_shell/variants.json').then(response => response.json())
        }
        return variants;
    }
};

export default {
    create(){
        return [];
    }
};

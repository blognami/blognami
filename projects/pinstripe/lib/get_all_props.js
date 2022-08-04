
export const getAllProps = (o, out = []) => {
    Object.getOwnPropertyNames(o).forEach(name => {
        if(!out.includes(name)){
            out.push(name);
        }
    });
    if(o.__proto__){
        getAllProps(o.__proto__, out);
    }
    return out;
};

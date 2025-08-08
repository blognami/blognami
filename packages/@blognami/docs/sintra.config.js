
const environment = process.env.NODE_ENV || 'development';

let database;
if(environment == 'production'){
    database = {
        adapter: 'mysql',
        host: 'localhost',
        user: 'root',
        password: '',
        database: `blognami/docs_${environment}`
    };
} else {
    database = {
        adapter: 'sqlite',
        filename: `${environment}.db`
    };
}

let mail;
if(environment == 'production'){
    mail = {
        adapter: 'smtp',
        host: "smtp.example.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "username",
            pass: "password",
        }
    };
} else {
    mail = {
        adapter: 'dummy'
    };
}

export default {
    database,
    mail,
    salt: 'a1b48514-f828-4d3d-845d-184c642c9e5a'
};
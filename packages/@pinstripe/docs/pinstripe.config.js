
const environment = process.env.NODE_ENV || 'development';

let database;
if(environment == 'production'){
    database = {
        adapter: 'mysql',
        host: 'localhost',
        user: 'root',
        password: '',
        database: `pinstripe/docs_${environment}`
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
    salt: '57ec57a7-eef6-48c1-b071-16b6294752d9'
};
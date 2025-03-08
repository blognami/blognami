
const environment = process.env.NODE_ENV || 'development';

let database;
if(environment == 'production'){
    database = {
        adapter: 'mysql',
        host: 'localhost',
        user: 'root',
        password: '',
        database: `blognami/stripe_${environment}`
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
    salt: 'fd749267-0c2f-4f3c-84a7-079485c0552f'
};

const environment = process.env.NODE_ENV || 'development';

let database;
if(environment == 'production'){
    database = {
        adapter: 'mysql',
        host: 'localhost',
        user: 'root',
        password: '',
        database: `blognami_com_${environment}`
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
    salt: 'b7953e9f-db3e-4eae-8030-847619095372'
};
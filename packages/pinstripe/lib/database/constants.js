
export const TYPE_TO_MYSQL_COLUMN_TYPE_MAP = {
    primary_key: "int(11) unsigned",
    alternate_key: "binary(16)",
    foreign_key: "binary(16)",
    binary: "longblob",
    boolean: "enum('false','true')",
    date: "date",
    datetime: "datetime",
    decimal: "decimal",
    float: "float",
    integer: "int(11)",
    string: "varchar(255)",
    text: "longtext",
    time: "time",
    timestamp: "datetime"
};

export const TYPE_TO_DEFAULT_VALUE_MAP = {
    boolean: false,
    decimal: 0,
    float: 0,
    integer: 0,
    string: ''
};

export const MYSQL_COLUMN_TYPE_TO_TYPE_MAP = (() => {
    const out = {};
    Object.keys(TYPE_TO_MYSQL_COLUMN_TYPE_MAP).forEach(
        key => out[TYPE_TO_MYSQL_COLUMN_TYPE_MAP[key]] = key
    );
    return out;
})();


export const COMPARISON_OPERATORS = {
    Eq: (column, value) => column.sql`${column} = ${value}`,
    Ne: (column, value) => column.sql`${column} != ${value}`,
    Lt: (column, value) => column.sql`${column} < ${value}`,
    Gt: (column, value) => column.sql`${column} > ${value}`,
    Le: (column, value) => column.sql`${column} <= ${value}`,
    Ge: (column, value) => column.sql`${column} >= ${value}`,
    BeginsWith: (column, value) => column.sql`${column} like concat(${value}, '%')`,
    EndsWith: (column, value) => column.sql`${column} like concat('%', ${value})`,
    Contains: (column, value) => column.sql`${column} like concat('%', ${value}, '%')`
};

export const KEY_COMPARISON_OPERATORS = {
    Eq: (column, value) => column.sql`${column} = uuid_to_bin(${value})`,
    Ne: (column, value) => column.sql`${column} != uuid_to_bin(${value})`
};

export const COMPARISON_OPERATOR_METHOD_PATTERN = new RegExp(`^(.+)(${Object.keys(COMPARISON_OPERATORS).join('|')})$`);
export const KEY_COMPARISON_OPERATOR_METHOD_PATTERN = new RegExp(`^(id|.+Id)(${Object.keys(KEY_COMPARISON_OPERATORS).join('|')})$`);

export const COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP = {
    primary_key: "hidden",
    alternate_key: "hidden",
    foreign_key: "hidden",
    binary: "file",
    boolean: "checkbox",
    date: "date",
    datetime: "datetime-local",
    decimal: "number",
    float: "number",
    integer: "number",
    string: "text",
    text: "textarea",
    time: "datetime-local",
    timestamp: "datetime-local"
};


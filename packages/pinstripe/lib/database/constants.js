

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
};

export const MYSQL_COLUMN_TYPE_TO_TYPE_MAP = (() => {
    const out = {};
    Object.keys(TYPE_TO_MYSQL_COLUMN_TYPE_MAP).forEach(
        key => out[TYPE_TO_MYSQL_COLUMN_TYPE_MAP[key]] = key
    );
    return out;
})();

export const TYPE_TO_SQLITE_COLUMN_TYPE_MAP = {
    primary_key: "integer",
    alternate_key: "varchar",
    foreign_key: "varchar",
    binary: "blob",
    boolean: "boolean",
    date: "date",
    datetime: "datetime",
    decimal: "decimal",
    float: "float",
    integer: "integer",
    string: "varchar",
    text: "text",
};

export const SQLITE_COLUMN_TYPE_TO_TYPE_MAP = (() => {
    const out = {};
    Object.keys(TYPE_TO_SQLITE_COLUMN_TYPE_MAP).forEach(
        key => out[TYPE_TO_SQLITE_COLUMN_TYPE_MAP[key]] = key
    );
    return out;
})();

export const COMPARISON_OPERATORS = {
    '': '? = ?',
    Ne: '? != ?',
    Lt: '? < ?',
    Gt: '? > ?',
    Le: '? <= ?',
    Ge: '? >= ?',
    BeginsWith: `? like concat(?, '%')`,
    EndsWith: `? like concat('%', ?)`,
    Contains: `? like concat('%', ?, '%')`
};

export const MYSQL_KEY_COMPARISON_OPERATORS = {
    '': '? = uuid_to_bin(?)',
    Ne: '? != uuid_to_bin(?)'
};

export const TYPE_TO_DEFAULT_VALUE_MAP = {
    boolean: 'false',
    decimal: 0,
    float: 0,
    integer: 0,
    string: ''
};

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
};

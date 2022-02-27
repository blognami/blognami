
export const ALLOWED_TABLE_ADAPTER_COLUMN_TYPES = [
    'boolean',
    'date',
    'datetime',
    'decimal',
    'float',
    'integer',
    'string',
    'time',
    'timestamp'
];

export const TYPE_TO_DEFAULT_VALUE_MAP = {
    boolean: false,
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
    time: "datetime-local",
    timestamp: "datetime-local"
};

export const RESERVED_WORDS = [
    'adapter',
    'column',
    'database',
    'environment',
    'table'
];

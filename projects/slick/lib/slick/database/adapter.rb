
require "slick/registry"

class Slick::Database::Adapter
    class << self
        include Slick::Registry
    end

    attr_reader :config

    def initialize(config)
        @config = config
    end
    
    TYPE_TO_MYSQL_COLUMN_TYPE_MAP = {
        "primary_key" => "int(11) unsigned",
        "alternate_key" => "binary(16)",
        "foreign_key" => "binary(16)",
        "binary" => "longblob",
        "boolean" => "enum('false','true')",
        "date" => "date",
        "time" => "datetime",
        "decimal" => "decimal",
        "float" => "float",
        "integer" => "int(11)",
        "string" => "varchar(255)",
        "text" => "longtext",
    }

    MYSQL_COLUMN_TYPE_TO_TYPE_MAP = TYPE_TO_MYSQL_COLUMN_TYPE_MAP.invert

    MYSQL_COMPARISON_OPERATORS = {
        'eq' => '? = ?',
        'ne' => '? != ?',
        'lt' => '? < ?',
        'gt' => '? > ?',
        'le' => '? <= ?',
        'ge' => '? >= ?',
        'begins_with' => '? like concat(?, '%')',
        'ends_with' => '? like concat('%', ?)',
        'contains' => '? like concat('%', ?, '%')'
    }

    MYSQL_KEY_COMPARISON_OPERATORS = {
        'eq' => '? = uuid_to_bin(?)',
        'ne' => '? != uuid_to_bin(?)',
    }

    MYSQL_COMPARISON_OPERATOR_METHOD_PATTERN = Regexp.new("\\A(.+)_(#{MYSQL_COMPARISON_OPERATORS.keys.join('|')})\\z")
    MYSQL_KEY_COMPARISON_OPERATOR_METHOD_PATTERN = Regexp.new("\\A(id|.+_id)_(#{MYSQL_KEY_COMPARISON_OPERATORS.keys.join('|')})\\z")

    TYPE_TO_DEFAULT_VALUE_MAP = {
        "boolean" => "false",
        "decimal" => 0,
        "float" => 0,
        "integer" => 0,
        "string" => ''
    }

    TYPE_TO_SQLITE_COLUMN_TYPE_MAP = {
        "primary_key" => "integer",
        "alternate_key" => "varchar",
        "foreign_key" => "varchar",
        "binary" => "blob",
        "boolean" => "boolean",
        "date" => "date",
        "time" => "datetime",
        "decimal" => "decimal",
        "float" => "float",
        "integer" => "integer",
        "string" => "varchar",
        "text" => "text",
    }
    
    SQLITE_COLUMN_TYPE_TO_TYPE_MAP = TYPE_TO_SQLITE_COLUMN_TYPE_MAP.invert
    
    SQLITE_COMPARISON_OPERATORS = {
        'eq' => '? = ?',
        'ne' => '? != ?',
        'lt' => '? < ?',
        'gt' => '? > ?',
        'le' => '? <= ?',
        'ge' => '? >= ?',
        'begins_with' => '? like concat(?, '%')',
        'ends_with' => '? like concat('%', ?)',
        'contains' => '? like concat('%', ?, '%')'
    }
    
    SQLITE_KEY_COMPARISON_OPERATORS = {
        'eq' => '? = ?',
        'ne' => '? != ?',
    }
    
    SQLITE_COMPARISON_OPERATOR_METHOD_PATTERN = Regexp.new("\\A(.+)_(#{SQLITE_COMPARISON_OPERATORS.keys.join('|')})\\z")
    SQLITE_KEY_COMPARISON_OPERATOR_METHOD_PATTERN = Regexp.new("\\A(id|.+_id)_(#{SQLITE_KEY_COMPARISON_OPERATORS.keys.join('|')})\\z")

end

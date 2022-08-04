
require "slick/database/adaptable"

class Slick::Database::Column

    class << self
        include Slick::Database::Adaptable
    end

    _define_adapter_methods :column

    deligate_to_adapter :create, :drop    

    attr_reader :name

    def initialize(table, name, type = nil)
        @table = table
        @name = name
        @type = type
    end

    def type
        @type ||= @table.send(@name).instance_variable_get(:@type)
    end

    def exist?
        !type.nil?
    end

    def _adapter
        @_adapter ||= @table.database.send(:_adapter)
    end

end

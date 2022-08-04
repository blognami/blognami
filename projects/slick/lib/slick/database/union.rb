
require "slick/registry"
require "slick/database/adaptable"

class Slick::Database::Union

    class << self

        include Slick::Registry
        include Slick::Database::Adaptable

        def register(name, *args, &block)
            out = super
            Slick::Helper.register(name).define_method "call" do |*args, &block|
                database.send(self.class.name, *args, &block)
            end
            out
        end

        def table_classes
            @table_classes ||= []
        end

    end

    _define_adapter_methods :union

    deligate_to_adapter :_generate_select_sql

    attr_reader :database

    def initialize(database, collections = nil)
        @database = database
        @tables = []
        (collections || self.class.table_classes.map{|table_class| table_class.new(@database)}).each do |table|
            if table.kind_of?(Slick::Database::Union)
                @tables.concat(table.instance_variable_get(:@tables))
            elsif table.kind_of?(Slick::Database::Table)
                @tables << table
            end
        end
        @order_by_sql = []
        @skip_count = 0
    end

    def +(collection)
        Slick::Database::Union.new(@database, @tables.clone.push(collection))
    end

    def order_by(column, direction = 'asc')
        out = clone
        if @order_by_sql.count > 0
            @order_by_sql << [", ? #{direction.to_s == 'desc' ? 'desc' : 'asc'}", column]
        else
            @order_by_sql << ["? #{direction.to_s == 'desc' ? 'desc' : 'asc'}", column]
        end
        out
    end

    def paginate(page = 1, page_size = 10)
        out = clone
        out.instance_eval do
            @page = page
            @page_size = page_size
        end
        out
    end

    def clear_pagination
        out = clone
        out.instance_eval do
            @page = nil
            @page_size = nil
        end
        out
    end

    def skip(skip_count)
        out = clone
        out.instance_eval do
            @skip_count = skip_count
        end
        out
    end

    def count(options = {})
        @database.run(_generate_select_sql({ select: "count(*)" }.merge(options)), options).pop.values.pop
    end

    def all(options = {})
        @database.run(_generate_select_sql(options), options)
    end

    def first
        paginate(1, 1).all.first
    end

    def each(options = {}, &block)
        @database.run(_generate_select_sql(options), options).each(&block)
    end

    def explain(options = {})
        @database.send(:_prepare, _generate_select_sql(options))
    end

    def inspect
        all
    end

    def method_missing(*args, &block)
        out = clone
        out.instance_eval{ @tables = @tables.map{|table| table.send(*args, &block)} }
        out
    end

    private

    def _column_names
        @_column_names ||= begin
            out = []
            @tables.each do |table|
                table.columns.keys.each do |column_name|
                    out << column_name if !out.include?(table)
                end
            end
            out
        end
    end

    def _adapter
        @_adapter ||= database.send(:_adapter)
    end

end

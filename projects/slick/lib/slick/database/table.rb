

require "slick/registry"
require "slick/database/adaptable"
require "slick/helper"

class Slick::Database::Table

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

        def relationships
            @relationships ||= {}
        end

        def has_many(name, options = {})
            name = name.to_s

            relationships[name] = {
                name: name.to_s,
                collection_name: name.to_s,
                from_key: "id",
                to_key: "#{self.name.singularize}_id",
                cascade_delete: true
            }
            
            relationships[name].merge!(options)

            relationships[name][:cascade_delete] = false if !relationships[name][:through].nil?

            class_eval("def #{name}; _join('#{name}'); end")
        end

        def has_one(name, options = {})
            name = name.to_s

            relationships[name] = {
                name: name.to_s,
                collection_name: name.pluralize,
                from_key: "id",
                to_key: "#{self.name.singularize}_id",
                cascade_delete: true
            }
            relationships[name].merge!(options)
            class_eval("def #{name}; _join('#{name}'); end")
        end

        def belongs_to(name, options = {})
            name = name.to_s

            relationships[name] = {
                name: name.to_s,
                collection_name: name.pluralize,
                from_key: "#{name}_id",
                to_key: "id",
                cascade_delete: false
            }
            relationships[name].merge!(options)
            class_eval("def #{name}; _join('#{name}'); end")
        end

    end

    _define_adapter_methods :table

    deligate_to_adapter :columns, :create, :drop, :method_missing, :_generate_select_sql

    attr_reader :database

    def initialize(database, join_parent = nil)
        @database = database
        @join_parent = join_parent
        @alias_counters = {} if !@join_parent
        @alias = _generate_alias(self.class.name)

        if !@join_parent
            @from_sql = ['? as ?', self.class.name.to_sym, @alias.to_sym]
            @where_sql = []
            @order_by_sql = []
            @skip_count = 0
        end
    end

    def +(collection)
        Slick::Database::Union.new(@database, [clone, collection])
    end

    def clone
        out = super
        out.instance_eval do
            instance_variables.each do |name|
                if name.match(/\A@_/)
                    remove_instance_variable(name)
                elsif name != :@database
                    instance_variable_set(name, instance_variable_get(name).clone)
                end
            end
        end
        out
    end

    def back(count = 1)
        out = self
        count.times{ out = out.instance_variable_get(:@join_parent) }
        out
    end

    def where(*predicate, &block)
        if block
            join_path = []
            current = self
            block.arity.times do
                join_path << current
                current = current.instance_eval{ @join_parent } if current
            end
            predicate << block.call(*join_path)
        end
        out = clone
        where_sql = out.send(:_join_root).instance_variable_get(:@where_sql)
        if where_sql.count > 0
            where_sql << ['and', predicate]
        else
            where_sql << predicate
        end
        out
    end

    def order_by(column, direction = 'asc')
        out = clone
        column = out.send(column.to_s) if !column.kind_of?(Slick::Database::Column)
        order_by_sql = out.send(:_join_root).instance_variable_get(:@order_by_sql)
        if order_by_sql.count > 0
            order_by_sql << [", ? #{direction.to_s == 'desc' ? 'desc' : 'asc'}", column]
        else
            order_by_sql << ["? #{direction.to_s == 'desc' ? 'desc' : 'asc'}", column]
        end
        out
    end

    def clear_order_by
        out = clone
        out.send(:_join_root).instance_variable_set(:@order_by_sql, [])
        out
    end

    def paginate(page = 1, page_size = 10)
        out = clone
        out.send(:_join_root).instance_eval do
            @page = page.to_i
            @page_size = page_size.to_i
        end
        out
    end

    def clear_pagination
        out = clone
        out.send(:_join_root).instance_eval do
            @page = nil
            @page_size = nil
        end
        out
    end

    def skip(skip_count)
        out = clone
        out.send(:_join_root).instance_eval do
            @skip_count = skip_count
        end
        out
    end

    def all(options = {})
        @database.run(_generate_select_sql(options), options)
    end

    def each(options = {}, &block)
        @database.run(_generate_select_sql(options), options).each(&block)
    end

    def first(options = {})
        clone.paginate(1, 1).all(options).pop
    end

    def [](id)
        clone.id_eq(id).first
    end

    def count(options = {})
        first(options.merge(select: ['count(distinct ?)', id])).values.pop
    end

    def explain(options = {})
        @database.send(:_prepare, _generate_select_sql(options))
    end

    def inspect
        all
    end

    def insert(fields = {}, &block)
        Slick::Database::Row.create(self.class.name.singularize, @database).update(fields, &block)
    end

    def update(fields = {}, &block)
        @database.transaction do
            each{|row| row.update(fields, &block)}
        end
        self
    end

    def delete
        @database.transaction do
            each{|row| row.delete}
        end
        self
    end
    
    def exist?
        @database.tables.keys.include?(self.class.name)
    end
    
    def add_column(name, *args)
        send(name).create(*args)
    end

    def remove_column(name)
        send(name).drop
    end

    COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP = {
        "primary_key" => "hidden",
        "alternate_key" => "hidden",
        "foreign_key" => "hidden",
        "binary" => "file",
        "boolean" => "checkbox",
        "date" => "date",
        "time" => "datetime-local",
        "decimal" => "number",
        "float" => "number",
        "integer" => "number",
        "string" => "text",
        "text" => "textarea",
    }

    def to_form_adapter
        Class.new do
            def initialize(table)
                @table = table
            end

            def title
                "Add #{@table.class.name.singularize}"
            end

            def fields
                @fields ||= begin
                    out = [];
                    @table.columns.values.each do |column|
                        out << {
                            name: column.name,
                            type: COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP[column.type]
                        }
                    end
                    out
                end
                
            end

            def submit_title
                title
            end

            def cancel_title
                "Cancel"
            end

            def unsaved_changes_confirm
                "There are unsaved changes are you sure you want to close?"
            end

            def submit(values, &block)
                block.call(@table.insert(values))
            end
        end.new(self)
    end

    private

    def _join(relationship_name)
        relationship = self.class.relationships[relationship_name]

        if relationship[:through]
            out = self
            relationship[:through].each do |relationship|
                out = out.send(relationship)
            end
            out
        elsif Slick::Database::Union.registered_classes[relationship[:collection_name]]
            _join_to_union(relationship)
        else
            _join_to_table(relationship)
        end
    end

    def _join_to_union(relationship)
        union_class = Slick::Database::Union.registered_classes[relationship[:collection_name]]
        tables = union_class.table_classes.map do |table_class|
            join_parent = clone
            out = table_class.new(@database, join_parent)
            out.send(:_join_root).instance_eval do
                @from_sql << [', ? as ?', out.class.name.to_sym, out.instance_variable_get(:@alias).to_sym]
                @where_sql << ["#{@where_sql.count > 0 ? 'and ' : ''}? = ?", join_parent.send(relationship[:from_key]), out.send(relationship[:to_key])]
                if matches = relationship[:from_key].match(/\A(.+)_id\z/)
                    @where_sql << ['and ? = ?', join_parent.send("#{matches[1]}_type"), out.class.name.singularize]
                elsif matches = relationship[:to_key].match(/\A(.+)_id\z/)
                    @where_sql << ['and ? = ?', out.send("#{matches[1]}_type"), join_parent.class.name.singularize]
                end
            end
            out
        end
        union_class.new(@database, tables)
    end

    def _join_to_table(relationship)
        join_parent = clone
        out = Slick::Database::Table.create(relationship[:collection_name], @database, join_parent)
        out.send(:_join_root).instance_eval do
            @from_sql << [', ? as ?', out.class.name.to_sym, out.instance_variable_get(:@alias).to_sym]
            @where_sql << ["#{@where_sql.count > 0 ? 'and ' : ''}? = ?", join_parent.send(relationship[:from_key]), out.send(relationship[:to_key])]
        end
        out
    end

    def _generate_alias(name)
        alias_counters = _join_root.instance_variable_get(:@alias_counters)

        name = name.to_s
        alias_counters[name] = 0 if alias_counters[name].nil?
        alias_counters[name] += 1

        if alias_counters[name] == 1
            name
        else
            "#{name}#{alias_counters[name]}"
        end
    end

    def _join_root
        @_join_root ||= begin
            out = self
            while join_parent = out.instance_variable_get(:@join_parent)
                out = join_parent
            end
            out
        end
    end

    def _adapter
        @_adapter ||= database.send(:_adapter)
    end
end

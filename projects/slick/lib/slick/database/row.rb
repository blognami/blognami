
require "securerandom"

require "slick/model"
require "slick/database/adaptable"
require "slick/registry"

class Slick::Database::Row < Slick::Model

    class << self

        include Slick::Registry
        include Slick::Database::Adaptable

        def table_class
            @table_class ||= Slick::Database::Table.register(name.pluralize)
        end

        def register(name, options = {}, &block)
            out = super

            if options[:abstract]
                out.method_missing(:can_be, name) if options[:abstract]
            else
                out.table_class
            end

            if options[:singleton]
                out.class_eval do
                    instance_eval{ @singleton = true }

                    validate_with do
                        if !validation_error?('general') && id.nil? && database.send(self.class.table_class.name).count > 0
                            set_validation_error('general', "A singleton table can't contain more than one row")
                        end
                    end
                end
                Slick::Helper.register(name).define_method "call" do |*args, &block|
                    database.send(self.class.name, *args, &block)
                end
            end
            
            out
        end

        def can_be(name)
            union_class = Slick::Database::Union.register(name.pluralize)
            union_class.table_classes << table_class if !union_class.table_classes.include?(table_class)
        end

        def has_many(name, *args, &block)
            table_class.has_many(name, *args, &block)

            if table_class.relationships[name.to_s][:cascade_delete]
                class_eval("before_delete{ send(#{name.to_s.dump}).delete }")
            end

            class_eval("def #{name}; self.class.table_class.new(@database).id_eq(id).#{name}; end")
        end

        def has_one(name, *args, &block)
            table_class.has_one(name, *args, &block)

            options = args.last.kind_of?(Hash) ? args.last : {}
            if table_class.relationships[name.to_s][:cascade_delete]
                class_eval("before_delete{ send(#{name.to_s.dump}).delete }")
            end

            class_eval("def #{name}; self.class.table_class.new(@database).id_eq(id).#{name}.first; end")
        end

        def belongs_to(name, *args, &block)
            table_class.belongs_to(name, *args, &block)

            options = args.last.kind_of?(Hash) ? args.last : {}
            if table_class.relationships[name.to_s][:cascade_delete]
                class_eval("before_delete{ send(#{name.to_s.dump}).delete }")
            end
            
            class_eval("def #{name}; self.class.table_class.new(@database).id_eq(id).#{name}.first; end")
        end

        def before_insert_or_update(&block)
            before_insert(&block)
            before_update(&block)
        end

        def after_insert_or_update(&block)
            after_insert(&block)
            after_update(&block)
        end

        def scope(name, &block)
            table_class.define_method(name, &block)
        end

    end

    _define_adapter_methods :row

    deligate_to_adapter :delete, :_generate_insert_sql, :_generate_update_sql

    _define_callback_methods :before_insert
    _define_callback_methods :after_insert
    _define_callback_methods :before_update
    _define_callback_methods :after_update
    _define_callback_methods :before_delete
    _define_callback_methods :after_delete

    attr_reader :database

    def initialize(database, fields = {})
        @database = database
        @fields = fields
        @altered_fields = {}
        @update_level = 0
    end

    def inspect
        @fields
    end

    def id=(value)
        raise "Id fields can't be set directly on a row"
    end

    def update(fields = {}, &block)
        @database.transaction do
            @update_level += 1
            fields.each{ |name, value| send("#{name}=", value) }

            if block
                if block.arity > 0
                    block.call(self)
                else
                instance_eval(&block) 
                end
            end

            validate if @update_level == 1

            @update_level -=1

            if @update_level == 0
                if @fields['id'].nil?
                    _run_before_insert_callbacks
                    @database.run(_generate_insert_sql())
                    _run_after_insert_callbacks
                    @fields = @altered_fields
                else
                    _run_before_update_callbacks
                    @database.run(_generate_update_sql()) if @altered_fields.count > 0
                    _run_after_update_callbacks
                end
                @fields.merge!(@altered_fields)
                @altered_fields = {}
            end
        end
        self
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
            def initialize(row)
                @row = row
            end

            def title
                "Edit #{@row .class.name}"
            end

            def fields
                out = []
                columns = Slick.database.send(@row.class.table_class.name).columns
                settable_field_names = @row.methods.map(&:to_s).select{|name| name.match(/\A[a-z_]+=\z/i)}.map{|name| name.sub(/=\z/, '')}
                names = (columns.keys + settable_field_names).uniq
                while names.length > 0
                    name = names.shift
                    column = columns[name]
                    value = @row.send(name)
                    value = value.to_field_value if value.respond_to?(:to_field_value)
                    type = column ? column.type : 'string'
                    out << {
                        name: name,
                        type: COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP[type],
                        value: value
                    }
                end
                out
            end

            def submit_title
                "Save Changes"
            end

            def cancel_title
                "Cancel"
            end

            def unsaved_changes_confirm
                "There are unsaved changes are you sure you want to close?"
            end

            def submit(values, &block)
                @row.update(values)
                block.call(@row)
            end
        end.new(self)
    end

    def method_missing(name, *args, &block)
        if args.length == 1 && matches = name.match(/\A(.+)=\z/)
            if _column_names.include?(matches[1])
                @altered_fields[matches[1]] = args.first if @fields[matches[1]] != args.first
                update if @update_level == 0
            else
                raise "No such column '#{matches[1]} exists for table '#{self.class.name.pluralize}'"
            end
        elsif args.length == 0
            name = name.to_s
            if _column_names.include?(name)
                if @altered_fields.key?(name)
                    @altered_fields[name]
                else
                    @fields[name]
                end
            else
                raise "No such column '#{name}' exists for table '#{self.class.name.pluralize}'"
            end
        else
            super
        end
    end

    def respond_to_missing?(name, is_private_or_protected)
        if !is_private_or_protected && matches = name.match(/\A(.+)(=|)\z/)
            _column_names.include?(matches[1])
        else
            super
        end
    end

    def _column_names
        @_column_names ||= Slick::Database::Table.create(self.class.name.pluralize, @database).columns.keys
    end

    def _adapter
        @_adapter ||= database.send(:_adapter)
    end

end

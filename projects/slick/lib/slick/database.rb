

require "slick/database/adaptable"

class Slick::Database

    class << self
        include Slick::Database::Adaptable
    end

    _define_adapter_methods :database

    deligate_to_adapter :initialize, :run, :exist?, :create, :drop, :tables
    deligate_to_adapter :transaction, :lock, :clean_up, :unix_timestamp

    def initialize(config = {})
        @config = config
        _adapter.database_initialize(self)
    end

    def add_table(name)
        send(name).create
    end

    def remove_table(name)
        send(name).drop
    end

    def current_schema_version
        Slick::Database::Migrator.new(self).current_schema_version
    end

    def latest_schema_version
        Slick::Database::Migrator.new(self).latest_schema_version
    end

    def migrate
        Slick::Database::Migrator.new(self).migrate
    end

    def method_missing(name, *args, &block)
        if args.length == 0
            row_class = Slick::Database::Row.registered_classes[name.to_s]
            out = if row_class && row_class.instance_eval{ @singleton }
                table = row_class.table_class.new(self)
                table.first || lock do
                    table.first || begin
                        table.insert
                        table.first
                    end
                end
            elsif Slick::Database::Union.registered_classes[name.to_s]
                Slick::Database::Union.create(name, self)
            else
                Slick::Database::Table.create(name, self)
            end

            if block
                if block.arity > 0
                    block.call(out)
                else
                    out.instance_eval(&block)
                end
            end

            out
        else
            super
        end
    end

    private

    def _adapter
        @_adapter ||= Slick::Database::Adapter.create(@config[:adapter], @config)
    end

end

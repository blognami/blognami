

require "slick/database/adapter"

Slick::Database::Adapter.register :mysql do

    def database_initialize(database)
        database.instance_eval do
            @transaction_level = 0
            @lock_level = 0
            run("use ?", @config[:name].to_sym) if exist?
        end
    end

    def database_run(database, *args)
        database.instance_eval do
            options = args.last.kind_of?(Hash) ? args.pop : {}
            options = { cache: true }.merge(options)
            query = _adapter.prepare(args)

            Slick.resource_provider["database_schema_cache"].clear if query.match(/\A\s*(create|drop|alter)/i)
            Slick.resource_provider["database_session_cache"].clear if query.match(/\A\s*(create|drop|alter|insert|update|delete)/i)
            
            cache = if options[:cache]
                if query.match(/\A\s*(show|describe)/i)
                    Slick.resource_provider["database_schema_cache"]
                elsif query.match(/\A\s*select/i)
                    Slick.resource_provider["database_session_cache"]
                end    
            end

            rows = if cache
                cache["query:#{query}"] ||= _adapter.fetch_rows(query)
            else
                _adapter.fetch_rows(query)
            end

            rows.map do |row|
                out = row.clone
                if out['_type']
                    out = Slick::Database::Row.create(out.delete('_type'), self, out)
                end
                out
            end
        end
    end

    def database_exist?(database)
        database.instance_eval do
            run("show databases").map{|row| row["Database"]}.include?(@config[:name])
        end
    end

    def database_create(database)
        database.instance_eval do
            if !exist?
                run("create database ?", @config[:name].to_sym) 
                run("use ?", @config[:name].to_sym)
            end
        end
    end

    def database_drop(database)
        database.instance_eval do
            run("drop database ?", @config[:name].to_sym) if exist?
            @using = nil
        end
    end

    def database_tables(database)
        database.instance_eval do
            if exist?
                out = {}
                run("show tables").each do |row|
                    name = row.values[0]
                    out[name] = send(name)
                end
                out
            else
                {}
            end
        end
    end

    def database_transaction(database, &block)
        database.instance_eval do
            run("start transaction") if @transaction_level == 0
            @transaction_level += 1
            out = begin
                block.call if block
            rescue Exception => e
                run("rollback") if @transaction_level > 0
                @transaction_level = 0
                raise e
            end
            @transaction_level -= 1
            run("commit") if @transaction_level == 0
            out
        end
    end

    def database_lock(database, &block)
        database.instance_eval do
            run("select get_lock('pinstripe_lock', -1)", cache: false) if @lock_level == 0
            @lock_level += 1
            out = block.call if block
            @lock_level -= 1
            run("select release_lock('pinstripe_lock')", cache: false) if @lock_level == 0
            out
        end
    end

    def database_clean_up(database)
        database.instance_eval do
            run("rollback") if @transaction_level > 0
            @transaction_level = 0
        end
    end

    def database_unix_timestamp(database)
        database.instance_eval do
            run("select unix_timestamp()").pop.values.pop
        end
    end

    def column_create(column, type = 'string', options = {})
        column.instance_eval do
            type = type.to_s
            options = options.merge(index: type == 'foreign_key', default: Slick::Database::Adapter::TYPE_TO_DEFAULT_VALUE_MAP[type])
            database = @table.instance_variable_get(:@database)

            @table.create

            query = [
                'alter table ?', @table.class.name.to_sym,
                'add column ?', @name.to_sym, Slick::Database::Adapter::TYPE_TO_MYSQL_COLUMN_TYPE_MAP[type]
            ]

            query << [ 'default ?', options[:default] ] if !options[:default].nil?

            database.run(query) if !exist?

            database.run(
                'alter table ?', @table.class.name.to_sym,
                'add index(?)', @name.to_sym
            ) if options[:index] == 'true'
        end
    end

    def column_drop(column)
        column.instance_eval do
            database = @table.instance_variable_get(:@database)
            database.run(
                'alter table ?', @table.class.name.to_sym,
                'drop ?', @name.to_sym
            )
            @type = nil
        end
    end

    def row_delete(row)
        row.instance_eval do
            @database.transaction do
                _run_before_delete_callbacks
                @database.run('delete from ? where id = uuid_to_bin(?)', self.class.name.pluralize.to_sym, id)
                _run_after_delete_callbacks
            end
            self
        end
    end

    def row__generate_insert_sql(row)
        row.instance_eval do
            @fields['id'] = SecureRandom.uuid
            @altered_fields['id'] = @fields['id']
            out = []
            out << ['insert into ?', self.class.name.pluralize.to_sym]
            out << ["(#{@altered_fields.keys.map{'?'}.join(', ')})"] + @altered_fields.keys.map{|name| name.to_sym}
            out << ["values(#{@altered_fields.keys.map{|name| name.match(/\A(id|.+_id)\z/) ? 'uuid_to_bin(?)' : '?'}.join(', ')})"] + @altered_fields.values
            out
        end
    end

    def row__generate_update_sql(row)
        row.instance_eval do
            out = []
            out << ['update ? ', self.class.name.pluralize.to_sym]
            out << ['set']
            out << @altered_fields.keys.map{|name| name.match(/\A.+_id\z/) ? '? = uuid_to_bin(?)' : '? = ?'}.join(', ')
            @altered_fields.each do |name, value|
                out << name.to_sym
                out << value
            end
            out << ['where id = uuid_to_bin(?)', @fields['id']]
            out
        end
    end

    def table_columns(table)
        table.instance_eval do
            if exist?
                out = {}
                @database.run('describe ?', self.class.name.to_sym).each do |row|
                    name = row['Field']
                    if name == '_id'
                        type = 'primary_key'
                    elsif name == 'id'
                        type = 'alternate_key'
                    else
                        type = Slick::Database::Adapter::MYSQL_COLUMN_TYPE_TO_TYPE_MAP[
                            row['Type']
                        ] || "string"
                    end
                    out[name] = Slick::Database::Column.new(self, name, type)
                end
                out
            else
                {}
            end
        end
    end

    def table_create(table)
        table.instance_eval do
            @database.create()
            @database.run(
                "create table ?", self.class.name.to_sym, "(",
                    "_id int(11) unsigned auto_increment primary key,",
                    "id binary(16) not null,",
                    "index(id)",
                ")"
            ) if !exist?
        end
    end

    def table_drop(table)
        table.instance_eval do
            @database.run("drop table ?", self.class.name.to_sym) if exist?
        end
    end

    def table_method_missing(table, name, *args, &block)
        table.instance_eval do
            if args.length == 0 && block.nil?
                columns[name.to_s] || Slick::Database::Column.new(self, name)
            elsif args.length == 1 && block.nil? && matches = name.to_s.match(Slick::Database::Adapter::MYSQL_KEY_COMPARISON_OPERATOR_METHOD_PATTERN)
                if send(matches[1]).exist?
                    where(Slick::Database::Adapter::MYSQL_KEY_COMPARISON_OPERATORS[matches[2]], send(matches[1]), *args)
                else
                    where('1 = 2')
                end
            elsif args.length == 1 && block.nil? && matches = name.to_s.match(Slick::Database::Adapter::MYSQL_COMPARISON_OPERATOR_METHOD_PATTERN)
                if send(matches[1]).exist?
                    where(Slick::Database::Adapter::MYSQL_COMPARISON_OPERATORS[matches[2]], send(matches[1]), *args)
                else
                    where('1 = 2')
                end
            elsif scope = self.class.scope[name]
                
            else
                super
            end
        end
    end

    def table__generate_select_sql(table, options = {})
        table.instance_eval do
            options = { column_names: columns.keys }.merge(options)

            out = ['select']

            if options.key?(:select)
                out << options[:select]
            else
                out << ['distinct']
                options[:column_names].map(&:to_s).uniq.each do |column_name|
                    next if column_name == '_id'
                    column = send(column_name)
                    if column.exist?
                        if column_name.match(/\A(id|.+_id)\z/)
                            out << ['bin_to_uuid(?) as ?, ', column, column_name.to_sym]
                        else
                            out << ['? as ?, ', column, column_name.to_sym]
                        end
                    else
                        out << ['null as ?, ', column_name.to_sym]
                    end
                end
                out << ['? as ?', self.class.name.singularize, :_type]
            end
            
            if options.key?('from')
                from_sql = options.from || []
            else
                from_sql = _join_root.instance_variable_get(:@from_sql)
            end
            out << ["from", from_sql] if from_sql.count > 0

            if options.key?('where')
                where_sql = options.where || []
            else
                where_sql = _join_root.instance_variable_get(:@where_sql)
            end
            out << ['where', where_sql] if where_sql.count > 0

            if options.key?('order_by')
                order_by_sql = options.order_by || []
            else
                order_by_sql = _join_root.instance_variable_get(:@order_by_sql)
            end
            out << ['order by', order_by_sql] if order_by_sql.count > 0

            if options.key?('limit')
                limit_sql = options.limit || []
            else
                limit_sql = []
                page_size = _join_root.instance_variable_get(:@page_size)
                limit_sql << ['?', page_size] if !page_size.nil?
            end
            out << ['limit', limit_sql] if limit_sql.count > 0

            if options.key?('offset')
                offset_sql = options.offset || []
            else
                offset_sql = []
                page = _join_root.instance_variable_get(:@page)
                page_size = _join_root.instance_variable_get(:@page_size)
                skip_count = _join_root.instance_variable_get(:@skip_count)
                if !page.nil? || skip_count > 0
                    page ||= 1
                    page_size ||= 10
                    offset_sql << ['?', ((page - 1) * page_size) + skip_count]
                end
            end
            out << ['offset', offset_sql] if offset_sql.count > 0

            out
        end
    end

    def union__generate_select_sql(union, options)
        union.instance_eval do
            options = { select: "*" }.merge(options)
            out = []
            out << "select #{options[:select]} from (("
            @tables.each do |table|
                out << ') union all (' if out.count > 1
                out << table.send(:_generate_select_sql, {
                    :column_names => _column_names,
                    :order_by => nil,
                    :limit => nil,
                    :offset => nil
                })
            end
            out << ")) as `_union`"

            if options.key?(:order_by)
                order_by_sql = options[:order_by] || []
            else
                order_by_sql = @order_by_sql
            end
            out << ['order by', order_by_sql] if order_by_sql.count > 0

            if options.key?(:limit)
                limit_sql = options[:limit] || []
            else
                limit_sql = []
                limit_sql << ['?', @page_size] if !@page_size.nil?
            end
            out << ['limit', limit_sql] if limit_sql.count > 0

            if options.key?(:offset)
                offset_sql = options[:offset] || []
            else
                offset_sql = []
                if !@page.nil? || @skip_count > 0
                    page = @page || 1
                    page_size = @page_size || 10
                    offset_sql << ['?', ((page - 1) * page_size) + @skip_count]
                end
            end
            out << ['offset', offset_sql] if offset_sql.count > 0

            out
        end
    end

    def prepare(*args)
        query = []
        args = flatten(args)
        while(args.length > 0)
            query << args.shift.to_s.gsub(/\?/) { |match| escape(args.shift) }
        end
        query.join(' ').force_encoding("ASCII-8BIT")
    end

    def flatten(items)
        out = []
        items = items.clone
        while items.length > 0
            items = flatten_first(items)
            out << items.shift
            out.last.scan("?").count.times do
                out << items.shift
            end
        end
        out
    end

    def flatten_first(items)
        out = items.clone
        while true
            if out[0].kind_of?(Hash)
                out[0] = out[0][:mysql]
            elsif out[0].kind_of?(Array)
                out = out[0] + out[1..]
            else
                break
            end
        end
        out
    end

    def escape(value)    
        if value.kind_of?(Slick::Database::Table)
            escape_identifier(value.instance_eval{ @alias })
        elsif value.kind_of?(Slick::Database::Column)
            alias_identifier = value.instance_eval{ @table }.instance_eval{ @alias }
            column_identifier = value.instance_eval{ @name }
            "#{escape_identifier(alias_identifier)}.#{escape_identifier(column_identifier)}"
        elsif value.kind_of?(Symbol)
            escape_identifier(value)
        elsif value.kind_of?(Numeric)
            value
        elsif value.kind_of?(NilClass)
            "null"
        elsif(value.kind_of?(Time) || value.kind_of?(DateTime))
            "'#{value.strftime('%Y-%m-%d %H:%M:%S')}'"
        elsif(value.kind_of?(Date))
            "'#{value.strftime('%Y-%m-%d')}'"
        else
            "'#{client.escape(value.to_s)}'"
        end
    end

    def escape_identifier(value)
        "`#{value.to_s.gsub(/`/, '')}`"
    end

    def fetch_rows(query)
        if Slick.environment != "production"
            sanatized_query = query
            if !sanatized_query.match(/\Aselect/)
                sanatized_query = "#{sanatized_query[0..997]}..." if sanatized_query.length > 1000
                sanatized_query.gsub!(/[^\x20-\x7E]/, ' ')
                sanatized_query.gsub!(/\s+/, ' ')
            end
            puts ""
            puts "Query: #{sanatized_query}"
            puts ""
        end

        out = []
        begin
            result = client.query(query)
            result.each{|row| out << row} if result
        rescue Exception => e
            puts ""
            puts "Query Error: #{e.message}"
            puts ""
            raise e
        end
        out
    end

    def client
        @client ||= begin
            require "mysql2"

            Mysql2::Client.new({
                :host => @config[:host] || '127.0.0.1',
                :port => @config[:port] || 3306,
                :username => @config[:username] || 'root',
                :password => @config[:password] || ''
            })
        end
    end
    
end

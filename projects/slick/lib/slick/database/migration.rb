
require "slick/registry"
require "slick/helpers"

class Slick::Database::Migration

    class << self

        include Slick::Registry

        def register(name, *args, &block)
            throw "Invalid migration name '#{name}' - it must begin with a unix timestamp" if !name.to_s.match(/\A\d+/)
            super
        end

        def schema_version
            if matches = name.to_s.match(/\A(\d+)/)
                matches[0].to_i
            else
                0
            end
        end

    end

    include Slick::Helpers

    def migrate

    end

end

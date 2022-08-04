
class Slick::Util::ParamsHash < Hash

    def initialize
       super
    end

    def []=(key, value)
        super(key.to_s, value)
    end

    def[](key)
        super(key.to_s)
    end

    def merge!(hash)
        hash.each{|key, value| self[key] = value }
    end

    def merge(hash)
        out = clone
        out.merge!(hash)
        out
    end

    def key?(name)
        super(name.to_s)
    end

    def method_missing(name, *args, &block)
        if args.length == 0 && !block
            self[name]
        else
            super
        end
    end

end

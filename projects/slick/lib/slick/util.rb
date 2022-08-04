
require "cgi"

module Slick::Util

    class << self

        def pluralize(word)
            word = word.to_s
            Inflections.pluralize_rules.each do |rule|
                pattern, replacement = rule
                return word.sub(pattern, replacement) if word.match?(pattern)
            end
        end

        def singularize(word)
            word = word.to_s
            Inflections.singularize_rules.each do |rule|
                pattern, replacement = rule
                return word.sub(pattern, replacement) if word.match?(pattern)
            end
        end

        def snakeify(stringable)
            stringable.to_s.split(/::|\//).map{ |segment|
                segment.gsub(/([A-Z])/, '_\1').downcase.gsub(/[^a-z0-9]+/, '_').gsub(/(\A_|_\z)/, '')
            }.join('/')
        end

        def dasherize(stringable)
            snakeify(stringable).gsub(/_/, '-')
        end

        def camelize(stringable)
            snakeify(stringable).split(/\//).map{ |segment|
                segment.sub(/\A[0-9]+/, '').split(/_/).map{|word| word.capitalize }.join
            }.join('::')
        end

        def html_escape(stringable)
            CGI::escapeHTML(stringable.to_s)
        end

        def html_unescape(stringable)
            CGI::unescapeHTML(stringable.to_s)
        end

        def url_escape(stringable)
            CGI::escape(stringable.to_s)
        end

        def url_unescape(stringable)
            CGI::unescape(stringable.to_s)
        end

        def paramify(hashable, defaults = {})
            if hashable.kind_of?(Hash)
                out = ParamsHash.new.merge(defaults)
                hashable.each{|name, value| out[name] = paramify(value)}
                out
            elsif hashable.kind_of?(Array)
                out = ParamsHash.new.merge(defaults)
                hashable.each_with_index{|value, index| out[index] = paramify(value)}
                out
            else
                return hashable
            end
        end

        def url_encode(hashable, path = [], out = [])
            hashable = paramify(hashable) if !hashable.kind_of?(ParamsHash)
            if hashable.kind_of?(ParamsHash)
                hashable.each do |name, value|
                    path.push(name)
                    url_encode(value, path, out)
                    path.pop
                end
                return out.join('&') if path.count == 0
            elsif path.count == 0
                return url_escape(hashable)
            else 
                out << "#{url_escape(path.first)}#{path[1..path.length].map{|name| "[#{url_escape(name)}]"}.join}=#{url_escape(hashable)}"
            end
        end

        def parse_html(stringable, options = {})
            Html.parse(stringable, options)
        end

    end

    (methods - Module.methods).each do |method_name|
        class_eval "def #{method_name}(*args); ::Slick::Util.#{method_name}(self, *args); end"
    end

end

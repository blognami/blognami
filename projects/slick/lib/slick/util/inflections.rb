
module Slick::Util::Inflections

    instance_eval do
        @pluralize_rules = []
        @singularize_rules = []
    end

    class << self

        attr_accessor :pluralize_rules
        attr_accessor :singularize_rules

        def plural(*args)
            pluralize_rules.prepend(args)
        end

        def singular(*args)
            singularize_rules.prepend(args)
        end

        def irregular(singular, plural)
            s0 = singular[0]
            srest = singular[1..-1]

            p0 = plural[0]
            prest = plural[1..-1]

            if s0.upcase == p0.upcase
                plural(/(#{s0})#{srest}$/i, '\1' + prest)
                plural(/(#{p0})#{prest}$/i, '\1' + prest)

                singular(/(#{s0})#{srest}$/i, '\1' + srest)
                singular(/(#{p0})#{prest}$/i, '\1' + srest)
            else
                plural(/#{s0.upcase}(?i)#{srest}$/,   p0.upcase   + prest)
                plural(/#{s0.downcase}(?i)#{srest}$/, p0.downcase + prest)
                plural(/#{p0.upcase}(?i)#{prest}$/,   p0.upcase   + prest)
                plural(/#{p0.downcase}(?i)#{prest}$/, p0.downcase + prest)

                singular(/#{s0.upcase}(?i)#{srest}$/,   s0.upcase   + srest)
                singular(/#{s0.downcase}(?i)#{srest}$/, s0.downcase + srest)
                singular(/#{p0.upcase}(?i)#{prest}$/,   s0.upcase   + srest)
                singular(/#{p0.downcase}(?i)#{prest}$/, s0.downcase + srest)
            end
        end

        def uncountable(singular_and_plural)
            irregular(singular_and_plural, singular_and_plural)
        end

    end

    plural(/$/, "s")
    plural(/s$/i, "s")
    plural(/^(ax|test)is$/i, '\1es')
    plural(/(octop|vir)us$/i, '\1i')
    plural(/(octop|vir)i$/i, '\1i')
    plural(/(alias|status)$/i, '\1es')
    plural(/(bu)s$/i, '\1ses')
    plural(/(buffal|tomat)o$/i, '\1oes')
    plural(/([ti])um$/i, '\1a')
    plural(/([ti])a$/i, '\1a')
    plural(/sis$/i, "ses")
    plural(/(?:([^f])fe|([lr])f)$/i, '\1\2ves')
    plural(/(hive)$/i, '\1s')
    plural(/([^aeiouy]|qu)y$/i, '\1ies')
    plural(/(x|ch|ss|sh)$/i, '\1es')
    plural(/(matr|vert|ind)(?:ix|ex)$/i, '\1ices')
    plural(/^(m|l)ouse$/i, '\1ice')
    plural(/^(m|l)ice$/i, '\1ice')
    plural(/^(ox)$/i, '\1en')
    plural(/^(oxen)$/i, '\1')
    plural(/(quiz)$/i, '\1zes')

    singular(/s$/i, "")
    singular(/(ss)$/i, '\1')
    singular(/(n)ews$/i, '\1ews')
    singular(/([ti])a$/i, '\1um')
    singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '\1sis')
    singular(/(^analy)(sis|ses)$/i, '\1sis')
    singular(/([^f])ves$/i, '\1fe')
    singular(/(hive)s$/i, '\1')
    singular(/(tive)s$/i, '\1')
    singular(/([lr])ves$/i, '\1f')
    singular(/([^aeiouy]|qu)ies$/i, '\1y')
    singular(/(s)eries$/i, '\1eries')
    singular(/(m)ovies$/i, '\1ovie')
    singular(/(x|ch|ss|sh)es$/i, '\1')
    singular(/^(m|l)ice$/i, '\1ouse')
    singular(/(bus)(es)?$/i, '\1')
    singular(/(o)es$/i, '\1')
    singular(/(shoe)s$/i, '\1')
    singular(/(cris|test)(is|es)$/i, '\1is')
    singular(/^(a)x[ie]s$/i, '\1xis')
    singular(/(octop|vir)(us|i)$/i, '\1us')
    singular(/(alias|status)(es)?$/i, '\1')
    singular(/^(ox)en/i, '\1')
    singular(/(vert|ind)ices$/i, '\1ex')
    singular(/(matr)ices$/i, '\1ix')
    singular(/(quiz)zes$/i, '\1')
    singular(/(database)s$/i, '\1')

    irregular("person", "people")
    irregular("man", "men")
    irregular("child", "children")
    irregular("sex", "sexes")
    irregular("move", "moves")
    irregular("zombie", "zombies")

    uncountable "equipment"
    uncountable "information"
    uncountable "rice"
    uncountable "money"
    uncountable "species"
    uncountable "series"
    uncountable "fish"
    uncountable "sheep"
    uncountable "jeans"
    uncountable "police"

end
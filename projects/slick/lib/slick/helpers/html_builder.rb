
require "slick/helpers"

module Slick::Helpers

    def text(stringable)
        echo stringable.html_escape
    end

    SELF_CLOSING_TAGS = [
        'area',
        'base',
        'br',
        'embed',
        'hr',
        'iframe',
        'img',
        'input',
        'link',
        'meta',
        'param',
        'source',
        'track'
    ]
    
    TEXT_ONLY_TAGS = [
        'script',
        'style'
    ]

    def html_tag(name, *args, &block)
        name = name.to_s.downcase
        echo "<#{name.html_escape}"
        if args.last.kind_of?(Hash) 
            attributes = args.pop
            attributes.each do |name, value|
                echo " #{name.html_escape}=\"#{value.html_escape}\""
            end
        end
        echo ">"
        if !SELF_CLOSING_TAGS.include?(name)
            if args.first
                content = args.shift
                if TEXT_ONLY_TAGS.include?(name)
                    echo content
                else
                    text content
                end
            end
            block.call if block
            echo "</#{name.html_escape}>"
        end
        nil
    end

    TAGS = [
        "html",
        "a",
        "abbr",
        "address",
        "area",
        "article",
        "aside",
        "audio",
        "b",
        "base",
        "bdi",
        "bdo",
        "blockquote",
        "body",
        "br",
        "button",
        "canvas",
        "caption",
        "cite",
        "code",
        "col",
        "colgroup",
        "content",
        "data",
        "datalist",
        "dd",
        "del",
        "details",
        "dfn",
        "dialog",
        "div",
        "dl",
        "dt",
        "em",
        "embed",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hr",
        "html",
        "i",
        "iframe",
        "img",
        "input",
        "ins",
        "kbd",
        "keygen",
        "label",
        "legend",
        "li",
        "link",
        "main",
        "map",
        "mark",
        "menu",
        "menuitem",
        "meta",
        "meter",
        "nav",
        "noscript",
        "object",
        "ol",
        "optgroup",
        "option",
        "output",
        "p",
        "param",
        "picture",
        "pre",
        "progress",
        "q",
        "rp",
        "rt",
        "rtc",
        "ruby",
        "s",
        "samp",
        "script",
        "section",
        "select",
        "shadow",
        "slot",
        "small",
        "source",
        "span",
        "strong",
        "style",
        "sub",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "template",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "time",
        "title",
        "tr",
        "track",
        "u",
        "ul",
        "var",
        "video",
        "wbr"
    ]

    TAGS.each do |name|
        class_eval("def #{name}(*args, &block); html_tag(\"#{name}\", *args, &block); end")
    end

end
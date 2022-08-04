
require "coderay"

module Slick::Util::Html
    extend self

    def parse(stringable, options = {})
        options = { :markdown => false, :highlight_code => false }.paramify.merge(options)

        stringable = CommonMarkerRenderer.render(stringable.to_s) if options.markdown

        out = Node.create("#fragment").append(stringable.to_s)
        out.descendants.each do |node|
            if node.type == 'pre' && !node.attributes.lang.nil?
                
            end
        end
        out
    end

end

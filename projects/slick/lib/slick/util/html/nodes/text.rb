
require "slick/util/html/node"

Slick::Util::Html::Node.register "#text" do

    def to_s
        if Slick::Util::Html::TEXT_ONLY_TAGS.include?(parent.type)
            attributes[:value].to_s
        else
            attributes[:value].html_escape
        end
    end

end

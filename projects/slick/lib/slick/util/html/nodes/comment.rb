
require "slick/util/html/node"

Slick::Util::Html::Node.register "#comment" do

    def to_s
        "<!--#{attributes[:value].html_escape}-->"
    end

end

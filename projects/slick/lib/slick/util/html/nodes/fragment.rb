
require "slick/util/html/node"

Slick::Util::Html::Node.register "#fragment" do

    def to_s
        out = []
        children.each do |child|
            out << child.to_s
        end
        out.join
    end

end


require "commonmarker"


class Slick::Util::Html::CommonMarkerRenderer < CommonMarker::HtmlRenderer

    def self.render(markdown)
        new.render(CommonMarker.render_doc(markdown))
    end
    
    def initialize
        super(
            :options => [ :UNSAFE, :GITHUB_PRE_LANG, :HARDBREAKS, :SOURCEPOS ],
            :extensions => [ :table, :tasklist, :strikethrough, :autolink ]
        )
    end

end
  
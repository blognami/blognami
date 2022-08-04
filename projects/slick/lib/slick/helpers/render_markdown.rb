
require "commonmarker"

require "slick/helpers"

Slick::Helpers.define_method :render_markdown do |stringable, options = {}|
    common_marker_options = [ :UNSAFE, :GITHUB_PRE_LANG, :HARDBREAKS ]
    common_marker_options << :SOURCEPOS if options[:render_slash_blocks]
    common_marker_extensions = [ :table, :tasklist, :strikethrough, :autolink ]
    out = CommonMarker.render_html(stringable.to_s, common_marker_options, common_marker_extensions)
    if options[:render_slash_blocks]
        out = out.parse_html
        out.descendants.each do |node|
            if matches = node.attributes['data-sourcepos'].to_s.match(/\A(\d+):/)
                line_number = matches[1]
                node.attributes.delete 'data-sourcepos'
                if node.type == 'p' && node.level == 1 && matches = node.text.match(/\A\/([^\/\s]*)(.*)\z/);
                    name = matches[1];
                    args = matches[2].strip;
                    slash_block_node = node.replace("<div></div>").first
                    slash_block_node.attributes.merge!({
                        :class => "frame",
                        'data-node-wrapper': 'frame',
                        'data-line-number' => line_number,
                        'data-url' => "/blocks/#{name.url_escape}?args=#{args.url_escape}"
                    })
                end
            end
        end
    end
    echo out.to_s
end

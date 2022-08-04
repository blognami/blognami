
require "yaml"

Slick::View::FileInterpreter.register "md" do

    def interpret_file
        front_matter = {}
        body = File.read(file_path)
        
        if matches = body.match(/\A---(.*?)---(.*)\z/m)
            front_matter = YAML.load(matches[1])
            front_matter = {} if !front_matter.kind_of?(Hash)
            body = matches[2]
        end
        front_matter = front_matter.paramify
        body = grab { render_markdown(body) }
        
        front_matter[:title] ||= begin
            h1 = body.descendants.find{|node| node.type == 'h1'}
            h1 ? h1.text : nil
        end

        Slick::View.register(relative_file_path.sub(/\.md/i, '')).class_eval "
            def render
                render_view('_layout', #{front_matter.inspect}) do
                    echo #{body.to_s.dump}
                end
            end
        "
    end

end

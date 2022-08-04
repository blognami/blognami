
Slick::View::FileInterpreter.register "erb" do

    def interpret_file
        Slick::View.register(relative_file_path.sub(/\.erb/i, '')).class_eval "def render(&block);#{compile}; response.body.clear if !response.body.empty? && response.body.join.length == 0; end", file_path
    end

    def compile
        File.read(file_path).gsub(/.*?<%={0,1}.*?%>|.+/m) do |chunk|
            if matches = chunk.match(/\A(.*?)(<%[=#]{0,1})(.*?)%>\z/m)
                if matches[2] == '<%#'
                    if matches[1].length > 0
                        "echo '#{escape(matches[1])}'; #{matches[3].gsub(/[^\n]/, '')}"
                    else 
                        "#{matches[3].gsub(/[^\n]/, '')}"
                    end
                    
                elsif matches[2] == '<%='
                    if matches[1].length > 0
                        "echo '#{escape(matches[1])}'; text #{matches[3]};"
                    else 
                        "text #{matches[3]};"
                    end
                else
                    if matches[1].length > 0
                        "echo '#{escape(matches[1])}'; #{matches[3]};"
                    else 
                        "#{matches[3]};"
                    end
                end
            else
                "echo '#{escape(chunk)}';" if chunk.length > 0
            end
        end
    end

    def escape(html)
        html.gsub(/'/, '\\\\\'')
    end

end

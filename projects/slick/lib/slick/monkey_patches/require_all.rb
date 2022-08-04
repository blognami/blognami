
require 'slick/file_interpreter'
require 'slick/file_interpreters/rb'

module Kernel
    
    def require_all(path, files = {}, top = true)
        $LOAD_PATH.each do |current_load_path|
            dir_path = "#{current_load_path}/#{path}"
            next if !Dir.exist?(dir_path)
            files["#{dir_path}/_file_interpreter.rb"] = Slick::FileInterpreter if top

            Dir.open(dir_path).sort.each do |item|
                candidate_file_path = "#{dir_path}/#{item}"
                if File.file?(candidate_file_path)
                    files["#{dir_path}/#{item}"] = if item == "_file_interpreter.rb"
                        files["#{dir_path}/_file_interpreter.rb"] = instance_eval(File.read(candidate_file_path), candidate_file_path)
                    else
                        true
                    end
                else
                    require_all("#{path}/#{item}", files, false) if item != '..' && item != '.' && item != ''
                end
            end
        end

        return if !top

        files.keys.sort.filter{|file_path| !file_path.match(/\/_file_interpreter\.rb\z/)}.each do |file_path|
            dir_path = file_path.sub(/[^\/]*\z/, '')
            while dir_path.length > 0
                break if !files["#{dir_path}_file_interpreter.rb"].nil?
                dir_path = dir_path.sub(/[^\/]*\/\z/, '')
            end
            file_interpreter = files["#{dir_path}_file_interpreter.rb"]

            file_interpreter.interpret_file(dir_path, file_path)
        end

    end

end

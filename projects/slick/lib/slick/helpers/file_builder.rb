

require "slick/helpers"
require "pathname"
require "fileutils"

module Slick::Helpers

    def confirm(question)
        while true
            puts "#{question.sub(/\?+\z/, '')}? Y/n/a"
            response = gets.chomp.downcase
            if response == '' || response == 'y'
                return true
            elsif response == 'n'
                return false
            elsif response == 'a'
                exit
            end
        end
    end

    def generate_dir(path, &block)
        path = Pathname.new("#{Dir.pwd}/#{path}").cleanpath.to_s if !path.match(/\A\//)
        puts "Creating dir \"#{path}\"".green if !Dir.exist?(path)
        FileUtils.mkdir_p(path)
        Dir.chdir(path, &block) if block
        nil
    end

    def generate_file(name, options = {}, &block)
        if matches = name.match(/\A(.*)\/([^\/]*)\z/)
            generate_dir(matches[1]){ generate_file(matches[2], options, &block) }
        else
            data = grab(&block).to_s
            file_path = "\"#{Dir.pwd}/#{name}\"";

            if !File.exist?(name)
                puts "Creating file #{file_path}".green
                File.write(name, data)
            elsif File.read(name) == data
                # no change (so ignore)
            elsif options[:skip_if_exist]
                puts "Skipping file #{file_path} (as it already exists)".blue
            elsif options[:force] || confirm("Are you sure you want to update #{file_path}?")
                puts "Updating file #{file_path}".red
                File.write(name, data)
            end
        end
        nil
    end

end

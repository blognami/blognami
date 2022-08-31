
require "slick/helpers"

class Slick::ProjectWatcher

    def self.watch
        self.new.watch
    end

    include Slick::Helpers

    def watch
        last_modified_times = {}

        paths = if ENV["WATCH_PATHS"]
            ENV["WATCH_PATHS"].split(/,/)
        else
            [project.root_path]
        end

        while true
            is_change = false

            paths.each do |path|
                Dir.glob("#{path}/**/*").each do |file|
                    next if file.match(/\.(db|db-journal)\z/)
                    last_modified_time = File.mtime(file)
                    if last_modified_times[file] != last_modified_time
                        is_change = true
                    end
                    last_modified_times[file] = last_modified_time
                end
            end

            if is_change
                Process.kill('KILL', @child_process_pid) if @child_process_pid
                @child_process_pid = Process.fork
                break if !@child_process_pid
            end

            sleep 1
        end
    end


end

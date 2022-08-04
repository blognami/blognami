

class Slick::Project

    attr_reader :root_path, :load_paths, :name, :lib_names

    def initialize
        @root_path = find_root_path(Dir.pwd)
        @load_paths = $LOAD_PATH.map{|load_path| find_root_path(load_path) }.compact
        if @root_path
            @name = gem_name(@root_path)
            @load_paths.unshift(@root_path) unless @load_paths.include?(@root_path)
        end
        @lib_names = @load_paths.map{|load_path| gem_name(load_path) }
    end

    def exist?
        !@name.nil?
    end

    private

    def find_file_path(path, pattern)
        if Dir.exist?(path)
            current_path = path
            while true
                Dir.open(current_path).each do |item|
                    candidate_file_path = "#{current_path}/#{item}"
                    return candidate_file_path if File.file?(candidate_file_path) && item.match(pattern)
                end
                if matches = current_path.match(/\A(.*)\/([^\/]+)\z/)
                    current_path = matches[1]
                    current_path = '/' if current_path == ''
                else
                    break
                end
            end
        end
        nil
    end

    def find_root_path(path)
        out = find_file_path(path, /\A\.slick\z/)
        out.sub!(/\.slick\z/, '').sub!(/\A(.+)\/\z/, '\1') if out
        out
    end

    def gem_name(path)
        out = find_file_path(path, /\A[^\/]+\.gemspec\z/)
        out.sub!(/\A.*\//, '').sub!(/\.gemspec\z/, '\1') if out
        out
    end

end

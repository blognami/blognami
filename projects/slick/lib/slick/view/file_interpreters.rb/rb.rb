
['rb', 'ruby'].each do |file_extension|
    Slick::View::FileInterpreter.register(file_extension).define_method :interpret_file do
        require file_path
    end
end

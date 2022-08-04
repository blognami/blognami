
lib = File.expand_path("lib", __dir__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "demo/version"

Gem::Specification.new do |spec|
  spec.name = "demo"
  spec.version = Demo::VERSION
  spec.authors = ["Your Name"]
  spec.email = ["your.email@example.com"]
  spec.summary = "Coming soon..."
  
  spec.files= Dir.chdir(File.expand_path('..', __FILE__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  end
  
  spec.require_paths = ["lib"]
  
  spec.add_dependency "slick", "~> 0"

end

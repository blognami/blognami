
lib = File.expand_path("lib", __dir__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "blognami/version"

Gem::Specification.new do |spec|
  spec.name = "blognami"
  spec.version = Blognami::VERSION
  spec.authors = ["Jody Salt"]
  spec.email = ["jody@jodysalt.com"]
  spec.summary = "An entrepreneurial publishing platform."
  
  spec.files= Dir.chdir(File.expand_path('..', __FILE__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  end
  
  spec.require_paths = ["lib"]
  
  spec.add_dependency "slick", "~> 0"
end

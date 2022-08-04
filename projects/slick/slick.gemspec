lib = File.expand_path("lib", __dir__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "slick/version"

Gem::Specification.new do |spec|
  spec.name          = "slick"
  spec.version       = Slick::VERSION
  spec.authors       = ["Jody Salt"]
  spec.email         = ["jody@jodysalt.com"]

  spec.summary       = "An entrepreneurial web framework that allows small (or one-man) teams to be highly productive."

  # spec.homepage      = "TODO: Put your gem's website or public repo URL here."
  # spec.metadata["allowed_push_host"] = "TODO: Set to 'http://mygemserver.com'"
  # spec.metadata["homepage_uri"] = spec.homepage
  # spec.metadata["source_code_uri"] = "TODO: Put your gem's public repo URL here."
  # spec.metadata["changelog_uri"] = "TODO: Put your gem's CHANGELOG.md URL here."

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files         = Dir.chdir(File.expand_path('..', __FILE__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  end
  spec.files << "./lib/slick/views/assets/javascripts/pinstripe.js"
  spec.files << "./lib/slick/views/assets/javascripts/pinstripe.js.map"
  
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_dependency "mysql2", "~> 0.5"
  spec.add_dependency "bundler", "~> 2.0"
  spec.add_dependency "rack", "~> 2.2"
  spec.add_dependency "colorize", "~> 0.8"
  spec.add_dependency "commonmarker", "~> 0.21"
  spec.add_dependency "coderay", "~> 1.1"
  spec.add_dependency "net-smtp", "~> 0.3.1"
  
  spec.add_development_dependency "rake", "~> 13.0"
  spec.add_development_dependency "minitest", "~> 5.0"
  
end

$LOAD_PATH.unshift File.expand_path("../lib", __dir__)

ENV['RACK_ENV'] = 'test'

require "slick"

require "minitest/autorun"

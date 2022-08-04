
require "blognami/models/pageable"

Slick::Database::Row.register :image do

  include :pageable

  def file=(file)
      return if !file.kind_of?(Hash) || !file[:type].to_s.match(/\Aimage\/(.+)\z/)
      self.title = file[:filename]
      self.type = file[:type]
      self.data = file[:tempfile].read
  end

end

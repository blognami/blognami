
require "slick/database/row"

Slick::Database::Row.register "tagable", abstract: true do

  has_many :tagable_tags, from_key: :id, to_key: :tagable_id
  has_many :tags, through: [:tagable_tags, :tag]

  scope :tagged_with do |*tag_names|
    out = self
    tag_names.each do |tag_name|
        out = out.tags.name_eq(tag_name).back(2)
    end
    out
  end

  after_insert_or_update do
    next if @tags.nil?
    tags = @tags.to_s.split(/\n/).map{|tag| tag.strip.gsub(/\s+/, ' ')}.select{|tag| tag != ''}
    tag_ids = []
    tags.each do |name|
        tag = database.tags.name_eq(name).first
        if tag
            tag_ids << tag.id
        else
            tag_ids << database.tags.insert(name: name).id
        end
    end

    tagable_tags.delete

    tag_ids.each do |tag_id|
        database.tagable_tags.insert(tagable_id: id, tag_id: tag_id)
    end
  end

  def tags=(value)
    @tags = value
  end

end

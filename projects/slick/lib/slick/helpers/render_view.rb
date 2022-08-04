
Slick::Helpers.define_method :render_view do |name, params = {}, &block|
    Slick::View.render(name, params, &block)
    nil
end

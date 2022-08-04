
require "slick/resource_factory"

Slick::ResourceFactory.register("session").define_method "create" do
    slick_session = request.cookies['slick_session']
    return nil if slick_session.to_s == ''
    (session_id, pass_string) = slick_session.split(/:/)
    sessions.id_eq(session_id).pass_string_eq(pass_string).first
end

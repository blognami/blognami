
require "slick/helpers"

class Slick::CallHandler

    include Slick::Helpers

    def handle_call
        view_name = request.path.sub(/\A\//, '')
    
        begin
            render_guard_views(view_name)
            return if response.body.length > 0
            if !view_name.match(/(\A|\/)_/)
                view_name_segments = view_name.split(/\//)
                candidate_index_view_name = (view_name_segments + ['index']).join('/');
                render_view(candidate_index_view_name, params) if view?(candidate_index_view_name)
                return if response.body.length > 0
                render_view(view_name, params) if view?(view_name)
                return if response.body.length > 0
            end
            render_default_views(view_name)
        rescue Slick::ExitException => e
            Slick::Workspace.new.instance_eval(&e.block) if e.block
        end

        if response.body.length == 0
            response.status = 404
            response.set_header("Content-Type", "text/plain")
            response.body = ["Not found"]
        end
    end

    def render_guard_views(view_name)
        view_name_segments = view_name.split(/\//)

        candidate_index_view_name = (view_name_segments + ['index']).join('/');
        candidate_default_view_name = (view_name_segments + ['default']).join('/');

        view_name_segments.pop if !view?(candidate_index_view_name) && !view?(candidate_default_view_name)

        prefix_segments = [];
        while true
            candidate_guard_view_name = (prefix_segments + ['guard']).join('/')
            render_view(candidate_guard_view_name, params) if view?(candidate_guard_view_name)
            break if response.body.length > 0 || view_name_segments.length == 0
            prefix_segments.push(view_name_segments.shift)
        end
    end

    def render_default_views(view_name)
        prefix_segments = view_name.split(/\//)
        while true
            candidate_default_view_name = (prefix_segments + ['default']).join('/')
            render_view(candidate_default_view_name, params) if view?(candidate_default_view_name)
            break if response.body.length > 0 || break if prefix_segments.length == 0
            prefix_segments.pop
        end
    end

    def view?(name)
        Slick::View.registered_classes[name] != nil
    end

end

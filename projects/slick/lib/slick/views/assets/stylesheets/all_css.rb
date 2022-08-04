

Slick::View.register("assets/stylesheets/all.css").define_method :render do
    response.headers['Content-Type'] = "text/css"

    prefix_stylesheets = [
        'assets/stylesheets/vars.css',
        'assets/stylesheets/reset.css',
        'assets/stylesheets/global.css'
    ]


    suffix_stylesheets = Slick::View.registered_classes.keys.select do |view_name|
        if view_name == 'assets/stylesheets/all.css'
            false
        elsif !view_name.match(/\Aassets\/stylesheets\/.*\.css\z/)
            false
        elsif prefix_stylesheets.include?(view_name)
            false
        else
            true
        end
    end

    out = (prefix_stylesheets + suffix_stylesheets).map do |view_name|
        "@import \"/#{view_name}\";"
    end

    

    response.body << out.join("\n")
end

# let out;

# const prefixStylesheets = [
#     'assets/stylesheets/vars.css',
#     'assets/stylesheets/reset.css',
#     'assets/stylesheets/global.css',
# ];

# export default ({ viewNames }) => {
#     if(!out){
#         const suffixStylesheets = viewNames.filter(viewName => {
#             if(viewName == 'assets/stylesheets/all.css') return false;
#             if(!viewName.match(/^assets\/stylesheets\/.*\.css$/)) return false;
#             if(prefixStylesheets.includes(viewName)) return false;
#             return true;
#         });
#         out = [ ...prefixStylesheets, ...suffixStylesheets ].map(stylesheet => {
#             return `@import "/${stylesheet}";`
#         }).join('\n');
#     }

#     return [200, { 'content-type': 'text/css'}, [ out ]];
# };
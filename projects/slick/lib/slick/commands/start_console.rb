
require "slick/command"

Slick::Command.register("start-console").define_method "run" do

    require "irb"
    IRB.setup nil
    IRB.conf[:MAIN_CONTEXT] = IRB::Irb.new.context
    require "irb/ext/multi-irb"
    workspace = Slick::Workspace.new
    workspace.instance_eval{ undef :source, :exit }
    IRB.irb nil, workspace

end

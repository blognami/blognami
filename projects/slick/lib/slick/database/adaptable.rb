
class Slick::Database
    module Adaptable
        def _define_adapter_methods(namespace)
            instance_eval "
                def self.deligate_to_adapter(*method_names, **options)
                    method_names.each do |method_name|
                        define_method method_name do |*args, &block|
                            _adapter.send(\"#{namespace}_\#{method_name}\", self, *args, &block)
                        end
                        private method_name if method_name.start_with?('_')
                    end
                end
            "
        end
    end
end

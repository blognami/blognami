

class Slick::ResourceProvider

    attr_reader :shared_resources

    def initialize
        @shared_resources = {}
        @mutex = Mutex.new
    end

    def thread_resources
        Thread.current["SLICK_RESOURCES"] ||= {}
    end

    def [](name)
        name = name.to_s

        return thread_resources[name] if !thread_resources[name].nil?
        return shared_resources[name] if !shared_resources[name].nil?

        resource_factory = Slick::ResourceFactory.create(name)

        if resource_factory.class.shared?
            @mutex.synchronize { shared_resources[name] ||= resource_factory.create }
            shared_resources[name]
        else
            thread_resources[name] = resource_factory.create
            thread_resources[name]
        end
    end

    def []=(name, value)
        thread_resources[name.to_s] = value
        self
    end
    
    def reset(shared = false, thread = true, &block)
        previous_shared_resources = shared_resources
        previous_thread_resources = thread_resources
        @shared_resources = {} if shared
        Thread.current["SLICK_RESOURCES"] = {} if thread
        if block
            begin
                out = block.call
            ensure
                if shared
                    clean_up_resources(shared_resources)
                    @shared_resources = previous_shared_resources
                end
                if thread
                    clean_up_resources(thread_resources)
                    Thread.current["SLICK_RESOURCES"] = previous_thread_resources
                end
            end
            out
        else
            clean_up_resources(previous_shared_resources) if shared
            clean_up_resources(previous_thread_resources) if thread
        end
    end

    def clean_up_resources(resources)
        resources.values.each do |resource|
            resource.clean_up if resource.respond_to?(:clean_up)
        end
    end

end

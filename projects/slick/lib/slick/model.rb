
class Slick::Model

    class << self

        def must_not_be_blank(name, options = {})
            options = { message: "Must not be blank" }.merge(options)
            validate_with do
                if !validation_error?(name) && send(name).to_s.strip == ""
                    set_validation_error(name, options[:message])
                end
            end
        end

        def must_match_pattern(name, pattern, options = {})
            options = { message: "Must match pattern" }.merge(options)
            validate_with do
                if !validation_error?(name) && !send(name).to_s.match(pattern)
                    set_validation_error(name, options[:message])
                end
            end
        end

        def must_be_a_valid_email(name, options = {})
            options = { message: "Must be a valid email" }.merge(options)
            must_match_pattern(name, /\A[^@]+@[^@]+\z/, options)
        end

        def _define_callback_methods(name)
            instance_eval "def #{name}_callbacks; @#{name}_callbacks ||= []; end"
            instance_eval "def #{name}(&block); #{name}_callbacks << block if block; end"
            class_eval "private def _run_#{name}_callbacks; self.class.#{name}_callbacks.each{|block| instance_eval(&block) }; end"
        end
        
    end

    _define_callback_methods :validate_with
    _define_callback_methods :before_validation
    _define_callback_methods :after_validation

    def initialize
        @values = {}
    end

    def validation_errors
        @validation_errors ||= {}
    end

    def set_validation_error(name, message)
        validation_errors[name.to_s] = message.to_s
    end

    def validation_error?(name = nil)
        if name
            !validation_errors[name.to_s].nil?
        else
            validation_errors.keys.count > 0
        end
    end

    def raise_validation_error(errors = {})
        raise Slick::ValidationError.new(errors)
    end

    def validate
        _run_before_validation_callbacks
        validation_errors.clear
        _run_validate_with_callbacks
        raise_validation_error(validation_errors.clone) if validation_error?
        _run_after_validation_callbacks
    end

    def to_form_adapter
        Class.new do
            def initialize(model)
                @model = model
            end

            def title
                "Submit"
            end

            def fields
                []
            end

            def submit_title
                "Submit"
            end

            def cancel_title
                "Cancel"
            end

            def unsaved_changes_confirm
                nil
            end

            def submit(values, &block)
                @model.instance_eval{ @values = values }
                @model.validate
                block.call(@model)
            end
        end.new(self)
    end

    def method_missing(name, *args, &block)
        if args.length == 0
            @values[name.to_s]
        else
            super
        end
    end
end


# import { Base } from '../base.js';
# import { Validatable } from '../validatable.js';

# export default () => {
#     return definition => Base.extend().include({
#         meta(){
#             this.include(Validatable);
#             this.include(definition);
#         },

#         toFormAdapter(){
#             return {
#                 title: 'Submit',
#                 fields: [],
#                 submitTitle: 'Submit',
#                 cancelTitle: 'Cancel',
#                 submit: async (values, fn) => {
#                     Object.assign(this, values);
#                     await this.validate();
#                     return fn(this);
#                 }
#             }
#         }
#     }).new();
# };

require "slick/registry"

class Slick::Util::Html::Node

    extend Slick::Registry

    attr_reader :parent, :attributes, :children

    def initialize(parent = nil, attributes = {})
        @parent = parent
        @attributes = attributes.paramify
        @children = []
    end

    def type
        self.class.name
    end

    def <<(html)
        append(html)
    end
    
    def append(html)
        if !html.kind_of?(Slick::Util::Html::StringReader)
            html = Slick::Util::Html::StringReader.new(html)
            while html.length > 0
                begin
                    send(__callee__, html)
                rescue Slick::Util::Html::CloseTag
                    # do nothing
                end
            end
        end

        while(html.length > 0)
            if(matches = html.match(/\A[^<]+/))
                append_node('#text', value: matches[0])
            elsif(matches = html.match(/\A<!DOCTYPE[^>]*>/i))
                if(!parent)
                    append_node('#doctype')
                end
            elsif(matches = html.match(/\A<!--([\s\S]*?)-->/i))
                append_node('#comment', value: matches[1])
            elsif(matches = html.match(/\A<([^>\s]+)/))
                type = matches[1].downcase
                attributes = {}
        
                while(html.length > 0)
                    if(matches = html.match(/\A\s*([\w-]+)\s*=\s*\"([^\">]*)\"/))
                        attributes[matches[1]] = matches[2].html_unescape
                    elsif(matches = html.match(/\A\s*([\w-]+)\s*=\s*\'([^\'>]*)\'/))
                        attributes[matches[1]] = matches[2].html_unescape
                    elsif(matches = html.match(/\A\s*([\w-]+)\s*=\s*([^\s>]+)/))
                        attributes[matches[1]] = matches[2].html_unescape
                    elsif(matches = html.match(/\A\s*([\w-]+)/))
                        attributes[matches[1]] = nil
                    else 
                        html.match(/\A[^>]*>/)
                        break
                    end
                end
                
                if(matches = type.match(/\A\/(.*)/))
                    raise Slick::Util::Html::CloseTag.new(matches[1])
                end
        
                child = append_node(type, attributes)
                
                if(Slick::Util::Html::SELF_CLOSING_TAGS.include?(type))
                    # do nothing
                elsif(Slick::Util::Html::TEXT_ONLY_TAGS.include?(type) && (matches = html.match(Regexp.new("^([\\s\\S]*?)<\\/#{type}[^>]*>"))))
                    child.send(:append_node, '#text', value: matches[1])
                elsif(Slick::Util::Html::TEXT_ONLY_TAGS.include?(type) && (matches = html.match(/\A([\s\S]+)/)))
                    child.send(:append_node, '#text', value: matches[1])
                else 
                    begin 
                        child.append(html)
                    rescue Slick::Util::Html::CloseTag => e
                        if(e.type != type)
                            raise e
                        end
                    end
                end
            elsif(matches = html.match(/\A[\s\S]/)) 
                append_node('#text', value: matches[0])
            else 
                break
            end
        end
        self
    end

    def index
        if parent
            parent.children.each_with_index do |node, index|
                return index if node == self
            end
        else
            nil
        end
    end

    def level
        out = -1
        current = self
        while current
            current = current.parent
            out += 1
        end
        out
    end

    def replace(html)
        fragment = Slick::Util::Html.parse(html)
        parent = self.parent
        fragment.children.each do |node|
            node.instance_eval{ @parent = parent }
        end
        index = self.index
        parent.children.delete_at(index)
        parent.children.insert(index, *fragment.children)
        fragment.children
    end

    def to_s
        out = []
        out << "<#{type}"
        attributes.each do |name, value|
            out << " #{name.html_escape}=\"#{value.html_escape}\""
        end
        if Slick::Util::Html::SELF_CLOSING_TAGS.include?(type)
            out << " />"
        else
            out << ">"
            children.each do |child|
                out << child.to_s
            end
            out << "</#{type}>"
        end
        out.join
    end

    def inspect
        to_s
    end

    def text
        descendants.filter{|node| node.type == '#text'}.map{|node| node.attributes[:value]}.join
    end

    def descendants
        out = []
        traverse do |node|
            out << node if node != self
        end
        out
    end

    private

    def traverse(&block)
        block.call(self)
        children.clone.each do |child|
            child.send(:traverse, &block)
        end
    end

    def append_node(type, attributes = {})
        out = Slick::Util::Html::Node.create(type, self, attributes)
        children << out
        out
    end

end

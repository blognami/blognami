
require "test_helper"

Class.new Minitest::Test do

    include Slick::Helpers

    def setup
        run_command('reset-database')
    end

    def test_tagable
        assert_equal 0, tagables.count

        user = users.insert name: 'Admin', email: 'admin@example.com', role: 'admin'

        id = posts.insert({
            user_id: user.id,
            title: 'Foo',
            tags: "
                Apple
                Pear
            "
        }).id;

        assert_equal 1, tagables.count
        assert_equal 1, tagables.tagged_with('Apple').count
        assert_equal 1, tagables.tagged_with('Pear').count
        assert_equal 0, tagables.tagged_with('Peach').count
        assert_equal 1, tagables.tagged_with('Apple', 'Pear').count
        assert_equal 0, tagables.tagged_with('Apple', 'Peach').count

        tagable = tagables.id_eq(id).first

        assert_equal 'Foo', tagable.title
        assert_equal 2, tagable.tags.count

        tagable.update(tags: "
            Apple
            Peach    
        ")

        assert_equal 2, tagable.tags.count
        assert_equal 1, tagables.tagged_with('Apple').count
        assert_equal 0, tagables.tagged_with('Pear').count
        assert_equal 1, tagables.tagged_with('Peach').count
        assert_equal 0, tagables.tagged_with('Apple', 'Pear').count
        assert_equal 1, tagables.tagged_with('Apple', 'Peach').count

        tagable.update(tags: '')
        
        assert_equal 0, tagable.tags.count
        assert_equal 0, tagables.tagged_with('Apple').count
        assert_equal 0, tagables.tagged_with('Pear').count
        assert_equal 0, tagables.tagged_with('Peach').count
        assert_equal 0, tagables.tagged_with('Apple', 'Pear').count
        assert_equal 0, tagables.tagged_with('Apple', 'Peach').count
    
    end

end

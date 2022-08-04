
require "test_helper"

Class.new Minitest::Test do

    include Slick::Helpers

    def setup
        run_command('reset-database')
    end

    def test_user
        assert_equal 0, users.count

        id = users.insert(name: 'Admin', email: 'admin@example.com', role: 'admin').id

        assert_equal 1, users.count

        user = users.id_eq(id).first

        assert_equal 'Admin', user.name

        assert_equal 0, user.posts.count

        assert_equal 0, user.posts.tags.count
        
        posts.insert user_id: id, title: 'Foo'

        assert_equal 1, user.posts.count

        assert_equal 0, user.posts.tags.count

        posts.insert user_id: id, title: 'Foo', tags: 'Apple'

        assert_equal 2, user.posts.count

        assert_equal 1, user.posts.tags.count

        posts.insert user_id: id, title: 'Foo', tags: "Apple\nPear\nPeach"

        assert_equal 3, user.posts.count

        assert_equal 3, user.posts.tags.count

        assert_equal 4, tagable_tags.count

        user.posts.delete

        assert_equal 0, tagable_tags.count
    end

end

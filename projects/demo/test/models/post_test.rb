
require "test_helper"

Class.new Minitest::Test do

    include Slick::Helpers

    def setup
        run_command('reset-database')
    end

    def test_post
        assert_equal 0, posts.count

        user = users.insert name: 'Admin', email: 'admin@example.com', role: 'admin'

        id = posts.insert(user_id: user.id, title: 'Foo').id

        assert_equal 1, posts.count

        post = posts.id_eq(id).first

        assert_equal 'Foo', post.title

        assert_equal 'Admin', post.user.name

        post.update title: 'Bar'

        post = posts.id_eq(id).first

        assert_equal 'Bar', post.title

        post.delete

        assert_equal 0, posts.count
    end

end

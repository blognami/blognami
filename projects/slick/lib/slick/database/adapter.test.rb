
require "test_helper"

Class.new Minitest::Test do

    def test_flatten
        

        assert_equal [], flatten(:mysql, [])
        assert_equal ["?", "apple"], flatten(:mysql, ["?", "apple"])
        assert_equal ["apple", "pear"], flatten(:mysql, ["apple", "pear"])
        assert_equal ["?", ["apple"]], flatten(:mysql, ["?", ["apple"]])
        assert_equal ["?", ["apple"]], flatten(:mysql, [["?"], ["apple"]])
        assert_equal ["? < ?", ["apple"], [["pear"]], "plum"], flatten(:mysql, [[["? < ?"]], ["apple"], [["pear"]], [[["plum"]]]])
        assert_equal ["apple", "pear", "plum"], flatten(:mysql, [["apple"], [["pear"]], [[["plum"]]]])

        assert_equal ["apple", "pear", "plum"], flatten(:mysql, [{ mysql: "apple", sqlite: "peach" }, "pear", "plum"])
        assert_equal ["peach", "pear", "plum"], flatten(:sqlite, [{ mysql: "apple", sqlite: ["peach"] }, "pear", "plum"])
        assert_equal ["? = ?", ["peach"], "quince", "pear", "plum"], flatten(:sqlite, [{ mysql: "apple", sqlite: ["? = ?", ["peach"], "quince"] }, "pear", "plum"])
    end
    

    def flatten(adapter, *args)
        adapter = Slick::Database::Adapter.create(adapter, nil)
        adapter.flatten(*args)
    end

end

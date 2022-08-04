
require "securerandom"
require 'digest/sha1'

require "slick/database/row"

Slick::Database::Row.register "user" do
    has_many :sessions

    must_not_be_blank :name
    must_not_be_blank :email
    must_be_a_valid_email :email
    must_not_be_blank :role

    before_validation do
        self.salt = SecureRandom.uuid if !salt
    end

    def generate_password
        generate_passwords(1).pop
    end

    def verify_password(password)
        generate_passwords(3).include?(password)
    end

    def log_successful_sign_in
        update last_successful_sign_in_at: Time.now
    end

    private

    def generate_passwords(count)
        out = []
        unix_timestamp_current_minute_start = database.unix_timestamp / 60 * 60;
        count.times do |i|
            out << Digest::SHA1.base64digest("#{salt}:#{last_successful_sign_in_at}:#{unix_timestamp_current_minute_start - (i * 60)}")[0..8]
        end
        out
    end
end

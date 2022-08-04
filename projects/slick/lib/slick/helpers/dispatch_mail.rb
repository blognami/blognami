
require "slick/helpers"
require "net/smtp"

Slick::Helpers.define_method :dispatch_email do |options = {}|
    smtp_server = '0.0.0.0' 
    smtp_port = 25

    from = options[:from]
    to = options[:to]
    subject = options[:subject]
    text = options[:text]
    if text.kind_of?(Proc)
        text = grab{ text.call }.to_s
    else
        text = text.to_s
    end

    message = []
    message << "From: <#{from}>"
    message << "To: <#{to}>"
    message << "Subject: #{subject}"
    message << "Date: " + Time.now.to_s
    message << ""
    message << text

    message = message.join("\n")

    if environment == 'production'
        Net::SMTP.start(smtp_server, smtp_port) do |smtp|
            smtp.send_message "#{message.gsub(/\n/, "\r\n")}\r\n", from, to
        end
    else
        puts "----------------------------------------"
        puts "dispatch_email".green
        puts "----------------------------------------"
        puts message
        puts "----------------------------------------"
    end
end

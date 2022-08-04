
task :install_dependencies => [ :install_pinstripe_dependencies, :install_slick_dependencies, :install_blognami_dependencies, :install_demo_dependencies ]

task :install_pinstripe_dependencies do
    system "
        cd ./projects/pinstripe
        yarn install
    "
end

task :install_slick_dependencies do
    system "
        cd ./projects/slick
        bundle install
    "
end

task :install_blognami_dependencies do
    system "
        cd ./projects/blognami
        bundle install
    "
end

task :install_demo_dependencies do
    system "
        cd ./projects/demo
        bundle install
    "
end

task :build => [ :build_pinstripe, :build_slick ]

task :build_pinstripe do
    system "
        cd ./projects/pinstripe
        yarn build
    "
end

task :build_slick do
    system "
        cd ./projects/slick
        mkdir -p lib/slick/views/assets/javascripts
        cp ../pinstripe/build/pinstripe.js* lib/slick/views/assets/javascripts
    "
end

task :install_gems => [ :install_slick_gem ]

task :install_slick_gem do
    system "
        cd ./projects/slick
        rake install
    "
end

task :init => [ :install_dependencies, :build, :install_gems ]

task :start do
    system "
        cd ./projects/demo
        WATCH_PATHS=\"#{Dir.pwd}/projects\" slick start-server
    "
end

task :test => [ :test_pinstripe, :test_slick, :test_demo ]

task :test_pinstripe do
    success = system "
        echo ''
        echo '##############################'
        echo '# Testing Pinstripe'
        echo '##############################'
        echo ''
        cd ./projects/pinstripe
        yarn test
    "
    raise "FAILURE" if !success
end

task :test_slick do
    success = system "
        echo ''
        echo '##############################'
        echo '# Testing Slick'
        echo '##############################'
        echo ''
        cd ./projects/slick
        bundle exec rake test
    "
    raise "FAILURE" if !success
end

task :test_demo do
    success = system "
        echo ''
        echo '##############################'
        echo '# Testing Demo'
        echo '##############################'
        echo ''
        cd ./projects/demo
        bundle exec rake test
    "
    raise "FAILURE" if !success
end
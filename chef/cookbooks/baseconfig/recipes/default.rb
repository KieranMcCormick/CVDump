ruby_block 'check node requirements' do
  block do
    puts "Checking RAM: #{node['memory']['total']}"
    raise "Minimum RAM Requirement: 2GB" if node['memory']['total'][0..-3].to_i / 1024 < 2000
  end
end

##### Apache Cassandra #####
Chef.event_handler do
  on :run_failed do
    command 'sudo apt-key adv --keyserver pool.sks-keyservers.net --recv-key A278B781FE4B2BDA'
    command 'sudo apt-get update'
    command 'sudo apt-get -y install cassandra'
    command 'sudo service cassandra start'
  end
end

cookbook_file "cassandra.sources.list" do
  path "/etc/apt/sources.list.d/cassandra.sources.list"
end

execute 'add repo keys' do
  command 'curl -sL https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -'
end

execute 'apt_update' do
  command 'apt-get update'
end

package "cassandra"

systemd_unit 'cassandra' do
  action :restart
end

##### node.js #####
execute 'add_nodesource' do
  command 'curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -'
end

package 'nodejs'

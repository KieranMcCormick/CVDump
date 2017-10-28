ruby_block 'check node requirements' do
  block do
    raise "Minimum RAM Requirement: 2GB" if node['memory']['total'] / 1024 < 2048
  end
end

ruby_block "set-time-now" do
  block do
    node.normal[:cookbook_name][:deployment_time] = Time.new.strftime("%Y-%m-%d %H:%M:%S")
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
  command 'curl https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -'
end

apt_update 'update'

package "cassandra"

systemd_unit 'cassandra' do
  action :restart
end

##### node.js #####
execute 'add_nodesource' do
  command 'curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -'
end

package 'nodejs'

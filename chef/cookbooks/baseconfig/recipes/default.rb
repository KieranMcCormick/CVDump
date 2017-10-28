Chef.event_handler do
  on :run_failed do
    command 'sudo apt-key adv --keyserver pool.sks-keyservers.net --recv-key A278B781FE4B2BDA'
    command 'sudo apt-get update'
    command 'sudo apt-get -y install cassandra'
    command 'sudo service cassandra start'    
  end
end

# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end

execute 'apt_update' do
  command 'apt-get update'
end

execute 'add cassandra repo' do
  command 'echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list'
end

execute 'add repo keys' do
  command 'curl https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -'
end

execute 'apt-get update' do
  command 'sudo apt-get update'
end

execute 'install cassandra' do
  command 'sudo apt-get -y install cassandra'
end

execute 'start database' do
  command 'sudo service cassandra start'
end
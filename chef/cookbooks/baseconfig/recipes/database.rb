execute 'load cql schema' do 
  cwd '/home/ubuntu/project/chef/cookbooks/baseconfig/files/'
  command 'cqlsh -e "source \'schema.cql\'"'
end

execute 'seed database' do
  cwd '/home/ubuntu/project/chef/cookbooks/baseconfig/files/'
  command 'cqlsh -e "source \'seed.cql\'"'
end
# small scale file system setup

directory 'home/ubuntu/files' do
  owner node['runas_user']
  recursive true
  mode '660'
  action :create
end

[1,2,3].each do |n|
  directory "home/ubuntu/files/#{n}" do
    owner node['runas_user']
    recursive true
    mode '660'
    action :create
  end
  [1,2,3].each do |j|
    directory "home/ubuntu/files/#{n}/#{j}" do
      owner node['runas_user']
      recursive true
      mode '660'
      action :create
    end
    [1,2,3].each do |k|
      directory "home/ubuntu/files/#{n}/#{j}/#{k}" do
        owner node['runas_user']
        recursive true
        mode '660'
        action :create
      end
    end
  end
end



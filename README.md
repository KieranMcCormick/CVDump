# Team Poopnado

## Main Project


#### Get Started with Vagrant

Run `vagrant up`.

The site will run over HTTP (port 8080).

To restart the site processes, do `vagrant ssh` and then `sudo systemctl restart sws`.

NOTE: SCSS autorecompilation does not work because fsevents doesn't seem to work over shared folders.
Restart with the above command to see style changes.

NOTE: Please delete `node_modules` to avoid issues. This is not likely to work with Windows.

#### Get Started in Production

Make sure there is an attr.json file with the following:
```
{
  "public_attr": "<fully qualified domain name without protocol>",
  "certbot_email": "<email for certbot registration>",
  "run_list": "recipe[baseconfig]
}
```

Run the following command:
```
cd service-worker-site/chef && sudo chef-client -z -j <absolute path to directory>/attr.json
```

The current node will then be provisioned with the necessary certificates and resources.

PLEASE NOTE: The server must be reachable over the internet at the `public_attr` for certificate provisioning to work.

The site will run over HTTPS (port 443).


#### Have Fun 👍


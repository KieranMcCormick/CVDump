# Team Poopnado

## Main Project


#### Get Started with Vagrant

### NOTE FOR WINDOWS: Run CommandPrompt/GitBash/etc as Administrator (right click icon and Run as Administrator)

Run `vagrant up`.

The site will run over HTTP (port 8080).

To restart the site processes, do `vagrant ssh` and then `sudo systemctl restart main-project`.

NOTE: SCSS autorecompilation does not work because fsevents doesn't seem to work over shared folders.
Restart with the above command to see style changes.


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
cd main-project/chef && sudo chef-client -z -j <absolute path to directory>/attr.json
```

The current node will then be provisioned with the necessary certificates and resources.

PLEASE NOTE: The server must be reachable over the internet at the `public_attr` for certificate provisioning to work.

PLEASE NOTE: You will need to have a `KEY_FILE` with secrets placed in `/home/ubuntu/project` unless you override the `project_path` see the `fake_KEY_FILE` in the chef cookbook for a template.

The site will run over HTTPS (port 443).

#### `fake_production`

There is a way you can simulate running the site in a production configuration.

In the `Vagrantfile`, search for `fake_production` and configure as desired.

#### Have Fun 👍


#Using the `Blocks` tab:

The `Block` section of the website can be a little confusing when starting off, however it is quite simple once you know what you are doing.

To create a new `Block` you first need to enter a name into the `Name of new block` input.

Once you have done this you can either add a new `Header` or `Skill` `Block` by clicking on the appropriate `+` button.

This button will then add a new `Block` with the name you entered to that section.

To edit a `Block`, all you need to do is click on it and start typing in either the rich editor on the top or the text area on the bottom.

The rich text editor allows you to simply start typing and using the wonderful UI to style your text.

If you wish for more control, all you need to do is directly edit the Markdown in the text area.

Once you are done editing make sure you press the `Save` button before clicking away or your edits will not be saved.

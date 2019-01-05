# Team Poopnado

## What's working

All main features are working.
Test data is seeded into the Vagrant instance via Chef.

Upon completion of Vagrant Provisioning, access the site at http://localhost:8080

Users: user1, user2, user3
Password (for all): Pass123$

## What's not working or known bugs

- You may get multiple notifications for comments / sharing.
- You may be able to save multiple copies when creating a new File.

## Special things to note when marking

- To test Notifications, use separate accounts in separate browsers (e.g. Firefox, Chrome, Safari).
  - Do not use Incognito/Private Browsing, as they often do not allow Notifications.
  - You do not get a notification if you comment on something you created / shared.
  - Internet Explorer is not supported.

- We observed that Firefox Quantum (Version 57 and later) has styling issues with flexbox and Material UI library.
  - For best experiences, please use Chrome.

- If you create a new account, you will not have any blocks in your New File page.
  - Please create blocks first via the Blocks page

- 'Save' a File before trying to 'Download PDF' or 'Share File'.

- CAS and LinkedIn Login allow the user to login via external auth from those services.
  - They are sent to the service's login page and then redirected back to the application.
  - For LinkedIn, the user can be provisioned directly with information from LinkedIn.
  - CAS Login requires the user to register first, then connect to CAS via the Profile Page.

- LinkedIn Login requires some credentials/secrets which cannot be checked in to the repo.
  - They need to be put into the /home/ubuntu/KEY_FILE file inside the Vagrant VM.
  - Contact Jonathan Lo (jcl60@sfu.ca) to obtain these secrets.

- This Vagrant VM is configured to be a 'production-like' deployment.
  - Consult the fake_deployment.rb recipe and the fake_nginx-default file to see the configuration.


## Get Started with Vagrant

#### NOTE FOR WINDOWS: Run CommandPrompt/GitBash/etc as Administrator (right click icon and Run as Administrator)

Run `vagrant up`.

The site will run over HTTP (port 8080).

To restart the site processes, do `vagrant ssh` and then `sudo systemctl restart main-project`.

NOTE (not for fake_production): SCSS autorecompilation does not work because fsevents doesn't seem to work over shared folders.
Restart with the above command to see style changes.

If you need to see application logs, do `sudo journalctl -u main-project -f -n 1000`.

fake_production ONLY: You can see nginx logs with `sudo tail -F /var/log/nginx/main-project.access.log -n 1000`.

## Get Started in Production (e.g. some server on EC2/GCE)

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

## `fake_production`

There is a way you can simulate running the site in a production configuration.

In the `Vagrantfile`, search for `fake_production` and configure as desired.

# Have Fun 👍
```
───────────────────────────────────────
───▐▀▄───────▄▀▌───▄▄▄▄▄▄▄─────────────
───▌▒▒▀▄▄▄▄▄▀▒▒▐▄▀▀▒██▒██▒▀▀▄──────────
──▐▒▒▒▒▀▒▀▒▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄────────
──▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▒▒▒▒▒▒▒▒▒▒▒▒▀▄──────
▀█▒▒▒█▌▒▒█▒▒▐█▒▒▒▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌─────
▀▌▒▒▒▒▒▒▀▒▀▒▒▒▒▒▒▀▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐───▄▄
▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌▄█▒█
▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒█▀─
▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▀───
▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌────
─▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐─────
─▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌─────
──▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐──────
──▐▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▌──────
────▀▄▄▀▀▀▀▀▄▄▀▀▀▀▀▀▀▄▄▀▀▀▀▀▄▄▀────────
```

# How to set up a local dev environment of the Colouring Dresden platform


## **Please, only use GitHub branch "opendatacamp2024" (or new branches) for coding!**
(other relevant branches should be protected, but it is better to care about)



## Option 1: Using Image / .ova of prepared Ubuntu-VM with Oracle VirtualBox

- **Ask team of Colouring Dresden for Image File 'Ubuntu-VM.ova' (~6GB)**
- via Online-Access from IOER or via USB Stick
- Import the file in Oracle VirtualBox
### Add **port forwarding** for VM, to get access from host system
<detail>
    If you a running Ubuntu in a virtual environment you will need to configure networking to forward ports from the guest to the host. For Virtual Box the following was configured under NAT port forwarding (found under `Settings -> Network -> Advanced -> Port Forwarding`).

    Name     | Protocol  | Host Port  | Guest Port
    -------- | --------- | ---------- | -----------
    app      | TCP       | 8080       | 3000
    app_dev  | TCP       | 3001       | 3001
    ssh      | TCP       | 4022       | 22

    The `app_dev` mapping is used in development by Razzle which rebuilds and serves client side assets on the fly.

    To run the commands in the rest of this setup guide, either `ssh` into the VirtualBox environment or open the terminal within the Ubuntu GUI.

    If you wish to `ssh`, you will first need to open the terminal in Ubuntu and run the following.

    ```bash
    sudo apt-get install -y openssh-server
    ```

    You can then `ssh` into the VirtualBox VM set up with the port  forwarding described above like so, where `<linuxusername>` is the name you set up during the installation of Ubuntu (you can type `whoami` in the Ubuntu terminal to remind yourself of this).

    ```bash
    ssh <linuxusername>@localhost -p 4022
    ```
</detail>

### Possible ressources for VM
- RAM: 4096 MB
- Number of kernels: 4
- VDI / Size on hard disk: 30 GB
### User of Ubuntu-VM
- username: odc_user
- pw: 2024_col%dd!
### Workarounds
- please care about current british keyboard
- in case of Ubuntu terminal is not opening: go to Settings-->Region & Language (within Ubuntu GUI) and switch to e.g. Canada --> click button "Restart" --> close VM and start again and switch back to UK or US. Open terminal again.
- if odc_user is not in sudoers files / not sudo roots rights --> change to different TTY session e.g. CTRL+ALT+F3 and add new line for odc_user in visudo file. change back to first session: CTRL+ALT+F1 

### Start the application
- start npm
  - set postgres env variables (again, it is required):
  - take care, password for postgres user is without "!" in the end
```bash
export PGPASSWORD=2024_col%dd
export PGUSER=odc_user
export PGHOST=localhost
export PGDATABASE=dresdendb
```

```bash
export PGPORT=5432
export APP_COOKIE_SECRET=123456
export TILECACHE_PATH=~/colouring-core/app/tilecache
```
  
- got to app directory
```bash
cd ~/colouring-core/app
```
- switch to correct branch
```bash
git checkout opendatacamp2024
```

- start npm
```bash
npm start
```


### Viewing the application

The site can then be viewed on http://localhost:8080 on the host computer.

Finally to quit the application type `Ctrl-C`.


### for further information also check:

[Setup a dev environment (Colouring Core version of CCRP)](../setup-dev-environment.md)

- install DBeaver or pgAdmin to get access to postgres database for administration
# How to set up a local dev environment of the Colouring Dresden platform


## **Please, only use GitHub branch "opendatacamp2024" (or new branches) for coding!**
(other relevant branches should be protected, but it is better to care about)



## Option 2: Creating a new Ubuntu VM with Oracle VirtualBox

### At the beginning

- Install Oracle VirtualBox
- Download DB Dump from Colouring Dresden Postgres/PostGIS database (**ask the Colouring Dresden team for access to DB Dump (~160MB)**)

### Create new Ubuntu-VM
- based on Ubuntu 20.04 LTS

### Possible ressources for VM
- RAM: 4096 MB
- Number of kernels: 4
- VDI / Size on hard disk: 30 GB
### Possible user for Ubuntu-VM
- username: odc_user
- pw: 2024_col%dd!
### Workarounds (in case of troubles)
- please care about current british keyboard
- in case of Ubuntu terminal is not opening: go to Settings-->Region & Language (within Ubuntu GUI) and switch to e.g. Canada --> click button "Restart" --> close VM and start again and switch back to UK or US. Open terminal again.
- if odc_user is not in sudoers files / not sudo roots rights --> change to different TTY session e.g. CTRL+ALT+F3 and add new line for odc_user in visudo file. change back to first session: CTRL+ALT+F1 

### Add **port forwarding** for VM, to get access from host system

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



## :tulip: Installing the tools and components

First upgrade the installed packages to the latest versions, to remove any security warnings.

```bash
sudo apt-get update -y
sudo apt-get upgrade -y
```

Now install some essential tools.

```bash
sudo apt-get install -y build-essential git wget curl parallel rename
```

### :red_circle: Installing PostgreSQL

Set the postgres repo for apt (these instructions were taken from [postgresql.org](https://www.postgresql.org/download/linux/ubuntu/)).

```bash
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
```

```bash
sudo wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
```

```bash
sudo apt-get update
```

Next install postgres and postgis to enable support for geographical objects.

```bash
sudo apt-get install -y postgresql-12 postgresql-contrib-12 libpq-dev postgis postgresql-12-postgis-3
```

and additional geo-spatial tools

```bash
sudo apt-get install -y gdal-bin libspatialindex-dev libgeos-dev libproj-dev
```

### :rainbow: Installing Colouring Cities Core Platform

Now clone the `colouring-dresde` codebase. 

```bash
cd ~ && git clone https://github.com/colouring-cities/colouring-dresden.git
```

**Note:** We assume here that you will clone the repo into the home directory of your Ubuntu installation. Watch out for later commands in this guide that assume the repo is located at `~/colouring-dresden` and modify the path if appropriate.

### :arrow_down: Installing Node.js

Now install Node. It is helpful to define some local variables.

```bash
export NODE_VERSION=v16.13.2
export DISTRO=linux-x64
wget -nc https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-$DISTRO.tar.xz
sudo mkdir /usr/local/lib/node
sudo tar xf node-$NODE_VERSION-$DISTRO.tar.xz -C /usr/local/lib/node
sudo mv /usr/local/lib/node/node-$NODE_VERSION-$DISTRO /usr/local/lib/node/node-$NODE_VERSION
rm node-$NODE_VERSION-$DISTRO.tar.xz
```

Now add the Node installation to the path and export this to your bash profile.

```bash
cat >> ~/.profile <<EOF
export NODEJS_HOME=/usr/local/lib/node/node-$NODE_VERSION/bin
export PATH=\$NODEJS_HOME:\$PATH
EOF
```

Then run source to make sure node and npm are on your path.

```bash
source ~/.profile
```

You can check the updated variables as follows

```bash
echo $PATH
echo $NODEJS_HOME
```

### :large_blue_circle: Configuring PostgreSQL

Now we configure postgres. First ensure postgres is running.

```bash
sudo service postgresql start
```

Ensure the `en_US` locale exists.

```bash
sudo locale-gen en_US.UTF-8
```

Configure postgres to listen on network connection.

```bash
sudo sed -i "s/#\?listen_address.*/listen_addresses '*'/" /etc/postgresql/12/main/postgresql.conf
```

Allow authenticated connections from any IP (so includes the host).

```bash
echo "host    all             all             all                     md5" | sudo tee --append /etc/postgresql/12/main/pg_hba.conf > /dev/null
```

Restart postgres to pick up config changes.

```bash
sudo service postgresql restart
```

Create a superuser role for this user (`odc_user`) if it does not already exist. The
password `2024_col%dd` is arbitrary and probably should not be your Ubuntu login password.

```bash
sudo -u postgres psql -c "SELECT 1 FROM pg_user WHERE username = 'odc_user';" | grep -q 1 || sudo -u postgres psql -c "CREATE ROLE odc_user SUPERUSER LOGIN PASSWORD '2024_col%dd';"
```

<details>
<summary>Note for "Colouring Cities" devs</summary><p></p>

If you intend to load the full CL database from a dump file into your dev environment, run the above `psql` command with `<username>` as "cldbadmin" and use that username in subsequent steps, but also run the above a second time with `<username>` as "clwebapp" (see section [:house: Loading the building data](#house-loading-the-building-data) for more details).

</details><p></p>

### :space_invader: Create an empty database

Now create an empty database configured with geo-spatial tools. The database name (`dresdendb`) is arbitrary.

Set environment variables, which will simplify running subsequent `psql` commands.

```bash
export PGPASSWORD=2024_col%dd
export PGUSER=odc_user
export PGHOST=localhost
export PGDATABASE=dresdendb
```

Create the database.

```bash
sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = 'dresdendb';" | grep -q 1 || sudo -u postgres createdb -E UTF8 -T template0 --locale=en_US.utf8 -O odc_user dresdendb
```

```bash
psql -c "create extension postgis;"
psql -c "create extension pgcrypto;"
psql -c "create extension pg_trgm;"
```

### :arrow_forward: Configuring Node.js

Now upgrade the npm package manager to the most recent release with global privileges. This needs to be performed as root user, so it is necessary to export the node variables to the root user profile.

```bash
export NODEJS_HOME=/usr/local/lib/node/node-v16.13.2/bin/
export PATH=$NODEJS_HOME:$PATH
sudo env "PATH=$PATH" npm install -g npm@8.1.2
```

Now install the required Node packages. This needs to done from the `app` directory of your
local repository, so that it can read from the `package.json` file.

```bash
cd ~/colouring-dresden/app
npm install
```

### :snake: Set up Python

Install python and related tools.

```bash
sudo apt-get install -y python3 python3-pip python3-dev python3-venv
```

## :house: Loading the database dump from Colouring Dresden


  
**Using the above command, use pg_restore:**
  ```bash
pg_restore -d dresdendb -U odc_user -Fc -v -C colouring-odc2024_pgdump-custom_dresdendb.binary_20240523_1716474653
```


## :computer: Running the application

Now we are ready to run the application.

First enter the app directory.

```bash
cd ~/colouring-dresden/app
```

Then create a folder for the tilecache.

```bash
mkdir tilecache
```

Create some additional variables for running the application (the `APP_COOKIE_SECRET` is arbitrary).

```bash
export PGPORT=5432
export APP_COOKIE_SECRET=123456
export TILECACHE_PATH=~/colouring-dresden/app/tilecache
```

Finally, simply run the application with npm.

```bash
npm start
```

**Note:** You can also specify the variables for `npm start` like so:
<details>
<summary>
Specify variables
</summary>

```bash
PGPASSWORD=<pgpassword> PGDATABASE=<colouringcitiesdb> PGUSER=<username> PGHOST=localhost PGPORT=5432 APP_COOKIE_SECRET=123456 TILECACHE_PATH=~/colouring-dresden/app/tilecache npm start
```

</details><p></p>

### :eyes: Viewing the application

The site can then be viewed on http://localhost:8080 on the host computer.

Finally to quit the application type `Ctrl-C`.


### for further information also check:

[Setup a dev environment (Colouring Core version of CCRP)](../setup-dev-environment.md)

- install DBeaver or pgAdmin to get access to postgres database for administration
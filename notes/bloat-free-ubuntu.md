---
---

# Bloat-free Ubuntu Installation

- [x] Minimal install
- [x] GUI desktop enviromnent
- [x] Necessary GUI tools
- [x] Start up the GUI
- [x] Build essentials
- [x] Fonts for CJK and developer
- [x] Virtual Box guest additions
- [x] ROS installation

We used Ubuntu Trusty and ROS Indigo in this write-up, but it should work for newer versions.

## Minimal install

Use ubuntu server CD image for a clean and minimum installation.
Then configure software source and update the sources.

```bash
sudo apt-get update
```

## GUI desktop environment

Boot into recovery mode (hold `<shift>` while boot), then resume to shell.

```bash
sudo apt-get install --no-install-recommends xorg gdm menu gksu
sudo apt-get install --no-install-recommends gnome-session gnome-panel gnome-shell
```

If this is enough, you can jump to "Start up the GUI" section.

I personally recommend lightdm+awesome for a minimum-distraction environment (Well, you should really consider using ArchLinux in the first place.)

```bash
sudo apt-get install --no-install-recommends xorg lightdm lightdm-gtk-greeter awesome awesome-extra termit
sudo service lightdm start
```

## Necessary GUI tools

Without `gnome-terminal`, GUI is useless. `synaptic` provides package management under the GUI.

```bash
sudo apt-get install --no-install-recommends gnome-terminal synaptic
```

If you want to tweak system configurations within GUI:

```bash
sudo apt-get install --no-install-recommends gnome-control-center
```

If you want to tweak gnome configurations:

```bash
sudo apt-get install --no-install-recommends gnome-tweak-tool gnome-shell-extensions
```

For some early versions of Ubuntu (14.04 trusty for example), `gnome-tweak-tool` may have a small bug preventing some settings being saved.

Use following fix:

```bash
mkdir -p ~/.config/gtk-3.0
touch ~/.config/gtk-3.0/settings.ini
```

You may also need a file manager and a browser:

```bash
sudo apt-get install --no-install-recommends nautilus firefox
```

## Start up the GUI

Before start up, it is recommended to upgrade everything:

```bash
sudo apt-get update
sudo apt-get upgrade
```

Then kick-off `gdm`

```bash
sudo service gdm start
```

Once you've done that, you will be brought to GUI login for the next boot.

So let's reboot and make everything settled:

```bash
sudo reboot --
```

## Build essentials

This is simple:

```bash
sudo apt-get install --no-install-recommends build-essential
```

## Fonts for CJK and developer

You will need a CJK font, and a nice monospace font, use the ones you like:

```bash
sudo apt-get install fonts-noto-cjk fonts-inconsolata
```

Then open `gnome-tweak-tool` to set them.

## Virtual Box guest additions

If you're installing in virtual box, this is the time you mount the addon disk:

```bash
# cd /media/cdrom
sudo ./VBoxGuestAdditions.run
```

If you try shared folders now, users in guest system may have no permissions.

All you have to do is to add the user to `vboxsf` user group:

```bash
# grant access to virtual box shared folders
sudo usermod -aG vboxsf userName
```

Remember to re-login or reboot for changes to take place.

## ROS installation

This step is fairly straight-forward, as you can follow the installation tutorial on the ROS website:

```bash
# here we used a faster source
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.ustc.edu.cn/ros/ubuntu/ $DISTRIB_CODENAME main" > /etc/apt/sources.list.d/ros-latest.list'
sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key 421C365BD9FF1F717815A3895523BAEEB01FA116
sudo apt-get update

# install indigo
sudo apt-get install ros-indigo-desktop-full

# initialize rosdep
sudo rosdep init
rosdep update

# setup environment
echo "source /opt/ros/indigo/setup.bash" >> ~/.bashrc
source ~/.bashrc

# install rosinstall
sudo apt-get install python-rosinstall
```

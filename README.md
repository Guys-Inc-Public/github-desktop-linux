> ## 🐧 Guys Inc — GitHub Desktop for Linux
>
> This is an **actively-maintained community fork** that continues the excellent Linux
> work of [`shiftkey/desktop`](https://github.com/shiftkey/desktop), which has been
> inactive since mid-2025. Our focus is shipping regular, reliable
> **Ubuntu / Debian (`.deb`)** releases of GitHub Desktop for Linux — with AppImage,
> Flatpak, and `.rpm` builds carried forward as well.
>
> **⚠️ Unofficial build.** GitHub Desktop for Linux is a community project and is **not affiliated with, endorsed by, or supported by GitHub, Inc.** “GitHub” and “GitHub Desktop” are trademarks of GitHub, Inc. This fork exists solely to provide Linux packages of the MIT-licensed source.
>
> - 📦 **Releases:** see the [Releases](https://github.com/Guys-Inc-Public/github-desktop-linux/releases) page
> - 🐛 **Found a bug?** [Open an issue](https://github.com/Guys-Inc-Public/github-desktop-linux/issues)
> - 🙏 **Credit:** huge thanks to [@shiftkey](https://github.com/shiftkey) and all prior
>   contributors for years of Linux packaging work this fork builds on.

---

# [GitHub Desktop](https://desktop.github.com) - The Linux Fork

[![CI / Linux](https://github.com/Guys-Inc-Public/github-desktop-linux/actions/workflows/ci-linux.yml/badge.svg)](https://github.com/Guys-Inc-Public/github-desktop-linux/actions/workflows/ci-linux.yml)

[GitHub Desktop](https://desktop.github.com/) is an open-source [Electron](https://www.electronjs.org/)-based
GitHub app. It is written in [TypeScript](https://www.typescriptlang.org) and
uses [React](https://reactjs.org/).

<picture>
  <source
    srcset="https://user-images.githubusercontent.com/634063/202742848-63fa1488-6254-49b5-af7c-96a6b50ea8af.png"
    media="(prefers-color-scheme: dark)"
  />
  <img
    width="1072"
    src="https://user-images.githubusercontent.com/634063/202742985-bb3b3b94-8aca-404a-8d8a-fd6a6f030672.png"
    alt="A screenshot of the GitHub Desktop application showing changes being viewed and committed with two attributed co-authors"
  />
</picture>

## What is this repository for?

This repository contains specific patches on top of the upstream
`desktop/desktop` repository to support Linux usage.

It also publishes [releases](https://github.com/Guys-Inc-Public/github-desktop-linux/releases) for various Linux distributions:

 - AppImage (`.AppImage`)
 - Debian (`.deb`)
 - RPM (`.rpm`)

## Installation via package manager

You can use your operating system's package manager to install `github-desktop` and
keep it up to date on Debian and RPM-based distributions.

### Debian/Ubuntu

Install the **Guys Inc** signing key and add the repository:

```sh
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://apt.guysinc.pub/guysinc-apt.gpg | sudo tee /etc/apt/keyrings/guysinc-apt.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/guysinc-apt.gpg] https://apt.guysinc.pub stable main" | sudo tee /etc/apt/sources.list.d/guysinc-github-desktop.list
```

The signing key fingerprint is `9129 8955 2DCD 86E6 9150 D032 753B 218B 25FE 5F74`.

#### Installation

Once you have a feed configured, run this command to install the application:

```sh
sudo apt update && sudo apt install github-desktop
```

### Red Hat/CentOS/Fedora

There are two RPM package feeds available, both hosted in the US. You only need
to add one or the other here, as both of these are generated based on the
releases from this repository.

#### [@shiftkey](https://github.com/shiftkey) package feed

```sh
sudo rpm --import https://rpm.packages.shiftkey.dev/gpg.key
sudo sh -c 'echo -e "[shiftkey-packages]\nname=GitHub Desktop\nbaseurl=https://rpm.packages.shiftkey.dev/rpm/\nenabled=1\ngpgcheck=1\nrepo_gpgcheck=1\ngpgkey=https://rpm.packages.shiftkey.dev/gpg.key" > /etc/yum.repos.d/shiftkey-packages.repo'
```

#### [@mwt](https://github.com/mwt) package feed

```sh
sudo rpm --import https://mirror.mwt.me/shiftkey-desktop/gpgkey
sudo sh -c 'echo -e "[mwt-packages]\nname=GitHub Desktop\nbaseurl=https://mirror.mwt.me/shiftkey-desktop/rpm\nenabled=1\ngpgcheck=1\nrepo_gpgcheck=1\ngpgkey=https://mirror.mwt.me/shiftkey-desktop/gpgkey" > /etc/yum.repos.d/mwt-packages.repo'
```

#### Installation

Once you have a feed configured, run this command to install the application:

```sh
# if yum is your package manager
sudo yum install github-desktop

# if dnf is your package manager
sudo dnf install github-desktop

# if zypper is your package manager
sudo zypper ref && sudo zypper in github-desktop
```

#### OpenSUSE

There are two RPM package feeds available, both hosted in the US. You only need
to add one or the other here, as both of these are generated based on the
releases from this repository.

#### [@shiftkey](https://github.com/shiftkey) package feed

```sh
sudo rpm --import https://rpm.packages.shiftkey.dev/gpg.key
sudo sh -c 'echo -e "[shiftkey-packages]\nname=GitHub Desktop\nbaseurl=https://rpm.packages.shiftkey.dev/rpm/\nenabled=1\ngpgcheck=1\nrepo_gpgcheck=1\ngpgkey=https://rpm.packages.shiftkey.dev/gpg.key" > /etc/zypp/repos.d/shiftkey-packages.repo'
```

#### [@mwt](https://github.com/mwt) package feed

```sh
sudo rpm --import https://mirror.mwt.me/shiftkey-desktop/gpgkey
sudo sh -c 'echo -e "[mwt-packages]\nname=GitHub Desktop\nbaseurl=https://mirror.mwt.me/shiftkey-desktop/rpm\nenabled=1\ngpgcheck=1\nrepo_gpgcheck=1\ngpgkey=https://mirror.mwt.me/shiftkey-desktop/gpgkey" > /etc/zypp/repos.d/mwt-packages.repo'
```

#### Installation

```sh
sudo zypper ref && sudo zypper in github-desktop
```


## Other Distributions

### Arch Linux

Arch Linux users can install GitHub Desktop from the [AUR](https://aur.archlinux.org/packages/github-desktop-bin/).

`gnome-keyring` is required and the daemon must be launched either at login or when the X server is started. Normally this is handled by a display manager, but in other cases following the instructions found on the [Arch Wiki](https://wiki.archlinux.org/index.php/GNOME/Keyring#Using_the_keyring_outside_GNOME) will fix the issue of not being able to save login credentials.

### Cross-Distribution Packages

GitHub Desktop is also available cross-platform as a [Flatpak](https://github.com/flathub/io.github.shiftey.Desktop) and [AppImage](https://appimage.github.io/GitHubDesktop/).

### deb-get

Debian/Ubuntu users can also install directly from this repository using [`deb-get`](https://github.com/wimpysworld/deb-get): `deb-get install github-desktop`.

## Known issues

If you're having troubles with Desktop, please refer to the [Known issues](docs/known-issues.md#linux)
document for guidance and workarounds for common limitations.

If your package manager is still trying to reach PackageCloud, refer to the
[cleanup instructions](docs/known-issues.md#the-packagecloud-package-feed-is-no-longer-working)
for details about migrating away.

## More information

Please check out the [README](https://github.com/desktop/desktop#github-desktop)
on the upstream [GitHub Desktop project](https://github.com/desktop/desktop) and
[desktop.github.com](https://desktop.github.com) for more product-oriented
information about GitHub Desktop.

See our [getting started documentation](https://docs.github.com/en/desktop/overview/getting-started-with-github-desktop) for more information on how to set up, authenticate, and configure GitHub Desktop.

## License

**[MIT](LICENSE)**

The MIT license grant is not for GitHub's trademarks, which include the logo
designs. GitHub reserves all trademark and copyright rights in and to all
GitHub trademarks. GitHub's logos include, for instance, the stylized
Invertocat designs that include "logo" in the file title in the following
folder: [logos](app/static/logos).

GitHub® and its stylized versions and the Invertocat mark are GitHub's
Trademarks or registered Trademarks. When using GitHub's logos, be sure to
follow the GitHub [logo guidelines](https://github.com/logos).

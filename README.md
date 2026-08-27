> ## 🐧 Guys Inc — GitHub Desktop for Linux
>
> This is an **actively-maintained community fork** that continues the excellent Linux
> work of [`shiftkey/desktop`](https://github.com/shiftkey/desktop), which has been
> inactive since mid-2025. Our focus is shipping regular, reliable
> **Ubuntu / Debian (`.deb`)** releases of GitHub Desktop for Linux — with `.rpm`
> and AppImage builds too.
>
> **⚠️ Unofficial build.** GitHub Desktop for Linux is a community project and is **not affiliated with, endorsed by, or supported by GitHub, Inc.** “GitHub” and “GitHub Desktop” are trademarks of GitHub, Inc. This fork exists solely to provide Linux packages of the MIT-licensed source.
>
> - 📦 **Releases:** see the [Releases](https://github.com/Guys-Inc-Public/github-desktop-linux/releases) page
> - 🐛 **Found a bug?** [Open an issue](https://github.com/Guys-Inc-Public/github-desktop-linux/issues)
> - 🙏 **Credit:** huge thanks to [@shiftkey](https://github.com/shiftkey) and all prior
>   contributors for years of Linux packaging work this fork builds on.

---

# GitHub Desktop for Linux

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

## Install on Debian / Ubuntu (recommended)

Our **signed APT repository** installs `github-desktop` and keeps it up to date through `apt`:

```sh
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://apt.guysinc.pub/guysinc-apt.gpg | sudo tee /etc/apt/keyrings/guysinc-apt.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/guysinc-apt.gpg] https://apt.guysinc.pub/github-desktop stable main" | sudo tee /etc/apt/sources.list.d/guysinc-github-desktop.list
sudo apt update && sudo apt install github-desktop
```

The repository is GPG-signed; the signing key fingerprint is
`F45B B6D3 4D82 EF56 BB97 FBE0 F305 FB33 592B 46C8`.

## Other distributions

Prebuilt packages for every release are on the
[Releases](https://github.com/Guys-Inc-Public/github-desktop-linux/releases) page —
`.deb`, `.rpm`, and `.AppImage` for x64 and ARM.

### Fedora / RHEL / openSUSE (`.rpm`)

We don't host an RPM repository yet, so install the downloaded package directly:

```sh
sudo dnf install ./GitHubDesktop-linux-*.rpm     # Fedora / RHEL
sudo zypper install ./GitHubDesktop-linux-*.rpm  # openSUSE
```

### AppImage (any distribution)

```sh
chmod +x GitHubDesktop-linux-*.AppImage
./GitHubDesktop-linux-*.AppImage
```

### Arch Linux

`gnome-keyring` is required for saving credentials — see the
[Arch Wiki](https://wiki.archlinux.org/index.php/GNOME/Keyring#Using_the_keyring_outside_GNOME).
Community-maintained AUR packages may exist but are **not** produced by this project.

## Known issues

If you hit trouble, see the [Known issues](docs/known-issues.md#linux) document for
guidance and workarounds.

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

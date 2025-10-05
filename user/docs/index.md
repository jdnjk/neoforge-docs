---
sidebar_position: 0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# NeoForge 用户指南

无论您是普通玩家、整合包开发者还是服务器管理员，本指南旨在帮助您准备计算机以运行 NeoForge，并解答一些常见问题。

本指南主要帮助您使用 Mojang 提供的官方 Minecraft 启动器安装 NeoForge。此外，还有一些第三方启动器可以为您自动化此过程，其中一些在[第三方启动器][launchers]文章中提到。

## Java

要运行 NeoForge，您需要先在计算机上安装 Java。Java 是 Minecraft 和 NeoForge 所使用的编程语言。虽然 Minecraft 使用启动器下载所需的 Java 版本，但 NeoForge 需要您自行安装 Java。

所需的 Java 版本取决于您想运行的 Minecraft 版本：

| Minecraft 版本 | Java 版本 |
|:--------------:|:---------:|
|   1.20.2-1.20.4   |      17      |
|   1.20.5-最新版本   |      21      |

:::info
虽然 NeoForge 支持 Minecraft **1.20.1**，但我们建议在该版本上使用 Forge，因为 Forge 对 Minecraft 1.20.1 提供了更长时间的支持。我们仅建议在 Minecraft 1.20.2 及更新版本上使用 NeoForge。
:::

### 检测是否已安装 Java

_如果您确定未安装 Java，可以跳过此部分，直接前往[安装 Java][installingjava]。_

在许多情况下，您的系统可能已经安装了 Java。因此，您需要验证版本是否正确。

- 打开终端。具体操作因操作系统而异：

<Tabs defaultValue="windows">
  <TabItem value="windows" label="Windows">
在左下角的开始菜单中，搜索 `命令提示符` 并按 Enter。
  </TabItem>
  <TabItem value="macos" label="MacOS">
打开 Finder。在 Finder 中，打开 Applications/Utilities 文件夹并双击 Terminal。
  </TabItem>
  <TabItem value="linux" label="Linux">
打开您的 Linux 发行版的终端。常见名称可能是 `GNOME Terminal` 或 `Konsole`，但可能因具体设置而异。
  </TabItem>
</Tabs>

- 输入以下命令：`java -version` 并按 Enter。
- 如果显示错误，则说明未安装 Java，您可以跳至[安装 Java][installingjava]部分。
- 如果已安装 Java，您应该看到以下输出（或类似内容）：
```
openjdk version "21.0.4" 2024-07-16 LTS
OpenJDK Runtime Environment Temurin-21.0.4+7 (build 21.0.4+7-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.4+7 (build 21.0.4+7-LTS, mixed mode, sharing)
```
- 验证 `version` 后的第一个数字是否与所需的 Minecraft 版本匹配。
  - 例如，`openjdk version "21.0.4" 2024-07-16 LTS` 是 Java 21 版本，因此适用于 Minecraft 1.20.5 及更新版本。
  - 如果版本不匹配，则需要[安装正确的 Java 版本][installingjava]。
- 如果一切正常，请继续阅读[安装 NeoForge][installingneoforge]。

### 安装 Java

安装 Java 的方法取决于您的操作系统。请确保下载正确版本的 Java，并确保下载 64 位版本，因为现代版本的 Minecraft 不再支持 32 位 Java。

<Tabs defaultValue="windows">
  <TabItem value="windows" label="Windows">
从 [Adoptium 项目](https://adoptium.net/temurin/releases/?version=21&os=windows) 下载 JDK `.msi` 文件。在文件系统中打开刚下载的 `.msi` 文件，双击并完成安装程序。
  </TabItem>
  <TabItem value="windows_server" label="Windows（服务器）">
使用以下 `winget` 命令下载 JDK（如有必要，请更改版本号）：

```
winget install -e --id=Microsoft.OpenJDK.21
```
  </TabItem>
  <TabItem value="macos" label="MacOS">
从 [Adoptium 项目](https://adoptium.net/temurin/releases/?version=21&os=mac) 下载 JDK `.pkg` 文件。在文件系统中打开刚下载的 `.pkg` 文件，双击并完成安装程序。
  </TabItem>
  <TabItem value="linux" label="Linux">
打开您的 Linux 发行版的终端。常见名称可能是 `GNOME Terminal` 或 `Konsole`，但可能因具体设置而异。

然后，使用系统的包管理器（例如 Ubuntu 和 Debian 上的 `apt`，CentOS 上的 `yum`，Fedora 上的 `dnf`，或 Arch 上的 `pacman`）安装 Java。包的确切名称可能有所不同，但通常 `openjdk-21`（如有必要，请更换版本号）是一个不错的选择。

一些发行版还提供了安装 Java 的文档和/或附加工具：

<ul>
  <li>[在 Arch 上安装 Java][arch]</li>
  <li>[在 Debian 上安装 Java][debian]</li>
  <li>[在 Fedora 上安装 Java][fedora]</li>
  <li>[在 Ubuntu 上安装 Java][ubuntu]</li>
</ul>

  </TabItem>
</Tabs>

安装完成后，建议再次[检测是否已安装 Java][testingforjava]，以确保一切正常。

## 安装 NeoForge

成功安装 Java 后，您现在可以安装 NeoForge 本体。

- 如果您想在单人模式下使用 NeoForge 或加入 NeoForge 服务器，请阅读[安装 NeoForge 客户端][client]。
- 如果您想使用 NeoForge 运行服务器，请阅读[安装 NeoForge 服务器][server]。

## 获取更多帮助

本指南涵盖了 NeoForge 用户可能遇到的大多数问题，但并非详尽无遗，您可能会遇到未在此处涵盖的问题。

常见问题可以在[故障排除与常见问题解答][faq]文章中找到。有关更多支持，请参阅 FAQ 的[获取支持][support]部分。

[arch]: https://wiki.archlinux.org/title/Java
[client]: client.md
[debian]: https://wiki.debian.org/Java
[faq]: faq.md
[fedora]: https://docs.fedoraproject.org/zh_Hans/quick-docs/installing-java
[installingjava]: #installing-java
[installingneoforge]: #installing-neoforge
[launchers]: launchers.md
[server]: server.md
[support]: faq.md#getting-support
[testingforjava]: #testing-for-java
[ubuntu]: https://ubuntu.com/tutorials/install-jre

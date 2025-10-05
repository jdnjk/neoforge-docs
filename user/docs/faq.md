---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 故障排除与常见问题解答

本页面列出了一些安装或运行 NeoForge 整合包时的常见问题。如果您的问题未在此处列出，请参阅[获取支持][support]部分。

## 安装 Java 或 NeoForge

### 我下载了安装程序文件，但无法运行它！

请参阅[安装 Java][installjava]部分。是的，即使您已经安装了 Minecraft: Java Edition。

### 我安装了 Java，但仍然显示版本错误！

这可能意味着您的 PATH 变量未设置或设置不正确。PATH 变量是一个系统变量，用于告诉计算机在哪里找到 Java。根据您的操作系统，执行以下步骤进行修复：

<Tabs defaultValue="windows">
  <TabItem value="windows" label="Windows">
下载并运行 [Jarfix 程序][jarfix]。
  </TabItem>
  <TabItem value="macos" label="MacOS">
打开 Finder。在 Finder 中，打开 Applications/Utilities 文件夹并双击 Terminal。

运行以下命令：

- `echo export "JAVA_HOME=\$(/usr/libexec/java_home)" >> ~/.zshenv`
- `echo export "PATH=$PATH:$JAVA_HOME/bin" >> ~/.zshenv`

然后，关闭 Terminal 并重试。
  </TabItem>
  <TabItem value="linux" label="Linux">
许多常见的 Linux 发行版都有专门的程序来管理 PATH 变量。请参阅它们各自的 Java 安装说明：

<ul>
  <li>[在 Arch 上安装 Java][arch]</li>
  <li>[在 Debian 上安装 Java][debian]</li>
  <li>[在 Fedora 上安装 Java][fedora]</li>
  <li>[在 Ubuntu 上安装 Java][ubuntu]</li>
</ul>

如果您使用的是其他发行版，您需要查找适用于您特定发行版的方法，或者通过控制台手动设置 PATH 变量。

为此，打开您的 Linux 发行版的终端。常见名称可能是 `GNOME Terminal` 或 `Konsole`，但可能因具体设置而异。

找到 Java 的存储位置。通常，这可能是 `/usr/lib/jvm/java-21-openjdk-amd64`。

运行以下命令：

- `echo export "JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64/" >> ~/.bashrc`（如果需要，请替换为实际路径）
- `echo export "PATH=$PATH:$JAVA_HOME/bin" >> ~/.bashrc`

然后，关闭终端并重试。
  </TabItem>
</Tabs>

### 我收到错误提示“无法找到或加载主类 @user_jvm_args.txt”，该怎么办？

这通常有两个原因：

- 您正在运行过时版本的 Java。请参阅[安装 Java][installjava]部分。
- 您的计算机上安装了多个 Java 版本，可能刚刚安装了一个新版本，但计算机仍在使用旧版本。这意味着您的 PATH 变量未正确设置。请按照[此处][wrongjava]的步骤操作。

## 使用 NeoForge

<!--
This subsection is used as the target for links.neoforged.net/early-display-errors. Avoid changing the title, or update the short link target as well if necessary.
-->
### 启动时的显示错误

如果您正在阅读此内容，您很可能是被启动早期出现的错误消息重定向到此处的。这通常意味着系统的图形设置存在问题。

- 请参考 [Minecraft 的视频和图形问题 FAQ][mcdriver] 并按照其中的步骤操作。
- 如果仍然无效，请尝试更新图形驱动程序。请参阅[我遇到了视觉问题！][visual]。
- 如果仍然无效，请[加入我们的 Discord 服务器][support]与我们联系，因为很明显有问题。作为一种解决方法：
    - 打开您的实例文件夹。如果您使用的是[第三方启动器][launcher]，它们通常会提供一个类似于“打开实例文件夹”的按钮。如果您使用的是原版启动器，请使用[模组配置文件][clientinstall]中设置的文件夹。
    - 进入 `config` 文件夹。
    - 使用您喜欢的文本编辑器（例如 Windows 记事本）打开 `fml.toml` 文件。
    - 将 `earlyWindowControl=true` 行更改为 `earlyWindowControl=false`。
    - 保存更改后的文件。
    - 再次尝试启动游戏。

### 我的游戏很卡！我该怎么办？

确定问题是出在服务器端还是客户端（或两者）。

- 如果您的游戏运行帧率（FPS）较低，请阅读[我的客户端很卡！我该怎么办？][clientlag]。
- 如果您的游戏帧率尚可，但世界运行缓慢（例如机器运行过慢、实体视觉延迟等），请阅读[我的服务器很卡！我该怎么办？][serverlag]。

### 我的服务器很卡！我该怎么办？

这可能有多种原因。常见问题是附近有太多实体（例如生物或掉落物）或方块实体（例如箱子、机器等）。

如果您想确切了解是什么导致了卡顿，可以尝试使用 [Spark][spark] 模组。Spark 是一个性能分析工具，可以告诉您哪些代码路径耗时较长。使用方法如下：

- 加入一个世界。
- 运行 `/spark profiler` 命令。
- 等待几分钟。
- 运行 `/spark profiler --stop` 命令。
- 打开链接查看分析结果。如果您无法理解，可以将其发布到 [Discord 服务器][support] 的 `#user-support` 频道，我们会尽力帮助您。

### 我的客户端很卡！我该怎么办？

这通常是因为 Minecraft 本身优化较差，而模组可能会加剧这一问题。

如果您正在运行光影，可能是您的显卡性能不足以支持它们。尝试禁用光影，看看是否能解决问题。

如果您想确切了解是什么导致了卡顿，可以尝试使用 [Spark][spark] 模组。Spark 是一个性能分析工具，可以告诉您哪些代码路径耗时较长。使用方法如下：

- 加入一个世界。
- 运行 `/sparkc profiler` 命令。（注意使用 `/sparkc` 而不是 `/spark` 来分析客户端性能。）
- 等待几分钟。
- 运行 `/sparkc profiler --stop` 命令。
- 打开链接查看分析结果。如果您无法理解，可以将其发布到 [Discord 服务器][support] 的 `#user-support` 频道，我们会尽力帮助您。

### 如何找到有问题的模组？

如果您需要在没有任何线索的情况下找到有问题的模组，最好的方法可能是使用二分搜索。二分搜索是一种常见的方法，可以在许多事物中找到问题，而无需逐一检查。对于模组，操作如下：

1. 移除一半的模组并将它们放入另一个文件夹。
    - 确保依赖关系（需要其他模组的模组）保持完整。
2. 运行游戏。
3. 确定问题是否仍然存在。
    - 如果是：从步骤 1 开始，使用当前的模组继续。
    - 如果否：将最近移除的模组与当前模组交换，然后从步骤 1 开始。
4. 重复此过程，直到找到有问题的模组。

### 我遇到了视觉问题！

视觉问题通常是由过时的图形驱动程序引起的。请根据您的显卡品牌更新图形驱动程序：[AMD][amd] | [Intel][intel] | [NVIDIA][nvidia]

如果更新图形驱动程序后问题仍然存在，请参阅[获取支持][support]。

## 获取支持

如果您的问题未在此处列出，请随时加入 [Discord 服务器][discord] 并在 `#user-support` 频道中寻求帮助。在寻求帮助时，请尽可能提供以下信息：

- 日志文件（特殊类型的文本文件）。
    - 如果是安装问题，日志文件位于安装程序所在位置，文件名后缀为 `.jar`（如果启用了文件扩展名，则为 `.log`）。
    - 如果是游戏问题，日志文件位于实例文件夹中的 `logs` 文件夹，文件名为 `debug` 或 `debug.log`（如果启用了文件扩展名）。
- 如果您生成了 [Spark 报告][sparkreport]，请一并提供。

### 没有 `debug.log` 文件！

如果您使用 [CurseForge 应用][curseforge] 游戏，可能是应用禁用了 `debug.log` 文件的生成。在这种情况下，您需要重新启用它。操作如下：

- 打开设置（左下角齿轮图标）。
- 在游戏特定设置中，导航到 Minecraft。
- 在高级设置下，启用“启用 Forge debug.log”选项。

然后，重新启动游戏以生成新的 `debug.log`。

如果您未使用 CurseForge，或者即使启用了日志选项仍然没有 `debug.log`，可能是游戏在生成 `debug.log` 之前就崩溃了。在这种情况下，启动器日志可以帮助我们。

要获取启动器日志，请打开您的 [`.minecraft`][dotminecraft] 文件夹，找到 `launcher_log` 文件（如果启用了文件扩展名，则为 `launcher_log.txt`）。

### 我的 .minecraft 文件夹在哪里？

根据您的操作系统，`.minecraft` 文件夹位于以下位置：

<Tabs defaultValue="windows">
  <TabItem value="windows" label="Windows">
`%APPDATA%\.minecraft`
  </TabItem>
  <TabItem value="macos" label="MacOS">
`~/Library/Application Support/minecraft`
  </TabItem>
  <TabItem value="linux" label="Linux">
`~/.minecraft`
  </TabItem>
</Tabs>

[amd]: https://www.amd.com/zh-cn/support
[arch]: https://wiki.archlinux.org/title/Java
[clientinstall]: client.md#installing
[clientlag]: #my-client-is-lagging-what-can-i-do
[curseforge]: launchers.md#curseforge-app
[debian]: https://wiki.debian.org/Java
[discord]: https://discord.neoforged.net/
[dotminecraft]: #where-is-my-minecraft-folder
[fedora]: https://docs.fedoraproject.org/zh_Hans/quick-docs/installing-java
[intel]: https://www.intel.cn/content/www/cn/zh/support/detect.html
[installjava]: index.md#installing-java
[jarfix]: https://johann.loefflmann.net/en/software/jarfix/index.html
[launcher]: launchers.md
[mcdriver]: https://aka.ms/mcdriver
[nvidia]: https://www.nvidia.cn/drivers/lookup/
[serverlag]: #my-server-is-lagging-what-can-i-do
[spark]: https://www.curseforge.com/minecraft/mc-mods/spark
[sparkreport]: #my-game-is-lagging-what-can-i-do
[support]: #getting-support
[ubuntu]: https://ubuntu.com/tutorials/install-jre
[visual]: #i-am-having-visual-issues
[wrongjava]: #i-installed-java-but-im-still-getting-the-wrong-version

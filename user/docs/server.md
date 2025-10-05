---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 安装 NeoForge 服务器

_本文假设您[已安装正确版本的 Java][java]。_

## 安装

<Tabs defaultValue="linux">
  <TabItem value="linux" label="Linux/MacOS">
在 Linux 或 MacOS 上运行 NeoForge 服务器需要您具备基本的终端命令使用能力。

- 转到您希望安装服务器的文件夹。
- 使用 `wget` 从 Maven 下载安装程序 `.jar` 文件（根据需要替换版本号和 `-beta` 标签）：
```shell
wget https://maven.neoforged.net/releases/net/neoforged/neoforge/21.4.111-beta/neoforge-21.4.111-beta-installer.jar
```
- 使用以下命令运行安装程序：`java -jar /path/to/neoforge-installer.jar --installServer`。
- （可选）在新创建的 `user_jvm_args.txt` 文件中修改服务器分配的内存大小以及其他 JVM 参数。有关更多信息，请参阅文件中的注释。
- 使用 `./run.sh` 启动服务器。服务器将在首次运行时关闭。
- 打开 `eula.txt` 文件，将 `eula=false` 更改为 `eula=true`。通过这样做，您同意在操作服务器时遵守 [Minecraft EULA][eula]。
- 再次使用 `./run.sh` 启动服务器。

您的服务器现在应该可以正常运行了。您可能需要进行一些环境设置，例如在系统和/或网络防火墙中打开 Minecraft 端口（默认为 25565）。如果您计划让服务器 24/7 运行，还应使用 cronjob 或类似工具安排定期重启。
  </TabItem>
  <TabItem value="windows" label="Windows">
在 Windows 上运行 NeoForge 服务器需要您具备基本的终端命令使用能力。

- 转到您希望安装服务器的文件夹。
- 使用 `curl` 从 Maven 下载安装程序 `.jar` 文件（根据需要替换版本号和 `-beta` 标签）：
```shell
curl -O https://maven.neoforged.net/releases/net/neoforged/neoforge/21.4.111-beta/neoforge-21.4.111-beta-installer.jar
```
- 使用以下命令运行安装程序：`java -jar /path/to/neoforge-installer.jar --installServer`。
- （可选）在新创建的 `user_jvm_args.txt` 文件中修改服务器分配的内存大小以及其他 JVM 参数。有关更多信息，请参阅文件中的注释。
- 使用 `.\run.bat` 启动服务器。服务器将在首次运行时关闭。
- 打开 `eula.txt` 文件，将 `eula=false` 更改为 `eula=true`。通过这样做，您同意在操作服务器时遵守 [Minecraft EULA][eula]。
- 再次使用 `.\run.bat` 启动服务器。

您的服务器现在应该可以正常运行了。您可能需要进行一些环境设置，例如在系统和/或网络防火墙中打开 Minecraft 端口（默认为 25565）。如果您计划让服务器 24/7 运行，还应使用 Windows 任务计划程序安排定期重启。
  </TabItem>
</Tabs>

## 添加模组

首次启动游戏后，将会出现一个 `mods` 文件夹。您需要将模组文件放入该文件夹中。

模组文件应仅从可信来源下载。我们通常推荐您从 [CurseForge][curseforge] 或 [Modrinth][modrinth] 获取模组。

## 更新

要更新服务器的 NeoForge 版本，只需按照与旧版本相同的方式下载并运行新版本的安装程序。安装程序会自动替换旧版本的相关内容。

:::danger
在更新 NeoForge 或模组之前，请务必备份您的世界！
:::

## 安装整合包

在服务器上安装预制整合包通常需要一些额外的设置。由于整合包是[第三方启动器][launchers]的功能，因此需要使用一个启动器来在服务器上安装整合包。

- 按上述步骤安装服务器。
- 在您的启动器中，如果整合包提供了“服务器包”，请安装一个单独的服务器包实例。否则，请安装一个单独的普通包实例。
- 将新安装实例的所有内容移动到服务器的游戏文件夹中。
- （可选）从服务器中移除客户端模组。
  - 什么是客户端模组并不总是很清楚，通常需要反复试验。客户端模组通常执行视觉相关的功能，例如启用着色器或额外的资源包功能。
  - 如果您安装了服务器包，这一步通常已经为您完成。
- 使用 `./run.sh`（Linux）或 `.\run.bat`（Windows）启动服务器。

## 另见

- [设置 Java 版服务器][wiki1] 和 [服务器维护][wiki2]（来自 [Minecraft Wiki][wiki]）——请注意，这些文章讨论的是设置原版 Minecraft 服务器，而不是模组服务器。

[curseforge]: https://www.curseforge.com/minecraft/search?class=mc-mods
[eula]: https://www.minecraft.net/zh-hans/eula
[java]: index.md#java
[launchers]: launchers.md
[modrinth]: https://modrinth.com/mods
[wiki]: https://zh.minecraft.wiki/
[wiki1]: https://zh.minecraft.wiki/w/Tutorial:%E6%9E%B6%E8%AE%BEJava%E7%89%88%E6%9C%8D%E5%8A%A1%E5%99%A8
[wiki2]: https://zh.minecraft.wiki/w/Tutorial:%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%BB%B4%E6%8A%A4

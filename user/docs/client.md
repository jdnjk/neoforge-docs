---
sidebar_position: 1
---

# 安装 NeoForge 客户端

_本文假设您[已安装正确版本的 Java][java]，并且您使用的是（原版）Minecraft 启动器。如果您使用的是[第三方启动器][launchers]，请参考其文档。_

## 安装

安装 NeoForge：

- 关闭 Minecraft 启动器。
- 从[NeoForged][neoforged]下载安装程序 `.jar` 文件。
- 确保选择了 `安装客户端`，然后点击 `继续`。
- 打开 Minecraft 启动器。一个 NeoForged 的运行选项应该已经出现。

虽然您可以直接使用该运行选项，但建议在处理模组实例时使用自定义启动配置文件，以便将模组与原版游戏隔离。为此，Minecraft 启动器提供了在“安装”选项卡中创建自定义配置文件的功能：

- 转到“安装”选项卡。
- 点击“新建安装”。
- 为您的新安装命名。
- 选择所需的 NeoForge 版本。
- 选择游戏目录。此目录应为标准[`.minecraft`][dotminecraft]目录之外的单独文件夹。
- 点击“安装”并启动配置文件。

## 添加模组

首次启动游戏后，指定的游戏目录中会出现一个 `mods` 文件夹。您需要将模组文件放入该文件夹中。

模组文件应仅从可信来源下载。我们通常推荐您从 [CurseForge][curseforge] 或 [Modrinth][modrinth] 获取模组。

## 更新

要更新您的 NeoForge 版本，只需按照上述步骤下载并运行新版本的安装程序。然后，转到启动器的“安装”选项卡，并将 NeoForge 配置文件中的版本更改为新版本。

:::danger
在更新 NeoForge 或模组之前，请务必备份您的世界！

要备份您的世界，请打开游戏目录并选择 `saves` 子文件夹。然后，将带有您世界名称的文件夹（例如 `New World`）复制到安全位置。

如果更新过程中出现任何问题，请删除更新后的世界文件夹，将 NeoForge 和/或模组降级到之前使用的版本，然后将您的世界备份复制回 `saves` 文件夹。
:::

## 安装整合包

Minecraft 启动器不提供自动安装模组及其配置文件集合（即整合包）的功能。这通常属于[第三方启动器][launchers]的功能范围。

:::tip
如果您正在自行制作整合包，我们建议您查看[整合包文档][modpack]以获取一些提示和技巧。
:::

[curseforge]: https://www.curseforge.com/minecraft/search?class=mc-mods
[dotminecraft]: https://minecraft.wiki/w/.minecraft
[java]: index.md#java
[launchers]: launchers.md
[modpack]: /modpack/docs
[modrinth]: https://modrinth.com/mods
[neoforged]: https://neoforged.net

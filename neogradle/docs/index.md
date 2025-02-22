---
sidebar_position: 0
---

# NeoGradle 文档

这是 [NeoGradle] 的官方文档，一个用于开发 [NeoForge] 及其 Mod 的 [Gradle] 插件。

本文档**仅适用于 NeoForge**，**不**是 Java、Groovy/Kotlin 或 Gradle 的教程。

如果您想为文档做出贡献，请阅读 [贡献指南][contributing]。

## Adding the Plugin

NeoGradle can be added using the `plugins` block in `build.gradle` by adding the NeoForged maven to the available plugin repositories in `settings.gradle`:

```gradle
// In settings.gradle
pluginManagement {
    repositories {
        // ...

        // Add the NeoForged maven
        maven { url = 'https://maven.neoforged.net/releases' }
    }
}
```

```gradle
// In build.gradle
plugins {
    // Add the NeoGradle userdev plugin
    id 'net.neoforged.gradle.userdev' version '7.0.120'

    // ...
}
```

:::note
While you can use version ranges for the NeoGradle plugin, it is not recommended to do so, as that may lead to more frequent decompilation and recompilation rounds and possible behavioral changes. You can find the latest NeoGradle version on our [Project Listing][gradlelisting].
:::

## Adding the NeoForge dependency

In order to get the decompiled Minecraft environment and the NeoForge classes in your development environment, you just need to add the `net.neoforged:neoforge` dependency to a configuration for both a runtime and compile-time dependencies (usually `implementation`):

```gradle
dependencies {
    // highlight-next-line
    implementation 'net.neoforged:neoforge:20.6.43-beta'
}
```

:::note
[NeoForge's MDK][mdk] sets the NeoForge version via [gradle.properties][properties]. You can find the latest NeoForge version on our [Project Listing][neolisting].
:::

[NeoGradle]: https://github.com/neoforged/NeoGradle
[Gradle]: https://gradle.org/
[NeoForge]: https://github.com/neoforged/NeoForge
[contributing]: /contributing
[gradlelisting]: https://projects.neoforged.net/neoforged/neogradle
[neolisting]: https://projects.neoforged.net/neoforged/neoforge
[mdk]: https://github.com/neoforged/MDK
[properties]: https://github.com/neoforged/MDK/blob/a52ce16c8a1dd2d656edac482376f33385fe912c/gradle.properties#L19

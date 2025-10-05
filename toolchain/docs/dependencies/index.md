# 依赖项

依赖项不仅用于开发模组之间的互操作性或向游戏添加额外的库，还决定了要开发的 Minecraft 版本。本文将简要介绍如何修改 `repositories` 和 `dependencies` 块以将依赖项添加到您的开发环境中。

:::note
本文不会深入解释 Gradle 的概念。强烈建议在继续之前阅读 [Gradle 依赖管理指南][guide]。
:::

## 模组依赖项

所有模组依赖项的添加方式与其他工件相同。

```gradle
dependencies {
    // 假设我们有一些可以从指定仓库获取的工件 'examplemod'
    implementation 'com.example:examplemod:1.0'
}
```

### 本地模组依赖项

如果您尝试依赖的模组未在 Maven 仓库（例如 [Maven Central][central]、[CurseMaven]、[Modrinth]）中可用，则可以改为使用[平面目录][flat]添加模组依赖项：

```gradle
repositories {
    // 将项目目录中的 'libs' 文件夹添加为平面目录
    flatDir {
        dir 'libs'
    }
}

dependencies {
    // ...

    // 给定某个 <group>:<name>:<version>:<classifier (默认无)>
    //   以及扩展名 <ext (默认 jar)>
    // 平面目录中的工件将按以下顺序解析：
    // - <name>-<version>.<ext>
    // - <name>-<version>-<classifier>.<ext>
    // - <name>.<ext>
    // - <name>-<classifier>.<ext>

    // 如果显式指定了分类器
    //   则带有分类器的工件将优先：
    // - examplemod-1.0-api.jar
    // - examplemod-api.jar
    // - examplemod-1.0.jar
    // - examplemod.jar
    implementation 'com.example:examplemod:1.0:api'
}
```

:::note
组名可以是任何内容，但对于平面目录条目，组名不能为空，因为在解析工件文件时不会检查它们。
:::

[guide]: https://docs.gradle.org/8.14.3/userguide/dependency_management.html

[central]: https://central.sonatype.com/
[CurseMaven]: https://cursemaven.com/
[Modrinth]: https://docs.modrinth.com/docs/tutorials/maven/

[flat]: https://docs.gradle.org/8.14.3/userguide/supported_repository_types.html#sec:flat-dir-resolver

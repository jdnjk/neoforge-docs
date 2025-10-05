---
sidebar_position: 1
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 非 Minecraft 依赖项

非 Minecraft 依赖项是指既不是模组，也不是 Minecraft 或 NeoForge 本身依赖的工件。默认情况下，NeoForge 在加载模组时不会加载非 Minecraft 依赖项。在开发环境中，它们必须作为运行时依赖项添加，而在生产环境中应使用 [jar-in-jar 系统][jij]。

例如，您可以像下面这样将 `com.example:example` 库添加到所有运行中：

<Tabs defaultValue="mdg">
<TabItem value="mdg" label="ModDevGradle">

```gradle
dependencies {
    // 仍然需要在编译时添加库
    implementation 'com.example:example:1.0'
    // 将库添加到所有运行中
    additionalRuntimeClasspath 'com.example:example:1.0'
}
```

</TabItem>
<TabItem value="ng" label="NeoGradle">

```gradle
dependencies {
    implementation 'com.example:example:1.0'
}

runs {
    configureEach {
        dependencies {
            // highlight-next-line
            runtime 'com.example:example:1.0'
        }
    }
}
```

或者，您可以使用配置：

```gradle
configurations {
    libraries
    // 确保您添加到 libraries 配置中的所有依赖项也会添加到 implementation 配置中
    // 这样，您只需要为运行时和编译依赖项声明一次依赖
    implementation.extendsFrom libraries
}

dependencies {
    libraries 'com.example:example:1.0'
}

runs {
    configureEach {
        dependencies {
            // highlight-next-line
            runtime project.configurations.libraries
        }
    }
}
```

</TabItem>
</Tabs>

:::tip
如果您只想将运行时依赖项添加到某个特定运行中：

<Tabs defaultValue="mdg">
<TabItem value="mdg" label="ModDevGradle">

```gradle
dependencies {
    implementation 'com.example:example:1.0'
    // 仅为客户端运行添加依赖项
    // highlight-next-line
    clientAdditionalRuntimeClasspath 'com.example:example:1.0'
}
```

</TabItem>
<TabItem value="ng" label="NeoGradle">

```gradle
runs {
    // 仅为客户端运行配置依赖项
    // highlight-next-line
    named('client').configure {
        dependencies {

        }
    }
}
```

</TabItem>
</Tabs>

:::

[jij]: jarinjar.md

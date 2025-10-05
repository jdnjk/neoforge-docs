# Jar-in-Jar

Jar-in-Jar 是一种从模组的 jar 文件中加载依赖项的方法。为实现此目的，Jar-in-Jar 会在构建时生成一个位于 `META-INF/jarjar/metadata.json` 的元数据 json，其中包含要从 jar 中加载的工件。

Jar-in-Jar 是一个完全可选的系统。它会将 `jarJar` 配置中的所有依赖项包含到 `jarJar` 任务中。

## 添加依赖项

您可以使用 `jarJar` 配置将依赖项包含到您的 jar 中。Jar-in-Jar 是一个协商系统，默认情况下，它会从 `prefer` 版本中创建并包含最高版本。

```gradle
// 在 build.gradle 中
dependencies {
    // 编译并包含 examplelib 的支持版本
    //   从 2.0（含）开始
    jarJar(implementation(group: 'com.example', name: 'examplelib')) {
        version {
            // 在您的工作区中使用并打包到模组 jar 中的版本
            prefer '2.0'
        }
    }
}
```

如果您的库应该仅在一个确切的版本范围内工作，而不是从首选版本到最高版本，您可以将 `strictly` 配置为您的模组兼容的范围：

```gradle
// 在 build.gradle 中
dependencies {
    // 编译并包含 examplelib 的最高支持版本
    //   在 2.0（含）到 3.0（不含）之间
    jarJar(implementation(group: 'com.example', name: 'examplelib') {
        version {
            // 设置 examplelib 的支持版本
            //   在 2.0（含）到 3.0（不含）之间
            strictly '[2.0,3.0)'
            // 在您的工作区中使用并打包到模组 jar 中的版本
            prefer '2.8.0'
        }
    }
}
```

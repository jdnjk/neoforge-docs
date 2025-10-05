import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 访问转换器

访问转换器（简称 ATs）允许扩展类、方法和字段的可见性，并修改其 `final` 标志。它们使模组开发者能够访问和修改原本无法访问的类成员。

可以在 NeoForged 的 GitHub 上查看[规范文档][specs]。

## 添加访问转换器

向模组项目添加访问转换器非常简单，只需在 `build.gradle` 中添加一行代码：

访问转换器需要在 `build.gradle` 中声明。AT 文件可以放置在任何位置，只要在编译时将它们复制到 `resources` 输出目录即可。

<Tabs defaultValue="mdg">
<TabItem value="mdg" label="ModDevGradle">

默认情况下无需执行任何操作！

</TabItem>
<TabItem value="ng" label="NeoGradle">

```gradle
// 在 build.gradle 中：
minecraft {
    accessTransformers {
        file 'src/main/resources/META-INF/accesstransformer.cfg'
    }
}
```

</TabItem>
</Tabs>

默认情况下，NeoForge 会搜索 `META-INF/accesstransformer.cfg`。如果 `build.gradle` 中指定了其他位置的访问转换器，则需要在 `neoforge.mods.toml` 中定义它们的位置：

```toml
# 在 neoforge.mods.toml 中：
[[accessTransformers]]
## 文件相对于资源输出目录，或者在编译时 jar 内的根路径
## 'resources' 目录表示资源的根输出目录
file="META-INF/accesstransformer.cfg"
```

此外，可以指定多个 AT 文件，并按顺序应用。这对于具有多个包的大型模组非常有用。

<Tabs defaultValue="mdg">
<TabItem value="mdg" label="ModDevGradle">

```gradle
// 在 build.gradle 中：
neoForge {
    // ModDevGradle 默认会尝试包含 'src/main/resources/META-INF/accesstransformer.cfg'
    accessTransformers.from 'src/additions/resources/accesstransformer_additions.cfg'
}
```

</TabItem>
<TabItem value="ng" label="NeoGradle">

```gradle
// 在 build.gradle 中：
minecraft {
    accessTransformers {
        file 'src/main/resources/META-INF/accesstransformer.cfg'
        file 'src/additions/resources/accesstransformer_additions.cfg'
    }
}
```

</TabItem>
</Tabs>

```toml
# 在 neoforge.mods.toml 中
[[accessTransformers]]
file="accesstransformer_main.cfg"

[[accessTransformers]]
file="accesstransformer_additions.cfg"
```

添加或修改任何访问转换器后，必须刷新 Gradle 项目以使转换生效。

## 访问转换器规范

### 注释

所有以 `#` 开头的文本直到行尾都会被视为注释，不会被解析。

### 访问修饰符

访问修饰符指定目标成员的新可见性。按可见性从高到低排序：

- `public` - 对包内外的所有类可见
- `protected` - 仅对包内类和子类可见
- `default` - 仅对包内类可见
- `private` - 仅对类内部可见

可以在上述修饰符后附加特殊修饰符 `+f` 和 `-f`，分别添加或移除 `final` 修饰符。`final` 修饰符会阻止子类化、方法重写或字段修改。

:::danger
指令仅修改其直接引用的方法；任何重写的方法不会被访问转换。建议确保转换的方法没有非转换的重写方法，否则 JVM 会抛出错误。

可以安全转换的方法包括 `final` 方法（或 `final` 类中的方法）和 `static` 方法。`private` 方法通常也很安全，但可能会在子类型中导致意外的重写，因此需要进行额外的手动验证。
:::

### 目标和指令

#### 类

要定位类：

```
<访问修饰符> <完全限定类名>
```

内部类通过外部类的完全限定名和内部类名组合，并用 `$` 分隔。

#### 字段

要定位字段：

```
<访问修饰符> <完全限定类名> <字段名>
```

#### 方法

定位方法需要使用特殊语法来表示方法参数和返回类型：

```
<访问修饰符> <完全限定类名> <方法名>(<参数类型>)<返回类型>
```

##### 指定类型

也称为“描述符”：有关更多技术细节，请参阅 [Java 虚拟机规范，SE 21，第 4.3.2 和 4.3.3 节][jvmdescriptors]。

- `B` - `byte`，有符号字节
- `C` - `char`，UTF-16 中的 Unicode 字符代码点
- `D` - `double`，双精度浮点值
- `F` - `float`，单精度浮点值
- `I` - `integer`，32 位整数
- `J` - `long`，64 位整数
- `S` - `short`，有符号短整型
- `Z` - `boolean`，`true` 或 `false` 值
- `[` - 表示数组的一维
    - 示例：`[[S` 表示 `short[][]`
- `L<class name>;` - 表示引用类型
    - 示例：`Ljava/lang/String;` 表示 `java.lang.String` 引用类型（注意使用斜杠而不是点）
- `(` - 表示方法描述符，参数应在此处提供，如果没有参数则为空
    - 示例：`<method>(I)Z` 表示一个需要整数参数并返回布尔值的方法
- `V` - 表示方法不返回值，仅可用于方法描述符的末尾
    - 示例：`<method>()V` 表示一个没有参数且不返回值的方法

### 示例

```
# 将 Crypt 中的 ByteArrayToKeyFunction 接口设为 public
public net.minecraft.util.Crypt$ByteArrayToKeyFunction

# 将 MinecraftServer 中的 'random' 字段设为 protected 并移除 final 修饰符
protected-f net.minecraft.server.MinecraftServer random

# 将 Util 中的 'makeExecutor' 方法设为 public，
# 接受一个 String 并返回一个 TracingExecutor
public net.minecraft.Util makeExecutor(Ljava/lang/String;)Lnet/minecraft/TracingExecutor;

# 将 UUIDUtil 中的 'leastMostToIntArray' 方法设为 public，
# 接受两个 long 并返回一个 int[]
public net.minecraft.core.UUIDUtil leastMostToIntArray(JJ)[I
```

[specs]: https://github.com/NeoForged/AccessTransformers/blob/main/FMLAT.md
[jvmdescriptors]: https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.3.2

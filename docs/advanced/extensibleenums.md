# 可扩展枚举

可扩展枚举是对特定原版枚举的增强，允许添加新条目。这是通过在运行时修改枚举的已编译字节码来添加元素实现的。

## `IExtensibleEnum`

所有可以添加新条目的枚举都实现了 `IExtensibleEnum` 接口。此接口充当标记，使 `RuntimeEnumExtender` 启动插件服务知道哪些枚举需要被转换。

:::warning
您**不应该**在自己的枚举上实现此接口。根据您的使用场景，改用映射或注册表。  
未被修补以实现该接口的枚举无法通过 mixins 或 coremods 添加该接口，因为转换器的运行顺序限制了这一点。
:::

### 创建枚举条目

要创建新的枚举条目，需要创建一个 JSON 文件，并在 `neoforge.mods.toml` 的 `[[mods]]` 块中通过 `enumExtensions` 条目引用它。指定的路径必须相对于 `resources` 目录：

```toml
# 在 neoforge.mods.toml 中：
[[mods]]
## 文件相对于资源输出目录，或者在编译时 jar 内的根路径
## 'resources' 目录表示资源的根输出目录
enumExtensions="META-INF/enumextensions.json"
```

条目的定义包括目标枚举的类名、新字段的名称（必须以模组 ID 为前缀）、用于构造条目的构造函数描述符以及传递给该构造函数的参数。

```json5
{
    "entries": [
        {
            // 要添加条目的枚举类
            "enum": "net/minecraft/world/item/ItemDisplayContext",
            // 新条目的字段名称，必须以模组 ID 为前缀
            "name": "EXAMPLEMOD_STANDING",
            // 要使用的构造函数
            "constructor": "(ILjava/lang/String;Ljava/lang/String;)V",
            // 直接提供的常量参数
            "parameters": [ -1, "examplemod:standing", null ]
        },
        {
            "enum": "net/minecraft/world/item/Rarity",
            "name": "EXAMPLEMOD_CUSTOM",
            "constructor": "(ILjava/lang/String;Ljava/util/function/UnaryOperator;)V",
            // 使用给定类中的 EnumProxy<Rarity> 字段作为参数引用
            "parameters": {
                "class": "example/examplemod/MyEnumParams",
                "field": "CUSTOM_RARITY_ENUM_PROXY"
            }
        },
        {
            "enum": "net/minecraft/world/damagesource/DamageEffects",
            "name": "EXAMPLEMOD_TEST",
            "constructor": "(Ljava/lang/String;Ljava/util/function/Supplier;)V",
            // 使用给定类中的方法作为参数引用
            "parameters": {
                "class": "example/examplemod/MyEnumParams",
                "method": "getTestDamageEffectsParameter"
            }
        }
    ]
}
```

```java
public class MyEnumParams {
    public static final EnumProxy<Rarity> CUSTOM_RARITY_ENUM_PROXY = new EnumProxy<>(
            Rarity.class, -1, "examplemod:custom", (UnaryOperator<Style>) style -> style.withItalic(true)
    );
    
    public static Object getTestDamageEffectsParameter(int idx, Class<?> type) {
        return type.cast(switch (idx) {
            case 0 -> "examplemod:test";
            case 1 -> (Supplier<SoundEvent>) () -> SoundEvents.DONKEY_ANGRY;
            default -> throw new IllegalArgumentException("Unexpected parameter index: " + idx);
        });
    }
}
```

#### 构造函数

构造函数必须指定为[方法描述符][jvmdescriptors]，并且只能包含源代码中可见的参数，省略隐藏的常量名称和序号参数。  
如果构造函数带有 `@ReservedConstructor` 注解，则无法用于模组的枚举常量。

#### 参数

参数可以通过以下三种方式指定，具体取决于参数类型的限制：

- 在 JSON 文件中内联为常量数组（仅允许基本值、字符串以及为任何引用类型传递 null）
- 作为类中 `EnumProxy<TheEnum>` 类型字段的引用（参见上面的 `EnumProxy` 示例）
    - 第一个参数指定目标枚举，后续参数传递给枚举构造函数
- 作为返回 `Object` 的方法引用，其中返回值是要使用的参数值。方法必须恰好有两个参数，类型分别为 `int`（参数索引）和 `Class<?>`（参数的预期类型）
    - 应使用 `Class<?>` 对象进行类型转换（`Class#cast()`），以便在模组代码中捕获 `ClassCastException`。

:::warning
用于提供参数值的字段和/或方法应位于单独的类中，以避免意外过早加载模组类。
:::

某些参数有额外规则：

- 如果参数是与枚举上的 `@IndexedEnum` 注解相关的 int ID 参数，则会被忽略并替换为条目的序号。如果该参数在 JSON 中内联指定，则必须指定为 `-1`，否则会抛出异常。
- 如果参数是与枚举上的 `@NamedEnum` 注解相关的字符串名称参数，则必须以模组 ID 为前缀，格式为 `namespace:path`（与 `ResourceLocation` 的格式相同），否则会抛出异常。

#### 检索生成的常量

可以通过 `TheEnum.valueOf(String)` 检索生成的枚举常量。如果使用字段引用提供参数，则还可以通过 `EnumProxy` 对象的 `EnumProxy#getValue()` 方法检索常量。

## 为 NeoForge 做贡献

要向 NeoForge 添加新的可扩展枚举，至少需要完成以下两项操作：

- 使枚举实现 `IExtensibleEnum` 接口，以标记该枚举应通过 `RuntimeEnumExtender` 转换。
- 添加一个 `getExtensionInfo` 方法，该方法返回 `ExtensionInfo.nonExtended(TheEnum.class)`。

根据枚举的具体细节，还需要采取进一步的操作：

- 如果枚举具有与条目序号匹配的 int ID 参数，则应使用 `@IndexedEnum` 注解枚举，并将注解的值设置为 ID 参数的索引（如果不是第一个参数）。
- 如果枚举具有用于序列化的字符串名称参数，则应使用 `@NamedEnum` 注解枚举，并将注解的值设置为名称参数的索引（如果不是第一个参数）。
- 如果枚举通过网络发送，则应使用 `@NetworkedEnum` 注解枚举，并指定注解的参数以指明值可以发送的方向（客户端、服务器或双向）。
- 如果枚举具有模组无法使用的构造函数（例如，它们需要注册对象，而枚举可能在模组注册运行之前初始化），则应使用 `@ReservedConstructor` 注解这些构造函数。

:::note
如果枚举实际添加了任何条目，则 `getExtensionInfo` 方法将在运行时转换以提供动态生成的 `ExtensionInfo`。
:::

```java
// 这是一个示例，不是原版中的实际枚举

// 第一个参数必须匹配枚举常量的序号
@net.neoforged.fml.common.asm.enumextension.IndexedEnum
// 第二个参数是一个字符串，必须以模组 ID 为前缀
@net.neoforged.fml.common.asm.enumextension.NamedEnum(1)
// 此枚举用于网络通信，必须检查客户端和服务器之间的匹配
@net.neoforged.fml.common.asm.enumextension.NetworkedEnum(net.neoforged.fml.common.asm.enumextension.NetworkedEnum.NetworkCheck.BIDIRECTIONAL)
public enum ExampleEnum implements net.neoforged.fml.common.asm.enumextension.IExtensibleEnum {
    // VALUE_1 表示此处的名称参数
    VALUE_1(0, "value_1", false),
    VALUE_2(1, "value_2", true),
    VALUE_3(2, "value_3");

    ExampleEnum(int arg1, String arg2, boolean arg3) {
        // ...
    }

    ExampleEnum(int arg1, String arg2) {
        this(arg1, arg2, false);
    }

    public static net.neoforged.fml.common.asm.enumextension.ExtensionInfo getExtensionInfo() {
        return net.neoforged.fml.common.asm.enumextension.ExtensionInfo.nonExtended(ExampleEnum.class);
    }
}
```

[jvmdescriptors]: https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.3.2

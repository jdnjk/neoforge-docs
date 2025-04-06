# 资源

资源是游戏使用的外部文件，而非代码。其中最为常见的资源类型是纹理，但在Minecraft生态系统中还存在许多其他类型的资源。当然，所有这些资源都需要在代码端有对应的处理系统来调用，因此这些相关的系统也被归类在本节中一同说明。

Minecraft通常包含两类资源：供[逻辑客户端][logicalsides]使用的资源（称为资产），以及供[逻辑服务器][logicalsides]使用的资源（称为数据）。资产（Assets）主要是仅用于显示的信息，例如纹理（Textures）、显示模型（Display Models）、语言翻译（Translations）或音效（Sounds）；而数据（Data）则包含影响游戏玩法逻辑的内容，例如战利品表（Loot Tables）、合成配方（Recipes）或世界生成配置（Worldgen Information）。它们分别通过资源包（Resource Packs）和数据包（Data Packs）加载。NeoForge会为每个模组自动生成内置的资源包与数据包。

资源包和数据包通常需要一个[pack.mcmeta文件][packmcmeta]，但现代NeoForge会在运行时自动生成此文件，因此开发者无需手动处理。

若对资源格式存在疑惑，建议直接参考原版资源。 NeoForge开发环境不仅包含原版代码，还集成了原版资源文件。那些可以在 外部资源(IntelliJ)/项目库 (Eclipse), 对应的资源库名称为 `ng_dummy_ng.net.minecraft:client:client-extra:<minecraft_version>` (Minecraft资源) 或者 `ng_dummy_ng.net.neoforged:neoforge:<neoforge_version>` (NeoForge资源).

## 资产

_参阅：[Minecraft Wiki][mcwiki]上的[资源包][mcwikiresourcepacks]_  

资产（Assets），即客户端资源，指所有仅与[客户端][sides]相关的资源。这些资源通过资源包（resource packs）加载，该术语有时仍沿用旧称纹理包（texture packs）（源于早期版本中仅能修改纹理的特性）。资源包本质上是一个`assets`文件夹。该`assets`文件夹包含资源包所涵盖的各个命名空间对应的子文件夹；每个命名空间对应一个子文件夹。例如，一个模组ID为`coolmod`的资源包通常会包含`coolmod`命名空间子文件夹，但也可能额外包含其他命名空间（如`minecraft`）。

NeoForge会自动将所有模组资源包整合到`Mod resources`包中，该包位于资源包菜单的"已选资源包"列表底部。目前无法禁用`Mod resources`包。然而，位于`Mod resources`包上方的资源包会覆盖下方资源包中定义的资源。此机制允许资源包制作者覆盖您模组的资源，也允许模组开发者在需要时覆盖Minecraft原版资源。

资源包可包含[模型][models]、[方块状态文件][bsfile]、[纹理][textures]、[音效][sounds]、[粒子定义][particles]及[语言文件][translations]。

## 数据

_参阅：[Minecraft Wiki][mcwiki]上的[数据包][mcwikidatapacks]_  

与资产（Assets）不同，**数据（Data）**指所有与[服务器端][sides]相关的资源。类似于资源包，数据通过**数据包（Data Packs）**加载。数据包与资源包类似，由[`pack.mcmeta`文件][packmcmeta]和一个名为`data`的根文件夹组成。`data`文件夹内同样包含多个命名空间对应的子文件夹，每个命名空间对应一个子文件夹。例如，模组ID为`coolmod`的数据包通常会包含`coolmod`命名空间子文件夹，但也可能额外包含其他命名空间（如`minecraft`）。

NeoForge会在创建新世界时自动应用所有模组数据包。目前无法禁用模组数据包。不过，大多数数据文件可通过**更高优先级的数据包**进行覆盖（例如用空文件替换以删除原内容）。额外添加的数据包可通过放置在世界存档的`datapacks`子文件夹中，并使用[`/datapack`][datapackcmd]命令启用或禁用。

:::info  
目前没有内置方法为所有世界统一应用自定义数据包集合，但部分模组可实现此功能。  
:::

数据包可包含以下文件夹及其对应功能：  
| 文件夹名称                                                                       | 内容                          |
|---------------------------------------------------------------------------------|-------------------------------|
| `advancement`                                                                   | [进度][advancements]          |
| `damage_type`                                                                   | [伤害类型][damagetypes]       |
| `loot_table`                                                                    | [战利品表][loottables]        |
| `recipe`                                                                        | [合成配方][recipes]           |
| `tags`                                                                          | [标签][tags]                  |
| `neoforge/data_maps`                                                            | [数据映射][datamap]           |
| `neoforge/loot_modifiers`                                                       | [全局战利品修饰器][glm]       |
| `dimension`, `dimension_type`, `structure`, `worldgen`, `neoforge/biome_modifier` | 世界生成文件                  |
此外，数据包还可包含与命令系统集成的子文件夹。这些系统虽较少与模组结合使用，但仍值得提及：  

| 文件夹名称      | 内容                             |
|-----------------|---------------------------------|
| `chat_type`      | [聊天类型][chattype]            |
| `function`       | [函数][function]                |
| `item_modifier`  | [物品修饰器][itemmodifier]      |
| `predicate`      | [谓词][predicate]               |

## `pack.mcmeta`

_参阅：[Minecraft Wiki][mcwiki]上的[资源包`pack.mcmeta`][packmcmetaresourcepack]与[数据包`pack.mcmeta`][packmcmetadatapack]_  

`pack.mcmeta`文件用于存储资源包或数据包的元数据（metadata）。对于模组而言，NeoForge已使此文件变得冗余，因为它会自动生成`pack.mcmeta`文件。若您仍需手动创建`pack.mcmeta`文件，其完整规范可参考上述链接的Minecraft Wiki文章。

## 数据生成（Data Generation）  

数据生成（俗称"datagen"）是一种通过编程方式生成JSON资源文件的方法，旨在避免手动编写文件时繁琐且容易出错的过程。虽然其名称容易引发误解，但实际上它既适用于资产（Assets）也适用于数据（Data）。  

数据生成通过**Data运行配置**（Data run configuration）执行，该配置与Client和Server运行配置一同自动生成。数据运行配置遵循[模组生命周期][lifecycle]，直到注册事件（registry events）触发后结束。随后会触发[`GatherDataEvent`][event]事件，开发者可在该事件中通过**数据提供者**（data providers）注册待生成的对象，将其写入磁盘并终止进程。  

所有数据提供者均继承`DataProvider`接口，通常需覆写一个核心方法。以下是Minecraft和NeoForge提供的重要数据生成器列表（链接文章包含更多信息，如辅助方法说明）：  

| 类                                                                 | 方法                                      | 生成内容                                                                 | 适用端   | 备注                                                                                                           |
|-------------------------------------------------------------------|------------------------------------------|--------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------|
| [`BlockStateProvider`][blockstateprovider]                       | `registerStatesAndModels()`             | 方块状态文件（Blockstate files）、方块模型（Block models）               | 客户端   |                                                                                                               |
| [`ItemModelProvider`][itemmodelprovider]                         | `registerModels()`                      | 物品模型（Item models）                                                  | 客户端   |                                                                                                               |
| [`LanguageProvider`][langprovider]                               | `addTranslations()`                     | 语言翻译文件（Translations）                                             | 客户端   | 需在构造函数中指定目标语言（如`"zh_cn"`）。                                                                   |
| [`ParticleDescriptionProvider`][particleprovider]                | `addDescriptions()`                     | 粒子定义（Particle definitions）                                         | 客户端   |                                                                                                               |
| [`SoundDefinitionsProvider`][soundprovider]                      | `registerSounds()`                      | 音效定义（Sound definitions）                                            | 客户端   |                                                                                                               |
| `SpriteSourceProvider`                                           | `gather()`                              | 纹理图集源（Sprite sources / atlases）                                   | 客户端   |                                                                                                               |
| [`AdvancementProvider`][advancementprovider]                     | `generate()`                            | 进度（Advancements）                                                     | 服务端   | 需使用NeoForge提供的版本，而非原版。                                                                          |
| [`LootTableProvider`][loottableprovider]                         | `generate()`                            | 战利品表（Loot tables）                                                  | 服务端   | 需额外配置方法和类，详见链接文章。                                                                            |
| [`RecipeProvider`][recipeprovider]                               | `buildRecipes(RecipeOutput)`            | 合成配方（Recipes）                                                      | 服务端   |                                                                                                               |
| [`TagsProvider`的子类][tagsprovider]                             | `addTags(HolderLookup.Provider)`        | 标签（Tags）                                                             | 服务端   | 存在多个专用子类（如`BlockTagsProvider`），详见链接文章。                                                     |
| [`DataMapProvider`][datamapprovider]                             | `gather()`                              | 数据映射条目（Data map entries）                                          | 服务端   |                                                                                                               |
| [`GlobalLootModifierProvider`][glmprovider]                      | `start()`                               | 全局战利品修饰器（Global loot modifiers）                                | 服务端   |                                                                                                               |
| [`DatapackBuiltinEntriesProvider`][datapackprovider]             | N/A                                     | 数据包内置条目（如世界生成配置、[伤害类型][damagetypes]）                | 服务端   | 无需覆写方法，需在构造函数的lambda表达式中添加条目。详见链接文章。                                            |
| `JsonCodecProvider`（抽象类）                                    | `gather()`                              | 支持Codec编码的对象                                                      | 双端     | 可扩展用于任何支持[Codec][codec]编码的数据对象。                                                              |  

所有数据提供者遵循相同使用模式：  
1. **创建子类**：继承对应的数据提供者类，并实现资源生成逻辑。  
2. **注册到事件**：通过[事件处理器][eventhandler]将提供者注册到`GatherDataEvent`中。  

以下是一个使用`RecipeProvider`的示例：  

```java
public class MyRecipeProvider extends RecipeProvider {
    public MyRecipeProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookupProvider) {
        super(output, lookupProvider);
    }

    @Override
    protected void buildRecipes(RecipeOutput output) {
        // 在这里注册你的配方
    }
}

@EventBusSubscriber(bus = EventBusSubscriber.Bus.MOD, modid = "examplemod")
public class MyDatagenHandler {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        // 数据生成器可能需要其中一些作为构造函数参数。
        // 请参阅下面的详细信息。
        DataGenerator generator = event.getGenerator();
        PackOutput output = generator.getPackOutput();
        ExistingFileHelper existingFileHelper = event.getExistingFileHelper();
        CompletableFuture<HolderLookup.Provider> lookupProvider = event.getLookupProvider();

        // 注册提供程序。
        generator.addProvider(
                // 一个布偶值，用于确定是否生成数据
                // 事件提供了确定这一点的方法:
                // event.includeClient(), event.includeServer(),
                // event.includeDev() and event.includeReports().
                // 因为配方是服务器数据，所以我们只在服务器数据中运行它们。
                event.includeServer(),
                // Our provider.
                new MyRecipeProvider(output, lookupProvider)
        );
        // 添加其他的数据供应
    }
}
```

该事件提供以下上下文供您使用：

- `event.getGenerator()` 返回您注册数据提供器所用的`DataGenerator`
- `event.getPackOutput()` 返回`PackOutput`，某些提供器用它确定文件输出位置
- `event.getExistingFileHelper()` 返回`ExistingFileHelper`，供需要引用其他文件的提供器使用（例如可以指定父文件的方块模型）
- `event.getLookupProvider()` 返回`CompletableFuture<HolderLookup.Provider>`，主要用于标签和数据生成注册表引用其他可能尚未存在的元素
- `event.includeClient()`、`event.includeServer()`、`event.includeDev()`和`event.includeReports()`是布尔方法，用于检查特定的命令行参数（见下文）是否启用

### 命令行参数

数据生成器可接受以下命令行参数：

- `--mod examplemod`：指定要为该模组运行数据生成。NeoGradle会自动添加所属模组ID，若单个项目中包含多个模组需手动添加此参数。
- `--output path/to/folder`：指定数据生成器的输出目录。建议使用Gradle的`file(...).getAbsolutePath()`生成绝对路径（基于项目根目录的相对路径）。默认值为`file('src/generated/resources').getAbsolutePath()`。
- `--existing path/to/folder`：指定数据生成器检查现有文件时应参考的目录。与输出路径类似，建议使用Gradle的`file(...).getAbsolutePath()`。
- `--existing-mod examplemod`：指定数据生成器检查现有文件时应参考的模组JAR文件资源。

生成模式参数（均为布尔参数，无需额外值）：
- `--includeClient`：是否生成客户端资源（assets）。运行时通过`GatherDataEvent#includeClient()`检查。
- `--includeServer`：是否生成服务端资源（data）。运行时通过`GatherDataEvent#includeServer()`检查。
- `--includeDev`：是否运行开发者工具。模组通常不需使用。运行时通过`GatherDataEvent#includeDev()`检查。
- `--includeReports`：是否输出已注册对象列表。运行时通过`GatherDataEvent#includeReports()`检查。
- `--all`：启用所有生成模式。

所有参数均可通过以下方式添加到运行配置中（在`build.gradle`中添加）：

```groovy
runs {
    // 其他的运行配置

    data {
        programArguments.addAll '--arg1', 'value1', '--arg2', 'value2', '--all' // 布尔参数没有值
    }
}
```

例如, 要复制默认参数, 你可以指定以下内容:

```groovy
runs {
    // 其他的运行配置

    data {
        programArguments.addAll '--mod', 'examplemod', // 插入你的模组id
                '--output', file('src/generated/resources').getAbsolutePath(),
                '--includeClient',
                '--includeServer'
    }
}
```

[advancementprovider]: server/advancements.md#data-generation
[advancements]: server/advancements.md
[blockstateprovider]: client/models/datagen.md#block-model-datagen
[bsfile]: client/models/index.md#blockstate-files
[chattype]: https://zh.minecraft.wiki/w/%E8%81%8A%E5%A4%A9%E7%B1%BB%E5%9E%8B%E5%AE%9A%E4%B9%89%E6%A0%BC%E5%BC%8F
[codec]: ../datastorage/codecs.md
[damagetypes]: server/damagetypes.md
[datamap]: server/datamaps/index.md
[datamapprovider]: server/datamaps/index.md#data-generation
[datapackcmd]: https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/datapack
[datapackprovider]: ../concepts/registries.md#data-generation-for-datapack-registries
[event]: ../concepts/events.md
[eventhandler]: ../concepts/events.md#registering-an-event-handler
[function]: https://zh.minecraft.wiki/w/Java%E7%89%88%E5%87%BD%E6%95%B0
[glm]: server/loottables/glm.md
[glmprovider]: server/loottables/glm.md#datagen
[itemmodelprovider]: client/models/datagen.md#item-model-datagen
[itemmodifier]: https://zh.minecraft.wiki/w/%E7%89%A9%E5%93%81%E4%BF%AE%E9%A5%B0%E5%99%A8
[langprovider]: client/i18n.md#datagen
[lifecycle]: ../concepts/events.md#the-mod-lifecycle
[logicalsides]: ../concepts/sides.md#the-logical-side
[loottableprovider]: server/loottables/index.md#datagen
[loottables]: server/loottables/index.md
[mcwiki]: https://zh.minecraft.wiki
[mcwikidatapacks]: https://zh.minecraft.wiki/w/%E6%95%B0%E6%8D%AE%E5%8C%85
[mcwikiresourcepacks]: https://zh.minecraft.wiki/w/%E8%B5%84%E6%BA%90%E5%8C%85
[models]: client/models/index.md
[packmcmeta]: #packmcmeta
[packmcmetadatapack]: https://zh.minecraft.wiki/w/%E6%95%B0%E6%8D%AE%E5%8C%85#pack.mcmeta
[packmcmetaresourcepack]: https://zh.minecraft.wiki/w/%E8%B5%84%E6%BA%90%E5%8C%85#%E8%B5%84%E6%BA%90%E5%8C%85%E5%86%85%E5%AE%B9
[particleprovider]: client/particles.md#datagen
[particles]: client/particles.md
[predicate]: https://zh.minecraft.wiki/w/%E8%B0%93%E8%AF%8D
[recipeprovider]: server/recipes/index.md#data-generation
[recipes]: server/recipes/index.md
[sides]: ../concepts/sides.md
[soundprovider]: client/sounds.md#datagen
[sounds]: client/sounds.md
[tags]: server/tags.md
[tagsprovider]: server/tags.md#datagen
[textures]: client/textures.md
[translations]: client/i18n.md#language-files

# 功能标志

功能标志是一种系统，允许开发者将一组功能置于某些必需标志之后，这些标志可以是已注册的元素、游戏机制、数据包条目或模组中的其他独特系统。

一个常见的用例是将实验性功能/元素置于实验标志之后，允许用户在功能最终确定之前轻松启用并进行试用。

:::tip
您不必添加自己的标志。如果发现原版标志适合您的用例，可以随意使用该标志标记您的方块/物品/实体等。

例如，在 `1.21.3` 中，如果您要添加到苍白橡树中，您可能只希望在启用了 `WINTER_DROP` 标志时显示这些方块。
:::

## 创建功能标志

要创建新的功能标志，需要创建一个 JSON 文件，并在 `neoforge.mods.toml` 文件的 `[[mods]]` 块中通过 `featureFlags` 条目引用它。指定的路径必须相对于 `resources` 目录：

```toml
# 在 neoforge.mods.toml 中：
[[mods]]
    # 文件相对于资源输出目录，或者在编译时 jar 内的根路径
    # 'resources' 目录表示资源的根输出目录
    featureFlags="META-INF/feature_flags.json"
```

条目的定义包括功能标志名称的列表，这些标志将在游戏初始化期间加载并注册。

```json5
{
    "flags": [
        // 要注册的功能标志的标识符
        "examplemod:experimental"
    ]
}
```

## 检索功能标志

已注册的功能标志可以通过 `FeatureFlagRegistry.getFlag(ResourceLocation)` 检索。这可以在模组初始化期间的任何时间完成，建议将其存储在某处以供将来使用，而不是每次需要标志时都查找注册表。

```java
// 查找 'examplemod:experimental' 功能标志
public static final FeatureFlag EXPERIMENTAL = FeatureFlags.REGISTRY.getFlag(ResourceLocation.fromNamespaceAndPath("examplemod", "experimental"));
```

## 功能元素

`FeatureElement` 是可以分配一组必需标志的注册表值。这些值仅在相应的必需标志与关卡中启用的标志匹配时才对玩家可用。

当功能元素被禁用时，它将完全从玩家视图中隐藏，所有交互将被跳过。但请注意，这些禁用的元素仍然存在于注册表中，只是功能上不可用。

以下是直接实现 `FeatureElement` 系统的所有注册表的完整列表：

- 物品（Item）
- 方块（Block）
- 实体类型（EntityType）
- 菜单类型（MenuType）
- 药水（Potion）
- 状态效果（MobEffect）

### 标记元素

要将给定的 `FeatureElement` 标记为需要您的功能标志，只需将其和任何其他所需标志传递到相应的注册方法中：

- `Item`: `Item.Properties#requiredFeatures`
- `Block`: `BlockBehaviour.Properties#requiredFeatures`
- `EntityType`: `EntityType.Builder#requiredFeatures`
- `MenuType`: `MenuType#new`
- `Potion`: `Potion#requiredFeatures`
- `MobEffect`: `MobEffect#requiredFeatures`

```java
// 这些元素仅在启用了 'EXPERIMENTAL' 标志后可用

// 物品
DeferredRegister.Items ITEMS = DeferredRegister.createItems("examplemod");
DeferredItem<Item> EXPERIMENTAL_ITEM = ITEMS.registerSimpleItem("experimental", new Item.Properties()
    .requiredFeatures(EXPERIMENTAL) // 标记为需要 'EXPERIMENTAL' 标志
);

// 方块
DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks("examplemod");
// 请注意，BlockBehaviour.Properties#ofFullCopy 和 BlockBehaviour.Properties#ofLegacyCopy 会复制所需的功能标志。
// 这意味着在 1.21.3 中，使用 BlockBehaviour.Properties.ofFullCopy(Blocks.PALE_OAK_WOOD) 会使您的方块需要 'WINTER_DROP' 标志。
DeferredBlock<Block> EXPERIMENTAL_BLOCK = BLOCKS.registerSimpleBlock("experimental", BlockBehaviour.Properties.of()
    .requiredFeatures(EXPERIMENTAL) // 标记为需要 'EXPERIMENTAL' 标志
);

// BlockItems 特殊之处在于其所需的功能标志继承自其相应的方块。
// 同样，生成蛋的功能标志继承自其相应的实体类型。
DeferredItem<BlockItem> EXPERIMENTAL_BLOCK_ITEM = ITEMS.registerSimpleBlockItem(EXPERIMENTAL_BLOCK);

// 实体类型
DeferredRegister<EntityType<?>> ENTITY_TYPES = DeferredRegister.create(Registries.ENTITY_TYPE, "examplemod");
DeferredHolder<EntityType<?>, EntityType<ExperimentalEntity>> EXPERIMENTAL_ENTITY = ENTITY_TYPES.register("experimental", registryName -> EntityType.Builder.of(ExperimentalEntity::new, MobCategory.AMBIENT)
    .requiredFeatures(EXPERIMENTAL) // 标记为需要 'EXPERIMENTAL' 标志
    .build(ResourceKey.create(Registries.ENTITY_TYPE, registryName))
);

// 菜单类型
DeferredRegister<MenuType<?>> MENU_TYPES = DeferredRegister.create(Registries.MENU, "examplemod");
DeferredHolder<MenuType<?>, MenuType<ExperimentalMenu>> EXPERIMENTAL_MENU = MENU_TYPES.register("experimental", () -> new MenuType<>(
    // 使用原版的 MenuSupplier:
    // 当您的菜单在 `player.openMenu` 期间未编码复杂数据时使用。例如：
    // (windowId, inventory) -> new ExperimentalMenu(windowId, inventory),

    // 使用 NeoForge 的 IContainerFactory:
    // 当您希望读取 `player.openMenu` 期间编码的复杂数据时使用。
    // 这里的强制转换很重要，因为 `MenuType` 特别需要一个 `MenuSupplier`。
    (IContainerFactory<ExperimentalMenu>) (windowId, inventory, buffer) -> new ExperimentalMenu(windowId, inventory, buffer),
    
    FeatureFlagSet.of(EXPERIMENTAL) // 标记为需要 'EXPERIMENTAL' 标志
));

// 状态效果
DeferredRegister<MobEffect> MOB_EFFECTS = DeferredRegister.create(Registries.MOB_EFFECT, "examplemod");
DeferredHolder<MobEffect, ExperimentalMobEffect> EXPERIMENTAL_MOB_EEFECT = MOB_EFFECTS.register("experimental", registryName -> new ExperimentalMobEffect(MobEffectCategory.NEUTRAL, CommonColors.WHITE)
    .requiredFeatures(EXPERIMENTAL) // 标记为需要 'EXPERIMENTAL' 标志
);

// 药水
DeferredRegister<Potion> POTIONS = DeferredRegister.create(Registries.POTION, "examplemod");
DeferredHolder<Potion, ExperimentalPotion> EXPERIMENTAL_POTION = POTIONS.register("experimental", registryName -> new ExperimentalPotion(registryName.toString(), new MobEffectInstance(EXPERIMENTAL_MOB_EEFECT))
    .requiredFeatures(EXPERIMENTAL) // 标记为需要 'EXPERIMENTAL' 标志
);
```

### 验证启用状态

要验证功能是否应启用，您必须首先获取启用的功能集。这可以通过多种方式完成，但常见且推荐的方法是使用 `LevelReader#enabledFeatures`。

```java
level.enabledFeatures(); // 从 'LevelReader' 实例
entity.level().enabledFeatures(); // 从 'Entity' 实例

// 客户端
minecraft.getConnection().enabledFeatures();

// 服务端
server.getWorldData().enabledFeatures();
```

要验证任何 `FeatureFlagSet` 是否启用，可以将启用的功能传递给 `FeatureFlagSet#isSubsetOf`，要验证特定 `FeatureElement` 是否启用，可以调用 `FeatureElement#isEnabled`。

:::note
`ItemStack` 有一个特殊的 `isItemEnabled(FeatureFlagSet)` 方法。这是为了确保即使支持的 `Item` 的所需功能与启用的功能不匹配，空堆栈也被视为启用。建议在可能的情况下优先使用此方法而不是 `Item#isEnabled`。
:::

```java
requiredFeatures.isSubsetOf(enabledFeatures);
featureElement.isEnabled(enabledFeatures);
itemStack.isItemEnabled(enabledFeatures);
```

## 功能包

_另见：[资源包](../resources/index.md#assets)、[数据包](../resources/index.md#data) 和 [Pack.mcmeta](../resources/index.md#packmcmeta)_

功能包是一种不仅加载资源和/或数据，还能够切换给定功能标志的包。这些标志在此包根目录下的 `pack.mcmeta` JSON 文件中定义，格式如下：

:::note
此文件不同于模组 `resources/` 目录中的文件。此文件定义了一个全新的功能包，因此必须位于其自己的文件夹中。
:::

```json5
{
    "features": {
        "enabled": [
            // 要启用的功能标志的标识符
            // 必须是有效的已注册标志
            "examplemod:experimental"
        ]
    },
    "pack": { /*...*/ }
}
```

用户可以通过以下几种方式获取功能包：从外部来源安装为数据包，或下载包含内置功能包的模组。这两种方式的安装方式取决于[物理端](../concepts/sides.md)。

### 内置功能包

内置包与您的模组捆绑在一起，并通过 `AddPackFindersEvent` 事件提供给游戏。

```java
@SubscribeEvent // 在模组事件总线上
public static void addFeaturePacks(final AddPackFindersEvent event) {
    event.addPackFinders(
            // 相对于模组 'resources' 的路径，指向此包
            // 请注意，这还定义了包的 ID，格式为
            // mod/<namespace>:<path>`，例如 `mod/examplemod:data/examplemod/datapacks/experimental`
            ResourceLocation.fromNamespaceAndPath("examplemod", "data/examplemod/datapacks/experimental"),
            
            // 此包中包含的资源类型
            // 'CLIENT_RESOURCES' 表示包含客户端资源（资源包）
            // 'SERVER_DATA' 表示包含服务端数据（数据包）
            PackType.SERVER_DATA,
            
            // 在实验屏幕中显示的名称
            Component.literal("ExampleMod: Experiments"),
            
            // 为了使此包加载并启用功能标志，此处必须为 'FEATURE'，
            // 其他任何 PackSource 类型均无效
            PackSource.FEATURE,
            
            // 如果为 true，则包始终处于活动状态且无法禁用，对于功能包应始终为 false
            false,
            
            // 加载此包资源的优先级
            // 'TOP' 表示此包优先于其他包
            // 'BOTTOM' 表示其他包优先于此包
            Pack.Position.TOP
    );
}
```

#### 在单人模式中启用

1. 创建一个新世界。
2. 导航到实验屏幕。
3. 切换所需的包。
4. 点击 `完成` 确认更改。

#### 在多人模式中启用

1. 打开服务器的 `server.properties` 文件。
2. 将功能包 ID 添加到 `initial-enabled-packs`，每个包用 `,` 分隔。包 ID 在注册包查找器时定义，如上所示。

### 外部功能包

外部包以数据包形式提供给用户。

#### 在单人模式中安装

1. 创建一个新世界。
2. 导航到数据包选择屏幕。
3. 将数据包 zip 文件拖放到游戏窗口。
4. 将新可用的数据包移动到 `已选择` 包列表。
5. 点击 `完成` 确认更改。

游戏现在会警告您有关任何新选择的实验功能、潜在的错误、问题和崩溃。您可以通过点击 `继续` 确认这些更改，或点击 `详细信息` 查看所有选择的包及其启用的功能的详细列表。

:::note
外部功能包不会显示在实验屏幕中。实验屏幕仅显示内置功能包。

要禁用已启用的外部功能包，请重新进入数据包屏幕，并将外部包从 `已选择` 移回 `可用`。
:::

#### 在多人模式中安装

启用功能包只能在初始世界创建期间完成，启用后无法禁用。

1. 创建目录 `./world/datapacks`
2. 将数据包 zip 文件上传到新创建的目录
3. 打开服务器的 `server.properties` 文件
4. 将数据包 zip 文件名（不包括 `.zip`）添加到 `initial-enabled-packs`（每个包用 `,` 分隔）
   - 示例：zip 文件 `examplemod-experimental.zip` 应添加为 `initial-enabled-packs=vanilla,examplemod-experimental`

### 数据生成

_另见：[数据生成](../resources/index.md#data-generation)_

功能包可以在常规模组数据生成期间生成。这最好与内置包结合使用，但也可以将生成的结果打包为外部包并共享。只需选择一种方式，例如不要同时将其作为外部包提供并捆绑为内置包。

```java
@SubscribeEvent // 在模组事件总线上
public static void gatherData(final GatherDataEvent.Client event) {
    DataGenerator generator = event.getGenerator();
    
    // 要生成功能包，您必须首先为所需包获取一个包生成器实例。
    // generator.getBuiltinDatapack(<shouldGenerate>, <namespace>, <path>);
    // 这将在以下路径中生成功能包：
    // ./data/<namespace>/datapacks/<path>
    PackGenerator featurePack = generator.getBuiltinDatapack(true, "examplemod", "experimental");
        
    // 注册一个提供者以生成 `pack.mcmeta` 文件。
    featurePack.addProvider(output -> PackMetadataGenerator.forFeaturePack(
            output,
            
            // 在实验屏幕中显示的描述
            Component.literal("Enabled experimental features for ExampleMod"),
            
            // 此包应启用的功能标志集
            FeatureFlagSet.of(EXPERIMENTAL)
    ));
    
    // 将其他提供者（配方、战利品表）注册到 `featurePack`，以将任何生成的资源写入此包，而不是根包。
}
```

# 音效

虽然音效并非必需的，但它们能让模组体验更加细腻生动。Minecraft提供了多种音效注册与播放方式，本文将详细介绍这些机制。

## 术语定义

Minecraft音效系统使用以下专业术语：

- **音效事件(SoundEvent)**：游戏内触发音效播放的代码事件，需注册到游戏系统中
- **音效分类/音源(SoundSource)**：音效的逻辑分组（对应声音设置中的滑块），包括`master`、`block`、`player`等枚举值
- **音效定义(SoundDefinition)**：在`sounds.json`中定义音效事件与具体音频文件的映射关系
- **音效对象(SoundObject)**：JSON对象，包含音频文件路径及元数据
- **音频文件**：仅支持`.ogg`格式的物理文件

:::danger
由于OpenAL音频库的实现限制，要实现距离衰减效果（音量随玩家距离变化），必须使用单声道音频文件。立体声音频不受衰减影响，适合环境音效和背景音乐。详见[MC-146721][bug]
:::

## 创建音效事件

音效事件属于[注册对象][registration]，需通过`DeferredRegister`注册为单例：

```java
public class MySoundsClass {
    // 假设模组id为examplemod
    public static final DeferredRegister<SoundEvent> SOUND_EVENTS =
            DeferredRegister.create(BuiltInRegistries.SOUND_EVENT, "examplemod");
    
    // 标准音效事件（支持距离衰减）
    public static final DeferredHolder<SoundEvent, SoundEvent> MY_SOUND = SOUND_EVENTS.register(
            "my_sound", // 需与下一行ResourceLocation匹配
            () -> SoundEvent.createVariableRangeEvent(ResourceLocation.fromNamespaceAndPath("examplemod", "my_sound"))
    );
    
    // 固定距离音效事件（无衰减）:
    public static final DeferredHolder<SoundEvent, SoundEvent> MY_FIXED_SOUND = SOUND_EVENTS.register("my_fixed_sound",
            // 16为默认衰减范围，超过16的值会被限制
            () -> SoundEvent.createFixedRangeEvent(ResourceLocation.fromNamespaceAndPath("examplemod", "my_fixed_sound"), 16)
    );
}
```

当然,别忘记你的添加注册到[模组事件总线][modbus]的[模组构造函数][modctor]:

```java
public ExampleMod(IEventBus modBus) {
    MySoundsClass.SOUND_EVENTS.register(modBus);
    // 其他的东西
}
```
瞧，你会有一个声音事件!

## `sounds.json`

_参阅: [sounds.json][mcwikisounds] on the [Minecraft Wiki][mcwiki]_

为了将声音事件连接到实际的声音文件，我们需要创建声音定义。所有声音定义存储在命名空间根目录中的一个名为`sounds.json`的文件中，也称为声音定义文件。每个声音定义将声音事件ID（例如`my_sound`）映射到一个JSON声音对象。请注意，声音事件ID不指定命名空间，因为声音定义文件所在的命名空间已经决定了命名空间:

```json5
{
    // 声音事件"examplemod:my_sound"的声音定义可以像以下格式来描述
    "my_sound": {
        // 声音对象的列表。如果此列表包含多个元素，将会随机选择一个元素进行播放。
        "sounds": [
            // 只有名称是必须的，其他都是可选的
            {
                // 声音文件的位置，相对于命名空间的sounds文件夹。
                // 例如，此例子引用了位于assets/examplemod/sounds/sound_1.ogg的声音文件。
                "name": "examplemod:sound_1",
                // 可以是“sound”或“event”。“sound”使名称引用一个声音文件。
                // “event”使名称引用另一个声音事件。默认值为“sound”。
                "type": "sound",
                // 该声音播放时的音量，必须介于0.0到1.0之间（默认值）。
                "volume": 0.8,
                // 该声音播放时的音调值。
                // 必须介于0.0到2.0之间，默认值为1.0。
                "pitch": 1.1,
                // 在从声音列表中选择声音时的权重，默认值为1。
                "weight": 3,
                // 如果为 true，则该声音将从文件中流式播放，而不是一次性加载。
                // 建议用于长度超过几秒的声音文件。默认值为 false。
                "stream": true,
                // 衰减距离的手动覆盖值，默认值为16。固定范围声音事件将忽略此设置。
                "attenuation_distance": 8,
                // 如果为 true，则该声音将在资源包加载时被加载到内存中，而不是在播放时加载。
                // 原版将其用于水下环境音效。默认值为 false。
                "preload": true
            },
            // 简写为 { "name": "examplemod:sound_2" }
            "examplemod:sound_2"
        ]
    },
    "my_fixed_sound": {
        // 可选项。如果为 true，则会替换其他资源包中的声音，而不是将其添加到声音列表中。
        // 有关详细信息，请参见下面的“合并”章节。
        "replace": true,
        // 触发该声音事件时显示的字幕的翻译键。
        "subtitle": "examplemod.my_fixed_sound",
        "sounds": [
            "examplemod:sound_1",
            "examplemod:sound_2"
        ]
    }
}
```

### 合并

与大多数其他资源文件不同，`sounds.json`不会覆盖其下方资源包中的值。相反，它们会合并在一起，然后被解释为一个组合的`sounds.json`文件。例如，假设声音`sound_1`、`sound_2`、`sound_3`和`sound_4`在两个来自不同资源包的`sounds.json`文件中定义，分别是 RP1 和 RP2，其中 RP2 位于 RP1 之下：

RP1 中的`sounds.json`：

```json5
{
    "sound_1": {
        "sounds": [
            "sound_1"
        ]
    },
    "sound_2": {
        "replace": true,
        "sounds": [
            "sound_2"
        ]
    },
    "sound_3": {
        "sounds": [
            "sound_3"
        ]
    },
    "sound_4": {
        "replace": true,
        "sounds": [
            "sound_4"
        ]
    }
}
```

RP2 中的`sounds.json`：

```json5
{
    "sound_1": {
        "sounds": [
            "sound_5"
        ]
    },
    "sound_2": {
        "sounds": [
            "sound_6"
        ]
    },
    "sound_3": {
        "replace": true,
        "sounds": [
            "sound_7"
        ]
    },
    "sound_4": {
        "replace": true,
        "sounds": [
            "sound_8"
        ]
    }
}
```

合并后的`sounds.json`文件是游戏最终用来加载声音的内容，类似如下格式（仅在内存中存在，此文件不会被写入任何地方）：

```json5
{
    "sound_1": {
        // replace false and false: add from lower pack, then from upper pack
        "sounds": [
            "sound_5",
            "sound_1"
        ]
    },
    "sound_2": {
        // replace true in upper pack and false in lower pack: add from upper pack only
        "sounds": [
            "sound_2"
        ]
    },
    "sound_3": {
        // replace false in upper pack and true in lower pack: add from lower pack, then from upper pack
        // Would still discard values from a third resource pack sitting below RP2
        "sounds": [
            "sound_7",
            "sound_3"
        ]
    },
    "sound_4": {
        // replace true and true: add from upper pack only
        "sounds": [
            "sound_8"
        ]
    }
}
```

## Playing Sounds

Minecraft offers various methods to play sounds, and it is sometimes unclear which one should be used. All methods accept a `SoundEvent`, which can either be your own or a vanilla one (vanilla sound events are found in the `SoundEvents` class). For the following method descriptions, client and server refer to the [logical client and logical server][sides], respectively.

### `Level`

- `playSeededSound(Player player, double x, double y, double z, Holder<SoundEvent> soundEvent, SoundSource soundSource, float volume, float pitch, long seed)`
    - Client behavior: If the player passed in is the local player, play the sound event to the player at the given location, otherwise no-op.
    - Server behavior: A packet instructing the client to play the sound event to the player at the given location is sent to all players except the one passed in.
    - Usage: Call from client-initiated code that will run on both sides. The server not playing it to the initiating player prevents playing the sound event twice to them. Alternatively, call from server-initiated code (e.g. a [block entity][be]) with a `null` player to play the sound to everyone.
- `playSound(Player player, double x, double y, double z, SoundEvent soundEvent, SoundSource soundSource, float volume, float pitch)`
    - Forwards to `playSeededSound` with a random seed selected and the holder wrapped around the `SoundEvent`
- `playSound(Player player, BlockPos pos, SoundEvent soundEvent, SoundSource soundSource, float volume, float pitch)`
    - Forwards to the above method with `x`, `y` and `z` taking the values of `pos.getX() + 0.5`, `pos.getY() + 0.5` and `pos.getZ() + 0.5`, respectively.
- `playLocalSound(double x, double y, double z, SoundEvent soundEvent, SoundSource soundSource, float volume, float pitch, boolean distanceDelay)`
    - Client behavior: Plays the sound to the player at the given location. Does not send anything to the server. If `distanceDelay` is `true`, delays the sound based on the distance to the player.
    - Server behavior: No-op.
    - Usage: Called from custom packets sent from the server. Vanilla uses this for thunder sounds.

### `ClientLevel`

- `playLocalSound(BlockPos pos, SoundEvent soundEvent, SoundSource soundSource, float volume, float pitch, boolean distanceDelay)`
    - Forwards to `Level#playLocalSound` with `x`, `y` and `z` taking the values of `pos.getX() + 0.5`, `pos.getY() + 0.5` and `pos.getZ() + 0.5`, respectively.

### `Entity`

- `playSound(SoundEvent soundEvent, float volume, float pitch)`
    - Forwards to `Level#playSound` with `null` as the player, `Entity#getSoundSource` as the sound source, the entity's position for x/y/z, and the other parameters passed in.

### `Player`

- `playSound(SoundEvent soundEvent, float volume, float pitch)` (overrides the method in `Entity`)
    - Forwards to `Level#playSound` with `this` as the player, `SoundSource.PLAYER` as the sound source, the player's position for x/y/z, and the other parameters passed in. As such, the client/server behavior mimics the one from `Level#playSound`:
        - Client behavior: Play the sound event to the client player at the given location.
        - Server behavior: Play the sound event to everyone near the given location except the player this method was called on.

## Datagen

Sound files themselves can of course not be [datagenned][datagen], but `sounds.json` files can. To do so, we extend `SoundDefinitionsProvider` and override the `registerSounds()` method:

```java
public class MySoundDefinitionsProvider extends SoundDefinitionsProvider {
    // Parameters can be obtained from GatherDataEvent.
    public MySoundDefinitionsProvider(PackOutput output, ExistingFileHelper existingFileHelper) {
        // Use your actual mod id instead of "examplemod".
        super(output, "examplemod", existingFileHelper);
    }

    @Override
    public void registerSounds() {
        // Accepts a Supplier<SoundEvent>, a SoundEvent, or a ResourceLocation as the first parameter.
        add(MySoundsClass.MY_SOUND, SoundDefinition.definition()
            // Add sound objects to the sound definition. Parameter is a vararg.
            .with(
                // Accepts either a string or a ResourceLocation as the first parameter.
                // The second parameter can be either SOUND or EVENT, and can be omitted if the former.
                sound("examplemod:sound_1", SoundDefinition.SoundType.SOUND)
                    // Sets the volume. Also has a double counterpart.
                    .volume(0.8f)
                    // Sets the pitch. Also has a double counterpart.
                    .pitch(1.2f)
                    // Sets the weight.
                    .weight(2)
                    // Sets the attenuation distance.
                    .attenuationDistance(8)
                    // Enables streaming.
                    // Also has a parameterless overload that defers to stream(true).
                    .stream(true)
                    // Enables preloading.
                    // Also has a parameterless overload that defers to preload(true).
                    .preload(true),
                // The shortest we can get.
                sound("examplemod:sound_2")
            )
            // Sets the subtitle.
            .subtitle("sound.examplemod.sound_1")
            // Enables replacing.
            .replace(true)
        );
    }
}
```

As with every data provider, don't forget to register the provider to the event:

```java
@SubscribeEvent
public static void gatherData(GatherDataEvent event) {
    DataGenerator generator = event.getGenerator();
    PackOutput output = generator.getPackOutput();
    ExistingFileHelper existingFileHelper = event.getExistingFileHelper();

    // other providers here
    generator.addProvider(
        event.includeClient(),
        new MySoundDefinitionsProvider(output, existingFileHelper)
    );
}
```

[bug]: https://bugs.mojang.com/browse/MC-146721
[datagen]: ../index.md#data-generation
[mcwiki]: https://minecraft.wiki
[mcwikisounds]: https://minecraft.wiki/w/Sounds.json
[modbus]: ../../concepts/events.md#event-buses
[modctor]: ../../gettingstarted/modfiles.md#javafml-and-mod
[registration]: ../../concepts/registries.md
[sides]: ../../concepts/sides.md#the-logical-side
[soundsjson]: #soundsjson

# 界面选项

## 语言

设置语言会影响数字和日期的格式。

## SFW 内容模式

SFW 内容模式用于指示所管理的内容*不是*成人内容。

当启用 SFW 内容模式时，UI 会进行以下更改：
- 默认的演员图片更改为非成人导向的图片
- 隐藏某些成人专用的元数据字段（例如演员生殖器字段）
- `O` 计数器替换为 `Like` 计数器

## 场景/标记墙预览类型

场景墙和标记页面默认显示场景预览视频（mp4）。可以将其更改为动态图片（webp）或静态图片。

> **⚠️ 注意：** 如果选择了视频预览类型，则必须生成场景/标记预览视频才能在适用的墙页面中看到它们。同样，如果选择了动态图片，则必须生成图片预览。

## 将工作室叠加层显示为文本

默认情况下，在网格卡片视图中，工作室将以工作室徽标的图像叠加层形式显示。选中此选项可将其更改为以文本名称形式显示工作室。

## 场景播放器选项

默认情况下，导航到场景页面时，场景视频不会自动开始播放。选中 "Auto-start video" 选项可将其更改为自动播放场景视频。

最大循环时长选项允许循环播放较短的视频。将此值设置为场景视频应循环的最大场景时长。将其设置为 0 可禁用此功能。

### 活动跟踪

"Track Activity" 选项允许跟踪场景播放次数和时长，并在场景视频未播放完时设置恢复点。

"Minimum play percent" 给出了在场景播放次数增加之前必须播放的视频最小比例。

默认情况下，当场景有恢复点时，场景播放器将在播放场景时自动跳转到此点。将 "Always start video from beginning" 设置为 true 可禁用此行为。

## 自定义 CSS

可以使用自定义 CSS 来自定义 Stash UI。参见[此处](https://discourse.stashapp.cc/t/custom-css-snippets/4043)获取社区策划的一组 CSS 片段以自定义你的 UI。

还有一组[社区创建的主题](https://discourse.stashapp.cc/tags/c/plugins/18/all/theme)可用。

## 自定义 JavaScript

Stash 支持注入自定义 JavaScript，以协助主题设置或添加额外功能。请注意，糟糕的 JavaScript 可能会破坏 UI，甚至造成更严重的后果。

## 自定义语言环境

可以自定义本地化字符串。默认（en-GB）语言环境字符串的主列表可以在[此处](https://github.com/stashapp/stash/blob/develop/ui/v2.5/src/locales/en-GB.json)找到。自定义语言环境格式与此 json 文件相同。

例如，要覆盖 `actions.add_directory` 标签（默认为 `Add directory`），你需要在自定义语言环境中包含以下内容：

```
{
  "actions": {
    "add_directory": "Some other description"
  }
}
```

## 自定义服务文件夹

可以将特定文件夹公开到 UI。此配置仅在 `config.yml` 文件中手动执行。

自定义服务内容通过 `/custom` URL 路径前缀公开。

例如，在 `config.yml` 文件中：
```
custom_served_folders:
  /: D:\stash\static
  /foo: D:\bar
```

使用上述配置，对 `/custom/foo/bar.png` 的请求将返回 `D:\bar\bar.png`。`/` 条目匹配任何未被其他条目映射的内容。例如，`/custom/baz/xyz.png` 将返回 `D:\stash\static\baz\xyz.png`。

其应用包括在自定义 css 中使用静态图像，例如 Plex 主题。例如，使用以下配置：
```yml
custom_served_folders:
  /: <stash folder>\custom
```

可以将 `background.png` 和 `noise.png` 文件放在 `custom` 文件夹中，然后在自定义 css 中，可以将 `./background.png` 和 `./noise.png` 字符串分别替换为 `/custom/background.png` 和 `/custom/noise.png`。

其他应用是向 Stash 添加自定义 UI，可通过 `/custom` 访问。

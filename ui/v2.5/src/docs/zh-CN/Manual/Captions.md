# 字幕

Stash 支持使用 SRT 和 VTT 文件的字幕。

只有当字幕文件与对应的场景文件位于同一文件夹时，才会被检测到。

请确保字幕文件遵循以下命名约定：

## 场景

- {scene_file_name}.{language_code}.{ext}
- {scene_file_name}.{ext}

其中 `{language_code}` 由 [ISO-6399-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)（双字母）标准定义，`{ext}` 为文件扩展名。没有语言代码的字幕文件在视频播放器中会显示为 Unknown，但仍可正常使用。

带有字幕的场景可以通过 `captions` 条件进行筛选。

> **⚠️ 注意：** 如果字幕文件是在场景扫描入库后添加的，你需要运行一次选择性扫描任务，它才会显示出来。

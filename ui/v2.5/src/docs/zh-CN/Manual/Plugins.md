# 插件

Stash 支持插件，可以执行以下操作：

- 当用户从“任务”页面触发时执行自定义任务
- 当由特定事件触发时执行自定义任务
- 向 UI 添加自定义 CSS
- 向 UI 添加自定义 JavaScript

插件任务可以使用内嵌 JavaScript 实现，也可以通过调用外部二进制程序来实现。

> **⚠️ 注意：** 插件支持仍处于实验阶段，可能会发生变化。

## 管理插件

可以在 `设置 > 插件`（Settings > Plugins）页面安装和管理插件。

插件通过 `可用插件`（Available Plugins）部分进行安装。此部分允许配置用于安装插件的源。默认配置了 `社区（稳定版）`（Community (stable)）源。此源包含适用于当前 _稳定_ 版本 stash 的插件。

以下是由 stashapp 组织维护的插件源：

| 名称 | 源 URL | 推荐的本地路径 | 说明 |
|------|-----------|------------------------|-------|
| 社区（稳定版）Community (stable) | `https://stashapp.github.io/CommunityScripts/stable/index.yml` | `stable` | 适用于当前稳定版的 stash。 |
| 社区（开发版）Community (develop) | `https://stashapp.github.io/CommunityScripts/develop/index.yml` | `develop` | 适用于开发版的 stash。 |

已安装的插件可以在 `已安装插件`（Installed Plugins）部分更新或卸载。

### 源 URL

源 URL 必须返回一个包含该源所有可用包的 yaml 文件。一个示例的源 yaml 文件如下所示：

```
- id: <package id>
  name: <package name>
  version: <version>
  date: <date>
  requires:
  - <ids of packages required by this package (optional)>
  - ...
  path: <path to package zip file>
  sha256: <sha256 of zip>
  metadata:
    <optional key/value pairs for extra information>
- ...
```

Path 可以是 zip 文件的相对路径，也可以是外部 URL。

## 手动添加插件

默认情况下，Stash 会在读取 stash `config.yml` 的目录的 `plugins` 子目录中查找插件配置。该目录可能是 `$HOME/.stash` 目录，也可能是当前工作目录。

通过将配置 yaml 文件（格式：`pluginName.yml`）添加到 `plugins` 目录中即可添加插件。

已加载的插件可以在“设置”的“插件”页面中查看。在 stash 运行期间添加、移除或编辑插件后，可以通过点击 `重新加载插件`（Reload Plugins）按钮来重新加载它们。

## 使用插件

插件提供可以从“任务”页面运行的任务。

## 创建插件

### 插件配置文件格式

插件配置文件的基本结构如下：

```yaml
name: <plugin name>
# optional list of dependencies to be included
# "#" is is part of the config - do not remove
# requires: <plugin ID>
description: <optional description of the plugin>
version: <optional version tag>
url: <optional url>

ui:
  # optional list of css files to include in the UI
  css:
    - <path to css file>

  # optional list of js files to include in the UI
  javascript:
    - <path to javascript file>

  # optional list of plugin IDs to load prior to this plugin
  requires:
    - <plugin ID>

  # optional list of assets
  assets:
    urlPrefix: fsLocation
    ...

  # content-security policy overrides
  csp:
    script-src:
      - http://alloweddomain.com

    style-src:
      - http://alloweddomain.com

    connect-src:
      - http://alloweddomain.com

# map of setting names to be displayed in the plugins page in the UI
settings:
  # internal name
  foo:
  # name to display in the UI
  displayName: Foo
  # type of the attribute to show in the UI
  # can be BOOLEAN, NUMBER, or STRING
  type: BOOLEAN

# the following are used for plugin tasks only
exec:
  - ...
interface: [interface type]
errLog: [one of none trace, debug, info, warning, error]
tasks:
  - ...
```

`name`、`description`、`version` 和 `url` 字段会显示在插件页面上。

`# requires` 会让插件管理器选择匹配指定 ID 的插件，并将其作为依赖自动安装。仅适用于同一索引内的插件。

`exec`、`interface`、`errLog` 和 `tasks` 字段仅用于带任务的插件。

`settings` 字段用于在插件页面上显示插件设置。插件设置也可以通过 graphql mutation `configurePlugin` 来设置——以这种方式设置的设置 _不_ 需要在 `settings` 字段中指定，除非要在原始的插件设置 UI 中显示它们。

### UI 配置

`css` 和 `javascript` 字段值可以是相对于插件配置文件的相对路径，也可以是完整的外部 URL。

`requires` 字段是一个插件 ID 列表，这些插件的 javascript/css 文件必须在本插件的 javascript/css 文件之前加载。

`assets` 字段是一个从 URL 前缀到相对于插件配置文件的文件系统路径的映射。
资产会被挂载到 `/plugin/{pluginID}/assets` 路径下。

举例来说，对于一个 id 为 `foo` 且 `assets` 值如下的插件：
```
assets:
  foo: bar
  /: .
```
以下 URL 将被映射到这些位置：
`/plugin/foo/assets/foo/file.txt` -> `{pluginDir}/bar/file.txt`
`/plugin/foo/assets/file.txt` -> `{pluginDir}/file.txt`
`/plugin/foo/assets/bar/file.txt` -> `{pluginDir}/bar/file.txt`（通过 `/` 条目）

如果映射试图跳出包含插件配置文件的目录，则会被忽略。

`csp` 字段包含对内容安全策略（content security policy）的覆盖。`script-src`、`style-src` 和 `connect-src` 中的 URL 将被添加到适用的内容安全策略中。

有关制作带外部任务的插件的详细信息，请参见[外部插件](/help/ExternalPlugins.md)。

有关制作带内嵌任务的插件的详细信息，请参见[内嵌插件](/help/EmbeddedPlugins.md)。

### 插件任务输入

插件任务可以接受来自 stash 服务器的输入。此输入根据接口进行编码，并具有以下结构（此处以 JSON 格式呈现）：
```
{
    "server_connection": {
        "Scheme": "http",
        "Port": 9999,
        "SessionCookie": {
            "Name":"session",
            "Value":"cookie-value",
            "Path":"",
            "Domain":"",
            "Expires":"0001-01-01T00:00:00Z",
            "RawExpires":"",
            "MaxAge":0,
            "Secure":false,
            "HttpOnly":false,
            "SameSite":0,
            "Raw":"",
            "Unparsed":null
        },
        "Dir": <path to stash config directory>,
        "PluginDir": <path to plugin config directory>,
    },
    "args": {
        "argKey": "argValue"
    }
}
```

`server_connection` 字段包含插件在必要时访问父 stash 服务器所需的全部信息。

### 插件任务输出

插件任务输出预期具有以下结构（此处以 JSON 格式呈现）：

```
{
    "error": <optional error string>
    "output": <anything>
}
```

如果存在 `error` 字段，则会以 `error` 日志级别记录到 stash 中。`output` 会以 `debug` 日志级别写入。

### 任务配置

任务使用以下结构进行配置：

```
tasks:
  - name: <operation name>
    description: <optional description>
    defaultArgs:
      argKey: argValue
```

一个插件配置可以包含多个任务。

`defaultArgs` 字段用于向发送给插件的插件输入添加输入项。

### Hook 配置

Stash 支持在 stash 操作期间通过触发 hook 来执行插件操作。

Hook 使用与任务类似的结构进行配置：

```
hooks:
  - name: <operation name>
    description: <optional description>
    triggeredBy:
      - <trigger types>...
    defaultArgs:
      argKey: argValue
```

**⚠️ 注意：** 如果 hook 执行的是变更（mutation）操作，则它们有可能相互触发或触发自身。为安全起见，如果某个 hook 已经在当前操作的上下文中被触发过，则不会被再次触发。Stash 使用 cookie 来跟踪此上下文，因此插件在执行操作时发送 cookie 非常重要。

#### 触发器类型

触发器类型使用以下格式：`<object type>.<operation>.<hook type>`

例如，场景创建操作上的后置 hook（post-hook）将是 `Scene.Create.Post`。

支持以下对象类型：

* `Scene`
* `SceneMarker`
* `Image`
* `Gallery`
* `Group`
* `Performer`
* `Studio`
* `Tag`

支持以下操作：

* `Create`
* `Update`
* `Destroy`
* `Merge`（仅用于 `Tag`）

目前仅支持 `Post` hook 类型。这些 hook 会在操作完成且事务提交之后执行。

#### Hook 输入

由 hook 触发的插件任务会在 `args` 对象结构中包含一个名为 `hookContext` 的参数。`hookContext` 的结构如下：

```
{
    "id": <object id>,
    "type": <trigger type>,
    "input": <operation input>,
    "inputFields": <fields included in input>
}
```

`input` 字段包含传递给原始操作的 JSON graphql 输入。不同操作之间会有所不同。对于由扫描或清理操作触发的 hook，input 将为 nil。`inputFields` 在更新操作中被填充，用于指示哪些字段被传递给了该操作，以区分缺失字段与空字段。

例如，以下是一个场景更新操作的 `args` 值：

```
{
    "hookContext": {
        "type":"Scene.Update.Post",
        "id":45,
        "input":{
            "clientMutationId":null,
            "id":"45",
            "title":null,
            "details":null,
            "url":null,
            "date":null,
            "rating":null,
            "organized":null,
            "studio_id":null,
            "gallery_ids":null,
            "performer_ids":null,
            "groups":null,
            "tag_ids":["21"],
            "cover_image":null,
            "stash_ids":null
        },
        "inputFields":[
            "tag_ids",
            "id"
        ]
    }
}
```

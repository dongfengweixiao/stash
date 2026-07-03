# 外部插件任务

外部插件任务通过运行外部二进制文件来执行。

## 插件接口

Stash 使用接口与外部插件任务通信。Stash 目前支持 RPC 和 raw 接口类型。

### RPC 接口

RPC 接口使用 JSON-RPC 与插件进程通信。stash 源码中的 `pkg/plugin/examples/gorpc` 下提供了一个使用 RPC 接口的 golang 插件。RPC 插件应提供满足 `pkg/plugin/common` 中 `RPCRunner` 接口的实现。

RPC 插件应异步接受请求。

在停止 RPC 插件任务时，stash 服务器会向插件发送停止请求，并依赖插件自行停止。

### Raw 接口

Raw 接口插件不需要遵循任何特定接口。stash 服务器会通过其 stdin 流将插件输入发送给插件进程，编码为 JSON。Raw 接口插件不要求读取该输入。

stash 服务器会读取插件的 stdout 作为其输出。如果输出可以被解码为插件输出数据结构的 JSON 表示，则会进行解码。如果不能，则将整个 stdout 字符串作为插件的输出。

在停止 raw 插件任务时，stash 服务器会直接终止所生成的进程，不会发出警告或信号。

## 日志

外部插件可以通过写入 stderr 向 stash 服务器记录日志。默认情况下，写入 stderr 的数据会以 `error` 级别记录。可以通过在插件配置文件中设置 `errLog` 字段来更改此默认行为。

插件可以通过在输出字符串前添加特殊控制字符前缀来记录特定级别的日志或记录进度。有关在 go 中如何实现的说明，请参见 `pkg/plugin/common/log`。

## 插件配置文件格式

### exec

对于外部插件任务，`exec` 字段是一个列表，第一个元素是要执行的二进制文件，后续元素是传递的参数。执行过程会在路径中搜索该二进制文件，然后尝试在插件配置文件所在的同一目录中查找该程序。在 Windows 系统上不需要 `exe` 扩展名。

> **⚠️ 注意：** 插件执行过程会将当前工作目录设置为 stash 进程的工作目录。

参数可以使用特殊字符串 `{pluginDir}` 来包含插件所在目录。

例如，如果插件可执行文件 `my_plugin` 放在 `plugins` 子目录中，并需要参数 `foo` 和 `bar`，那么配置中的 `exec` 部分如下所示：

```
exec:
  - my_plugin
  - foo
  - bar
```

另一个示例可能是使用 python 脚本来执行插件。假设 python 脚本 `foo.py` 与插件配置文件位于同一目录，则 `exec` 片段如下所示：

```
exec:
  - python
  - {pluginDir}/foo.py
```

### interface

对于外部插件任务，`interface` 字段必须设置为以下值之一：
* `rpc`
* `raw`

有关这些接口类型的详细信息，请参见上方的 `Plugin interfaces`（插件接口）章节。

如果未提供，`interface` 字段默认为 `raw`。

### errLog

`errLog` 字段告诉 stash，当插件输出到 stderr 且未编码日志级别时，默认日志级别应为多少。如果未提供，默认为 `error` 级别。如果插件以适当的编码输出日志，则不需要此字段。有关详细信息，请参见上方的 `Logging`（日志）章节。

## 任务配置

除了标准任务配置外，外部任务还可以配置可选的 `execArgs` 字段，以向任务的执行参数添加额外参数。

例如：

```
tasks:
  - name: <operation name>
    description: <optional description>
    execArgs:
      - <arg to add to the exec line>
```

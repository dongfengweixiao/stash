# 内嵌插件任务

内嵌插件任务使用脚本系统在 Stash 进程内执行。

## 支持的脚本语言

Stash 目前使用 [goja](https://github.com/dop251/goja) 支持 JavaScript 内嵌插件任务。

## JavaScript 插件

### 插件输入

输入通过 `input` 全局变量提供给 JavaScript 插件任务，它是一个基于 [插件](/help/Plugins.md) 页面 `Plugin input` 一节中所述结构的对象。

> **⚠️ 注意：** 在大多数内嵌插件中，`server_connection` 字段应该不是必需的。

### 插件输出

JavaScript 插件任务的输出派生自脚本的求值值。输出应符合 [插件](/help/Plugins.md) 页面 `Plugin output` 一节中所述的结构。

有多种方式可以返回插件输出：

#### 示例 #1

```
(function() {
    return {
        Output: "ok"
    };
})();
```

#### 示例 #2

```
function main() {
    return {
        Output: "ok"
    };
}

main();
```

#### 示例 #3

```
var output = {
    Output: "ok"
};

output;
```

## 日志记录

有关如何使用 Javascript 插件记录日志，请参见下文的 `Javascript API` 一节。

## 插件配置文件格式

### exec

对于内嵌插件，`exec` 字段是一个列表，第一个元素是要执行的 Javascript 文件的路径。Javascript 文件的路径应相对于插件配置文件所在的目录。

### interface

对于内嵌插件，`interface` 字段必须设置为以下值之一：

- `js`

## JavaScript API

### 日志记录

Stash 为 JavaScript 插件中的日志记录提供以下 API：

| 方法 | 描述 |
|--------|-------------|
| `log.Trace(<string>)` | 以 `trace` 日志级别记录日志。 |
| `log.Debug(<string>)` | 以 `debug` 日志级别记录日志。 |
| `log.Info(<string>)` | 以 `info` 日志级别记录日志。 |
| `log.Warn(<string>)` | 以 `warn` 日志级别记录日志。 |
| `log.Error(<string>)` | 以 `error` 日志级别记录日志。 |
| `log.Progress(<float between 0 and 1>)` | 设置插件任务的进度，以浮点数表示，其中 `0` 表示 0%，`1` 表示 100%。 |

### GQL

Stash 提供以下 API，用于使用 graphql 接口与 Stash 通信：

| 方法 | 描述 |
|--------|-------------|
| `gql.Do(<query/mutation string>, <variables object>)` | 在 Stash 服务器上执行 graphql 查询/变更。以与 graphql 查询相同的方式返回对象。 |

#### 示例

```
// creates a tag
var mutation = "\
mutation tagCreate($input: TagCreateInput!) {\
  tagCreate(input: $input) {\
    id\
  }\
}";

var variables = {
    input: {
        'name': tagName
    }
};

result = gql.Do(mutation, variables);
log.Info("tag id = " + result.tagCreate.id);
```

## 实用函数

Stash 为实用函数提供以下 API：

| 方法 | 描述 |
|--------|-------------|
| `util.Sleep(<milliseconds>)` | 将当前线程挂起指定的时长。 |

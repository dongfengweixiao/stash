# 贡献抓取器

可以通过在[此仓库](https://github.com/stashapp/CommunityScrapers/pulls)中创建 PR 来向社区贡献抓取器。

## XPath 抓取器模板

最基础的 XPath 抓取器模板可在 [CommunityScrapers 仓库](https://github.com/stashapp/CommunityScrapers/tree/master/templates)中找到。

## 抓取器配置文件格式

```yaml
name: <site>
performerByName:
  <single scraper config>
performerByFragment:
  <single scraper config>
performerByURL:
  <multiple scraper URL configs>
sceneByName:
  <single scraper config>
sceneByQueryFragment:
  <single scraper config>
sceneByFragment:
  <single scraper config>
sceneByURL:
  <multiple scraper URL configs>
groupByURL:
  <multiple scraper URL configs>
galleryByFragment:
  <single scraper config>
galleryByURL:
  <multiple scraper URL configs>
imageByFragment:
  <single scraper config>
imageByURL:
  <multiple scraper URL configs>
<other configurations>
```

`name` 是必填项，其他所有顶级字段均为可选。每个顶级字段的有无决定了抓取器具备何种能力。

任何顶级字段中的抓取器配置都必须至少包含一个 `action` 字段。其他字段是否必填取决于 `action` 字段的值。

抓取类型及其必填字段如下表所示：

| 行为 | 必填配置 |
|-----------|------------------------|
| 出现在演员编辑页 `Scrape...` 下拉按钮中的抓取器 | 有效的 `performerByName` 和 `performerByFragment` 配置。 |
| 从 URL 抓取演员 | 有效的 `performerByURL` 配置且 URL 匹配。 |
| 出现场景编辑页查询下拉按钮中的抓取器 | 有效的 `sceneByName` 和 `sceneByQueryFragment` 配置。 |
| 出现在场景编辑页 `Scrape...` 下拉按钮中的抓取器 | 有效的 `sceneByFragment` 配置。 |
| 从 URL 抓取场景 | 有效的 `sceneByURL` 配置且 URL 匹配。 |
| 从 URL 抓取分组 | 有效的 `groupByURL` 配置且 URL 匹配。**注意：** 也支持 `movieByURL`，但已弃用。 |
| 出现在图库编辑页 `Scrape...` 下拉按钮中的抓取器 | 有效的 `galleryByFragment` 配置。 |
| 从 URL 抓取图库 | 有效的 `galleryByURL` 配置且 URL 匹配。 |

基于 URL 的抓取接受多个抓取配置，每个配置都需要一个 `url` 字段。stash 会遍历这些配置，尝试将输入的 URL 与配置中的 `url` 字段进行匹配。只要输入的 URL 包含某个 `url` 字段的值，就会执行对应的第一个抓取配置。

## 动作（Actions）

### Script

执行脚本来完成抓取。此动作需要 `script` 字段，并接受一个字符串参数列表。例如：

```yaml
action: script
script:
  - python
  - iafdScrape.py
  - query
```

如果脚本指定了 python 可执行文件，Stash 会为你的系统找到正确的 python 可执行文件，即 `python` 或 `python3`。例如，此配置可能会执行 `python iafdScrape.py query` 或 `python3 iafdScrape.py query`。
系统会优先查找 `python3`，如果未找到，再查找 `python`。如果两者都未找到，将会报错。

Stash 会将数据发送到脚本进程的 `stdin` 流，并期望输出通过 `stdout` 流返回。任何错误和进度信息应输出到 `stderr`。

根据抓取类型的不同，脚本接收的输入和期望的输出也不同，详见下表：

| 抓取类型 | 输入 | 输出 |
|-------------|-------|--------|
| `performerByName` | `{"name": "<performer query string>"}` | JSON 编码的演员片段数组（至少包含 `name`） |
| `performerByFragment` | JSON 编码的演员片段 | JSON 编码的演员片段 |
| `performerByURL` | `{"url": "<url>"}` | JSON 编码的演员片段 |
| `sceneByName` | `{"name": "<scene query string>"}` | JSON 编码的场景片段数组 |
| `sceneByQueryFragment`、`sceneByFragment` | JSON 编码的场景片段 | JSON 编码的场景片段 |
| `sceneByURL` | `{"url": "<url>"}` | JSON 编码的场景片段 |
| `groupByURL` | `{"url": "<url>"}` | JSON 编码的分组片段 |
| `galleryByFragment` | JSON 编码的图库片段 | JSON 编码的图库片段 |
| `galleryByURL` | `{"url": "<url>"}` | JSON 编码的图库片段 |
| `imageByFragment` | JSON 编码的图片片段 | JSON 编码的图片片段 |
| `imageByURL` | `{"url": "<url>"}` | JSON 编码的图片片段 |

对于 `performerByName`，返回的演员片段中只有 `name` 是必填的。整个对象会被发送回 `performerByFragment` 以抓取特定演员，因此可以包含其他字段来辅助抓取演员。例如，可以为特定演员页面填写 `url` 字段，然后 `performerByFragment` 就可以使用该值进行提取。

演员抓取器的 Python 示例：

```python
import json
import sys
import string

def readJSONInput():
	input = sys.stdin.read()
	return json.loads(input)


def searchPerformer(name):
    # perform scraping here - using name for the query

    # fill in the output
    ret = []

    # example shown for a single found performer
    p = {}
    p['name'] = "some name"
    p['url'] = "performer url"
    ret.append(p)

    return ret

def scrapePerformer(input):
    ret = []
    # get the url from the input
    url = input['url']
    return scrapePerformerURL(url)

def debugPrint(t):
    sys.stderr.write(t + "\n")

def scrapePerformerURL(url):
    debugPrint("Reading url...")
    debugPrint("Parsing html...")

    # parse html

    # fill in performer details - single object
    ret = {}

    ret['name'] = "fred"
    ret['aliases'] = "freddy"
    ret['ethnicity'] = ""
    # and so on

    return ret

# read the input
i = readJSONInput()

if sys.argv[1] == "query":
    ret = searchPerformer(i['name'])
    print(json.dumps(ret))
elif sys.argv[1] == "scrape":
    ret = scrapePerformer(i)
    print(json.dumps(ret))
elif sys.argv[1] == "scrapeURL":
    ret = scrapePerformerURL(i['url'])
    print(json.dumps(ret))
```

### scrapeXPath

此动作使用 xpath 配置来解析并抓取网页。此动作对 `performerByFragment` **无效**。

此动作要求填充顶级 `xPathScrapers` 配置。`scraper` 字段是必填的，且必须与 `xPathScrapers` 中配置的某个抓取器名称相匹配。例如：

```yaml
sceneByURL:
- action: scrapeXPath
  url:
    - pornhub.com/view_video.php
  scraper: sceneScraper
```

上述配置要求 `sceneScraper` 存在于 `xPathScrapers` 配置中。

XPath 抓取配置指定了对象字段与 xpath 选择器之间的映射。xpath 抓取器会抓取相应的 URL，并使用 xpath 来填充对象字段。

### scrapeJson

此动作的工作方式与 `scrapeXPath` 相同，但使用映射的 json 配置来解析。它使用顶级的 `jsonScrapers` 配置。此动作对 `performerByFragment` **无效**。

JSON 抓取配置指定了对象字段与 GJSON 选择器之间的映射。JSON 抓取器会抓取相应的 URL，并使用 [GJSON](https://github.com/tidwall/gjson/blob/master/SYNTAX.md) 来解析返回的 JSON 对象并填充对象字段。


### scrapeXPath 和 scrapeJson 配合 `performerByName` 使用

对于 `performerByName`，还必须存在 `queryURL` 字段。该字段用于执行演员名称的搜索查询 URL。占位字符串序列 `{}` 会被替换为演员名称搜索字符串。为使后续的演员抓取能够工作，`URL` 字段必须填写与 `performerByURL` 抓取配置中给出的 URL 相匹配的演员页面 URL。例如：

```yaml
name: Boobpedia
performerByName:
  action: scrapeXPath
  queryURL: http://www.boobpedia.com/wiki/index.php?title=Special%3ASearch&search={}&fulltext=Search
  scraper: performerSearch
performerByURL:
  - action: scrapeXPath
    url:
      - boobpedia.com/boobs/
    scraper: performerScraper
xPathScrapers:
  performerSearch:
    performer:
      Name: # name element
      URL: # URL element that matches the boobpedia.com/boobs/ URL above
  performerScraper:
    # ... performer scraper details ...
```

### scrapeXPath 和 scrapeJson 配合 `sceneByFragment` 和 `sceneByQueryFragment` 使用

对于 `sceneByFragment` 和 `sceneByQueryFragment`，还必须存在 `queryURL` 字段。该字段用于为场景构建查询 URL。对于 `sceneByFragment`，`queryURL` 字段支持以下占位字段：

- `{checksum}` - 场景的 MD5 校验和
- `{oshash}` - 场景的 oshash
- `{phash}` - 场景的 phash
- `{filename}` - 场景的基本文件名
- `{title}` - 场景的标题
- `{url}` - 场景的 url

这些占位字段的值可以通过添加 `queryURLReplace` 段来进行 regex 替换操作，该段包含一个占位字段到 regex 配置的映射，使用与下文介绍的 `replace` 后处理动作相同的格式。例如：

```yaml
sceneByFragment:
  action: scrapeJson
  scraper: sceneQueryScraper
  queryURL: https://metadataapi.net/api/scenes?parse={filename}&limit=1
  queryURLReplace:
    filename:
      - regex: <some regex>
        with: <replacement>
```

上述配置会从 `queryURL` 的值进行抓取，将 `{filename}` 替换为场景的基本文件名（在经过 regex 替换处理之后）。

### scrapeXPath 和 scrapeJson 配合 `<scene|performer|gallery|group>ByURL` 使用

对于 `sceneByURL`、`performerByURL`、`galleryByURL`，如果想使用 `queryURLReplace`，也可以使用 `queryURL`。其功能与 `sceneByFragment` 相同，不过唯一可用的占位字段是 `url`：

- `{url}` - 场景/演员/图库的 url

```yaml
sceneByURL:
  - action: scrapeJson
    url:
      - metartnetwork.com
    scraper: sceneScraper
    queryURL: "{url}"
    queryURLReplace:
      url:
        - regex: '^(?:.+\.)?([^.]+)\.com/.+movie/(\d+)/(\w+)/?$'
          with: https://www.$1.com/api/movie?name=$3&date=$2
```

### Stash

可以将另一个不同的 stash 服务器配置为抓取来源。此动作仅适用于 `performerByName`、`performerByFragment`、`sceneByName`、`sceneByQueryFragment` 和 `sceneByFragment` 类型。此动作要求配置顶级 `stashServer` 字段。

- `stashServer` 包含一个用于远程 stash 服务器的 `url` 字段。
- 用户名和密码可以使用 `username:password@host` 嵌入到此字符串中。
- 或者，可以使用 `apiKey` 字段向远程 stash 服务器进行身份验证。

下面是一个 stash 抓取配置示例：

```yaml
name: stash
performerByName:
  action: stash
performerByFragment:
  action: stash
sceneByFragment:
  action: stash
sceneByName:
  action: stash
sceneByQueryFragment:
  action: stash
stashServer:
  apiKey: <api key>
  url: http://stashserver.com:9999
```

## Xpath 和 JSON 抓取器配置

顶级 `xPathScrapers` 字段包含 xpath 抓取配置，可自由命名。它们在 `scrapeXPath` 抓取器的 `scraper` 字段中被引用。

同样，顶级 `jsonScrapers` 字段包含 json 抓取配置。

这些配置统称为映射抓取配置。

一个映射抓取配置可以包含一个 `common` 字段，并且根据其配置的抓取类型，必须包含 `performer`、`scene`、`group` 或 `gallery`。

在 `performer`/`scene`/`group`/`gallery` 字段内部是键值对，对应演员/场景对象上的 [golang 字段](/help/ScraperDevelopment.md#object-fields)。这些字段区分大小写。

这些字段的值可以是一个简单的选择器值（告诉系统从何处获取该字段的值），也可以是一个更高级的配置（见下文）。例如，对于一个 xpath 配置：

```yaml
performer:
  Name: //h1[@itemprop="name"]
```

这会将返回的演员的 `Name` 属性设置为匹配 `<h1 itemprop="name">...` 元素的文本内容。

对于一个 json 配置：

```yaml
performer:
  Name: data.name
```

该值也可以是一个子对象。如果是子对象，则选择器必须设置到该子对象的 `selector` 键上。例如，使用与上面相同的 xpath：

```yaml
performer:
  Name:
    selector: //h1[@itemprop="name"]
    postProcess:
      # post-processing config values
```

### 固定属性值

或者，可以将属性值设置为固定值，而不是从网页抓取。可以通过将 `selector` 替换为 `fixed` 来实现。例如：

```yaml
performer:
  Gender:
    fixed: Female
```

### 输入 URL 占位符

`{inputURL}` 和 `{inputHostname}` 占位符可用于 `fixed` 值和 `selector` 表达式中，以访问用于抓取内容的原始 URL 的相关信息。

#### {inputURL}

`{inputURL}` 占位符提供对完整 URL 的访问。当你希望将来源 URL 作为抓取数据的一部分返回或引用时，这很有用。例如：

```yaml
scene:
  URL:
    fixed: "{inputURL}"
  Title:
    selector: //h1[@class="title"]
```

当从 `https://example.com/scene/12345` 抓取时，`{inputURL}` 占位符会被替换为 `https://example.com/scene/12345`。

#### {inputHostname}

`{inputHostname}` 占位符仅从 URL 中提取主机名。当你需要引用域名而又不想手动解析 URL 时，这很有用。例如：

```yaml
scene:
  Studio:
    fixed: "{inputHostname}"
  Details:
    selector: //div[@data-domain="{inputHostname}"]//p[@class="description"]
```

当从 `https://example.com/scene/12345` 抓取时，`{inputHostname}` 占位符会被替换为 `example.com`。

这些占位符也可用于选择器中以实现更高级的用例：

```yaml
scene:
  Details:
    selector: //div[@data-url="{inputURL}"]//p[@class="description"]
  Site:
    selector: //div[@data-host="{inputHostname}"]//span[@class="site-name"]
```

> **⚠️ 注意：** 这些占位符表示用于获取内容的实际 URL，即在任何 URL 替换被应用之后。

### 公共片段

`common` 字段用于配置可在选择器字符串中引用的选择器片段。这些是键值对，其中键是用于引用该片段的字符串，值是该片段将被替换为的内容。例如：

```yaml
common:
  $infoPiece: //div[@class="infoPiece"]/span
performer:
  Measurements: $infoPiece[text() = 'Measurements:']/../span[@class="smallInfo"]
```

`Measurements` xpath 字符串会将 `$infoPiece` 替换为 `//div[@class="infoPiece"]/span`，结果为：`//div[@class="infoPiece"]/span[text() = 'Measurements:']/../span[@class="smallInfo"]`。

> **⚠️ 注意：** **不支持**递归的公共片段。

在另一个公共片段中引用某个公共片段会导致错误。例如：
```yaml
common:
  $info: //div[@class="info"]
  # Referencing $info in $models will cause an error
  $models: $info/a[@class="model"]
scene:
  Title: $info/h1
  Performers:
    Name: $models
    URL: $models/@href
```

### 后处理选项

后处理操作包含在 `postProcess` 键中。后处理操作按指定的顺序执行。可用的后处理操作如下：

#### `javascript`

`javascript`：接受一个 javascript 代码块，该代码块必须返回一个字符串值。输入字符串在 `value` 变量中声明。如果在编译或运行脚本时发生错误，则返回原始值。例如：

```yaml
performer:
  Name:
    selector: //div[@class="example element"]
    postProcess:
      - javascript: |
          // capitalise the first letter
          if (value && value.length) {
            return value[0].toUpperCase() + value.substring(1)
          }
```

我们使用 [`goja` javascript 引擎](https://github.com/dop251/goja)，它缺少一些内置方法，可能与其他现代 javascript 实现不一致。

#### `feetToCm`

`feetToCm`：将包含英尺和英寸数字的字符串转换为厘米。查找最多两个独立的整数，并将第一个解释为英尺数，第二个解释为英寸数。数字之间可以用任何非数字字符分隔，包括 `.` 字符。它不处理小数。例如 `6.3` 和 `6ft3.3` 都会被解释为 6 英尺 3 英寸，然后再转换为厘米。

#### `lbToKg`

`lbToKg`：将包含磅（lbs）的字符串转换为千克（kg）。

#### `map`

`map`：包含一个从输入值到输出值的映射。当某个值匹配其中一个输入值时，它将被替换为对应的输出值。如果没有匹配到任何值，则该值保持不变。例如：

```yaml
performer:
  Gender:
    selector: //div[@class="example element"]
    postProcess:
      - map:
          F: Female
          M: Male
  Height:
    selector: //span[@id="height"]
    postProcess:
      - feetToCm: true
  Weight:
    selector: //span[@id="weight"]
    postProcess:
      - lbToKg: true
```

获取所选 div 元素的内容，并将返回值设置为：
    - 如果抓取到的值为 `F`，则为 `Female`；
    - 如果抓取到的值为 `M`，则为 `Male`。

    身高和体重从所选的 span 中提取，并分别转换为 `cm` 和 `kg`。

#### `parseDate`

`parseDate`：如果存在，其值为使用 go 的参考日期（2006-01-02）表示的日期格式。例如，如果示例日期为 `14-Mar-2003`，则日期格式应为 `02-Jan-2006`。详见 [time.Parse 文档](https://golang.org/pkg/time/#Parse)。当存在时，抓取器会将输入字符串转换为日期，然后再转换为 stash 使用的字符串格式（`YYYY-MM-DD`）。字符串 "Today"、"Yesterday" 会被匹配（不区分大小写）并由抓取器转换，因此你无需编辑/替换它们。

Unix 时间戳（例如：1660169451）也可以通过将日期格式选择为 `unix` 来解析。例如：

```yaml
Date:
  selector: //div[@class="value epoch"]/text()
  postProcess:
    - parseDate: unix
```

#### `subtractDays`

`subtractDays`：如果设置为 `true`，它会从当前日期减去以天为单位的值，并以 stash 的日期格式返回结果日期。例如：
```yaml
Date:
  selector: //strong[contains(text(),"Added:")]/following-sibling::text()
  postProcess:
    - replace:
        - regex: (\d+)\sdays\sago.+
          with: $1
    - subtractDays: true
```

#### `replace`

`replace`：包含一个子对象数组。每个子对象必须具有 `regex` 和 `with` 字段。`regex` 字段是要替换的正则表达式模式，`with` 是要替换成的字符串。`$` 用于引用捕获组 —— `$1` 是第一个捕获组，`$2` 是第二个，依此类推。替换按数组的顺序执行。例如：

```yaml
CareerLength:
  selector: $infoPiece[text() = 'Career Start and End:']/../span[@class="smallInfo"]
    postProcess:
      - replace:
          - regex: \s+to\s+
            with: "-"
```
将 `2001 to 2003` 替换为 `2001-2003`。

#### `subScraper`

`subScraper`：如果存在，子抓取器将在所有其他后处理完成之后、parseDate 之前执行。然后它获取该值并以该值作为 URL 执行 http 请求。在 `subScraper` 配置内部是一个嵌套的抓取配置。这允许你跳转到其他网页以获取所需的属性值。更多信息和示例请参见 [#370](https://github.com/stashapp/stash/pull/370)、[#606](https://github.com/stashapp/stash/pull/606)。

### `concat` 和 `split` 属性

这些是在属性级别（不在 `postProcess` 中）指定的固定后处理字段，在 `postProcess` 操作之后执行：

- `concat`：如果 xpath 匹配多个元素，并且存在 `concat`，则所有元素将被连接在一起。
- `split`：`concat` 的逆操作。使用给定的分隔符将字符串拆分为更多元素。更多信息和示例请参见 PR [#579](https://github.com/stashapp/stash/pull/579)。例如：

```yaml
Tags:
  Name:
    selector: //span[@class="list_attributes"]
    split: ","
```

将位于该 span 中的逗号分隔的标签列表拆分，并返回各个标签。

为了向后兼容，`replace`、`subscraper` 和 `parseDate` 也被允许作为该属性的键。

属性后处理的执行顺序为：`concat`、`replace`、`subscraper`、`parseDate`，然后是 `split`。

### XPath 资源

- 在 Firefox 中测试 XPath：https://addons.mozilla.org/en-US/firefox/addon/try-xpath/
- XPath 速查表：https://devhints.io/xpath

### GJSON 资源

- GJSON Path 语法：https://github.com/tidwall/gjson/blob/master/SYNTAX.md

### 调试支持

要将抓取器请求收到的 html/json 打印到日志文件，请在你的抓取器 yml 文件中添加以下内容：

```yaml
debug:
  printHTML: true
```

### CDP 支持

有些网站交付的内容无法仅通过原始 html 文件来抓取。这些网站使用 javascript 动态加载内容。因此，直接 xpath 抓取在这些网站上不起作用。可以选择使用 Chrome DevTools Protocol 通过一个 Chrome 实例加载网页，然后抓取结果。

可以通过在 yml 配置的根节点添加以下内容，为特定的抓取配置启用 Chrome CDP 支持：

```yaml
driver:
  useCDP: true
```

可选地，你可以在 `driver` 段下添加一个 `sleep` 值。该值指定抓取器在加载网站后等待多少秒再执行抓取。这是必要的，因为某些网站需要更多时间来完成加载脚本。如果未设置，该值默认为 2 秒。

当 `useCDP` 设置为 true 时，stash 将执行或连接到一个 Chrome 实例。其行为由用户配置中的 `Chrome CDP path` 设置决定。如果留空，stash 会尝试在 path 环境变量中查找 Chrome 可执行文件，如果找不到则会失败。

`Chrome CDP path` 可以设置为 chrome 可执行文件的路径，或远程 chrome 实例的 http(s) 地址（例如：`http://localhost:9222/json/version`）。作为远程实例，也可以使用 docker 容器，强烈推荐使用 `chromedp/headless-shell` 镜像。

### CDP `clicks` 支持

使用 CDP 时，你可以使用 `driver` 段中的 `clicks` 部分对需要折叠或切换的元素执行鼠标点击。每个 click 元素都有一个 `xpath` 值，用于存放你需要点击的按钮/元素的 XPath，以及一个可选的 `sleep` 值，表示点击后等待的时间（以秒为单位）。
如果未设置 `sleep` 值，则默认为 `2` 秒。

下面是一个使用 `clicks` 的演示抓取器。

```yaml
name: clickDemo # demo only for a single URL
sceneByURL:
  - action: scrapeXPath
    url:
      - https://getbootstrap.com/docs/4.3/components/collapse/
    scraper: sceneScraper

xPathScrapers:
  sceneScraper:
    scene:
      Title: //head/title
      Details: # shows the id/s of the visible div/s for the Multiple targets example of the page
        selector: //div[@class="bd-example"]//div[@class="multi-collapse collapse show"]/@id
        concat: "\n\n"

driver:
  useCDP: true
  sleep: 1
  clicks: # demo usage toggle on off multiple times
    - xpath: //a[@href="#multiCollapseExample1"] # toggle on first element
    - xpath: //button[@data-target="#multiCollapseExample2"] # toggle on second element
      sleep: 4
    - xpath: //a[@href="#multiCollapseExample1"] # toggle off fist element
      sleep: 1
    - xpath: //button[@data-target="#multiCollapseExample2"] # toggle off second element
    - xpath: //button[@data-target="#multiCollapseExample2"] # toggle on second element
```

> **⚠️ 注意：** 每个 `click` 都会增加 `clicks sleep` 秒的额外延迟，因此上面的示例为页面加载时间增加了 `2+4+1+2+2=11` 秒。

### TLS 模拟（surf）支持

有些网站使用传输层安全（TLS）指纹识别来检测并阻止自动化流量。这些指纹无法通过请求头传递，因此我们使用 [surf](https://github.com/enetx/surf) 库进行 TLS 模拟。TLS 模拟是一种允许抓取器模仿真实浏览器 TLS 指纹的技术，使网站更难检测并阻止抓取器。

在大多数情况下，它应该比 Chrome DevTools Protocol (CDP) 或基于 Python 的脚本抓取器更快、更可靠，但它不执行 JavaScript，因此不适用于需要 JavaScript 才能加载内容的网站。

如果某个网站在浏览器中能正常工作，但通过 curl/Python/Stash 访问时却被莫名其妙地阻止，那么 TLS 模拟值得一试。

可以通过在 YAML 配置的根节点添加以下内容，为特定配置启用 TLS 模拟：

```yaml
driver:
  useSurf: true
```

启用 `useSurf` 驱动将自动移除 `User-Agent` [请求头](#headers)，因为覆盖它会造成 TLS 指纹与 User-Agent 之间的不匹配，从而违背模拟的整个目的。

> **⚠️ 注意：** 不支持 SOCKS5 的代理将无法充分利用 TLS 模拟，在少数情况下可能会失败。

### Cookie 支持

在某些网站上，需要使用 cookie 来绕过欢迎消息或某种其他形式的保护。stash 支持为直接的 xpath 抓取器和基于 CDP 的抓取器设置 cookie。由于实现上的差异，用法略有不同。

要使用 cookie 功能，需要在 `driver` 段下添加一个 `cookies` 子段。
每个 cookie 元素可以包含一个 `CookieURL` 和若干个 `Cookies`。

- `CookieURL` 仅在你使用直接/原生抓取器方法时需要。它是我们期望从所抓取网站发出的请求 url。它必须与我们尝试设置的 cookie 处于同一域名下，否则该组中的所有 cookie 都将设置失败。如果 `CookieURL` 不是有效的 URL，该组的 cookie 同样会失败。
- `Cookies` 是我们设置的实际 cookie。使用 CDP 时这是唯一需要的部分。它们具有 `Name`、`Value`、`Domain`、`Path` 值。

在下面的示例中，我们为使用直接/原生 xpath 抓取器的网站使用 cookie。我们期望请求来自 `https://www.example.com` 和 `https://api.somewhere.com`，它们查找一个 `_warning` 和一个 `_warn` cookie。同时还设置了一个 `_test2` cookie 仅仅作为演示。

```yaml
driver:
  cookies:
    - CookieURL: "https://www.example.com"
      Cookies:
        - Name: "_warning"
          Domain: ".example.com"
          Value: "true"
          Path: "/"
        - Name: "_test2"
          Value: "123412"
          Domain: ".example.com"
          Path: "/"
    - CookieURL: "https://api.somewhere.com"
      Cookies:
        - Name: "_warn"
          Value: "123"
          Domain: ".somewhere.com"
```

使用 CDP 时相同的功能如下所示：

```yaml
driver:
  useCDP: true
  cookies:
    - Cookies:
        - Name: "_warning"
          Domain: ".example.com"
          Value: "true"
          Path: "/"
        - Name: "_test2"
          Value: "123412"
          Domain: ".example.com"
          Path: "/"
    - Cookies:
        - Name: "_warn"
          Value: "123"
          Domain: ".somewhere.com"
```

对于某些网站，cookie 的值本身实际上并不重要。在这些情况下，我们可以使用 `ValueRandom` 属性来代替 `Value`。与 `Value` 不同，`ValueRandom` 需要一个大于 `0` 的整数值，该值表示 cookie 字符串应有的长度。

在下面的示例中，我们将之前的 cookie 改为使用 `ValueRandom`。我们将 `_test2` cookie 设置为随机生成一个长度为 6 个字符的值，将 `_warn` cookie 设置为长度为 3。

```yaml
driver:
  cookies:
    - CookieURL: "https://www.example.com"
      Cookies:
        - Name: "_warning"
          Domain: ".example.com"
          Value: "true"
          Path: "/"
        - Name: "_test2"
          ValueRandom: 6
          Domain: ".example.com"
          Path: "/"
    - CookieURL: "https://api.somewhere.com"
      Cookies:
        - Name: "_warn"
          ValueRandom: 3
          Domain: ".somewhere.com"
```

在开发抓取器时，你可以通过添加以下内容来查看某个网站设置的 cookie：

- 如果你使用直接 xpath 抓取器，添加一个 `CookieURL`
- 如果你使用 CDP 抓取器，添加一个 `Domain`

然后在调试模式下查看日志/控制台。

### 请求头（Headers）

使用抓取器时可以发送请求头。
请求头可以在 `driver` 段中设置，并支持普通抓取器、启用 CDP 的抓取器和 JSON 抓取器。
它们由一个 Key 和一个 Value 组成。如果 Key 为空或未定义，则忽略该请求头。

```yaml
driver:
  headers:
    - Key: User-Agent
      Value: My Stash Scraper
    - Key: Authorization
      Value: Bearer ds3sdfcFdfY17p4qBkTVF03zscUU2glSjWF17bZyoe8
```

- 请求头在应用了 stash 的 `User-Agent` 配置选项之后设置。
这意味着从抓取器设置 `User-Agent` 请求头会覆盖配置设置中的那个。

### XPath 抓取器示例

下面展示一个演员和场景的 xpath 抓取器作为示例：

```yaml
name: Pornhub
performerByURL:
  - action: scrapeXPath
    url:
      - pornhub.com
    scraper: performerScraper
sceneByURL:
  - action: scrapeXPath
    url:
      - pornhub.com/view_video.php
    scraper: sceneScraper
xPathScrapers:
  performerScraper:
    common:
      $infoPiece: //div[@class="infoPiece"]/span
    performer:
      Name: //h1[@itemprop="name"]
      Birthdate:
        selector: //span[@itemprop="birthDate"]
        parseDate: Jan 2, 2006
      Twitter: //span[text() = 'Twitter']/../@href
      Instagram: //span[text() = 'Instagram']/../@href
      Measurements: $infoPiece[text() = 'Measurements:']/../span[@class="smallInfo"]
      Height:
        selector: $infoPiece[text() = 'Height:']/../span[@class="smallInfo"]
        postProcess:
          - replace:
              - regex: .*\((\d+) cm\)
                with: $1
      Ethnicity: $infoPiece[text() = 'Ethnicity:']/../span[@class="smallInfo"]
      FakeTits: $infoPiece[text() = 'Fake Boobs:']/../span[@class="smallInfo"]
      Piercings: $infoPiece[text() = 'Piercings:']/../span[@class="smallInfo"]
      Tattoos: $infoPiece[text() = 'Tattoos:']/../span[@class="smallInfo"]
      CareerLength:
        selector: $infoPiece[text() = 'Career Start and End:']/../span[@class="smallInfo"]
        postProcess:
          - replace:
            - regex: \s+to\s+
              with: "-"
  sceneScraper:
    common:
      $performer: //div[@class="pornstarsWrapper"]/a[@data-mxptype="Pornstar"]
      $studio: //div[@data-type="channel"]/a
    scene:
      Title: //div[@id="main-container"]/@data-video-title
      Tags:
        Name: //div[@class="categoriesWrapper"]//a[not(@class="add-btn-small ")]
      Performers:
        Name: $performer/@data-mxptext
        URL: $performer/@href
      Studio:
        Name: $studio
        URL: $studio/@href
        Details: //div[@class="studioDescription"]
        Aliases: //div[@class="studioAliases"]/span
        Tags:
          Name: //div[@class="studioTags"]/a
```

更多示例另见 [#333](https://github.com/stashapp/stash/pull/333)。

### JSON 抓取器示例

下面展示一个用于 ThePornDB 的演员和场景抓取器：

```yaml
name: ThePornDB
performerByName:
  action: scrapeJson
  queryURL: https://api.metadataapi.net/performers?q={}
  scraper: performerSearch
performerByURL:
  - action: scrapeJson
    url:
      - https://api.metadataapi.net/performers/
    scraper: performerScraper
sceneByURL:
  - action: scrapeJson
    url:
      - https://api.metadataapi.net/scenes/
    scraper: sceneScraper
sceneByFragment:
  action: scrapeJson
  queryURL: https://api.metadataapi.net/scenes?parse={filename}&hash={oshash}&limit=1
  scraper: sceneQueryScraper
  queryURLReplace:
    filename:
      - regex: "[^a-zA-Z\\d\\-._~]" # clean filename so that it can construct a valid url
        with: "." # "%20"
      - regex: HEVC
        with:
      - regex: x265
        with:
      - regex: \.+
        with: "."
jsonScrapers:
  performerSearch:
    performer:
      Name: data.#.name
      URL:
        selector: data.#.id
        postProcess:
          - replace:
              - regex: ^
                with: https://api.metadataapi.net/performers/

  performerScraper:
    common:
      $extras: data.extras
    performer:
      Name: data.name
      Gender: $extras.gender
      Birthdate: $extras.birthday
      Ethnicity: $extras.ethnicity
      Height:
        selector: $extras.height
        postProcess:
          - replace:
              - regex: cm
                with:
      Measurements: $extras.measurements
      Tattoos: $extras.tattoos
      Piercings: $extras.piercings
      Aliases: data.aliases
      Image: data.image

  sceneScraper:
    common:
      $performers: data.performers
    scene:
      Title: data.title
      Details: data.description
      Date: data.date
      URL: data.url
      Image: data.background.small
      Performers:
        Name: data.performers.#.name
      Studio:
        Name: data.site.name
        URL: data.site.url
        Details: data.site.description
        Aliases: data.site.aliases
        Tags:
          Name: data.site.tags.#.name
      Tags:
        Name: data.tags.#.tag

  sceneQueryScraper:
    common:
      $data: data.0
      $performers: data.0.performers
    scene:
      Title: $data.title
      Details: $data.description
      Date: $data.date
      URL: $data.url
      Image: $data.background.small
      Performers:
        Name: $data.performers.#.name
      Studio:
        Name: $data.site.name
        URL: $data.site.url
        Details: $data.site.description
        Aliases: $data.site.aliases
        Tags:
          Name: $data.site.tags.#.name
      Tags:
        Name: $data.tags.#.tag
driver:
  headers:
    - Key: User-Agent
      Value: Stash JSON Scraper
    - Key: Authorization
      Value: Bearer lPdwFdfY17p4qBkTVF03zscUU2glSjdf17bZyoe  # use an actual API Key here
# Last Updated April 7, 2021
```

## 对象字段

### 图库（Gallery）

```
Code
Date
Details
Performers (see Performer fields)
Photographer
Rating
Studio (see Studio Fields)
Tags (see Tag fields)
Title
URLs
```

> **⚠️ 重要：** `Title` 字段是必填的。

### 分组（Group）

```
Aliases
BackImage
Date
Director
Duration
FrontImage
Name
Rating
Studio (see Studio Fields)
Synopsis
Tags (see Tag fields)
URLs
```

> **⚠️ 重要：** `Name` 字段是必填的。

### 图片（Image）

```
Code
Date
Details
Performers (see Performer fields)
Photographer
Rating
Studio (see Studio Fields)
Tags (see Tag fields)
Title
URLs
```

### 演员（Performer）

```
Aliases
Birthdate
CareerEnd
CareerStart
Circumcised
Country
DeathDate
Details
Disambiguation
Ethnicity
EyeColor
FakeTits
Gender
HairColor
Height
Measurements
Name
PenisLength
Piercings
Tags (see Tag fields)
Tattoos
URLs
Weight
```

> **⚠️ 重要：** `Name` 字段是必填的。

> **⚠️ 注意：** `Gender` 必须是 `male`、`female`、`transgender_male`、`transgender_female`、`intersex`、`non_binary` 之一（不区分大小写）。

### 场景（Scene）

```
Code
Date
Details
Director
Groups (see Group Fields)
Image
Performers (see Performer fields)
Studio (see Studio Fields)
Tags (see Tag fields)
Title
URLs
```

> **⚠️ 重要：** `Title` 字段仅在无文件（fileless）时为必填。

### 工作室（Studio）

```
Aliases
Details
Name
Tags (see Tag fields)
URL
```

> **⚠️ 重要：** `Name` 字段是必填的。

### 标签（Tag）

```
Name
```

> **⚠️ 重要：** `Name` 字段是必填的。

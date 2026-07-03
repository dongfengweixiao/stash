# 元数据抓取

Stash 支持从各种外部源抓取元数据。

## 抓取器类型

| 类型 | 描述 |
|---|:---|
| Fragment | 使用项目的现有元数据，并将其与元数据源中的结果进行匹配。 |
| Search/By Name | 使用提供的查询字符串在元数据源中搜索匹配列表，供用户选择。 |
| URL | 从给定的 URL 提取元数据。 |

## 支持的抓取器

|   | Fragment | Search | URL |
|---|:---:|:---:|:---:|
| 图库 | ✔️ | | ✔️ |
| 图片 | ✔️ | | ✔️ |
| 分组 | | | ✔️ |
| 演员 | | ✔️ | ✔️ |
| 场景 | ✔️  | ✔️ | ✔️ |

## 内置抓取器

Stash 提供以下内置抓取器：

| 抓取器 | 描述 |
|---|--|
| Freeones | 用于 freeones.xxx 的 `search` 演员抓取器。 |
| 自动标签 | 场景、图库和图片的 `fragment` 抓取器，使用文件名匹配现有的演员、工作室和标签。 |

## 管理抓取器

可以从 `Settings > Metadata Providers` 页面安装和管理抓取器。

抓取器使用 `Available Scrapers` 一节安装。此节允许配置安装抓取器的来源。默认配置了 `Community (stable)` 来源。此来源包含适用于当前 _稳定_ 版本的 Stash 的抓取器。

以下是 stashapp 组织维护的抓取器来源：

| 名称 | 来源 URL | 推荐的本地路径 | 备注 |
|------|-----------|------------------------|-------|
| Community (stable) | `https://stashapp.github.io/CommunityScrapers/stable/index.yml` | `stable` | 适用于当前的稳定版本的 Stash。 |
| Community (develop) | `https://stashapp.github.io/CommunityScrapers/develop/index.yml` | `develop` | 适用于开发版本的 Stash。 |

可以从 `Installed Scrapers` 一节更新或卸载已安装的抓取器。

### 来源 URL

来源 URL 必须返回一个 yaml 文件，其中包含该来源的所有可用包。来源 yaml 文件示例看起来如下：

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

path 可以是 zip 文件的相对路径或外部 URL。

## 手动添加抓取器

默认情况下，Stash 在读取 Stash `config.yml` 所在目录的 `scrapers` 子目录中查找抓取器配置。该目录将是 `$HOME/.stash` 目录或当前工作目录。

通过将 yaml 配置文件（格式：`scrapername.yml`）放入 `scrapers` 目录来手动添加抓取器。

> **⚠️ 注意：** 某些抓取器可能不仅需要 yaml 文件，请参阅各个抓取器的文档

在 Stash 运行时添加、删除或编辑 yaml 文件后，可以通过进入 `Settings > Metadata Providers > Scrapers` 并点击 `Reload Scrapers` 来重新加载它们。

## 使用抓取器

#### Fragment 抓取器

在项目的 `edit` 选项卡中点击 `Scrape With...` 按钮，然后选择你要使用的抓取器。

#### Search 抓取器

在项目的 `edit` 选项卡中点击 🔍 按钮。你将看到一个搜索对话框，其中预填了要搜索的查询，搜索后你将看到一个结果列表供选择。

#### URL 抓取器

在项目的 `edit` 选项卡中输入 URL。如果安装了支持该 URL 的抓取器，则会出现一个用于抓取元数据的按钮。

## 标签器视图

标签器视图可从支持的列表页面访问。场景可以使用 stash-box 和兼容的元数据抓取器。演员、工作室和标签使用已配置的 stash-box 实例。

标签器向用户展示来自所选 stash-box 实例或元数据源（如果支持）的项目的潜在匹配项。用户需要选择正确的元数据信息进行保存。

当与 stash-box 结合使用时，用户可以选择性地提交场景指纹，以向 stash-box 实例做出贡献。场景指纹由任何已生成的哈希（`phash`、`oshash`、`md5`）和场景时长组成。指纹提交与你的 stash-box 帐户相关联。提交指纹有助于其他人匹配他们的文件，因为 stash-box 会在每个潜在匹配中返回匹配的用户提交指纹计数。

| | 有标签器 | 来源选择 |
|---|:---:|:---:|
| 图库 | | |
| 分组 | | |
| 图片 | | |
| 演员 | ✔️ | |
| 场景 | ✔️ | ✔️ |
| 工作室 | ✔️ | |
| 标签 | ✔️ | |

## 识别任务

此任务会遍历你的场景，并尝试使用一组抓取源来识别场景。此任务可在 `Settings -> Tasks -> "Identify..." (Button)` 下找到。有关更多信息，请参见 [任务 > 识别](/help/Identify.md) 页面。

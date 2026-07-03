# 导入/导出 JSON 规范

提供给 Stash 的元数据可以导出为 JSON 格式。该结构可以被修改，也可以通过其他方式复制。然后再将得到的数据导入回来，从而实现各种自动抓取。此类元数据批量文件的格式为一个文件夹结构，包含以下文件夹：

* `files`
* `galleries`
* `images`
* `performers`
* `scenes`
* `studios`
* `groups`

## 文件命名

导出时，根据对象类型的不同，文件会以不同的格式命名：

| 类型 | 格式 |
|------|--------|
| 文件/文件夹 | `<以十六进制表示的路径深度，两位宽度>.<基本名>.<哈希>.json` |
| 图库 | `<第一个 zip 文件名>.<路径哈希>.json` 或 `<文件夹基本名>.<路径哈希>.json` 或 `<标题>.json` |
| 图片 | `<标题或第一个文件的基本名>.<哈希>.json` |
| 演员 | `<名称>.json` |
| 场景 | `<标题或第一个文件的基本名>.<哈希>.json` |
| 工作室 | `<名称>.json` |
| 分组 | `<名称>.json` |

> **⚠️ 注意：** 导入时文件名并无实际意义。所有的 json 文件都会从子目录中被读取。

## JSON 文件的内容

下文将展示各对应 json 的值。如果某个值是数字，则会以带小数的形式写入（例如 `29.98` 或 `50.0`），但仍然作为字符串存在。其中大多数含义都可以通过前文的说明，或者 Stash 在编辑时提供的可选值来理解，否则会附加简短注释。

除非另有说明，json 的值均以字符串形式给出。每一个新行代表 json 中的一个新值。如果某个值是一个对象列表，则该对象的值会以缩进形式展示。

如果某个值在任何文件中为空，则可以将其从文件中完全省略。
许多文件都有 `created_at` 和 `updated_at`，两者均使用以下格式保存：
```
YYYY-MM-DDThh:mm:ssTZD
```
示例：
```
"created_at": "2019-05-03T21:36:58+01:00"
```

### Performer

```
name
url
twitter
instagram
birthdate
death_date
ethnicity
country
hair_color
eye_color
height
weight
measurements
fake_tits
career_length
tattoos
piercings
image (base64 encoding of the image file)
created_at
updated_at
rating (integer)
details
```

### Studio

```
name
url
image (base64 encoding of the image file)
created_at
updated_at
rating (integer)
details
```

### Scene

```
title
studio
url
date
rating (integer)
details
performers (list of strings, performers name)
tags (list of strings)
markers
  title
  seconds
  primary_tag
  tags (list of strings)
  created_at
  updated_at
file (not a list, but a single object)
  size (in bytes, no after comma values)
  duration (in seconds)
  video_codec (example value: h264)
  audio_codec (example value: aac)
  width (integer, in pixel)
  height (integer, in pixel)
  framerate
  bitrate (integer, in Bit)
created_at
updated_at
```


### Image

```
title
studio
rating (integer)
performers (list of strings, performers name)
tags (list of strings)
files (list of path strings)
galleries
  zip_files (list of path strings)
  folder_path
  title (for user-created gallery)
created_at
updated_at
```

### Gallery

```
title
studio
url
date
rating (integer)
details
performers (list of strings, performers name)
tags (list of strings)
zip_files (list of path strings)
folder_path
created_at
updated_at
```

## 文件

### 文件夹

```
zip_file (path to containing zip file)
mod_time
type (= folder)
path
created_at
updated_at
```

### 视频文件

```
zip_file (path to containing zip file)
mod_time
type (= video)
path
fingerprints
  type
  fingerprint
size
format
width
height
duration
video_codec
audio_codec
frame
bitrate
interactive (bool)
interactive_speed (integer)
created_at
updated_at
```

### 图片文件

```
zip_file (path to containing zip file)
mod_time
type (= image)
path
fingerprints
  type
  fingerprint
size
format
width
height
created_at
updated_at
```

### 其他文件

```
zip_file (path to containing zip file)
mod_time
type (= file)
path
fingerprints
  type
  fingerprint
size
created_at
updated_at
```

## JSON 格式

对于偏好 [此处](https://json-schema.org/) 定义的 json 格式的用户，以下格式可能更值得关注：

### performer.json

``` json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://docs.stashapp.cc/in-app-manual/tasks/jsonspec#performerjson",
  "title": "performer",
  "description": "A json file representing a performer. The file is named by a MD5 Code.",
  "type": "object",
  "properties": {
    "name": {
      "description": "Name of the performer",
      "type": "string"
    },
    "url": {
      "description": "URL to website of the performer",
      "type": "string"
    },
    "twitter": {
      "description": "Twitter name of the performer",
      "type": "string"
    },
    "instagram": {
      "description": "Instagram name of the performer",
      "type": "string"
    },
    "birthdate": {
      "description": "Birthdate of the performer. Format is YYYY-MM-DD",
      "type": "string"
    },
    "death_date": {
      "description": "Death date of the performer. Format is YYYY-MM-DD",
      "type": "string"
    },
    "ethnicity": {
      "description": "Ethnicity of the Performer. Possible values are black, white, asian or hispanic",
      "type": "string"
    },
    "country": {
      "description": "Country of the performer",
      "type": "string"
    },
    "hair_color": {
      "description": "Hair color of the performer",
      "type": "string"
    },
    "eye_color": {
      "description": "Eye color of the performer",
      "type": "string"
    },
    "height": {
      "description": "Height of the performer in centimeters",
      "type": "string"
    },
    "weight": {
      "description": "Weight of the performer in kilograms",
      "type": "string"
    },
    "measurements": {
      "description": "Measurements of the performer",
      "type": "string"
    },
    "fake_tits": {
      "description": "Whether performer has fake tits. Possible are Yes or No",
      "type": "string"
    },
    "career_length": {
      "description": "The time the performer has been in business. In the format YYYY-YYYY",
      "type": "string"
    },
    "tattoos": {
      "description": "Giving a description of Tattoos of the performer if any",
      "type": "string"
    },
    "piercings": {
      "description": "Giving a description of Piercings of the performer if any",
      "type": "string"
    },
    "image": {
      "description": "Image of the performer, parsed into base64",
      "type": "string"
    },
    "created_at": {
      "description": "The time this performers data was added to the database. Format is YYYY-MM-DDThh:mm:ssTZD",
      "type": "string"
    },
    "updated_at": {
      "description": "The time this performers data was last changed in the database. Format is YYYY-MM-DDThh:mm:ssTZD",
      "type": "string"
    },
    "details": {
      "description": "Description of the performer",
      "type": "string"
    }
  },
  "required": ["name", "ethnicity", "image", "created_at", "updated_at"]
}

```

### studio.json

``` json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://docs.stashapp.cc/in-app-manual/tasks/jsonspec#studiojson",
  "title": "studio",
  "description": "A json file representing a studio. The file is named by a MD5 Code.",
  "type": "object",
  "properties": {
    "name": {
      "description": "Name of the studio",
      "type": "string"
    },
    "url": {
      "description": "URL to the studios websites",
      "type": "string"
    },
    "image": {
      "description": "Logo of the studio, parsed into base64",
      "type": "string"
    },
    "created_at": {
      "description": "The time this studios data was added to the database. Format is YYYY-MM-DDThh:mm:ssTZD",
      "type": "string"
    },
    "updated_at": {
      "description": "The time this studios data was last changed in the database. Format is YYYY-MM-DDThh:mm:ssTZD",
      "type": "string"
    },
    "details": {
      "description": "Description of the studio",
      "type": "string"
    }
  },
  "required": ["name", "image", "created_at", "updated_at"]
}
```

### scene.json

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://docs.stashapp.cc/in-app-manual/tasks/jsonspec#scenejson",
  "title": "scene",
  "description": "A json file representing a scene. The file is named by the MD5 Code of the file its data is referring to.",
  "type": "object",
  "properties": {
    "title": {
      "description": "Title of the scene",
      "type": "string"
    },
    "studio": {
      "description": "The name of the studio that produced that scene",
      "type": "string"
    },
    "url": {
      "description": "The url to the scenes original source",
      "type": "string"
    },
    "date": {
      "description": "The release date of the scene. Its given in the format YYYY-MM-DD",
      "type": "string"
    },
    "rating": {
      "description": "The scenes Rating. Its given in stars, from 1 to 5",
      "type": "integer"
    },
    "details": {
      "description": "A description of the scene, containing things like the story arc",
      "type": "string"
    },
    "performers": {
      "description": "A list of names of the performers in this gallery",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "tags": {
      "description": "A list of the tags associated with this scene",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "markers": {
      "description": "Markers mark certain events in the scene, most often the change of the position. They are attributed with their own tags.",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "description": "Searchable name of the marker",
            "type": "string"
          },
          "seconds": {
            "description": "At what second the marker is set. It is given with after comma values, such as 10.0 or 17.5",
            "type": "string"
          },
          "primary_tag": {
            "description": "A tag identifying this marker. Multiple markers from the same scene with the same primary tag are concatenated, showing them as similar in nature",
            "type": "string"
          },
          "tags": {
            "description": "A list of the tags associated with this marker",
            "type": "array",
            "items": {
              "type": "string"
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "created_at": {
            "description": "The time this marker was added to the database. Format is YYYY-MM-DDThh:mm:ssTZD",
            "type": "string"
          },
          "updated_at": {
            "description": "The time this marker was updated the last time. Format is YYYY-MM-DDThh:mm:ssTZD",
            "type": "string"
          }

        },
        "required": ["seconds", "primary_tag", "created_at", "updated_at"]
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "files": {
      "description": "A list of paths of the files for this scene",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "created_at": {
      "description": "The time this studios data was added to the database. Format is YYYY-MM-DDThh:mm:ssTZD",
      "type": "string"
    },
    "updated_at": {
      "description": "The time this studios data was last changed in the database. Format is YYYY-MM-DDThh:mm:ssTZD",
      "type": "string"
    }
  },
  "required": ["files", "created_at", "updated_at"]
}
```

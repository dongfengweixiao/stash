# UI 插件 API

`PluginApi` 对象是 `window` 对象中的一个全局对象。

`PluginApi` 被视为实验性功能，可能会在不另行通知的情况下发生变更。本文档仅介绍插件相关的 API，不一定涵盖核心 UI API。关于这些方法的信息应参考 UI 源代码。

在 `pkg/plugin/examples/react-component` 下的源代码中可以找到一个使用了 `PluginApi` 各方面功能的示例。

## 属性

### `React`

React 库的一个实例。

### `ReactDOM`

ReactDOM 库的一个实例。

### `GQL`

此命名空间包含生成的 graphql 客户端接口。这是一个底层接口。在许多情况下，应改用 `StashService`。

### `libraries`

`libraries` 提供对以下 UI 库的访问：

- `ReactRouterDOM`
- `Bootstrap`
- `Apollo`
- `Intl`
- `FontAwesomeRegular`
- `FontAwesomeSolid`
- `FontAwesomeBrands`
- `Mousetrap`
- `MousetrapPause`
- `ReactFontAwesome`
- `ReactSelect`

### `register`

此命名空间包含用于注册页面路由和组件的方法。

#### `PluginApi.register.route`

在 React Router 中注册一个路由。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `path` | `string` | 要注册的路径。通常应使用 `/plugin/` 前缀。 |
| `component` | `React.FC` | 一个 React 函数组件，在加载路由时将被渲染。 |

返回 `void`。

#### `PluginApi.register.component`

注册一个供插件使用的组件。该组件将在 `components` 命名空间中可用。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `name` | `string` | 要注册的组件名称。该名称必须唯一，理想情况下应以 `plugin-` 为前缀。 |
| `component` | `React.FC` | 一个 React 函数组件。 |

返回 `void`。

### `components`

此命名空间包含可供插件使用的所有组件。其中包括一部分核心组件，以及通过 `PluginApi.register.component` 注册的组件。

### `utils`

此命名空间提供对 `NavUtils`、`StashService` 和 `InteractiveUtils` 命名空间的访问。它还提供对 `loadComponents` 方法的访问。

#### `PluginApi.utils.loadComponents`

由于代码分割（code splitting）机制，某些组件在插件页面渲染时可能尚未被加载或不可用。`loadComponents` 会加载插件页面可能需要的所有组件。

通常，应改用 `PluginApi.hooks.useLoadComponents` hook。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `components` | `Promise[]` | 要加载的组件列表。这些值应来自 `PluginApi.loadableComponents` 命名空间。 |

返回一个 `Promise<void>`，在所有组件加载完成后解析。

#### `PluginApi.utils.InteractiveUtils`

此命名空间提供对 `interactiveClientProvider` 和 `getPlayer` 的访问
 - `getPlayer` 返回当前的 `videojs` 播放器对象
 - `interactiveClientProvider` 接收 `IInteractiveClientProvider`，允许开发者介入 funscript 的生命周期。

```ts
  export interface IDeviceSettings {
  connectionKey: string;
  scriptOffset: number;
  estimatedServerTimeOffset?: number;
  useStashHostedFunscript?: boolean;
  [key: string]: unknown;
}

export interface IInteractiveClientProviderOptions {
  handyKey: string;
  scriptOffset: number;
  defaultClientProvider?: IInteractiveClientProvider;
  stashConfig?: GQL.ConfigDataFragment;
}
export interface IInteractiveClientProvider {
  (options: IInteractiveClientProviderOptions): IInteractiveClient;
}

/**
 * Interface that is used for InteractiveProvider
 */
export interface IInteractiveClient {
  connect(): Promise<void>;
  handyKey: string;
  uploadScript: (funscriptPath: string, apiKey?: string) => Promise<void>;
  sync(): Promise<number>;
  configure(config: Partial<IDeviceSettings>): Promise<void>;
  play(position: number): Promise<void>;
  pause(): Promise<void>;
  ensurePlaying(position: number): Promise<void>;
  setLooping(looping: boolean): Promise<void>;
  readonly connected: boolean;
  readonly playing: boolean;
}

```
##### 示例

例如，假设我想在调用 `IInteractiveClient.connect()` 时添加额外的日志。
在你的插件中，你可以安装自己的客户端提供器（client provider），如下所示：

```ts
InteractiveUtils.interactiveClientProvider = (
  opts
) => {
  if (!opts.defaultClientProvider) {
    throw new Error('invalid setup');
  }

  const client = opts.defaultClientProvider(opts);
  const connect = client.connect;
  client.connect = async () => {
      console.log('patching connect method');
      return connect.call(client);
    };

  return client;
};

```

### `hooks`

此命名空间提供对以下核心实用 hook 的访问：

- `useGalleryLightbox`
- `useLightbox`
- `useSpriteInfo`
- `useToast`

它还提供插件专用的 hook。

#### `PluginApi.hooks.useLoadComponents`

这是一个用于加载组件的 hook，内部使用 `PluginApi.utils.loadComponents` 方法。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `components` | `Promise[]` | 要加载的组件列表。这些值应来自 `PluginApi.loadableComponents` 命名空间。 |

返回一个 `boolean`，当组件正在加载时为 `true`。

### `loadableComponents`

此命名空间包含所有可能需要通过 `loadComponents` 方法加载的组件。组件会按需被添加到此命名空间中。如果所需的组件不在此命名空间中，请提出开发请求。

此组件还包含原始 UI 中每个延迟加载导入的粗粒度条目。如果页面加载时某个组件在 `components` 中不可用，则可以使用对应的粗粒度条目来加载它。例如，可以使用 `loadableComponents.Performers` 来加载 `PerformerCard`。

### `patch`

此命名空间提供方法来补丁（patch）组件，以更改其行为。

#### `PluginApi.patch.before`

注册一个前置（before）函数。前置函数在调用组件的渲染函数之前被调用。它接收与组件渲染函数相同的参数，并预期返回一个将被传递给渲染函数的新参数列表。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `component` | `string` | 要打补丁的组件名称。 |
| `fn` | `Function` | 前置函数。它接收与组件渲染函数相同的参数，并预期返回一个要传递给渲染函数的参数列表。 |

返回 `void`。

#### `PluginApi.patch.instead`

为组件注册一个替换（replacement）函数。所提供的函数将以传递给原始渲染函数的参数被调用，并将下一个渲染函数作为最后一个参数。替换函数将按照其注册的顺序被调用。如果某个替换函数没有调用下一个渲染函数，则后续的替换函数将不会被调用或应用。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `component` | `string` | 要打补丁的组件名称。 |
| `fn` | `Function` | 替换函数。它接收与原始渲染函数相同的参数，外加下一个渲染函数，并预期返回替换后的组件。 |

返回 `void`。

#### `PluginApi.patch.after`

注册一个后置（after）函数。后置函数在组件的渲染函数之后被调用。它接收传递给原始渲染函数的参数，外加原始渲染函数的返回结果。预期其返回渲染后的组件。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `component` | `string` | 要打补丁的组件名称。 |
| `fn` | `Function` | 后置函数。它接收与原始渲染函数相同的参数，外加原始渲染函数的返回结果，并预期返回渲染后的组件。 |

返回 `void`。

#### 可打补丁的组件和函数

- `AlertModal`
- `App`
- `BackgroundImage`
- `BooleanSetting`
- `ChangeButtonSetting`
- `CompressedPerformerDetailsPanel`
- `ConstantSetting`
- `CountrySelect`
- `CustomFieldInput`
- `CustomFields`
- `CustomFieldsInput`
- `DateInput`
- `DetailImage`
- `ExternalLinkButtons`
- `ExternalLinksButton`
- `FilteredGalleryList`
- `FilteredGroupList`
- `FilteredImageList`
- `FilteredPerformerList`
- `FilteredSceneList`
- `FilteredSceneMarkerList`
- `FilteredStudioList`
- `FilteredTagList`
- `FolderSelect`
- `FrontPage`
- `GalleryCard`
- `GalleryCard.Details`
- `GalleryCard.Image`
- `GalleryCard.Overlays`
- `GalleryCard.Popovers`
- `GalleryCardGrid`
- `GalleryIDSelect`
- `GalleryList`
- `GalleryRecommendationRow`
- `GallerySelect`
- `GallerySelect.sort`
- `GridCard`
- `GroupCard`
- `GroupCardGrid`
- `GroupIDSelect`
- `GroupList`
- `GroupPage`
- `GroupRecommendationRow`
- `GroupSelect`
- `GroupSelect.sort`
- `HeaderImage`
- `HoverPopover`
- `Icon`
- `ImageCard`
- `ImageCard.Details`
- `ImageCard.Image`
- `ImageCard.Overlays`
- `ImageCard.Popovers`
- `ImageDetailPanel`
- `ImageGridCard`
- `ImageInput`
- `ImageList`
- `ImageRecommendationRow`
- `LightboxLink`
- `LoadingIndicator`
- `MainNavBar.MenuItems`
- `MainNavBar.UtilityItems`
- `ModalSetting`
- `NumberSetting`
- `Pagination`
- `PaginationIndex`
- `PerformerAppearsWithPanel`
- `PerformerCard`
- `PerformerCard.Details`
- `PerformerCard.Image`
- `PerformerCard.Overlays`
- `PerformerCard.Popovers`
- `PerformerCard.Title`
- `PerformerCardGrid`
- `PerformerDetailsPanel`
- `PerformerDetailsPanel.DetailGroup`
- `PerformerGalleriesPanel`
- `PerformerGroupsPanel`
- `PerformerHeaderImage`
- `PerformerIDSelect`
- `PerformerImagesPanel`
- `PerformerList`
- `PerformerPage`
- `PerformerRecommendationRow`
- `PerformerScenesPanel`
- `PerformerSelect`
- `PerformerSelect.sort`
- `PluginRoutes`
- `PluginSettings`
- `RatingNumber`
- `RatingStars`
- `RatingSystem`
- `RecommendationRow`
- `SceneCard`
- `SceneCard.Details`
- `SceneCard.Image`
- `SceneCard.Overlays`
- `SceneCard.Popovers`
- `SceneCard.SceneSpecs`
- `SceneCardsGrid`
- `SceneFileInfoPanel`
- `SceneIDSelect`
- `SceneMarkerCard`
- `SceneMarkerCard.Details`
- `SceneMarkerCard.Image`
- `SceneMarkerCard.Popovers`
- `SceneMarkerCardsGrid`
- `SceneMarkerList`
- `SceneMarkerRecommendationRow`
- `SceneList`
- `ScenePage`
- `ScenePage.TabContent`
- `ScenePage.Tabs`
- `ScenePlayer`
- `SceneRecommendationRow`
- `SceneSelect`
- `SceneSelect.sort`
- `SelectSetting`
- `Setting`
- `SettingGroup`
- `SettingModal`
- `StringListSetting`
- `StringSetting`
- `StudioCard`
- `StudioCardGrid`
- `StudioDetailsPanel`
- `StudioIDSelect`
- `StudioList`
- `StudioPage`
- `StudioRecommendationRow`
- `StudioSelect`
- `StudioSelect.sort`
- `SweatDrops`
- `TabTitleCounter`
- `TagCard`
- `TagCard.Details`
- `TagCard.Image`
- `TagCard.Overlays`
- `TagCard.Popovers`
- `TagCard.Title`
- `TagCardGrid`
- `TagIDSelect`
- `TagLink`
- `TagList`
- `TagPage`
- `TagRecommendationRow`
- `TagSelect`
- `TagSelect.sort`
- `TruncatedText`

### `PluginApi.Event`

允许插件监听 Stash 的事件。

```js
PluginApi.Event.addEventListener("stash:location", (e) => console.log("Page Changed", e.detail.data.location.pathname))
```

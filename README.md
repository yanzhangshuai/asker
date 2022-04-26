<h1>
  Asker
</h1>
<a href="https://npmjs.com/package/@mwjz/asker">
  <img src="https://badgen.net/npm/v/@mwjz/asker/latest" alt="npm package">
</a>

一个类似 Pinia 使用形式的 Service层 设计


## Installation


```sh
npm install @mwjz/asker
```

## Usage

实例化
```js
import { PiniaStorage } from '@mwjz/asker'

// Pass the plugin to your application's pinia plugin
createAsker({});
```

使用

```js
export const useService = defineService({
  hello(): Promise<string> {
    return this.$asker.get('xxx/xxx');
  }
});


const service = useService();
service.hello();

```

# js-guid

![Testing `js-guid`](https://github.com/Youssef-ben/js-guid/workflows/Testing%20%60js-guid%60/badge.svg?branch=master)

`js-guid` is a javascript library that lets you generate and manage unique identifiers GUIDs writen with TypeScript.

## Quickstart

### 1. Install

```bash
npm install js-guid

# or

yarn add js-guid
```

### 2. Library APIs

In order to start using the library use the following statement:

```js
import { Guid } from 'js-guid';

// or

const { Guid } = require('js-guid');
```

| API                                      | Description                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| [`Guid.EMPTY`](#guidempty)               | (static) The Empty Guid string (all zeros).                            |
| [`Guid.NewGuid()`](#guidnewguid)         | (static) Generate a new v4 Guid and return a new instance of the Guid. |
| [`Guid.isValid(value)`](#guidisvalid)    | (static) Checks if the given value is a valid GUID.                    |
| [`Guid.parse(value)`](#guidparse)        | (static) Parse the given value into the opposite type.                 |
| [`new Guid(value?)`](#guid-Object)       | Instantiate a new Guid object.                                         |
| [`guid.toString()`](#guidtostring)       | Returns the string format of the Guid.                                 |
| [`guid.toByteArray()`](#guidtobytearray) | Returns the Uint8Array of the Guid.                                    |
| [`guid.equals(value)`](#guidequals)      | Compare the Given value with the current Guid.                         |
| [`guid.isEmpty()`](#guidisEmpty)         | Return {True} if the Guid holds an empty value, False otherwise.       |

### API details

#### **Guid.EMPTY**

The Empty Guid string (all zeros).

example

```js
import { Guid } from 'js-guid';

console.log(Guid.Empty);

// Output
// ⇨ '00000000-0000-0000-0000-000000000000'
```

#### **Guid.NewGuid()**

Generate a new v4 Guid and return a new instance of the Guid.

Example

```js
import { Guid } from 'js-guid';

console.log(Guid.NewGuid());

// Output
// ⇨ '77eb3969-19fd-4223-907a-5749669f1178'
```

#### **Guid.isValid(value)**

Checks if the given value is a valid GUID.

| Key       | Description                             |
| --------- | --------------------------------------- |
| `value`   | A valid Guid `String` or `Uint8Array`.  |
| _returns_ | `true` if valid, `false` otherwise.     |
| _throws_  | `Error` if `value` is not a valid Guid. |

Example

```js
import { Guid } from 'js-guid';

console.log(Guid.isValid('77eb3969-19fd-4223-907a-5749669f1178'));

console.log(Guid.isValid(new Uint8Array([
  105, 57, 235, 119,
  253, 25, 35, 66,
  144, 122, 87, 73,
  102, 159, 17, 120,
]));

// Output
// ⇨ true
// ⇨ true
```

#### **Guid.parse(value)**

Parse the given value into the opposite type.

_Note : if value is string the function return a {Uint8Array of 16 elements},
otherwise it return a {string} if the value is a Uint8Array._

| Key       | Description                                                                               |
| --------- | ----------------------------------------------------------------------------------------- |
| `value`   | A valid Guid `String` or `Uint8Array`.                                                    |
| _returns_ | `Uint8Array(16)` if value is `string`. Or, returns `string` if value is `Uint8Array(16)`. |
| _throws_  | `Error` if `value` is not a valid Guid, or type is not supported.                         |

Example

```js
import { Guid } from 'js-guid';

console.log(Guid.parse('77eb3969-19fd-4223-907a-5749669f1178'));

// Output
// ⇨ [
//    105, 57, 235, 119,
//    253, 25, 35, 66,
//    144, 122, 87, 73,
//    102, 159, 17, 120,
//  ]

console.log(Guid.isValid(new Uint8Array([
  105, 57, 235, 119,
  253, 25, 35, 66,
  144, 122, 87, 73,
  102, 159, 17, 120,
]));

// Output
// ⇨ '77eb3969-19fd-4223-907a-5749669f1178'
```

#### **new Guid(value?)**

Create a new instance of the Guid with the given value, or generate a new Guid if no value was given.

| Key       | Description                                                       |
| --------- | ----------------------------------------------------------------- |
| `value`   | A valid Guid `String` or `Uint8Array`.                            |
| _returns_ | new Guid instance.                                                |
| _throws_  | `Error` if `value` is not a valid Guid, or type is not supported. |

Example

```js
import { Guid } from 'js-guid';

let guid = new Guid();
console.log(guid.toString());

guid = new Guid('77eb3969-19fd-4223-907a-5749669f1178');
console.log(guid.toString());

guid = new Guid(
  new Uint8Array([
    105,
    57,
    235,
    119,
    253,
    25,
    35,
    66,
    144,
    122,
    87,
    73,
    102,
    159,
    17,
    120,
  ]),
);
console.log(guid.toString());

// Output
// ⇨ '77eb3969-19fd-4223-907a-5749669f1178'
// ⇨ '77eb3969-19fd-4223-907a-5749669f1178'
// ⇨ '77eb3969-19fd-4223-907a-5749669f1178'
```

#### **Guid.toString()**

Returns the string format of the Guid.

| Key       | Description                          |
| --------- | ------------------------------------ |
| _returns_ | `string` value of the Guid instance. |

Example

```js
import { Guid } from 'js-guid';

const guid = new Guid();
console.log(guid.toString());

// Output
// ⇨ '77eb3969-19fd-4223-907a-5749669f1178'
```

#### **Guid.toByteArray()**

Returns the Uint8Array of the Guid.

| Key       | Description                                  |
| --------- | -------------------------------------------- |
| _returns_ | `Uint8Array(16)` value of the Guid instance. |

Example

```js
import { Guid } from 'js-guid';

const guid = new Guid();
console.log(guid.toByteArray());

// Output
// ⇨ [
//    105, 57, 235, 119,
//    253, 25, 35, 66,
//    144, 122, 87, 73,
//    102, 159, 17, 120,
//  ]
```

#### **Guid.equals(value)**

Compare the Given value with the current Guid.

| Key       | Description                                                   |
| --------- | ------------------------------------------------------------- |
| `value`   | A valid Guid `String`, `Uint8Array` or `Guid` object.         |
| _returns_ | `true` if equals, `false` otherwise.                          |
| _throws_  | `Error` if `value` is not a valid Guid. or type not spported. |

Example

```js
import { Guid } from 'js-guid';

const guid = new Guid('77eb3969-19fd-4223-907a-5749669f1178');
const guid2 = new Guid();

console.log(guid.equals(guid2));
console.log(guid.equals('77eb3969-19fd-4223-907a-5749669f1178'));
console.log(
  guid.equals(
    new Uint8Array([
      105,
      57,
      235,
      119,
      253,
      25,
      35,
      66,
      144,
      122,
      87,
      73,
      102,
      159,
      17,
      120,
    ]),
  ),
);

// Output
// ⇨ false
// ⇨ true
// ⇨ true
```

#### **Guid.isEmpty()**

Return {True} if the Guid holds an empty value, False otherwise.

| Key       | Description                                            |
| --------- | ------------------------------------------------------ |
| _returns_ | `true` if Guid equals `Guid.Empty`, `false` otherwise. |

Example

```js
import { Guid } from 'js-guid';

let guid = new Guid();
console.log(guid.isEmpty());

guid = new Guid(Guid.Empty);
console.log(guid.isEmpty());

// Output
// ⇨ false
// ⇨ true
```

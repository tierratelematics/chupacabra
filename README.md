# Chupacabras

An easy way for to access a [prettygoat](https://github.com/tierratelematics/prettygoat) instance and it's projections.
This module makes a connection via socket.io to receive realtime notifications from the projection engine and fetches automatically the new data.

## Installation

`
$ npm install chupacabras
`

Construct the required services:

```typescript
import {HttpClient, ModelRetriever, NotificationManager} from "chupacabras";
import * as io from "socket.io-client";

//Provide an instance of socket.io client, for example:
let socketClient = io.connect("your_endpoint");
let httpClient = new HttpClient();
let notificationManager = new NotificationManager(socketClient);
let modelRetriever = new ModelRetriever(httpClient, notificationManager);
```

## Usage

The data of a given projection can be retrieved by using a specific service: ModelRetriever.
This service returns an Observable with the projection state.

```typescript
//To access the data of a projection named List registered in a Users area
let subscription = modelRetriever.modelFor({
    area: "Users",
    modelId: "List"
}).subscribe(data => {
   //Do something with data! 
});
```

To close the connection with a projection just dispose the subscription.

## License

Copyright 2016 Tierra SpA

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

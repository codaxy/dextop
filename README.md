# Dextop

Dextop is RIA framework based on Sencha Ext JS and .NET/Mono platform.
Ask any question about Dextop at <a href="http://stackoverflow.com" target="_blank">StackOverflow</a> (just mark them with [extjs] tag).

### Links

- [Demos](http://dextop.codaxy.com/showcase/)
- [Documentation](http://dextop.codaxy.com/dox/)
- [Product page](http//www.codaxy.com/dextop)

### License

Dextop is available under GPL v3 or Commercial license.

### NuGet

Dextop NuGet is available through the official NuGet channel.

### Installation notes

In order to start Dextop Showcase application Ext JS library 
must to be included in folder 'Apps\Codaxy.Dextop.Showcase\client\lib\ext'.

Ext JS can be found at [Sencha's website](http://www.sencha.com/products/extjs/download/).

### Features

#### Remoting

- Simple remote procedure calls using Ext.Direct
- Automatic JSON encoding/decoding (thanks to JSON.NET)
- File upload
- AJAX request handling
- Server notifications by polling or long-polling technique

#### CodeGeneration

- Automatic concatenion and minification of js files (thanks to Yahoo.Yui.Compressor for .NET)
- Automatic minification of css files
- Automatic remoting Proxy class generation based on DextopRemotable attribute
- Automatic generation of Ext models based on DextopModel attribute
- Automatic generation of grid headers based on DextopGridHeaders attribute
- Automatic generation of forms based on DextopForm attribute

#### Data

- Array serialization/deserialization
- Simplified data access interface

#### Grids

- Reflection based models
- Reflection based headers
- Paging helpers

#### Forms

- Powerfull form generation engine

#### Localization

- Client and server localization support
- Localization tool
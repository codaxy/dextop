# Dextop

Dextop is RIA framework based on Sencha Ext JS and .NET/Mono platform.

## NuGet

Dextop NuGets are available through the official channel.

Installation notes
------------------

In order to start Dextop Showcase application Ext JS library 
must to be included in folder 'Apps\Codaxy.Dextop.Showcase\client\lib\ext'.

Ext JS can be found at [Sencha website].(http://www.sencha.com/products/extjs/download/)

## Dextop Features

### Remoting

- Simple remote procedure calls using Ext.Direct
- Automatic JSON encoding/decoding (thanks to JSON.NET)
- File upload
- AJAX request handling
- Server notifications by polling or long-polling technique

### CodeGeneration

- Automatic concatenion and minification of js files (thanks to Yahoo.Yui.Compressor for .NET)
- Automatic minification of css files
- Automatic remoting Proxy class generation based on DextopRemotable attribute
- Automatic generation of Ext models based on DextopModel attribute
- Automatic generation of grid headers based on DextopGridHeaders attribute
- Automatic generation of forms based on DextopForm attribute

### Data

- Array serialization/deserialization
- Simplified data access interface

### Grids

- Reflection based models
- Reflection based headers
- Paging helpers

### Forms

- Powerfull form generation engine

### Localization

- Client and server localization support
- Localization tool
<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<$rootnamespace$.Models.DextopAppConfig>" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>
        Dextop Demo app
    </title>

    <% foreach (var css in @Model.CssFiles) { %>
       <link href="<%: css %>"css" rel="stylesheet" type="text/css" /><% } %>

    <% foreach (var js in @Model.JsFiles) { %>
        <script src="<%: js %>"js" type="text/javascript"></script><% } %>

</head>
<body>
    <!-- To see source code go to http://code.google.com/p/codaxy-dextop2/ -->
    <script type="text/javascript">       
        Ext.onReady(function() {            
            Dextop.Session.initialize(<%: Model.SessionConfig %>);
        });
    </script>
</body>
</html>

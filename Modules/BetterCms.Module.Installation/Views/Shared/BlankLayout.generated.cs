﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.18449
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BetterCms.Module.Installation.Views.Shared
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Web;
    using System.Web.Helpers;
    using System.Web.Mvc;
    using System.Web.Mvc.Ajax;
    using System.Web.Mvc.Html;
    using System.Web.Routing;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.WebPages;
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "2.0.0.0")]
    [System.Web.WebPages.PageVirtualPathAttribute("~/Views/Shared/BlankLayout.cshtml")]
    public partial class BlankLayout : System.Web.Mvc.WebViewPage<BetterCms.Core.DataContracts.IPage>
    {
        public BlankLayout()
        {
        }
        public override void Execute()
        {
            
            #line 2 "..\..\Views\Shared\BlankLayout.cshtml"
  
    Layout = "~/Areas/bcms-Root/Views/Shared/BaseLayout.cshtml";

            
            #line default
            #line hidden
WriteLiteral("\r\n");

DefineSection("Styles", () => {

WriteLiteral("    \r\n");

WriteLiteral("    ");

            
            #line 6 "..\..\Views\Shared\BlankLayout.cshtml"
Write(RenderSection("Styles", false));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

});

DefineSection("HeadScripts", () => {

WriteLiteral("\r\n");

WriteLiteral("    ");

            
            #line 9 "..\..\Views\Shared\BlankLayout.cshtml"
Write(RenderSection("HeadScripts", false));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

});

            
            #line 11 "..\..\Views\Shared\BlankLayout.cshtml"
Write(RenderSection("CMSMainContent", false));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

            
            #line 12 "..\..\Views\Shared\BlankLayout.cshtml"
Write(RenderBody());

            
            #line default
            #line hidden
        }
    }
}
#pragma warning restore 1591

REM Creating NuGet : Dextop (just the libraries js & dll)

copy ..\Libraries\Codaxy.Dextop\Codaxy.Dextop\bin\Release\Codaxy.Dextop.* Dextop\lib
robocopy ..\Apps\Codaxy.Dextop.Showcase\client\lib\dextop Dextop\content\client\lib\dextop /XD .svn /MIR
REM robocopy ..\Libraries\Codaxy.Dextop\sound Dextop\content\client\lib\sound /XD .svn /MIR

del *.nupkg

bin\nuget pack Dextop\dextop.nuspec

REM Creating NuGet : Dextop Basic (simple app with one window, no libs)

bin\nuget pack Dextop.Template.Basic\Dextop.Template.Basic.nuspec

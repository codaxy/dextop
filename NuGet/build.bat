REM Creating NuGet : Dextop (just the libraries js & dll)

mkdir Dextop.Core\lib\
copy ..\Libraries\Codaxy.Dextop\Codaxy.Dextop\bin\Release\Codaxy.Dextop.* Dextop.Core\lib\

robocopy ..\Apps\Codaxy.Dextop.Showcase\client\lib\dextop Dextop\content\client\lib\dextop /XD .svn /MIR
REM robocopy ..\Libraries\Codaxy.Dextop\sound Dextop\content\client\lib\sound /XD .svn /MIR

del *.nupkg

nuget pack Dextop\dextop.nuspec
nuget pack Dextop.Core\dextop-core.nuspec

REM Creating NuGet : Dextop Basic (simple app with one window, no libs)

nuget pack Dextop.Template.Basic\Dextop.Template.Basic.nuspec

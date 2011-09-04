REM Creating NuGet : Dextop (just the libraries js & dll)

del *.nupkg
robocopy ..\Apps\Codaxy.Dextop.Showcase\client\lib\dextop Codaxy.Dextop\content\client\lib\dextop /XD .svn /MIR
nuget pack Codaxy.Dextop\Codaxy.Dextop.nuspec

mkdir Codaxy.Dextop.Core\lib\
copy ..\Libraries\Codaxy.Dextop\Codaxy.Dextop\bin\Release\Codaxy.Dextop.* Codaxy.Dextop.Core\lib\
del Codaxy.Dextop.Core\lib\*.pdb
nuget pack Codaxy.Dextop.Core\Codaxy.Dextop.Core.nuspec

mkdir Codaxy.Dextop.Core\src\
copy ..\Libraries\Codaxy.Dextop\Codaxy.Dextop\bin\Release\Codaxy.Dextop.* Codaxy.Dextop.Core\lib\
robocopy ..\Libraries\Codaxy.Dextop\Codaxy.Dextop Codaxy.Dextop.Core\src\ /MIR /XD obj bin
nuget pack Codaxy.Dextop.Core\Codaxy.Dextop.Core.nuspec -Symbols

REM Creating NuGet : Dextop Basic (simple app with one window, no libs)

nuget pack Dextop.Template.Basic\Dextop.Template.Basic.nuspec

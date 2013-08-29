REM Creating NuGet : Dextop (just the libraries js & dll)

del *.nupkg
robocopy ..\Apps\Codaxy.Dextop.Showcase\client\lib\dextop Codaxy.Dextop\content\client\lib\dextop /XD .svn /MIR
..\.nuget\nuget pack Codaxy.Dextop\Codaxy.Dextop.nuspec

mkdir Codaxy.Dextop.Core\lib\
copy ..\Libraries\Codaxy.Dextop\Codaxy.Dextop\bin\Release\Codaxy.Dextop.* Codaxy.Dextop.Core\lib\
del Codaxy.Dextop.Core\lib\*.pdb
..\.nuget\nuget pack Codaxy.Dextop.Core\Codaxy.Dextop.Core.nuspec

mkdir Codaxy.Dextop.Core\src\
copy ..\Libraries\Codaxy.Dextop\Codaxy.Dextop\bin\Release\Codaxy.Dextop.* Codaxy.Dextop.Core\lib\
robocopy ..\Libraries\Codaxy.Dextop\Codaxy.Dextop Codaxy.Dextop.Core\src\ /MIR /XD obj bin
..\.nuget\nuget pack Codaxy.Dextop.Core\Codaxy.Dextop.Core.nuspec -Symbols

mkdir Codaxy.Dextop.Preprocessor\lib\
copy ..\Tools\Codaxy.Dextop.Preprocessor\bin\Release\Codaxy.Dextop.Preprocessor.exe Codaxy.Dextop.Preprocessor\lib\
del Codaxy.Dextop.Preprocessor\lib\*.pdb
..\.nuget\nuget pack Codaxy.Dextop.Preprocessor\Codaxy.Dextop.Preprocessor.nuspec

mkdir Codaxy.Dextop.Api\lib\
copy ..\Libraries\Codaxy.Dextop.Api\bin\Release\Codaxy.Dextop.Api.dll Codaxy.Dextop.Api\lib\
del Codaxy.Dextop.Api\lib\*.pdb
..\.nuget\nuget pack Codaxy.Dextop.Api\Codaxy.Dextop.Api.nuspec

pause
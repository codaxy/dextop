To create automatic nuget publishing from VS (Select NuGet build configuration) create a file called local.bat with following content. 
Change the path of your nuget repository.

call build.bat

copy *.nupkg c:\code\nugets

pause
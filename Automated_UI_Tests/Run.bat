cd d %~dp0
mvn compile exec:java -Dexec.mainClass="com.homer.runner.HomerRunner"
pause
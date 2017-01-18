import jenkins.model.*;
import hudson.model.*;
def folderName = "TestRun_2016-06-23_10-56-43-AM";
def pa = new ParametersAction([
new StringParameterValue("FOLDERNAME_QA_JOB", folderName)
])
Thread.currentThread().executable.addAction(pa);
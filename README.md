# Google App Engine Scaling Demo Using Apache Bench
This demo uses the App Engine Standard Environment with Node.js to showcase the auto-scaling capabilities of App Engine. By sending sample load via an external VM (hosted on GCE), we will watch App Engine instances scale up and down in response to traffic.

## Setup
### Prerequisites
* Google Cloud Platform account
* Install and setup [Google Cloud SDK](https://cloud.google.com/sdk/)

### Spin up a VM for sample load using Apache Bench
* Open the [Google Cloud Console](https://console.cloud.google.com/), navigate to Cloud Launcher, and search for "LAMP Stack".
* Select the "LAMP Stack" by "Google Click to Deploy"

**Note:** You don't actually need the full LAMP stack for this demo, but since we'll just be using the VM for sending sample load, having Apache pre-installed is an easy way to set this up without additional time or cost. 
* Once the LAMP Stack VM is up and running, SSH into it
* Confirm Apache Bench is installed:
    
    `ab -V`

## Deploy the App Engine App
    gcloud app deploy
**Note:** If you're using the Google Cloud SDK on your machine, you may need to configure some settings (below) first. Alternatively, you can add the `--project [PROJECT-ID]` flag to the `gcloud app deploy` command each time. 
    gcloud config set project [PROJECT-ID]

* You are free to replace the sample app included here with your own. The app.js server here simply uses Express to serve two pages (an index `/` route and a `/test` route) which both return a Status: 200 response and print `Hello world!`.




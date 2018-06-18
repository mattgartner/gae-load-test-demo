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

## Auto-scaling tests
1. **Cold Boot:** Send 2 requests while all instances are off.

    `ab -n 2 -c 1 https://[PROJECT-ID].appspot.com/`

In Logs Viewer, set an advanced filter (click the dropdown arrow in the "Filter by label or text search" field to enable advanced): 

    resource.type="gae_app"

Notice that the first request has a severity level of `INFO` and has a higher latency than the second request. At the first request, App Engine spins up an instance and starts up your Node.js app. Your second request should be considerably faster, and not have a severity level associated with it.

2. **One instance handling all requests:**
    
    `ab -n 1000 -c 4 https://[PROJECT-ID].appspot.com/`

In Logs Viewer, set an advanced filter: 

    resource.type="gae_app"
    protoPayload.status=200
    severity>=INFO

In the Cloud Console, under App Engine > Instances, you should see that the original instance has now handled 1002 requests (first 2 requests above, plus the 1000 from this Apache Bench load)

3. **Hitting Max Instances:** Refer to the `app.yaml` file. We've set `max_instances` to 10 to help control costs. App Engine will spin up instances in response to load, up to 10 instances in this case to help keep costs under control. In the load test below, we have too many concurrent requests being run to be handled by just the 10 instances. Without `max_instances` set, App Engine would likely spin up more instances to respond to requests with low latency. Since we've capped our instances, we'll start to see high latencies while App Engine queues the requests. In some cases, the requests may time out and not finish. 

    `ab -n 16000 -c 400 https://[PROJECT-ID].appspot.com/`

In Logs Viewer, set an advanced filter: 

    resource.type="gae_app"
    protoPayload.status=200
    protoPayload.latency>="1s"

This log filter will show us all the requests that took more than 1 second to respond, indicating that the instances were backlogged with requests and couldn't serve them right away. 

## Optional
Approximately 15 minutes after the last request is sent, you should see the total instances being billed for drop to 0. 

For more information on how auto-scaled instances are managed and billed with Node.js in the App Engine Standard Environment: [https://cloud.google.com/appengine/docs/standard/nodejs/how-instances-are-managed]

**Note:** This is an unofficial project for experimental purposes only. "This is not an official Google Project."





# k6-investigation

## `smoke-testing` 
Is a smoke test example for basic CRUD functionality using [k6 test Api](https://test-api.k6.io/). <br /> 

The test will do the following <br /> 
- Creates one new user for all VUs.
- Logins with created user credentials
- Creates new crocodile from the `input-data.json` file. The crocodile number will be selected based on VU index in test. For the 1st user - #1, 5th user - #5, 6th user -  #1, #10th user - #5.
- Updates created crocodile by Id.
- Deletes crocodile.

Test uses [per-vu-interations](https://k6.io/docs/using-k6/scenarios/executors/per-vu-iterations/) scenario - vu*interations. Configuration can be found in `options.json` file. 
```
    "scenarios": {
        "simple-iterations": {
            "executor": "per-vu-iterations",
            "vus": 10,
            "iterations": 1,
            "maxDuration": "20s"
        }
    },
```

## `load-testing` 
Is a load test example from [k6 documenation](https://k6.io/docs/test-types/load-testing/) using crocodile get endpoint.

Test uses [ramping-vus](https://k6.io/docs/using-k6/scenarios/executors/ramping-vus/) scenario - users will be added and removed based on stages. Configuration can be found in `options.json` file. 
```
     "scenarios": {
        "rump-up": {
            "executor": "ramping-vus",
            "startVUs": 1,
            "stages": [
                {
                    "duration": "10s",
                    "target": 10
                },
                {
                    "duration": "20s",
                    "target": 20
                },
                {
                    "duration": "5s",
                    "target": 1
                }
            ],
            "gracefulRampDown": "5s"
        }
    },
```

For `smoke-testing` and `load-testing` summary will be added to `test_results_summary.json` (in addtion to console log). The detail results will be added in `test_results_details.json`.

## How to run

1. Install k6 open source locally for your OS using this [link](https://k6.io/docs/get-started/installation/ "ks Download")
>For Windows `choco install k6`

2. To run `smoke-testing` or `load-testing` sript the following command should be used. 
```
cd smoke-testing
k6 run --config options.json --out json=test_results_details.json script.js
```
Options can be update in `options.json`.<br />

To test basic script in the root folder

```
k6 run script.js

or with custom options 

k6 run --vus 10 --duration 15s script.js
```

3. The results will be available in `test_results_details.json` (in addition to console output) <br />


<img src="https://user-images.githubusercontent.com/16937972/206269390-7031cfa0-1408-4198-841a-e06d845426b6.png" width="600" height="600">

# Concepts

## Users 
[From documentation](https://k6.io/docs/get-started/running-k6/#adding-more-vus)

*k6 works with the concept of virtual users (VUs), which run your test scripts. VUs are essentially parallel while(true) loops. Scripts are written in JavaScript, as ES6 modules, so you can break larger tests into smaller pieces or make reusable pieces as you like.*

## Stages
[From documentation](https://k6.io/docs/get-started/running-k6/#stages-ramping-up-down-vus)

*You can ramp the number of VUs up and down during the test. To configure ramping, use the options.stages property.*<br />

*It is a shortcut option for a single scenario with a ramping VUs executor.*

## Scenarios

[From documentation](https://k6.io/docs/using-k6/scenarios/)

*Scenarios configure how VUs and iteration schedules in granular detail. With scenarios, you can model diverse workloads, or traffic patterns in load tests.*

# Options
Options can be passed in CLI directly
>For example set 10 VUs and duration for the test  `k6 run --vus 10 --duration 30s script.js`

[Options](https://k6.io/docs/using-k6/k6-options/how-to "Setup options") also can be create in script code or provided as a separate .json file. We can pass file in CLI or read it inside `setup` section in script.
> For example `k6 run --config options.json script.js` (see options.json in source code)<br />

[All options](https://k6.io/docs/using-k6/k6-options/reference/ "k6 Options") can be found here

# Reports
The End-of-test summary can be [customized in script](https://k6.io/docs/results-output/end-of-test/custom-summary/).<br />

The results could be expoted in CSV, Json files. Also [streaming to cloud supported](https://k6.io/docs/results-output/real-time/).<br />
[More information about possible results](https://k6.io/docs/results-output/end-of-test/)

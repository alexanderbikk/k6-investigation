# k6-investigation

1. Install k6 open source locally for your OS using this [link](https://k6.io/docs/get-started/installation/ "ks Download")
>For Windows `choco install k6`

2. To run sript the following command should be used. `k6 run --config options.json --out csv=test_results.csv script.js`<br />

Options can be update in `options.json`.<br />

Initial setup:<br />

3. In the end of test the result (in addition to console summary) will be exported to  `test_results.csv` file. <br />

# Concepts

## Users 
[From documentation](https://k6.io/docs/get-started/running-k6/#adding-more-vus)

*k6 works with the concept of virtual users (VUs), which run your test scripts. VUs are essentially parallel while(true) loops. Scripts are written in JavaScript, as ES6 modules, so you can break larger tests into smaller pieces or make reusable pieces as you like.*

## Stages
[From documentation](https://k6.io/docs/get-started/running-k6/#stages-ramping-up-down-vus)

*You can ramp the number of VUs up and down during the test. To configure ramping, use the options.stages property.*<br />

*It is a shortcut option for a single scenario with a ramping VUs executor.*

## Scenario 

# Options
Options can be passed in CLI directly
>For example set 10 VUs and duration for the test  `k6 run --vus 10 --duration 30s script.js`⋅⋅

[Options](https://k6.io/docs/using-k6/k6-options/how-to "Setup options") also can be create in script code or provided as a separate .json file. We can pass file in CLI or read it inside `setup` section in script.
> For example `k6 run --config options.json script.js` (see options.json in source code)<br />

[All options](https://k6.io/docs/using-k6/k6-options/reference/ "k6 Options") can be found here

# Reports
The End-of-test summary can be [customized in script](https://k6.io/docs/results-output/end-of-test/custom-summary/).<br />

The results could be expoted in CSV, Json files. Also [streaming to cloud supported](https://k6.io/docs/results-output/real-time/).<br />
[More information about possible results](https://k6.io/docs/results-output/end-of-test/)

# asl-deploy-bot

Provides a docker image that can update a version manifest in a github repo in drone.

## Usage

To update the version of your service in a drone build:

```yaml
pipeline:
  update_manifest:
  image: quay.io/ukhomeofficedigital/asl-deploy-bot:latest
  secrets:
    - github_access_token
  commands:
    - update
      --repo ukhomeoffice/example-repo
      --token $${GITHUB_ACCESS_TOKEN}
      --file versions.yml
      --service example-service
      --version $${DRONE_COMMIT_SHA}
  when:
    branch: master
    event: push
```

## Options

* `repo` _required_ - the github repo containing your manifest file
* `token` _required_ - a github access token that provides write access to that repo
* `file` _required_ - the manifest file containing your version data
* `service` _required_ - the name of the service to be updated
* `version` _required_ - the version of the service to be updated
* `branch` _optional_ - the branch to push the change to - default `master`

## Manifest files

Manifest files can be defined as JSON or YAML, and the type will be inferred from the file extension of the `file` option passed.

If the file does not already exist in the repository defined then it will be created.

# Promotion_Maintenance_Extended_UI
This service is part of the Discount Engine experience. This repo is a forked and extended version of the Promotion_Maintenance_UI. This repository was adapted to accomodate discount maintenance for both DCM users (online promotions) and MFA users (discounts delivered to customers in store transactions).

## Configuring Environments
The urls.js files within env_config folder can be edited to swap out WS environments the UI is using (local, AD, QA, etc)

# Install dependencies using npm
```
npm install (may require sudo npm install)
```

# Build and run locally
```
npm run dev
```

# Run unit tests
```
npm run test
```

# Run mutation tests
```
npm run mutation-test
```

//muation coverage report is generated @reports/mutation/html/index.html

# Concourse
[Concourse Repo](https://github.homedepot.com/snowshoe-ci/concourse)  
[Concourse](http://ld02201.homedepot.com/)

Builds are triggered through the promo folder in github/concourse
AD triggers automatically, whereas QA and PR need to be triggered manually to build

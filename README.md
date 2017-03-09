# Promotion_Maintenance_Extended_UI
This repo contains the code for the modified Aurora Promotions UI to serve Store Promotions

##Configuring Environments
The urls.js files within env_config folder can be edited to swap out WS environments the UI is using (local, AD, QA, etc)

## Capybara Feature Tests
All new features added to this repo must be covered by both unit tests (following TDD) and also feature tests. These feature tests are located in the capybaraTests folder of this repo.
##### Running Feature Tests
  ```
  cd e2e
  bundle install
  ./bin/run_test.sh
  
  *** tests must be run from within e2e folder ***
  *** Promo UI and WS must both be running               ***
  ```

# Clone master branch 
git clone git@github.homedepot.com:Pricing/Promotion_Maintenance_Extended_UI.git

# Go into directory
cd Promotion_Maintenance_Extended_UI

# Install dependencies using npm
npm install (may require sudo npm install)

# Build and run locally
npm run dev

# Run unit tests
npm run test

# Run e2e tests
npm run e2e // run on separate console

#Concourse
[Concourse Repo](https://github.homedepot.com/snowshoe-ci/concourse)
[Concourse](http://ld5743.homedepot.com/)

Builds are triggered through the promo folder in github/concourse
AD triggers automatically, whereas QA and PR need to be triggered manually to build

## Further help
Ask Roman
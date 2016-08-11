# RateCard
## Basic prices
Default unit price is defined directly under product. 

## Special prices
Special offer is defined under client profile which will be overrided to the product unit price with its requirement:
- Fix unit price which has no requirement on quantity
- Fix unit price where minimun quantity
- Specified quantity of price where meet the 3 for 2 deal or 5 for 4 deal. We may define 2 x unit price for 3 unit or 4 x unit price for 5 unit

## System Requirement
The entitle work is build base on NodeJS. NodeJS 5.0 is needed before install.

## Installation
Download the package and unzip it. Run below command to build it:
> npm install

## Testing
The unit test is built under jasmine frame and karma act as runner in NodeJS. It is currently only covered by Google Chrome test. To run the unit test you run below command:
> npm test

## Note
Dual to the time consuming, this repo is cloned from one of the small project. I have tried to drop as much dependacy as I can. But some of the plug still not able to be dropped in this short of time being.
Dashboard is built for showing the usability of Checkout. It is not fully cover by unit test.

## It just a POC
Below works are lacking in POC:
- Minify
- Styling
- Modules need to be stored in different file and deployment process has to be done.
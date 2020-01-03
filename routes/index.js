if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const
      express = require('express')
    , router = express.Router()
    , azureStorage = require('azure-storage')
    , blobService = azureStorage.createBlobService()
    , containerName = 'images'
    , config = require('../config')
    , async = require('async')
    , fs = require('fs')
    , createReadStream = require('fs').createReadStream
    , sleep = require('util').promisify(setTimeout)
    , ComputerVisionClient = require('azure-cognitiveservices-computervision').ComputerVisionClient
    , ApiKeyCredentials = require('ms-rest-azure').ApiKeyCredentials
    , subscriptionKey = "ca041fbd6cfa4eeda530e19c6171cbda"
    , uriBase = "https://subcompvision.cognitiveservices.azure.com/vision/v2.0/analyze"
    , map = new Map()
;

function computerVision() {
  async.series([
    async function () {
      return new Promise((resolve) => {
        resolve();
      })
    }
  ], (err) => {
    throw (err);
  });
}

router.get('/', (req, res, next) => {

  blobService.listBlobsSegmented(containerName, null, (err, data) => {

    let viewData;

    if (err) {

      viewData = {
        title: 'Error',
        viewName: 'error',
        message: 'There was an error contacting the blob storage container.',
        error: err
      };
      
      res.status(500);

    } else {

      viewData = {
        title: 'Home',
        viewName: 'index',
        accountName: config.getStorageAccountName(),
        containerName: containerName
      };


      if (data.entries.length) {
        viewData.thumbnails = data.entries;
      }
      
    }

    res.render(viewData.viewName, viewData);
  });



});


module.exports = router;

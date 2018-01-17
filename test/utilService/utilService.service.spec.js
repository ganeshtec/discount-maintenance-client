describe('utilService', function () {
  var $httpBackend,
    $compile,
    $rootScope,
    $scope,
    utilService,
    leadTimeService;



  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function (_$compile_, _$rootScope_, _utilService_, _leadTimeService_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    utilService = _utilService_;
    leadTimeService = _leadTimeService_;

    spyOn(leadTimeService, 'fetchLeadTime').and.callFake(function () {
      return {
        then: function (callback) { return callback(3) }
      }
    })

  }));
  it('get lead time', function () {
    var leadResponsePromise = utilService.getLeadTime();
    var leadTime = 0;
    leadResponsePromise.then(function (value) {
      leadTime = value;
    })
    expect(leadTime).toBe(3);
  });

  it('Test convertDateStringToDate',function(){      
    expect(utilService.convertDateStringToDate('12/10/2017 02:59:00')).toEqual(moment("12/10/2017").toDate());
    expect(utilService.convertDateStringToDate('12/10/2017')).toEqual(moment("12/10/2017").toDate());
    expect(utilService.convertDateStringToDate(undefined)).toBe(undefined);
  });
  
  it('isSubmitEligibleForDisable should return true for active promotion with printlabel and endDt within lead time', function () {

    var promotion = {
      "endDt": moment().add(1, 'days').toDate(),
      "printLabel": true,
      "status": 61
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(true);
  });

  it('isSubmitEligibleForDisable should return false for active promotion with printlabel and endDt outside lead time', function () {
    var promotion = {
      "endDt": moment().add(10, 'days').toDate(),
      "printLabel": true,
      "status": 61
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(false);

  });

  it('isSubmitEligibleForDisable should return false for active promotion without printlabel and endDt within lead time', function () {
    var promotion = {
      "endDt": moment().add(1, 'days').format("YYYY-MM-DD"),
      "printLabel": false,
      "status": 61
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(false);
  });

  it('isSubmitEligibleForDisable should return false for active promotion without printlabel and endDt outside lead time', function () {
    var promotion = {
      "endDt": moment().add(10, 'days').format("YYYY-MM-DD"),
      "printLabel": false,
      "status": 61
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(false);
  });


  it('isSubmitEligibleForDisable should return false for inactive promotion with printlabel and endDt outside lead time', function () {
    var promotion = {
      "endDt": moment().add(10, 'days').format("YYYY-MM-DD"),
      "printLabel": true,
      "status": 20
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(false);
  });

  it('isSubmitEligibleForDisable should return true for active promotion with printlabel and endDt minus lead time is equal to today', function () {
    var promotion = {
      "endDt": moment().add(3, 'days').format("YYYY-MM-DD"),
      "printLabel": true,
      "status": 61
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(true);

  });

  it('isSubmitEligibleForDisable should return false for active promotion with printlabel and today is one day more than end date minus lead time', function () {
    var promotion = {
      "endDt": moment().add(4, 'days').format("YYYY-MM-DD"),
      "printLabel": true,
      "status": 61
    }

    expect(utilService.isSubmitEligibleForDisable(promotion)).toEqual(false);
  });

  it('returns true from isPromotionActive for promotions with status 61.', function() {
    var promotion = {
      "status": 61
    }

    expect(utilService.isPromotionActive(promotion)).toEqual(true);
  });

  it('returns false from isPromotionActive for promotions with a status other than 61', function() {
    var promotion = {}

    while(!promotion.status || promotion.status == 61) {
      promotion.status = Math.floor(Math.random() * 100);
    }

    expect(utilService.isPromotionActive(promotion)).toEqual(false);
  });

  // Below Test Scenarios to cover multiItem Dollar Value Promotions
  it('returns error message from validateBuyAandBOverlap (value) for multi item promotions with overlapping categories (hierarchies).', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsValueDiscount","status":61,"purchaseConds":{"sources":[{"inclusions":{"partnumbers":null,"itemtype":null,"hierarchies":[{"id":"da80fc04-3857-427c-ada9-8b868b6bb45c","name":"Pipes & Fittings","catalog":"Web"}]}},{"inclusions":{"partnumbers":null,"itemtype":null,"hierarchies":[{"id":"da80fc04-3857-427c-ada9-8b868b6bb45c","name":"Pipes & Fittings","catalog":"Web"}]}}]}};

    expect(utilService.validateBuyAandBOverlap(promotion)).toEqual("ERROR: A and B groups cannot contain the same product categories");
  });

  it('returns null from validateBuyAandBOverlap (value) for multi item promotions with non overlapping categories (hierarchies).', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsValueDiscount","status":61,"purchaseConds":{"sources":[{"inclusions":{"partnumbers":null,"itemtype":null,"hierarchies":[{"id":"da80fc04-3857-427c-ada9-ffffffffffff","name":"Pipes & Fittings","catalog":"Web"}]}},{"inclusions":{"partnumbers":null,"itemtype":null,"hierarchies":[{"id":"da80fc04-3857-427c-ada9-8b868b6bb45c","name":"Pipes & Fittings","catalog":"Web"}]}}]}};

    expect(utilService.validateBuyAandBOverlap(promotion)).toEqual(null);
  });

  it('returns error message from validateBuyAandBOverlap (value) for multi item promotions with overlapping products (part numbers).', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsValueDiscount","status":61,"purchaseConds":{"sources":[{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}},{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}}]}};

    expect(utilService.validateBuyAandBOverlap(promotion)).toEqual("ERROR: A and B groups cannot contain the same products");
  });

  it('returns null from validateBuyAandBOverlap (value) for multi item promotions with non overlapping products (part numbers).', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsValueDiscount","status":61,"purchaseConds":{"sources":[{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}},{"inclusions":{"partnumbers":[100351464],"itemtype":null,"hierarchies":[]}}]}};

    expect(utilService.validateBuyAandBOverlap(promotion)).toEqual(null);
  });

  it('returns null from validateBuyAandBOverlap (value) for multi item promotions where one is using products (part numbers) and the other is using categories (hierarchies).', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsValueDiscount","status":61,"purchaseConds":{"sources":[{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}},{"inclusions":{"partnumbers":null,"itemtype":null,"hierarchies":[{"id":"da80fc04-3857-427c-ada9-ffffffffffff","name":"Pipes & Fittings","catalog":"Web"}]}}]}};

    expect(utilService.validateBuyAandBOverlap(promotion)).toEqual(null);
  });
  
  // Below Test Scenarios to cover multiItem Percentage Promotions
  it('returns error message from validateBuyAandBOverlap (percent) for multi item promotions with overlapping categories (hierarchies).', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsPercentDiscount","status":61,"purchaseConds":{"sources":[{"inclusions":{"partnumbers":null,"itemtype":null,"hierarchies":[{"id":"da80fc04-3857-427c-ada9-8b868b6bb45c","name":"Pipes & Fittings","catalog":"Web"}]}},{"inclusions":{"partnumbers":null,"itemtype":null,"hierarchies":[{"id":"da80fc04-3857-427c-ada9-8b868b6bb45c","name":"Pipes & Fittings","catalog":"Web"}]}}]}};

    expect(utilService.validateBuyAandBOverlap(promotion)).toEqual("ERROR: A and B groups cannot contain the same product categories");
  });

  it('returns null from validateBuyAandBOverlap (percent) for multi item promotions with non overlapping categories (hierarchies).', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsPercentDiscount","status":61,"purchaseConds":{"sources":[{"inclusions":{"partnumbers":null,"itemtype":null,"hierarchies":[{"id":"da80fc04-3857-427c-ada9-ffffffffffff","name":"Pipes & Fittings","catalog":"Web"}]}},{"inclusions":{"partnumbers":null,"itemtype":null,"hierarchies":[{"id":"da80fc04-3857-427c-ada9-8b868b6bb45c","name":"Pipes & Fittings","catalog":"Web"}]}}]}};

    expect(utilService.validateBuyAandBOverlap(promotion)).toEqual(null);
  });

  it('returns error message from validateBuyAandBOverlap (percent) for multi item promotions with overlapping products (part numbers).', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsPercentDiscount","status":61,"purchaseConds":{"sources":[{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}},{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}}]}};

    expect(utilService.validateBuyAandBOverlap(promotion)).toEqual("ERROR: A and B groups cannot contain the same products");
  });

  it('returns null from validateBuyAandBOverlap (percent) for multi item promotions with non overlapping products (part numbers).', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsPercentDiscount","status":61,"purchaseConds":{"sources":[{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}},{"inclusions":{"partnumbers":[100351464],"itemtype":null,"hierarchies":[]}}]}};

    expect(utilService.validateBuyAandBOverlap(promotion)).toEqual(null);
  });

  it('returns null from validateBuyAandBOverlap (percent) for multi item promotions where one is using products (part numbers) and the other is using categories (hierarchies).', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsPercentDiscount","status":61,"purchaseConds":{"sources":[{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}},{"inclusions":{"partnumbers":null,"itemtype":null,"hierarchies":[{"id":"da80fc04-3857-427c-ada9-ffffffffffff","name":"Pipes & Fittings","catalog":"Web"}]}}]}};

    expect(utilService.validateBuyAandBOverlap(promotion)).toEqual(null);
  });

  it('verify validateItemCategory clears inclusions.hierarchies when purchaseoption not equal to category.', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsPercentDiscount","status":61,"purchaseConds":{"sources":[{"purchaseoption":"itemsku","inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[{"id":"2>>2","name":"SPC TESTS>>SPC CLASS","catalog":"Merch"}]}}]}};

    utilService.validateItemCategory(promotion);
    expect(promotion.purchaseConds.sources[0].inclusions.hierarchies.length).toEqual(0);
    expect(promotion.purchaseConds.sources[0].inclusions.partnumbers.length).toEqual(1);
  });

  it('verify validateItemCategory clears inclusions.hierarchies when purchaseoption not equal to category.', function() {
    var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsPercentDiscount","status":61,"purchaseConds":{"sources":[{"purchaseoption":"category","inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[{"id":"2>>2","name":"SPC TESTS>>SPC CLASS","catalog":"Merch"}]}}]}};

    utilService.validateItemCategory(promotion);
    expect(promotion.purchaseConds.sources[0].inclusions.hierarchies.length).toEqual(1);
    expect(promotion.purchaseConds.sources[0].inclusions.partnumbers.length).toEqual(0);
  });

  it('verify isPrintLabelDisabled returns true if promotion is Active and print label is true', function() {
    var promotion = {
      "status": 61,
      "originalPrintLabel": true,
      "channels": [87]
    }
    expect(utilService.isPrintLabelDisabled(promotion)).toEqual(true);
  });

  it('verify isPrintLabelDisabled returns false if promotion is Active and print label is false', function() {
    var promotion = {
      "status": 61,
      "originalPrintLabel": false,
      "channels": [87]
    }
    expect(utilService.isPrintLabelDisabled(promotion)).toEqual(false);
  });

  it('verify isPrintLabelDisabled returns false if promotion is not Active and print label is true', function() {
    var promotion = {
      "status": 57,
      "originalPrintLabel": true,
      "channels": [87]
    }
    expect(utilService.isPrintLabelDisabled(promotion)).toEqual(false);
  });
  
  
  it('verify isPrintLabelDisabled returns true if item/sku is selected', function() {
   var promotion = {"promoId":18116,"promoSubTypeCd":"MultipleItemsPercentDiscount", "channels": [87],"status":61,"purchaseConds":{"sources":[{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}},{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}}]}};
    expect(utilService.isPrintLabelDisabled(promotion)).toEqual(true);
  });

  it('verify isPrintLabelDisabled returns true if customer segment is selected', function() {
   var promotion = {"custSegment":{id:11136},"promoId":18116,"promoSubTypeCd":"MultipleItemsPercentDiscount","channels": [87],"status":61,"purchaseConds":{"sources":[{"purchaseoption":"itemsku","inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}},{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}}]}};
    expect(utilService.isPrintLabelDisabled(promotion)).toEqual(true);
  });

  it('verify isPrintLabelDisabled returns false if customer segment is not selected', function() {
   var promotion = {"custSegment":{id:0},"promoId":18116,"promoSubTypeCd":"MultipleItemsPercentDiscount","channels": [87],"status":61,"purchaseConds":{"sources":[{"purchaseoption":"itemsku","inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}},{"inclusions":{"partnumbers":[100169919],"itemtype":null,"hierarchies":[]}}]}};
    expect(utilService.isPrintLabelDisabled(promotion)).toEqual(false);
  });

  it('verify isPrintLabelDisabled returns true if quantity threshold is not selected', function() {
   var promotion = {"promoId":18116,"channels": [87],"reward":{"type":"PERCNTOFF","details":[{"qualUOM":"Amount","value":"10.00","seq":1,"max":-1.0,"min":100.0,"maxAllowedVal":10.0}]}};
    expect(utilService.isPrintLabelDisabled(promotion)).toEqual(true);
  });

  it('verify isPrintLabelDisabled returns false if quantity threshold is selected', function() {
   var promotion = {"promoId":18116,"channels": [87],"reward":{"type":"PERCNTOFF","details":[{"qualUOM":"Quantity","value":"10.00","seq":1,"max":-1.0,"min":100.0,"maxAllowedVal":10.0}]}};
    expect(utilService.isPrintLabelDisabled(promotion)).toEqual(false);
  });

  it('verify isPrintLabelDisabled returns true if reward type is not PERCNTOFF', function() {
    var promotion = {"promoId":18116,"channels": [87],"reward":{"type":"AMTOFF","details":[{"qualUOM":"Quantity","value":"10.00","seq":1,"max":-1.0,"min":100.0,"maxAllowedVal":10.0}]}};
     expect(utilService.isPrintLabelDisabled(promotion)).toEqual(true);
   });

  it('verify isPrintLabelDisabled returns true if discount reward is multi tier', function() {
    var promotion = {
      "channels": [87],
      "reward": {
       "type": "PERCNTOFF",
       "method": "INDVDLAFFECTEDITMS",
       "reasonCode": 49,
       "details": [
         {
           "qualUOM": "Quantity",
           "min": 10,
           "max": 14,
           "maxAllowedVal": "",
           "seq": 1,
           "value": 10
         },
         {
           "min": 15,
           "value": 15,
           "max": 19,
           "seq": 2,
           "qualUOM": "Quantity"
         },
         {
           "min": 20,
           "value": 20,
           "max": -1,
           "seq": 3,
           "qualUOM": "Quantity"
         }
       ]
     }
    }
    expect(utilService.isPrintLabelDisabled(promotion)).toEqual(true);
   });
 
   it('verify isPrintLabelDisabled returns false if discount reward is single tier', function() {
     var promotion = {
      "channels": [87],
      "reward": {
        "type": "PERCNTOFF",
        "method": "INDVDLAFFECTEDITMS",
        "reasonCode": 49,
        "details": [
          {
            "qualUOM": "Quantity",
            "min": 10,
            "max": 14,
            "maxAllowedVal": "",
            "seq": 1,
            "value": 10
          }
        ]
      }
     } 
     expect(utilService.isPrintLabelDisabled(promotion)).toEqual(false);
    });
 
    it('verify isPrintLabelDisabled returns true if channels does not contain POS (87)', function() {
      var promotion = {
       "channels": [100,105,110,130],
       "reward": {
          "type": "PERCNTOFF","method": "INDVDLAFFECTEDITMS","reasonCode": 49,
          "details": [{"qualUOM": "Quantity","min": 10,"max": 14,"maxAllowedVal": "","seq": 1,"value": 10}]
        }
      }
      expect(utilService.isPrintLabelDisabled(promotion)).toEqual(true);
     });

     it('verify isPrintLabelDisabled returns false if channels contains POS (87)', function() {
      var promotion = {
       "channels": [87,100,105,110,130],
       "reward": {
         "type": "PERCNTOFF","method": "INDVDLAFFECTEDITMS","reasonCode": 49,
         "details": [{"qualUOM": "Quantity","min": 10,"max": 14,"maxAllowedVal": "","seq": 1,"value": 10}]
       }
      }
      expect(utilService.isPrintLabelDisabled(promotion)).toEqual(false);
     });

     it('verify updatePrintLabel does not modify the label for active promotions that already have a label', function() {
      var promotion = {
       "status": 61,
       "originalPrintLabel": true,
       "printLabel":true,
       "labelText":"Label Text",
       "channels": [100],
       "reward": {
         "type": "PERCNTOFF","method": "INDVDLAFFECTEDITMS","reasonCode": 49,
         "details": [{"qualUOM": "Quantity","min": 10,"max": 14,"maxAllowedVal": "","seq": 1,"value": 10}]
       }
      }
      utilService.updatePrintLabel(promotion);
      expect(promotion.printLabel).toEqual(true);
      expect(promotion.labelText).toEqual("Label Text"); 
     });

     it('verify updatePrintLabel clears the label for active promotions that do not already have a label', function() {
      var promotion = {
       "status": 61,
       "originalPrintLabel": false,
       "printLabel":true,
       "labelText":"Label Text",
       "channels": [100],
       "reward": {
         "type": "PERCNTOFF","method": "INDVDLAFFECTEDITMS","reasonCode": 49,
         "details": [{"qualUOM": "Quantity","min": 10,"max": 14,"maxAllowedVal": "","seq": 1,"value": 10}]
       }
      }
      utilService.updatePrintLabel(promotion);
      expect(promotion.printLabel).toEqual(false);
      expect(promotion.labelText).toEqual(''); 
     });

     it('verify updatePrintLabel clears the label for non-active promotions that already have a label', function() {
      var promotion = {
       "status": 21,
       "originalPrintLabel": true,
       "printLabel":true,
       "labelText":"Label Text",
       "channels": [100],
       "reward": {
         "type": "PERCNTOFF","method": "INDVDLAFFECTEDITMS","reasonCode": 49,
         "details": [{"qualUOM": "Quantity","min": 10,"max": 14,"maxAllowedVal": "","seq": 1,"value": 10}]
       }
      }
      utilService.updatePrintLabel(promotion);
      expect(promotion.printLabel).toEqual(false);
      expect(promotion.labelText).toEqual(''); 
     });

    it('populates subtype code with typeless information for store channel (MFA) promotions when setting defaults for save as draft', function() {
      var promotion = {
        "reward": {},
        "purchaseConds": {
          "channels": [87]
        }
      };
       utilService.userType = 228;
       utilService.setDefaultsForSaveAsDraft(promotion);
       expect(promotion.promoSubTypeCd).toEqual('TypeLessDiscount');
       expect(promotion.promoSubTypeDesc).toEqual('TypeLess-Discounts');
    })

    it('does not populate subtype code with typeless information for online channel (DCM) promotions when setting defaults for save as draft', function() {
      var promotion = {
        "reward": {},
        "purchaseConds": {
          "channels": [123]
        }
      };
       utilService.setDefaultsForSaveAsDraft(promotion);
       expect(promotion.promoSubTypeCd).toEqual(20);
    })

});

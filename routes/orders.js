var express = require("express");
var router = express.Router();
var melonn = require("../apis/melonn");
const axios = require("axios");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send({ respuesta: "hola" });
  console.log("hola from back");
});

router.post("/", function(req, res, next) {
  console.log("hola from back post");
  var shippingMethodId = req.body.formData.shippingMethod;
  var shippingMethodDetails = "";
  var daysOff = "";

  getShippingMethodDetails(shippingMethodId).then(response => {
    shippingMethodDetails = response;
    getOffDays().then(response => {
      daysOff = response;
      showMelonnResponse();
    });
  });
  function showMelonnResponse() {
    calculatePromises(req.body.formData, shippingMethodDetails, daysOff, res);
  }
});

function getShippingMethodDetails(shippingMethodId) {
  //get details like rules and shippment info from api with a given shipping id
  return axios
    .get(
      `https://yhua9e1l30.execute-api.us-east-1.amazonaws.com/sandbox/shipping-methods/${shippingMethodId}`,
      {
        headers: {
          "x-api-key": "oNhW2TBOlI1t4kWb3PEad1K1S1KxKuuI3GX6rGvT"
        }
      }
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return Promise.reject(error);
    });
}

function getShippingMethodDetailsMelonn(shippingMethodId) {
  return melonn
    .get("/shipping-methods/1")
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return Promise.reject(error);
    });
}

function getOffDays() {
  //days off from api
  return axios
    .get(
      "https://yhua9e1l30.execute-api.us-east-1.amazonaws.com/sandbox/off-days",
      {
        headers: {
          "x-api-key": "oNhW2TBOlI1t4kWb3PEad1K1S1KxKuuI3GX6rGvT"
        }
      }
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return Promise.reject(error);
    });
}

function calculatePromises(formData, shippingMethodDetails, daysOff, res) {
  const now_datetime = new Date();
  var todayDate = new Date().toISOString().slice(0, 10);

  var startDate = new Date("05/22/2021");
  var nextBusinessDays = getBusinessDates(now_datetime, daysOff);

  var rules = shippingMethodDetails.rules;
  var orderWeight = parseInt(formData.itemsData.itemsProductWeight);
  var minWeight = rules.availability.byWeight.min;
  var maxWeight = rules.availability.byWeight.max;

  if (!(minWeight <= orderWeight && orderWeight <= maxWeight)) {
    res.send({
      response: "Weight not in range"
    });
    return;
  }

  var dayType = rules.availability.byRequestTime.dayType;
  var fromTimeOfDay = rules.availability.byRequestTime.fromTimeOfDay;
  var toTimeOfDay = rules.availability.byRequestTime.toTimeOfDay;

  if (dayType == "ANY" || dayType == "BUSINESS") {
    if (dayType == "BUSINESS")
      if (!isBusinessDay(now_datetime, daysOff)) {
        res.send({
          response: "We are not in a business day"
        });
        return;
      }
    if (
      fromTimeOfDay <= now_datetime.getHours() &&
      now_datetime.getHours() <= toTimeOfDay
    ) {
      var cases = rules.promisesParameters.cases;
      workingCase = calculateWorkingCase(cases, now_datetime, daysOff);

      const [deliveryPromise, packPromise, readyPickUpPromise, shipPromise] = [
        "deliveryPromise",
        "packPromise",
        "readyPickUpPromise",
        "shipPromise"
      ];

      const [pack_promise_min, pack_promise_max] = getPromiseValues(
        workingCase,
        packPromise,
        now_datetime,
        nextBusinessDays
      );

      const [ship_promise_min, ship_promise_max] = getPromiseValues(
        workingCase,
        shipPromise,
        now_datetime,
        nextBusinessDays
      );

      const [delivery_promise_min, delivery_promise_max] = getPromiseValues(
        workingCase,
        deliveryPromise,
        now_datetime,
        nextBusinessDays
      );

      const [
        ready_pickup_promise_min,
        ready_pickup_promise_max
      ] = getPromiseValues(
        workingCase,
        readyPickUpPromise,
        now_datetime,
        nextBusinessDays
      );

      let creationDate =
        now_datetime.getFullYear() +
        "-" +
        (now_datetime.getMonth() + 1) +
        "-" +
        now_datetime.getDate();

      let internalOrderNumber =
        "MSE" + now_datetime.getTime() + Math.floor(Math.random() * 101);

      res.send({
        status: "OK",
        response: "order created",
        creationDate: creationDate,
        internalOrderNumber: internalOrderNumber,
        pack_promise_min: pack_promise_min,
        pack_promise_max: pack_promise_max,
        ship_promise_min: ship_promise_min,
        ship_promise_max: ship_promise_max,
        delivery_promise_min: delivery_promise_min,
        delivery_promise_max: delivery_promise_max,
        ready_pickup_promise_min: ready_pickup_promise_min,
        ready_pickup_promise_max: ready_pickup_promise_max
      });
    } else {
      res.send({
        response: "we are not in  business hours",
        shippingMethodDetails: shippingMethodDetails
      });
      return;
    }
  }
}

function getPromiseValues(
  workingCase,
  promiseType,
  now_datetime,
  nextBusinessDays
) {
  var minPromise = null;
  var maxPromise = null;

  var minType = workingCase[promiseType].min.type;
  var minDeltaHours = workingCase[promiseType].min.deltaHours;
  var minDeltaBusinessDays = workingCase[promiseType].min.deltaBusinessDays;
  var minTimeOfDay = workingCase[promiseType].min.timeOfDay;

  var maxType = workingCase[promiseType].max.type;
  var maxDeltaHours = workingCase[promiseType].max.deltaHours;
  var maxDeltaBusinessDays = workingCase[promiseType].max.deltaBusinessDays;
  var maxTimeOfDay = workingCase[promiseType].max.timeOfDay;

  if (minType != "NULL") {
    if (minType == "DELTA-HOURS") {
      now_datetime.setHours(now_datetime.getHours() + minDeltaHours);
      minPromise = now_datetime;
      now_datetime.setHours(now_datetime.getHours() - minDeltaHours);
    } else {
      minPromise = new Date(nextBusinessDays[minDeltaBusinessDays - 1]);
      minPromise.setHours(minTimeOfDay);
    }
  }

  if (maxType != "NULL") {
    if (maxType == "DELTA-HOURS") {
      now_datetime.setHours(now_datetime.getHours() + maxDeltaHours);
      maxPromise = now_datetime;
    } else {
      maxPromise = new Date(nextBusinessDays[maxDeltaBusinessDays - 1]);
      maxPromise.setHours(maxTimeOfDay);
    }
  }

  return [minPromise, maxPromise];
}

function calculateWorkingCase(cases, now_datetime, daysOff) {
  var priority = 1;
  while (priority <= cases.length) {
    let currentCase = cases.find(
      currentCase => currentCase.priority == priority
    );

    if (!currentCase) {
      return;
    } else {
      var dayType = currentCase.condition.byRequestTime.dayType;
      var fromTimeOfDay = currentCase.condition.byRequestTime.fromTimeOfDay;
      var toTimeOfDay = currentCase.condition.byRequestTime.toTimeOfDay;
      if (dayType == "ANY" || dayType == "BUSINESS") {
        if (dayType == "BUSINESS")
          if (!isBusinessDay(now_datetime, daysOff)) continue;
        if (
          fromTimeOfDay <= now_datetime.getHours() &&
          now_datetime.getHours() <= toTimeOfDay
        ) {
          return currentCase;
        }
      }
    }
    priority++;
  }
}

function isBusinessDay(date, daysOff) {
  const dayOfWeek = date.getDay();
  var formatedCurDate = date.toISOString().slice(0, 10);
  if (!(dayOfWeek == 6) && !daysOff.includes(formatedCurDate)) return true;

  return false;
}

function getBusinessDates(startDate, daysOff) {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  curDate.setDate(curDate.getDate() + 1);
  const businessDates = new Array();

  while (count < 10) {
    var formatedCurDate = curDate.toISOString().slice(0, 10);
    if (isBusinessDay(curDate, daysOff))
      count++, businessDates.push(formatedCurDate);

    curDate.setDate(curDate.getDate() + 1);
  }
  return businessDates;
}

module.exports = router;

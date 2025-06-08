"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const getData = (object, fields = []) => {
  return _.pick(object, fields);
};

const buildPopulateArray = (populateConfig, includes) => {
  if (!Array.isArray(includes) || includes.length === 0) {
    return [];
  }

  return includes.filter((field) => populateConfig[field]);
};

// const buildPopulateArray = (populateConfig, includes) => {
//   if (!Array.isArray(includes) || includes.length === 0) {
//     return [];
//   }

//   const result = [];
//   const processedPaths = new Set();

//   includes.forEach((field) => {
//     if (field.includes(".")) {
//       // Xử lý nested populate như "subtasks.user"
//       const [parentField, childField] = field.split(".");

//       if (populateConfig[parentField]) {
//         const parentConfig = populateConfig[parentField];
//         const childConfig = populateConfig[childField];

//         if (childConfig) {
//           const populateKey = `${parentField}.${childField}`;

//           // Tránh duplicate populate cho cùng một path
//           if (!processedPaths.has(populateKey)) {
//             result.push({
//               key: populateKey,
//               path: parentConfig.path,
//               populate: {
//                 path: childConfig.path,
//                 select: childConfig.select,
//               },
//             });
//             processedPaths.add(populateKey);
//           }
//         }
//       }
//     } else {
//       // Xử lý populate thông thường
//       if (populateConfig[field] && !processedPaths.has(field)) {
//         result.push({
//           key: field,
//           path: populateConfig[field].path,
//           select: populateConfig[field].select,
//         });
//         processedPaths.add(field);
//       }
//     }
//   });

//   return result;
// };

const convertToObjectIdMongodb = (id) => {
  return new Types.ObjectId(id);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnselectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

module.exports = {
  getData,
  buildPopulateArray,
  convertToObjectIdMongodb,
  getSelectData,
  getUnselectData,
};

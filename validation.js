const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
//const { validate, ValidationError, Joi } = require('express-validation');
dotenv.config();

const Joi = require('@hapi/joi');



//---------------------------------------------------------------------------------------------------------------------------
//valduation for register
const registerValidation = data => {
   const schema = Joi.object ({
        username: Joi.string()
          .regex(/[a-zA-Z]/)
          .max(50)
          .min(2)
          .required()
          .messages({'string.base': `Name should be text`,
                     'string.empty': `Name cannot be an empty field`,
                     'string.min': `Name should have a minimum length of {#limit} characters`,
                     'string.max': `Name should have a maximum length of {#limit} characters`,
                     'string.pattern.base': `Name can only contain text`,
                     'any.required': `Name is a required field`}),
        password: Joi.string()
        //minimum 1 upper and lower case letter, 8 characters, 1 special character and 1 number
          .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-><\/:;~]).{8,}$/)
          .min(8)
          .required()
          .messages({'string.base': `Password was not input in the correct format.`,
                     'string.pattern.base': `Password format incorrect, needs at least: 1 upper and lower case letter, 8 characters, 1 special character and 1 number `,
                     'string.min': `Password should have a minimum length of {#limit} characters`,
                     'string.empty' : `Password is a required field`,
                     'any.required': `Password is a required field`}), 
        email: Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
          .required()
          .messages({'string.base': `Email is required`,
                     'string.empty': `Email is required`,
                     'string.email': `Email must end in .com or .net and contain an @`,
                     'any.required': `Email is a required field`})
    });
    return schema.validate(data);
};
//
////---------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------
//valduation for login 
const loginValidation = data => {
    const schema = Joi.object ({
        email: Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
          .required()
          .messages({'string.base': `Email is required`,
                     'string.empty': `Email is required`,
                     'string.email': `Email must end in .com or .net and contain an @`,
                     'any.required': `Email is a required field`}),
        password: Joi.string()
        //minimum 1 upper and lower case letter, 8 characters, 1 special character and 1 number
          .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-><\/:;~]).{8,}$/)
          .min(8)
          .required()
          .messages({'string.base': `Password was not input in the correct format.`,
                     'string.pattern.base': `Password format incorrect, needs at least: 1 upper and lower case letter, 8 characters, 1 special character and 1 number `,
                     'string.min': `Password should have a minimum length of {#limit} characters`,
                     'string.empty' : `Password is a required field`,
                     'any.required': `Password is a required field`})      
    });
    return schema.validate(data);
};
//---------------------------------------------------------------------------------------------------------------------------


//validation for creating a player
const createPlayerValidation = data => {
    const schema = Joi.object ({
    player_name: Joi.string()
      .regex(/[a-zA-Z]/)
      .max(20)
      .min(2)
      .required()
      .messages({'string.base': `Name should be a type of 'text'`,
                 'string.empty': `Name cannot be an empty field`,
                 'string.min': `Name should have a minimum length of {#limit} characters`,
                 'string.max': `Name should have a maximum length of {#limit} characters`,
                 'string.pattern.base': `Name can only contain text`,
                 'any.required': `"Name" is a required field`}),
    player_number: Joi.string()
    //only allow jersey numbers from 1 - 29
      .regex(/^[1-2]?[0-9]$/)
      .required()
      .messages({'string.base': `Number was not input in the correct format. It should be a number between 1 and 29`,
                 'string.pattern.base': `Number should between 1 and 29`,
                 'string.empty' : `Number is a required field`,
                 'any.required': `Number is a required field`}),
      
  
})
    return schema.validate(data);
};
//---------------------------------------------------------------------------------------------------------------------------

////---------------------------------------------------------------------------------------------------------------------------
////validation for searching for a player
//const searchPlayerValidation = {
//  body: Joi.object({
//    player_name: Joi.string()
//      .regex(/[a-zA-Z]/)
//      .max(50)
//      .min(2)
//      .required()
//      .messages({'string.base': `Name should be a type of 'text'`,
//                 'string.empty': `Name cannot be an empty field`,
//                 'string.min': `Name should have a minimum length of {#limit} characters`,
//                 'string.max': `Name should have a maximum length of {#limit} characters`,
//                 'string.pattern.base': `Name can only contain text`,
//                 'any.required': `"Name" is a required field`}),
//      
//  }),
//  
//}
////---------------------------------------------------------------------------------------------------------------------------
//
////---------------------------------------------------------------------------------------------------------------------------
////validation for calls getting details by id
//const getIdValidation = {
//  body: Joi.object({
//    _id: Joi.string()
//      .required()
//      .messages({'string.base':  `Incorrect Id was used`,
//                 'string.empty': `Needs id to continue`,
//                 'any.required': `The id field is required`}),
//      
//  }),
//  
//}
//
////---------------------------------------------------------------------------------------------------------------------------
//
////---------------------------------------------------------------------------------------------------------------------------
////validation for getting user match details based off their id
//const getUserMatchDetailsByIdValidation = {
//  body: Joi.object({
//    user_id: Joi.string()
//      .required()
//      .messages({'string.base':  `Details input incorrectly`,
//                 'string.empty': `The id is required`,
//                 'any.required': `This field is required`}),
//      
//  }),
//  
//}
//
////---------------------------------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------------------------------
//valduation for creating match
const createMatchValidation = data => {
    const schema = Joi.object ({
    startTime: Joi.string()
      .required()
      .messages({'string.base': `Start time was not input in the correct format. E.g. 13:25`,
                 'string.empty' : `Start time is a required field`,
                 'any.required': `Start time is a required field`}), 
    gameType: Joi.string()
      .regex(/[a-zA-Z0-9]/)
      .max(30)
      .min(5)
      .required()
      .messages({'string.base': `Game type is required`,
                 'string.empty': `Game type is required`,
                 'string.max':`Game type can only be 30 characters long`,
                 'string.min':`Game type has to be at least 5 characters long`,
                 'any.required': `Game type is a required field`}),
    startDate: Joi.string()
      .required()
      .messages({'string.base': `Date is required`,
                 'string.empty': `Date is required`,
                 'any.required': `Date is a required field`}),
    location: Joi.string()
      .required()
      .messages({'string.base': `location is required`,
                 'string.empty': `location is required`,
                 'any.required': `location is a required field`}),         
    teamColor: Joi.string()
      .required()
      .messages({'string.base': `Team color is required`,
                 'string.empty': `Team color is required`,
                 'any.required': `Team color is a required field`}),
    teamName: Joi.string()
      .required()
      .messages({'string.base': `Team name is required`,
                 'string.empty': `Team name is required`,
                 'any.required': `Team name is a required field`}),
    oppColor: Joi.string()
      .required()
      .messages({'string.base': `Opposition team color is required`,
                 'string.empty': `Opposition team color is required`,
                 'any.required': `Opposition team color is a required field`}),
    opposition: Joi.string()
      .required()
      .messages({'string.base': `Opposition team name is required`,
                 'string.empty': `Opposition team name is required`,
                 'any.required': `Opposition team name is a required field`}),            
})
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.createPlayerValidation = createPlayerValidation;
module.exports.createMatchValidation = createMatchValidation;
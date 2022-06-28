/* 
* Node js validation - check these links for details
* https://express-validator.github.io/docs/check-api.html
* https://github.com/validatorjs/validator.js#validators
*/

const { body } = require("express-validator");

exports.validationRules =
	[[
		body("email", "Invalid email address or password")
			.notEmpty()
			.trim()
			.escape(),
			//.normalizeEmail()
			//.isEmail(),
	
		body("password", "The Password must be of minimum 4 characters length")
			.notEmpty()
			.trim()
			.isLength({ min: 4 }),
	],
	[
		// first Name sanitization and validation
		body('fname')
			.notEmpty()
			.trim()
			.escape()
			.withMessage('First Name required')
			.matches(/^[a-zA-Z ]*$/)
			.withMessage('Name: Only Characters with white space are allowed'),	

		// first Name sanitization and validation
		body('lname')
			.trim()
			.escape()
			.notEmpty().withMessage('Last Name required')
			.isAlpha().withMessage('Only Characters with white space are allowed'),

		//email address validation
		body("email")
			.notEmpty()
			.escape()
			.trim().withMessage('Email Address required')
			.normalizeEmail()
			.isEmail().withMessage('Invalid email address, Provide a valid email address!'),
	
		//email address validation
		body("gender", "Gender is required")
			.notEmpty(),
	
		// password validation
		body("password")
			.trim()
			.notEmpty().withMessage("Password is required")
			.isLength({min: 5, max: 20})
			.withMessage("Password lenght must be minimum 5 & maximum 20 character length")
			.isStrongPassword({ minLength: 5, 
								minLowercase: 1, 
								minUppercase: 1, 
								minNumbers: 1, 
								minSymbols: 0, 
								returnScore: false})
			.withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),				

		// confirm password validation
		 body('cpassword').custom((value, { req }) => {
			   if (value !== req.body.password) {
					 throw new Error('Password does not match password');
				}
				return true;
		   })
	],
	[
		// Course title sanitization and validation
		body('iname')
			.notEmpty()
			.trim()
			.escape()
			.withMessage('item name is required')
			.matches(/^[a-zA-Z ]*$/)
			.withMessage('item name: Only Characters with white space are allowed'),	

		// Course code sanitization and validation
		body('image')
			.trim()
			.escape()
			.notEmpty().withMessage('image path is required'),
			//.isLength({min: 4}).withMessage('Course code must be a minimum of 4 alphnumeric length')
			//.matches(/^[a-zA-Z0-9]*$/)
			//.withMessage('Course code must be alphnumeric'),		

		// Course description sanitization and validation
		body('price')
			.trim()
			.escape()
			.notEmpty()
			.withMessage('price  is required'),

		// Course category sanitization and validation
		body('ing')
			.trim()
			.escape()
			.matches(/^[a-zA-Z ,]*$/)
			.withMessage('ingredients: Only Characters with white space are allowed'),

		// Certificate type sanitization and validation
		body('c1')
		
			.notEmpty().withMessage('Catagory is is required'),

		// Course duration validation
		body('c2')
		
		.notEmpty().withMessage('Catagory is is required'),

		// Course cost validation
		body('c3')
		
		.notEmpty().withMessage('Catagory is is required'),
	],
	[
		// password reset validation
		body("password")
			.trim()
			.notEmpty().withMessage("Password is required")
			.isLength({min: 5, max: 20})
			.withMessage("Password must be minimum 5 & maximum 20 character length")
			.isStrongPassword({ minLength: 5, 
								minLowercase: 1, 
								minUppercase: 1, 
								minNumbers: 1, 
								minSymbols: 0, 
								returnScore: false})
			.withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),				

		// confirm password validation
		 body('cpassword').custom((value, { req }) => {
			   if (value !== req.body.password) {
					 throw new Error('Password does not match password');
				}
				return true;
		   })
	],
	[
			body("NPassword")
			.trim()
			.notEmpty().withMessage("Password is required")
			.isLength({min: 5, max: 20})
			.withMessage("Password must be minimum 5 & maximum 20 character length")
			.isStrongPassword({ minLength: 5, 
								minLowercase: 1, 
								minUppercase: 1, 
								minNumbers: 1, 
								minSymbols: 0, 
								returnScore: false})
			.withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
			body('confirm').custom((value, { req }) => {
				if (value !== req.body.NPassword) {
					  throw new Error('Password does not match password');
				 }
				 return true;
			})
	]
]
	
	


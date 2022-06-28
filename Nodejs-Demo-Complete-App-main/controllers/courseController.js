
const fs = require('fs')
var randtoken = require('rand-token');
const path = require('path');
const { validationResult } = require("express-validator");
const encrypt = require('../lib/hashing');

const dbConn = require("../config/db_Connection")
const validator = require('../lib/validation_rules');
const { uploadImage, uploadCSVFile } = require('../lib/fileUpload');
const { json } = require('body-parser');

// Record Display Page
exports.recordDisplayPage = (req, res, next) => {
	
	var query1;
	if (req.method == 'GET'){
		if (req.session.level == 1)
			query1 = 'SELECT * FROM `courses`';
		else 
			query1 = `SELECT * FROM courses as CO LEFT JOIN users as US ` + 
						`ON CO.user_id = US.id WHERE US.id = "${req.session.userID}"`;
	}					
	else if (req.method == 'POST')
	{
		const { body } = req;
		if (typeof body.searchBy === 'undefined')
		{
			if(!body.search_Key)
			{
				if (req.session.level == 1)
				{
					query1 = 'SELECT * FROM `courses`';
					req.flash ('success', "Please provide a search key!")
				}
				else
				{
					query1 = `SELECT * FROM courses as CO LEFT JOIN users as US ` + 
								`ON CO.user_id = US.id WHERE US.id = "${req.session.userID}"`;					
					req.flash ('success', "Please provide a search key!")
				}
			}
			else{
				//search multiple columns with "concat & like" operators
				if (req.session.level == 1)
				{
					query1 = `SELECT * FROM courses WHERE `
								+ `concat (code, title, description, category, certificate)`
								+ ` like "%${body.search_Key}%"`;
				}
				else{
					query1 = `SELECT * FROM courses as CO LEFT JOIN users as US ON CO.user_id = US.id` + 
									` WHERE US.id = "${req.session.userID}"` +
									` AND MATCH (code, title, description)` +
									` AGAINST ("${body.search_Key}" IN NATURAL LANGUAGE MODE)`;					
				}
				
				//fulltext search 
				/*
				* `SELECT * FROM courses WHERE MATCH (code, title, description)` +
				*		` AGAINST ("${body.search_Key}" IN NATURAL LANGUAGE MODE)`;
				*/
			}
		}
		else if (req.session.level == 1)
		{
			if (body.searchBy == "course_code")
				query1 = `SELECT * FROM courses WHERE code = "${body.search_Key}"`;
			else if (body.searchBy == "course_title")
				query1 = `SELECT * FROM courses WHERE title = "${body.search_Key}"`;
		}
		else
		{			
			if (body.searchBy == "course_code"){
				query1 = `SELECT * FROM courses as CO LEFT JOIN users as US `
								+ `ON CO.user_id = US.id WHERE CO.code = "${body.search_Key}"` 
								+ ` AND US.id = "${req.session.userID}"`;
			}
								
			else if (body.searchBy == "course_title"){		
				query1 = `SELECT * FROM courses as CO LEFT JOIN users as US `
								+ `ON CO.user_id = US.id WHERE CO.title = "${body.search_Key}"` 
								+ ` AND US.id = "${req.session.userID}"`;
			}			
		}
	}
	
	dbConn.query(query1, (error, result)=>{
	
		if(error)
			throw error;

		const msg = req.flash ('success')
		res.render('pages/display', {data:result, msg: msg, title:'Display Records'});
	});	
}
exports.orderpage = (req, res, next) => {
	var query1;
	if (req.method == 'GET'){
		if (req.session.flag == 1)
			query1 = 'SELECT * FROM `orders` where resturant = ? and state = ? and visible = ?';
			dbConn.query(query1,[req.session.resturant,-1,1], (error, result)=>{
	
				if(error)
					throw error;
		
				const msg = req.flash ('success')
				res.render('pages/order', {data:result, msg: msg, title:'orders'});
			});	
		
	}	

};

// Record Add Page
exports.addRecordPage = (req, res, next) => {
    res.render("pages/add", {title:'Add Record'});
};
exports.passpage = (req, res, next) => {
    res.render("pages/pass", {title:'change password'});
};
exports.passpagesv = async(req, res, next) =>{

	const errors = validationResult(req);
	const { body } = req;
	if (!errors.isEmpty()) {
		return res.render('pages/pass', {
										error: errors.array()[0].msg, 
										title:'Add Record'
									});
	}
	// var id = req.params.id;
		
	// if (!errors.isEmpty()) {
	// 	req.flash("error", errors.array()[0].msg)
	// 	return res.redirect('../pass/'+ id)
	// }	
	
	const pass = await encrypt.encryptPassword(body.NPassword);   
	var query = `UPDATE customer SET pass = "${pass}" WHERE username = "${req.session.user}"`;

		dbConn.query(query, function(error, data){
			if(error){
				throw error;
			}
			else
			{
				req.flash('success', 'password successfully changed');
				res.redirect('../display');
			}

	});
}
exports.delpage = (req, res, next) => {
    res.render("pages/del", {title:'delete account'});
};
exports.delpagesv = async(req, res, next) =>{

	// const errors = validationResult(req);
	// const { body } = req;
	// var id = req.params.id;
		
	// if (!errors.isEmpty()) {
	// 	req.flash("error", errors.array()[0].msg)
	// 	return res.redirect('../pass/'+ id)
	// }	
	
	// const pass = await encrypt.encryptPassword(body.NPassword);   
	var query = `UPDATE customer SET active = 0 WHERE username = "${req.session.user}"`;

		dbConn.query(query, function(error, data){
			if(error){
				throw error;
			}
			else
			{
				req.flash('success', 'password successfully changed');
				res.redirect('/');
			}

	});
}










// Adding New Record
exports.addRecord = async(req, res, next) => {
	 
	const errors = validationResult(req);
	const { body } = req;	
	
	if (!errors.isEmpty()) {
		return res.render('pages/add', {
										error: errors.array()[0].msg, 
										title:'Add Record'
									});
	}

    try {
		 iname = body.iname
		 image = body.image
		 price = body.price
		 ing = body.ing
		 c1 = body.c1
		 c2 = body.c2
		 c3 = body.c3
		 
		 let user;
		 if (req.session.level == 1)
			 user = 0;
		 else
			 user = req.session.user;
			 re = req.session.resturant

				 
		
		var query3 = `INSERT INTO menu (food, photo, price, ` +
								 `ingredients, catagory, rname, active) ` +
								 `VALUES(?,?,?,?,?,?,?)`;
		dbConn.query(query3, [iname, image, price, ing, c1+" "+c2+" "+c3,re,1], 
					(error, rows)=>{
						if(error)
						{
							console.log (error);
							throw error;
						}
						
						if (rows.affectedRows !== 1) {
							return res.render('pages/add', 
												{
													error: 'Error: Record not added.', 
													title:'Add Record'
												});
						}

						res.render("pages/add", 
									{
										msg: 'Record successfully added!',
										title:'Add Record'
									});
				    });
    } 
	catch (e) {
        next(e);
    }
};

// Record Editing Page
exports.recordEditPage = (req, res, next) => {

	var code = req.params.id;  //extract course code attached to the URL
	
	var query2 = `SELECT * FROM courses WHERE code = "${code}"`;
	dbConn.query(query2, function(error, result){
		if(error)
		{
			console.log(error);
			throw error;
		}
		message = req.flash('msg');
		error = req.flash('error');
		res.render('pages/edit', {
									data: result[0], 
									msg: message, 
									error: error,
									title:'Edit Record'
							});
	});
}

/* Record Editing Page */
exports.editRecord = (req, res, next) =>{

	const errors = validationResult(req);
	const { body } = req;
	var id = req.params.id;
		
	if (!errors.isEmpty()) {
		req.flash("error", errors.array()[0].msg)
		return res.redirect('../edit/'+ id)
	}	
	
	code = body.course_code
	title = body.course_title
	description = body.course_desc
	category = body.course_cat
	certificate = body.certificate
	duration = body.course_dur
	cost = body.course_cost
	 
	var query = `UPDATE courses SET code = "${code}", title = "${title}", ` +
						`description = "${description}", category = "${category}", ` +
						`certificate = "${certificate}", duration = "${duration}", ` +
						`cost = "${cost}" WHERE code = "${id}"`;

		dbConn.query(query, function(error, data){
			if(error){
				throw error;
			}
			else
			{
				req.flash('success', 'Record successfully Updated');
				res.redirect('../display');
			}

	});
}

// Image uplaod Page
exports.imageUploadPage = (req, res, next) => {

	var code = req.params.id;  //extract course code attached to the URL
	
	var query2 = `SELECT * FROM courses WHERE code = "${code}"`;
	dbConn.query(query2, function(error, result){
		if(error)
		{
			console.log(error);
			throw error;
		}
		errorMsg = req.flash("error")
		message = req.flash("msg")
		res.render('pages/addImage',{
										data: result[0], 
										error: errorMsg, 
										msg: message,
										title : "Upload Image"
									});
	});
}

// Image uplaod middleware
exports.uploadImage = (req, res, next) => {

	var code = req.params.id;  //extract course code attached to the URL
	
	/* Checking if course icon (image) upload success */
	const upload = uploadImage.single('course_img')
	upload(req, res, function(err) {
		if (req.file == undefined || err) {
			req.flash("error", "Error: You must select an image.\r\n Only image files [JPG | JPEG | PNG] are allowed!")
			req.flash ("title", "Upload Image")
			return res.redirect("./"+code);
		}		

		//retrive and check if there is image uploaded already
		var query1 = `SELECT imagePath FROM courses WHERE code = "${code}"`;
		var oldImagePath = "";
		dbConn.query(query1, function(error, result){
			if(error){
				throw error;
			}
			oldImagePath = result[0].imagePath;
		});
		
		var imgsrc = '/images/' + req.file.filename
		//console.log(imgsrc)
		
		var query2 = `UPDATE courses SET imagePath = "${imgsrc}" WHERE code = "${code}"`;
		dbConn.query(query2, function(error, result){
			if(error)
			{
				//Image is path is not added to database. Remove Uplaoded file.
				// and send error to the client
				fs.unlinkSync('public' + imgsrc);
				console.log(error)
				return res.send(error);
			}
			
			//remove existing image
			else{
				if (oldImagePath && oldImagePath != "None" && oldImagePath != imgsrc)
					fs.unlinkSync('public' + oldImagePath);
			}
			req.flash("msg", "Image is uploaded. Go back to Home page & check it.")
			req.flash ("title", "Upload Image")
			return res.redirect("./"+code);
		});
	});
}

// Record deletion Page
exports.recordDeletePage = (req, res, next) => {
	
	var code = req.params.id; //Get course code to delete
	
	var query3 = `DELETE FROM courses WHERE code = "${code}"`;
	dbConn.query(query3, function(error){

		if(error)
		{
			console.log(error);
			throw error;
		}
		else
		{
			req.flash('success', 'Record has been deleted');
			res.redirect('../display');
		}

	});
}
exports.reportsRecordPage = async(req, res, next) => {
	var query1;
	if (req.method == 'GET')
	{
		if (req.session.level == 1){
		query1 = `SELECT *  FROM orders where resturant = "${req.session.resturant}";`;
		query2 = `SELECT *  FROM orders where resturant= "${req.session.resturant}" and date = CURDATE()`;}
		else {
		query1 = `SELECT *  FROM orders where resturant = "${req.session.resturant}";`;
		query2 = `SELECT *  FROM orders where resturant= "${req.session.resturant}" and date = CURDATE()`;}
	}

	// else if (req.method == 'POST')
	// {
	// 	const { body } = req;
	// 	//fulltext search 
	// 	if (req.session.level == 1){
	// 		query1 = `SELECT * FROM courses WHERE MATCH (code, title, description)` +
	// 						` AGAINST ("${body.search_Key}" IN NATURAL LANGUAGE MODE)`;
	// 	}
	// 	else{
	// 		query1 = `SELECT * FROM courses as CO LEFT JOIN users as US ON CO.user_id = US.id` + 
	// 						 ` WHERE US.id = "${req.session.userID}"` +
	// 						 ` AND MATCH (code, title, description)` +
	// 						` AGAINST ("${body.search_Key}" IN NATURAL LANGUAGE MODE)`;			
	// 	}
		
	// 	//Alternative: search multiple columns with "concat & like" operators 
	// 	/*
	// 	* `SELECT * FROM courses WHERE concat (code, title, description)` +
	// 	*		` like "%${body.search_Key}%"`;		
	// 	*/
	// }
	var foods2 = [];
	var amount2 = [];
	let resultqu = [];

	var foods3 = [];
	var amount3 = [];
	var date = [];

	var date1 = [];
	var amount4 = [];



	dbConn.query(query1, async (error, result)=>{
         
		for(var i = 0 ; i< result.length ; i++){
		 if(foods3.length == 0){ 
		 foods3 =  result[i].food.split(",");  
		 amount3 = result[i].amount.split(","); 
		 for(var i = 0 ; i <  foods3.length ; i++){
			date[i] = result[i].date; 
		  }
		  continue; 
		 }
		 foods = result[i].food.split(",");      
		 amount = result[i].amount.split(","); 

		 for(var j = 0 ; j < foods3.length ; j++){
		   if(foods3.indexOf(foods[j]) !== -1){
			  var n = foods3.indexOf(foods[j]);
			  amount3[n] = parseInt(amount3[n])+parseInt(amount[j]);
			} else{
				foods3.push(foods[j]);
				amount3.push(amount[j]);
				date.push(result[i].date);
			  }
		  }	}
		  
	if(error)
	{
		console.log (error);
		throw error;
	}

	if (result > 0){  
		for(var i = 0 ; i< result.length ; i++){

		  if(date1.length == null){ 
		   date1.push(result[i].date.substr(11,15)); 
		   var amount = result[i].amount.split(","); 
		   amount4.push(amount.reduce()); 
		   continue; 
		   }
		   var date2 = result[i].date.substr(11,15); 
		   amount = result[i].amount.split(","); 
	
		   for(var i = 0 ; i < amount.length ; i++){
			 if( date1.indexOf(date2)!==-1){
				var n = date1.indexOf(date2);
				amount4[n] = amount4[n] + amount.reduce();
				break;
			  } else{
				 date1.push(date);
				 amount4.push(amount.reduce());
				 break;

				}
			} 
		  }}



	var done = false;
	while (!done) {
	  done = true;
	  for (var i = 1; i < foods3.length; i++) {
		if (foods3[i - 1] > foods3[i]) {
		  done = false;
		  var temp3 = date[i-1];
		  var temp2 = amount3[i-1];
		  var tmp = foods3[i - 1];
		  foods3[i - 1] = foods3[i];
		  amount3[i - 1] = amount3[i];
		  date[i - 1] = date[i];
		  foods3[i] = tmp;
		  amount3[i] = temp2;
		  date[i] = temp3;
		}
	  }
	}                    
	query1 =`SELECT *  FROM menu where rname = "${req.session.resturant}"`;
	for(var j = 0; j< foods3.length ;  j++)
		 {   
// 			console.log(foods2[j]);
		if (j == 0 ){
		query1 = query1 + ` and id =`+foods3[j] ;}
		else{
		query1 = query1 + ` or id =`+foods3[j] ;}
	  
	  }
		  dbConn.query(query1, async (error, result1)=>{ 
			 

			  if(error)
			  {  
				  console.log (error);
				  throw error;
			  }		 

                                
													dbConn.query(query2, async (error, result12)=>{
														
														for(var i = 0 ; i< result.length ; i++){
														if(foods2.length == null){ 
														foods2 =  result[i].food.split(",");  
														amount2 = result[i].amount.split(","); 
														continue; 
														}
														foods = result[i].food.split(",");      
														amount = result[i].amount.split(","); 

														for(var j = 0 ; j < foods.length ; j++){
														if(foods2.indexOf(foods[j]) !== -1){
															var n = foods2.indexOf(foods[j]);
															amount2[n] = parseInt(amount2[n])+parseInt(amount[j]);
															} else{
																foods2.push(foods[j]);
																amount2.push(amount[j]);
															}
														}	}
														
													if(error)
													{
														console.log (error);
														throw error;
													}

													var done = false;
													while (!done) {
													done = true;
													for (var i = 1; i < foods2.length; i++) {
														if (foods2[i - 1] > foods2[i]) {
														done = false;
														var temp2 = amount2[i-1];
														var tmp = foods2[i - 1];
														foods2[i - 1] = foods2[i];
														amount2[i - 1] = amount2[i];
														foods2[i] = tmp;
														amount2[i] = temp2;
														}
													}
													}



												// res.render("pages/reports", {data : result,data1: foods2, title:'Add Record'});
												query1 =`SELECT *  FROM menu where rname = "${req.session.resturant}"`;
												for(var j = 0; j< foods2.length ;  j++)
													{   
												// 			console.log(foods2[j]);
													if (j == 0 ){
													query1 = query1 + ` and ( id =`+foods2[j] ;}
													else{
													query1 = query1 + ` or id =`+foods2[j] ;}
													}query1 = query1 +`)`;

														dbConn.query(query1, async (error, result)=>{ 
															resultqu.push(result);

															if(error)
															{  
																console.log (error);
																throw error;
															}		 
															if(result12 < 1 ){result = 0}
															for (var i = 0 ; i < date.length ; i++){
																var  t = date[i].toString(); 
																date[i] = t.substr(0,15);
															}
															res.render("pages/reports", {data : result ,data2:result1 , data1 : amount2,dataam:amount3,dent:date,line : date1 ,line2:amount4 ,title:'Add Record'});	












			//   res.render("pages/reports", {data : result1 , data1 : amount3 ,date : date ,title:'Add Record'});	
	 
 

















	
//     dbConn.query(query1, async (error, result)=>{
         
// 			for(var i = 0 ; i< result.length ; i++){
// 			 if(foods2.length == null){ 
// 			 foods2 =  result[i].food.split(",");  
// 			 amount2 = result[i].amount.split(","); 
// 			 continue; 
// 			 }
// 			 foods = result[i].food.split(",");      
// 			 amount = result[i].amount.split(","); 

// 			 for(var j = 0 ; j < foods.length ; j++){
// 			   if(foods2.indexOf(foods[j]) !== -1){
// 				  var n = foods2.indexOf(foods[j]);
// 				  amount2[n] = parseInt(amount2[n])+parseInt(amount[j]);
// 				} else{
// 				    foods2.push(foods[j]);
// 				    amount2.push(amount[j]);
// 				  }
// 			  }	}
			  
// 		if(error)
// 		{
// 			console.log (error);
// 			throw error;
// 		}

// 		var done = false;
// 		while (!done) {
// 		  done = true;
// 		  for (var i = 1; i < foods2.length; i++) {
// 			if (foods2[i - 1] > foods2[i]) {
// 			  done = false;
// 			  var temp2 = amount2[i-1];
// 			  var tmp = foods2[i - 1];
// 			  foods2[i - 1] = foods2[i];
// 			  amount2[i - 1] = amount2[i];
// 			  foods2[i] = tmp;
// 			  amount2[i] = temp2;
// 			}
// 		  }
// 		}



// 	// res.render("pages/reports", {data : result,data1: foods2, title:'Add Record'});
// 	query1 =`SELECT *  FROM menu where rname = "${req.session.resturant}"`;
// 	  for(var j = 0; j< foods2.length ;  j++)
// 		   {   
// // 			console.log(foods2[j]);
//           if (j == 0 ){
// 		  query1 = query1 + ` and id =`+foods2[j] ;}
// 		  else{
// 		  query1 = query1 + ` or id =`+foods2[j] ;}
		
// 		}
// 			dbConn.query(query1, async (error, result)=>{ 
// 				resultqu.push(result);

// 				if(error)
// 				{  
// 					console.log (error);
// 					throw error;
// 				}		 
// 				res.render("pages/reports", {data : result , data1 : amount2, title:'Add Record'});	
})})
		    

	;})})}


	exports.viewpage = (req, res, next) => {
		var query1;
			if (req.method == 'GET'){
				if (req.session.flag == 1)
					query1 = 'SELECT * from menu where rname = ?';
					dbConn.query(query1,[req.session.resturant], (error, result)=>{
			
						if(error)
							throw error;
		
						
		
		
		
		
		
							
				
						const msg = req.flash ('success')
						res.render('pages/view', {data:result, msg: msg, title:'menu'});
						
					});	
				
			}	
		
	
		
			}
			exports.updatepage = (req, res, next) => {
				var query1;
				const { body } = req;
				var name1 = req.params.id;

			if (req.method == ''){
				if (req.session.flag == 1){
					query1 = 'SELECT * from menu where rname = ?';
					dbConn.query(query1,[req.session.resturant], (error, result)=>{
			
						if(error)
							throw error;
						const msg = req.flash ('success')
						res.render('pages/view', {data:result, msg: msg, title:'menu'});
					});	}
					
			}
			else{
                
				// res.render("pages/update" ,{title:'update menu' , name : name1});
			}
			;}
			exports.menuEditPage = (req, res, next) => {

				const errors = validationResult(req);
				const { body } = req;
				var name1 = req.params.id;
				 ch = body.u;
				 chh = body.rint;
				 chhh=body.iname;
			    //  chhh = chhh.replace("+"," ");
				var query = `UPDATE menu SET "${ch}" = "${chh}" WHERE rname = ${req.session.resturant} and food = "${chhh}"`;
				console.log(ch)
			
					dbConn.query(query, function(error, data){
						if(error){
							throw error;
						}
						else
						{
							req.flash('success', 'Record successfully Updated');
							res.redirect('./view');
						}
			
				});
			}
			exports.menuShowPage = (req, res, next) => {
				var name1 = req.params.id;  //extract course code attached to the URL
	
				var query2 = `SELECT * FROM menu WHERE  id = "${name1}"`;
				dbConn.query(query2, function(error, result){
					if(error)
					{
						console.log(error);
						throw error;
					}
					message = req.flash('msg');
					error = req.flash('error');
					res.render('pages/update', {
												data: result, 
												msg: message, 
												error: error,
												title:'Edit Record'
										});
				});
			}
			exports.orderpage = async(req, res, next) => {
				const { body } = req;
				var query1;
			if (req.method == 'GET'){
				console.log("here"+body['accept'])
				if(body.accept){
					console.log('it aoint over here')
				query1 = `UPDATE orders SET state= 1 where state= 0 and resturant= "${req.session.resturant}"`;
					dbConn.query(query1, (error, result)=>{
			
						if(error)
							throw error;
						const msg = req.flash ('success')
						res.render('./order', {  msg: msg, title:'menu'});	
					});}}
				var query1;
				var query2;
				var foods1 = [];
				var foods = [];
				var amount = [];
				var amount1 = [];
				var foods2 = [];
				var foods3 = [];
				var amount2 = [];
				var foods = [];
				var cust =[];
				var cust1 =[];
				var cust2 =[];
					var tot = [];
					var total = [];
					var total2 = [];
					var tot2 = [];
					let i = 0;
				
				if (req.method == 'GET'){
					if (req.session.flag == 1)
						query1 = 'SELECT * from orders inner join customer on orders.cust_username=customer.username  where orders.resturant=? and orders.visible = 0';
						dbConn.query(query1,[req.session.resturant], async(error, result)=>{
				
							if(error)
								throw error;

								for(var i = 0 ; i< result.length ; i++){
									if(foods2.length == null){ 
									foods2 =  result[i].food.split(",");  

									var a = result[i].fname;
									var a1 = result[i].phone;
									var a3 = result[i].location;
									for(let j = 0 ; j < foods2.length ; j++){
										cust.push(a);
										cust1.push(a1);
										cust2.push(a3);
									 }
									amount2 = result[i].amount.split(","); 
									continue; 
									}
									foods = result[i].food.split(",");      
									amount = result[i].amount.split(","); 

									for(var j = 0 ; j < foods.length ; j++){
									if(foods2.indexOf(foods[j]) !== -1){
										var n = foods2.indexOf(foods[j]);
										amount2[n] = parseInt(amount2[n])+parseInt(amount[j]);
										} else{
											foods2.push(foods[j]);
											var a = result[i].fname;
											var a1 = result[i].phone;
											var a3 = result[i].location;
											for(let j = 0 ; j < foods2.length ; j++){
												cust.push(a);
												cust1.push(a1);
												cust2.push(a3);
											}
											amount2.push(amount[j]);
										}
									}	}
									
								if(error)
								{
									console.log (error);
									throw error;
								}

								var done = false;
								while (!done) {
								done = true;
								for (var i = 1; i < foods2.length; i++) {
									if (foods2[i - 1] > foods2[i]) {
									done = false;
									var temp2 = amount2[i-1];
									var tmp = foods2[i - 1];
									foods2[i - 1] = foods2[i];
									amount2[i - 1] = amount2[i];
									foods2[i] = tmp;
									amount2[i] = temp2;
									}
								}
								}





			
							// 	for(let i = 0 ; i < result.length ; i++)
							// 	{
							    
							// 	foods = result[i].food.split(","); 
							// 	  var a = result[i].fname;
							// 	  var a1 = result[i].phone;
							// 	  var a3 = result[i].location;
								  
								  
								
							// 	for(let j = 0 ; j < foods.length ; j++){
							// 		cust.push(a);
							// 		cust1.push(a1);
							// 		cust2.push(a3);
							// 	 }
								
							// 	amount = result[i].amount.split(","); 
			
							// 	for(let j = 0; j< foods.length; j++)
							// 	{
							// 		foods2[j] = parseInt(foods[j]);
							// 		amount2[j] = parseInt(amount[j]);
							
								
							// 	}

							// }
					 
									

									query2 = `SELECT food,price FROM menu WHERE rname = "Effoy-pizza" `;
								for(let k = 0 ; k< foods2.length;  k++)
								{    
									if (k == 0 ){
										query2 = query2 + ` and ( id =`+foods2[k] ;}
										else{
										query2 = query2 + ` or id =`+foods2[k] ;}
										console.log(foods[k])
									    console.log('bla')
										}query2 = query2 +`)`;
									
									dbConn.query(query2 , async(error, result2)=>{
			
										// foods3[k] = result2[k].food;
										// tot[k] = parseInt(result2[k].price);
									
										 
							// 			  total2[i] += amount2[a] +  foods3[k] + ", ";
							// 			  tot2[i] += parseInt(amount2[k])* tot[k];
			
										
											
							// 				const msg = req.flash ('success')
						
											res.render('pages/order', {dataim:result , data:result2 ,data1 : foods2,data2:amount2,data3:cust,data4:cust1 ,data5:cust2 , title:'orders'});
			  
			
										  
			
			
			
										 
			
			
			
			
			
									});
									
			
			
									
			
			
								}
							)}
						
						
						
						
						
						
						
						
						
						
						
						}
								  
			
								
							
					
					  
								
							
			 
			
				 
				exports.orderaccept = (req, res, next) => {
					var query1;
					if (req.method == 'POST'){
						if (req.session.flag == 1)
							query1 = 'update orders set state = 0 where id = ?';
							dbConn.query(query1,[req.body.name], (error, result)=>{
					
								if(error)
									throw error;
						
								const msg = req.flash ('success')
								//res.render('pages/order', {data:result, msg: msg, title:'orders'});
							});	
						
					}	
				};
				
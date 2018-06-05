        var sumTotal;
        var request_type;
        var requests_total;
        var _year;
		var _month;
		var _day;
		var display_date;
		var previous_day;
        var link;
        $(document).ready(function () {
            
            display_date = new Date();
			console.log(display_date);
				
			_year = parseInt(display_date.getFullYear());
			 _month = parseInt(display_date.getMonth()) + 1;
			 _day = parseInt(display_date.getDate()) -1;

			 if(display_date.getMonth().length == 2) {
			 previous_day = _year+ "-" + _month + "-" + _day;
			 } else {
				previous_day = _year + "-0" + _month + "-" + _day;
			 }
             
       var config;
       $.get("https://townofchapelhill.github.io/scf-reconciliation/sum_table.txt", function(data) {
				config = data.split("\n");
				for(var s in config) {
                    $.getJSON(config[s], function processData(jsonData) {
    
                request_type = getRequestType(jsonData);
                requests_total = getRequestsTotal(jsonData);
                if(jsonData.issues[0].request_type.id === 14437) {
                    console.log("Test");
                 if(requests_total === "No requests from today."){
                sumTotal = "Amount not updated.";
                } else {
                    sumTotal = requests_total * 30;
                    }
                link = "'garbage_carts.html'";
                } else if(jsonData.issues[0].request_type.id === 14551) {
                    if(requests_total === "No requests from today."){
                sumTotal = "Amount not updated.";
                } else {
                    sumTotal = requests_total * 31;
                    }
                link = "'yard_waste_carts.html'";
                } else {
                    getSumTotal(jsonData);
                link = "'bulky_items.html'";
                }
                      
                $(".table").append('<tr onClick="location.href='+link+'"><td>' + request_type + "</td><td>"+ requests_total + "</td><td>" +  sumTotal + "</td></tr>");
            });    
                }
        
            });
       
        
       function getRequestType(jsonData) {
        while(jsonData.issues[0].request_type.title !== null) {
        return jsonData.issues[0].request_type.title;
        }
        return "Type not listed";
       }
       
       function getRequestsTotal(jsonData) {
         var total = 0;
       $.each(jsonData.issues, function (object, objectData) {
         	if(parseInt(objectData.created_at.slice(0,4)) === _year
					   && parseInt(objectData.created_at.slice(5,7)) === _month
					   && parseInt(objectData.created_at.slice(8,10)) === _day + 1 && parseInt(objectData.created_at.slice(11,13)) < 17
				   || objectData.created_at.slice(0,10) === previous_day && parseInt(objectData.created_at.slice(11,13)) >= 17 )  {
                    total++;
            }  
        });
       if(total === 0) total = "No requests from today.";
       return total;
       }
       
       function getSumTotal(jsonData) {
        sumTotal = 0;
        $.each(jsonData.issues, function (object, objectData) {
            	if(parseInt(objectData.created_at.slice(0,4)) === _year
					   && parseInt(objectData.created_at.slice(5,7)) === _month
					   && parseInt(objectData.created_at.slice(8,10)) === _day + 1 && parseInt(objectData.created_at.slice(11,13)) < 17
				   || objectData.created_at.slice(0,10) === previous_day && parseInt(objectData.created_at.slice(11,13)) >= 17 ) {
                if(objectData.questions !== null && !isNaN(objectData.questions[1].answer)) {
                 sumTotal += parseInt(objectData.questions[1].answer);

                }
                }
       });
        if(sumTotal === undefined || isNaN(sumTotal) || sumTotal === 0) {
                    sumTotal = "Amount not updated.";
                } else {
                    sumTotal = parseInt(sumTotal);
                }
       }
       
        });
        
        /*CODE FOR FILTER BUTTON*/
        
        function setDisplayDate() {
            $(".table").empty();
			$(".table").append( "<tr><th>Request Type</th><th>Total Request Count</th><th>Total Amount</th></tr>");
			$(".norequests").empty();
			
			display_date = document.getElementById("filter_date").value;

			 _year = parseInt(display_date.slice(0,4));
			 _month = parseInt(display_date.slice(5,7));
			 _day = parseInt(display_date.slice(8,11)) -1;
			if(_month.length == 2) {
			 previous_day = _year+ "-" + _month + "-" + _day;
			 } else {
				previous_day = _year + "-0" + _month + "-" + _day;
			 }
             
              var config;
       $.get("https://townofchapelhill.github.io/scf-reconciliation/sum_table.txt", function(data) {
				config = data.split("\n");
				for(var s in config) {
                    $.getJSON(config[s], function processData(jsonData) {
    
                request_type = getRequestType(jsonData);
                requests_total = getRequestsTotal(jsonData);
               if(jsonData.issues[0].request_type.id === 14437) {
                 if(requests_total === "No requests in this time range."){
                sumTotal = "Amount not updated.";
                } else {
                    sumTotal = requests_total * 30;
                console.log("reached");
                    }
                } else if(jsonData.issues[0].request_type.id === 14550) {
                    if(requests_total === "No requests in this time range."){
                sumTotal = "Amount not updated.";
                } else {
                    sumTotal = requests_total * 31;
                    }
                } else {
                    getSumTotal(jsonData);
                }
            
                $(".table").append("<tr><td>"+ request_type + "</td><td>"+ requests_total + "</td><td>" +  sumTotal + "</td></tr>");
            });    
                }
        
            });
            
       function getRequestType(jsonData) {
        while(jsonData.issues[0].request_type.title !== null) {
        return jsonData.issues[0].request_type.title;
        }
        return "Type not listed";
       }
       
       function getRequestsTotal(jsonData) {
        var total = 0;
       $.each(jsonData.issues, function (object, objectData) {
         if(objectData.created_at.slice(0,10) === display_date  && parseInt(objectData.created_at.slice(11,13)) < 17
				   || objectData.created_at.slice(0,10) === previous_day && parseInt(objectData.created_at.slice(11,13)) >= 17 ) {
                    total++;
            }  
        });
       if(total === 0) total = "No requests in this time range.";
       return total;
       }
       
       function getSumTotal(jsonData) {
        sumTotal = 0;
        $.each(jsonData.issues, function (object, objectData) {
            if(objectData.created_at.slice(0,10) === display_date  && parseInt(objectData.created_at.slice(11,13)) < 17
				   || objectData.created_at.slice(0,10) === previous_day && parseInt(objectData.created_at.slice(11,13)) >= 17 ) {
                if(objectData.questions !== null && !isNaN(objectData.questions[1].answer)) {
                 sumTotal += parseInt(objectData.questions[1].answer);
                }
            }
        });
        
        if(sumTotal === undefined || isNaN(sumTotal) || sumTotal === 0) {
            sumTotal = "Amount not updated.";
        } else {
          sumTotal =  parseInt(sumTotal);
        }
       }
       
        }
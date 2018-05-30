	var _year;
		var _month;
		var _day;
		var display_date;
		var json_Data;
		var previous_day;
		$(document).ready( function() {
		
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
			$.get("https://townofchapelhill.github.io/scf-reconciliation/config_test.txt", function(data) {
				config = data.split("\n");
				for(var s in config) config[s] = config[s].trim();
            });
			
			
			$.getJSON("https://townofchapelhill.github.io/scf-reconciliation/seeclickfix_test.json",
            function processData(jsonData) {
				json_Data = jsonData;
                var totalRequests = 0;
                var sumTotal = 0;
                
				var firstLoop = true;
				var questions = new Map();
				var are_requests = false;
				
				$.each(jsonData.issues, function (object, objectData) {
				
					if(parseInt(objectData.created_at.slice(0,4)) === _year
					   && parseInt(objectData.created_at.slice(5,7)) === _month
					   && parseInt(objectData.created_at.slice(8,10)) === _day + 1 && parseInt(objectData.created_at.slice(11,13)) < 17
				   || objectData.created_at.slice(0,10) === previous_day && parseInt(objectData.created_at.slice(11,13)) >= 17 ) {
					
					
					if(firstLoop){
						$(".pageTitle").append(objectData.request_type.title);
						$(".title").append(objectData.request_type.title);
						for (var i in config) for(var q in objectData.questions) if(config[i] === objectData.questions[q].question.trim()){ 
							questions.set(config[i], q);
							$(".header").append("<th>" + config[i] + "</th>");
							break;
						}
						firstLoop = false;
					}
					
					var output = "<tr><td>" + objectData.id + "</td>";
					for(var i of questions.values()) output += "<td>" + getAnswer(objectData.questions, i) + "</td>";
					output += "</tr>";
					$("table").append(output);
					//validating that there is a request for that day
					are_requests = true;
					
					totalRequests++;
					if(objectData.questions != null && !isNaN(getAnswer(objectData.questions, questions.get("Amount paid")))) sumTotal += parseInt(getAnswer(objectData.questions, questions.get("Amount paid")));
                
					if(totalRequests === jsonData.issues.length) {
						$(".number").append("The Total Number of Requests is " + totalRequests);
						$(".amount").append("The Amount Paid Sum is " + sumTotal + " dollars");
                    }
					
					
				} else {
					console.log("Test");
					totalRequests++;
					if(totalRequests === jsonData.issues.length && are_requests === false) {
					$(".norequests").append("There are no requests from today.");
					}
				}
                    
                });
				
				
			});
					
		});
		
		function setDisplayDate() {
			console.log("Test");
			$(".table").empty();
			$(".table").append("<tr class ='header'><th>Request ID# </th></tr>");
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
			$.get("https://townofchapelhill.github.io/scf-reconciliation/config.txt", function(data) {
				config = data.split("\n");
				for(var s in config) config[s] = config[s].trim();
            });
			 
			 
			 $.getJSON("https://townofchapelhill.github.io/scf-reconciliation/seeclickfix.json",
            function processData(jsonData) {
			   var totalRequests = 0;
                var sumTotal = 0;
                
				var firstLoop = true;
				var questions = new Map();
				var are_requests = false;
				
				$.each(jsonData.issues, function (object, objectData) {
					
					if(objectData.created_at.slice(0,10) === display_date  && parseInt(objectData.created_at.slice(11,13)) < 17
				   || objectData.created_at.slice(0,10) === previous_day && parseInt(objectData.created_at.slice(11,13)) >= 17 ) {
						
					if(firstLoop){
						for (var i in config) for(var q in objectData.questions) if(config[i] === objectData.questions[q].question.trim()){ 
							questions.set(config[i], q);
							$(".header").append("<th>" + config[i] + "</th>");
							break;
						}
						firstLoop = false;
					}
					
					var output = "<tr><td>" + objectData.id + "</td>";
					for(var i of questions.values()) output += "<td>" + getAnswer(objectData.questions, i) + "</td>";
					output += "</tr>";
					$("table").append(output);
					are_requests = true;
					totalRequests++;
					if(objectData.questions != null && !isNaN(getAnswer(objectData.questions, questions.get("Amount paid")))) sumTotal += parseInt(getAnswer(objectData.questions, questions.get("Amount paid")));
                
					if(totalRequests === jsonData.issues.length) {
						$(".number").append("The Total Number of Requests is " + totalRequests);
						$(".amount").append("The Amount Paid Sum is " + sumTotal + " dollars");
                    }
					
				} else {
					totalRequests++;
					if(totalRequests === jsonData.issues.length && are_requests === false) {
					$(".norequests").append("There are no requests in this time range.");
					}
				}
                    
                });
			});
		
		}
			
		//Returns the answer to a given question in a list of questions.
		function getAnswer(questions, num){
			if(questions === null) return "No Answer Given (null)";
			if(questions[num] === null) return "No Answer Given (null)";
			return questions[num].answer
		}
		
        function downloadCSV(csv,filename) {
            var csvSCF;
            var downloadLink;
            
            csvSCF = new Blob([csv], {type: 'text/csv' });
            
            downloadLink = document.createElement("a");
            
            
            downloadLink.download = filename;
             //creating a link to the file
             //pasing in the new CSV object
             downloadLink.href = window.URL.createObjectURL(csvSCF);
             downloadLink.style.display = 'none';
             document.body.appendChild(downloadLink);
             downloadLink.click();
               
    }
        function exportTableToCSV(filename) {
        
			var csv = [];
			var rows = document.querySelectorAll("table tr");
        
			for (var i = 0; i < rows.length; i++) {
				//assigning each row of the csv fileto be the td elements from the table
				var row = [], cols = rows[i].querySelectorAll("td, th");
        
				for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);
				
				for(var k in row) row[k] = "\"" + row[k] + "\""
				
				csv.push(row.join(","));
			}
			
			// Download CSV file
			downloadCSV(csv.join("\n"), filename);
      
		}
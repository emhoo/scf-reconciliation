        var sumTotal;
        var request_type;
        var requests_total;
        $(document).ready(function () {
       
            //have a $.getJson for each request type??
            $.getJSON("https://townofchapelhill.github.io/scf-reconciliation/seeclickfix_test.json",
            function processData(jsonData) {
    
                request_type = getRequestType(jsonData);
                requests_total = getRequestsTotal(jsonData);
                getSumTotal(jsonData);
            
                $(".table").append("<tr><td>"+ request_type + "</td><td>"+ requests_total + "</td><td>" +  sumTotal + "</td></tr>");
            });
            
             $.getJSON("https://townofchapelhill.github.io/scf-reconciliation/seeclickfix.json",
            function processData(json_Data) {
                request_type = getRequestType(json_Data);
                requests_total = getRequestsTotal(json_Data);
                getSumTotal(json_Data);
            
                $(".table").append("<tr><td>"+ request_type + "</td><td>"+ requests_total + "</td><td>" + sumTotal + "</td></tr>");
            });
            
       
       function getRequestType(jsonData) {
        while(jsonData.issues[0].request_type.title !== null) {
        return jsonData.issues[0].request_type.title;
        }
        return "Type not listed";
       }
       
       function getRequestsTotal(jsonData) {
        return jsonData.issues.length;
       }
       
       function getSumTotal(jsonData) {
        sumTotal = 0;
        $.each(jsonData.issues, function (object, objectData) {
                if(objectData.questions !== null && !isNaN(objectData.questions[1].answer)) {
                 sumTotal += parseInt(objectData.questions[1].answer);
                 console.log(sumTotal);
                }
       });
        
        if(sumTotal === undefined || isNaN(sumTotal)) {
                    sumTotal = "Amount not Updated";
                } else {
                    sumTotal = parseInt(sumTotal);
                }
       }
       
        });
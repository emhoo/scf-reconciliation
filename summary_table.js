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
        $.each(jsonData.issues, function (object, objectData) {
                while(objectData.questions !== null && !isNaN(objectData.questions[1].answer)) {
                 sumTotal += parseInt(objectData.questions[1].answer);
                }
       });
        if(sumTotal === undefined) {
                    sumTotal = "Amount not updated";
                }
       }
       
        });
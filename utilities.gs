function date_formatter(date_object)
{
 //Converts the date object of javascript to dd-mmm-yyyy format

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  var day = date_object.getDate();
  var month = monthNames[date_object.getMonth()];
  var year = date_object.getYear()
return day + "-" + month + "-" + year;
 }


function validateEmail(email)
{
  //Validates the email with regex. Does not confirm whether the email really exists or not
  //Returns true/false depending on validity
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateDateAfterToday(date_range)
{
  //date_range should be the range of the cell where the date item is present
  //Validates that the date is after today. Returns bool if the date is in the future
  var now = new Date();
  return (date_range.getValue() > now);
}


function validateFilledItems(row_number)
{
  //Validates the contents of the row. 
  //If the contents of the row (email-address, checkin date and checkout date are valid, it returns true. false otherwise
  var email = sheet.getRange(row_number, EmailColumn).getValue();  
  if(validateEmail(email))
  {
    Logger.log("The email is valid");
    checkinRange = sheet.getRange(row_number, CheckinDateColumn);  
    checkoutRange = sheet.getRange(row_number, CheckoutDateColumn);  
    
    if((checkinRange.isBlank() == false) && (checkoutRange.isBlank() == false))
    {
      Logger.log("The checkin date is:" + checkinRange.getValue());
      Logger.log("The checkout date is:" + checkoutRange.getValue());
      if (checkoutRange.getValue().getTime() > checkinRange.getValue().getTime())
      {
        if((validateDateAfterToday(checkinRange)) && (validateDateAfterToday(checkoutRange)))
        {
          return true;
        }
      }
    } 
  }
  return false
}
